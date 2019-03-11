require('newrelic');
const { resolve } = require('path');

const express = require('express');
const { ParseServer } = require('parse-server');
const { S3Adapter } = require('parse-server');
const path = require('path');

const databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;
const serverURL = process.env.SERVER_URL;
const appId = process.env.APP_ID;

if (!databaseUri) {
	console.log('DATABASE_URI not specified, falling back to localhost.');
}

const api = new ParseServer({

	databaseURI: process.env.MONGODB_URI,
	cloud: process.env.CLOUD_CODE_MAIN || `${__dirname}/cloud/main.js`,
	serverURL,
	allowClientClassCreation: process.env.CLIENT_CLASS_CREATION || true,
	appId,
	masterKey: process.env.MASTER_KEY,
	publicServerURL: process.env.SERVER_URL,
	verifyUserEmails: true,
	preventLoginWithUnverifiedEmail: true,
	appName: 'peppequeue',
	filesAdapter: new S3Adapter(
		process.env.S3_ACCESS_KEY,
		process.env.S3_SECRET_KEY,
		process.env.S3_BUCKET,
		{ directAccess: true },
	),
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
					callback: user => ({ firstName: user.get('firstName') }),
					// Now you can use {{firstName}} in your templates
				},
				verificationEmail: {
					subject: 'Confirm your account',
					pathPlainText: resolve(__dirname, 'public/email-templates/verification_email.txt'),
					pathHtml: resolve(__dirname, 'public/email-templates/verification_email.html'),
					callback: user => ({ firstName: user.get('firstName') }),
					// Now you can use {{firstName}} in your templates
				},
				customEmailAlert: {
					subject: 'Urgent notification!',
					pathPlainText: resolve(__dirname, 'public/email-templates/custom_alert.txt'),
					pathHtml: resolve(__dirname, 'public/email-templates/custom_alert.html'),
				},
			},
		},
	},
	customPages: {
		invalidLink: `${process.env.PUBLIC_SERVER_URL}invalid-link`,
		verifyEmailSuccess: `${process.env.PUBLIC_SERVER_URL}verify-email-success`,
		passwordResetSuccess: `${process.env.PUBLIC_SERVER_URL}password-rest-success`,
	},
});

const app = express();

app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
const mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);


// set the view engine to ejs
app.set('view engine', 'ejs');

const config = { serverURL, appId }

const router = require('./routes/router')(config);
app.use("/", router);

const port = process.env.PORT || 1337;
const httpServer = require('http').createServer(app);

httpServer.listen(port, () => {
	console.log(`parse-server-example running on port ${port}.`);
});


// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
