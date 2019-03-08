require('newrelic');
const { resolve } = require('path');

const express = require('express');
const { ParseServer } = require('parse-server');
const { S3Adapter } = require('parse-server');
const path = require('path');

const databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI ;

if (!databaseUri) {
	console.log('DATABASE_URI not specified, falling back to localhost.');
}

const api = new ParseServer({

	databaseURI: process.env.MONGODB_URI,
	cloud: process.env.CLOUD_CODE_MAIN || `${__dirname}/cloud/main.js`,
	serverURL: process.env.SERVER_URL,
        allowClientClassCreation: process.env.CLIENT_CLASS_CREATION || true, 
	appId: process.env.APP_ID,
	masterKey: process.env.MASTER_KEY,
	publicServerURL: process.env.SERVER_URL,
	appName: 'peppequeue',
	filesAdapter: new S3Adapter(
		process.env.S3_ACCESS_KEY,
		process.env.S3_SECRET_KEY,
		process.env.S3_BUCKET,
		{ directAccess: true },
	),
});

const app = express();

app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
const mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/public/login.html'));
});

app.get('/dashboard', (req, res) => {
	res.sendFile(path.join(__dirname, '/public/dashboard.html'));
});

app.get('/changepassword', (req, res) => {
	res.sendFile(path.join(__dirname, '/public/changePassword.html'));
});

app.get('/terms', (req, res) => {
	res.sendFile(path.join(__dirname, '/public/terms.html'));
});


app.get('/invalid-link', (req, res) => {
	res.sendFile(path.join(__dirname, '/public/invalid-link.html'));
});

app.get('/verify-email-success', (req, res) => {
	res.sendFile(path.join(__dirname, '/public/verify-email-success.html'));
});

app.get('/password-rest-success', (req, res) => {
	res.sendFile(path.join(__dirname, '/public/password-rest-success.html'));
});

app.get('/pricing', (req, res) => {
	res.sendFile(path.join(__dirname, '/public/pricing.html'));
});

const port = process.env.PORT || 1337;
const httpServer = require('http').createServer(app);

httpServer.listen(port, () => {
	console.log(`parse-server-example running on port ${port}.`);
});


// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
