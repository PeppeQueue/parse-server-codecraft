require('newrelic');
const resolve = require('path').resolve;

// var express = require('express');
// var ParseServer = require('parse-server').ParseServer;

// var S3Adapter = require('parse-server').S3Adapter;
// var path = require('path');

// var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017';

// if (!databaseUri) {
// 	console.log('DATABASE_URI not specified, falling back to localhost.');
// }

// var api = new ParseServer({

// 	databaseURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/heroku_kwbq57mk',
// 	cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
// 	serverURL: process.env.SERVER_URL || 'https://peppequeue.herokuapp.com/parse',
// 	allowClientClassCreation: process.env.CLIENT_CLASS_CREATION || true,
// 	appId: process.env.APP_ID || 'peppeq',
// 	masterKey: process.env.MASTER_KEY || 'peppeq',
// 	publicServerURL: process.env.SERVER_URL || 'https://peppequeue.herokuapp.com/parse',
// 	verifyUserEmails: true,
// 	preventLoginWithUnverifiedEmail: true,
// 	appName: "peppequeue",
// 	filesAdapter: new S3Adapter(
// 		 'AKIAJEHX65OPGMUFJRTQ',
// 		 'X6p2Bp6PGMqGUWc9IC8pXx994ZnXh+h8GBRDSCAI',
// 		 'pqimages',
// 		{directAccess: true}
// 	  ),
// 	customPages: {
// 		invalidLink: process.env.PUBLIC_SERVER_URL + 'invalid-link',
// 		verifyEmailSuccess: process.env.PUBLIC_SERVER_URL + 'verify-email-success',
// 		passwordResetSuccess: process.env.PUBLIC_SERVER_URL + 'password-rest-success'
// 	}
// });

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
// var S3Adapter = require('parse-server').S3Adapter;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
	console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
	//**** General Settings ****//

	databaseURI: databaseUri || 'mongodb://localhost:27017/heroku_kwbq57mk',
	cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
	serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
	
	//**** Security Settings ****//
	// allowClientClassCreation: process.env.CLIENT_CLASS_CREATION || false, 
	appId: process.env.APP_ID || 'myAppId',
	masterKey: process.env.MASTER_KEY || 'myMasterKey', //Add your master key here. Keep it secret!	
	
});

var app = express();

app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/public/login.html'));
});

app.get('/dashboard', function (req, res) {
	res.sendFile(path.join(__dirname, '/public/dashboard.html'));
});

app.get('/changepassword', function (req, res) {
	res.sendFile(path.join(__dirname, '/public/changePassword.html'));
});

app.get('/terms', function (req, res) {
	res.sendFile(path.join(__dirname, '/public/terms.html'));
});


app.get('/invalid-link', function (req, res) {
	res.sendFile(path.join(__dirname, '/public/invalid-link.html'));
});

app.get('/verify-email-success', function (req, res) {
	res.sendFile(path.join(__dirname, '/public/verify-email-success.html'));
});

app.get('/password-rest-success', function (req, res) {
	res.sendFile(path.join(__dirname, '/public/password-rest-success.html'));
});

app.get('/pricing', function (req, res) {
	res.sendFile(path.join(__dirname, '/public/pricing.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function () {
	console.log('parse-server-example running on port ' + port + '.');
});


// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);

