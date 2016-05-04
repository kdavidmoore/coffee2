var express = require('express');
var router = express.Router();

// connect to mongo via mongoose
var mongoose = require('mongoose');
var mongoUrl = 'mongodb://localhost:27017/coffee';
mongoose.connect(mongoUrl);

// include model(s)
var Account = require('../models/accounts');
// include bcrypt
var bcrypt = require('bcrypt-nodejs');

/* get route for home page */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'DC Roasters - Home' });
});

/* get route for register page */
router.get('/register', function(req, res, next) {
	res.render('register', { page: 'register' });
});

/* post route for the register page */
router.post('/register', function(req, res, next) {
	// the user will only come to this route from router.get('/register')
	// go find out what vars were posted to this route
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var email = req.body.email;

	// check to see if passwords match
	if (passwords !== password2){
		var hashedPw = bcrypt.hashSync(password);
		var newAccount = new Account({
			username: username,
			password: hashedPw,
			email: email
		});
		// insert new account into database with save method
		newAccount.save();
		// set req.session.username so we have it as long as the session is in use
		req.session.username = username;
	} else {
		// passwords do not match
		res.redirect('/register?failure=password');
	}

});

/* get route for options */
router.get('/options', function(req, res, next) {
	res.render('options', { username: req.session.username, page: 'options' });
});

/* get route for login */
router.get('/login', function(req, res, next) {
	res.render('login', { username: req.session.username, page: 'options' });
});

/* post route for login */
router.post('/login', function(req, res, next) {
	// get all variables posted from the login form
	var username = req.body.username;
	var password = req.body.password;

	// check to see if the username is in the database
	Account.findOne({ username: username },
		function(err, doc){
			// doc is the object returned from mongo
			// bcrypt will compare the english password against the stored hashed password
			var passwordsMatch = bcrypt.compareSync(password, doc.password);
			if(passwordsMatch){
				req.session.username = username;
				res.redirect('/options');
			}
		});
});

module.exports = router;
