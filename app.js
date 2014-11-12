var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var session = require('express-session');
var cookieParser = require('cookie-parser');

var flash = require('connect-flash');
var passport = require('passport');
var passportConfig = require('./config/passport');

var indexController = require('./controllers/index.js');
var authenticationController = require('./controllers/authentication');
var apiController = require('./controllers/apiController.js');

mongoose.connect('mongodb://localhost/travelApp');

//require Board Seed
require('./models/seeds/boardSeed.js');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

//PASSPORT
app.use(cookieParser());
app.use(flash());
app.use(session({secret: 'secret'}));
app.use(passport.initialize());
app.use(passport.session());
// Our get request for viewing the login page
app.get('/auth/login', authenticationController.login);
// Post received from submitting the login form
app.post('/auth/login', authenticationController.processLogin);
// Post received from submitting the signup form
app.post('/auth/signup', authenticationController.processSignup);
// Any requests to log out can be handled at this url
app.get('/auth/logout', authenticationController.logout);
//Cannot move throughout website without authentication
app.use(passportConfig.ensureAuthenticated);

//GET MY PAGES
app.get('/', indexController.index);
app.get('/board', indexController.board);
app.get('/account/:id?', indexController.account);
app.get('/view/:location', indexController.location);
	
// API Routes
app.get('/api/getBoard', apiController.getBoard);
app.post('/api/addBoard', apiController.addBoard);
app.post('/api/saveToTimeline', apiController.saveToTimeline);
app.get('/api/addToTimeline', apiController.addToTimeline);
app.post('/api/saveToCityTimeline/:location', apiController.saveToCityTimeline);
app.get('/api/addToCityTimeline/:location', apiController.addToCityTimeline);
app.post('/api/saveToLibrary', apiController.saveToLibrary);
app.get('/api/getLibrary', apiController.getLibrary);
app.post('/api/saveToCustomBoard', apiController.saveToCustomBoard);
app.get('/api/getCustomBoard/:id', apiController.getCustomBoard);


var server = app.listen(3741, function() {
	console.log('Express server listening on port ' + server.address().port);
});
