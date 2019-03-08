require('newrelic');
const { resolve } = require('path');

const express = require('express');
const { ParseServer } = require('parse-server');
var S3Adapter = require('parse-server').S3Adapter;
const path = require('path');

const databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
	console.log('DATABASE_URI not specified, falling back to localhost.');
}

const api = new ParseServer({

	//* *** General Settings ****//
	databaseURI: databaseUri || 'mongodb://localhost:27017/heroku_kwbq57mk',
	cloud: process.env.CLOUD_CODE_MAIN || `${__dirname}/cloud/main.js`,
	serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse', // Don't forget to change to https if needed
	allowClientClassCreation: process.env.CLIENT_CLASS_CREATION || false,
	appId: process.env.APP_ID || 'myAppId',
	masterKey: process.env.MASTER_KEY || 'myMasterKey', // Add your master key here. Keep it secret!
	publicServerURL: process.env.SERVER_URL,
	verifyUserEmails: true,
	preventLoginWithUnverifiedEmail: true,
	appName: 'peppequeue',
	filesAdapter: new S3Adapter(
		process.env.S3_ACCESS_KEY || 'AKIAJEHX65OPGMUFJRTQ',
		process.env.S3_SECRET_KEY || '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',
		process.env.S3_BUCKET || 'pqimagesnp',
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
