const resolve = require('path').resolve;

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
	console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({

    databaseURI: process.env.MONGODB_URI,
    cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
    serverURL: process.env.SERVER_URL,
    allowClientClassCreation: process.env.CLIENT_CLASS_CREATION || true, 
    appId: process.env.APP_ID,
    masterKey: process.env.MASTER_KEY,
    publicServerURL: process.env.SERVER_URL,
    verifyUserEmails: true,
    preventLoginWithUnverifiedEmail:true,
    appName: "peppequeue",
    
    emailAdapter: {
	module: 'parse-server-mailgun',
	options: {
	    fromAddress: process.env.EMAIL_FROM,
	    domain: process.env.MAILGUN_DOMAIN,
	    apiKey: process.env.MAILGUN_API_KEY,

	    templates: {
		passwordResetEmail: {
		    subject: 'Reset your password',
		    pathPlainText: resolve(__dirname, 'public/email-templates/password_reset_email.txt'),
		    pathHtml: resolve(__dirname, 'public/email-templates/password_reset_email.html'),
		    callback: (user) => { return { firstName: user.get('firstName') }}
		    // Now you can use {{firstName}} in your templates
		},
		verificationEmail: {
		    subject: 'Confirm your account',
		    pathPlainText: resolve(__dirname, 'public/email-templates/verification_email.txt'),
		    pathHtml: resolve(__dirname, 'public/email-templates/verification_email.html'),
		    callback: (user) => { return { firstName: user.get('firstName') }}
		    // Now you can use {{firstName}} in your templates
		},
		customEmailAlert: {
		    subject: 'Urgent notification!',
		    pathPlainText: resolve(__dirname, 'public/email-templates/custom_alert.txt'),
		    pathHtml: resolve(__dirname, 'public/email-templates/custom_alert.html'),
		}
	    }
	}
    },    
    customPages: {
        invalidLink: process.env.PUBLIC_SERVER_URL + 'invalid-link',
        verifyEmailSuccess: process.env.PUBLIC_SERVER_URL + 'verify-email-success'
    }
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

app.get('/dashboard', function(req, res) {  
   res.sendFile(path.join(__dirname, '/public/dashboard.html'));
});

app.get('/changepassword', function(req, res) {  
   res.sendFile(path.join(__dirname, '/public/changePassword.html'));
});

app.get('/terms', function(req, res) {  
   res.sendFile(path.join(__dirname, '/public/terms.html'));
});


app.get('/invalid-link', function(req, res) {  
   res.sendFile(path.join(__dirname, '/public/invalid-link.html'));
});

app.get('/verify-email-success', function(req, res) {  
   res.sendFile(path.join(__dirname, '/public/verify-email-success.html'));
});


var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function () {
	console.log('parse-server-example running on port ' + port + '.');
});


// This will enable the Live Query real-time server
			  ParseServer.createLiveQueryServer(httpServer);
			  
