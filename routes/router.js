const express = require('express');
const router = express.Router();

function routes(config){
	router.route('/').get((req, res) => {
		res.render('pages/login',config);
	});
	
	router.route('/dashboard').get((req, res) => {
		res.render('pages/dashboard',config);
	});
	
	router.route('/changepassword').get((req, res) => {
		res.render('pages/change-password',config);
	});
	
	router.route('/terms').get((req, res) => {
		res.render('pages/terms',config);
	});
	
	router.route('/invalid-link').get((req, res) => {
		res.render('pages/invalid-link',config);
	});
	
	router.route('/verify-email-success').get((req, res) => {
		res.render('pages/verify-email-success',config);
	});
	
	router.route('/password-rest-success').get((req, res) => {
		res.render('pages/password-rest-success',config);
	});
	
	router.route('/pricing').get((req, res) => {
		res.render('pages/pricing',config);
	});

	return router;
}

module.exports = routes;