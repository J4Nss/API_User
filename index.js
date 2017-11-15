var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var morgan = require('morgan'); // logging
var mongoose = require('mongoose'); // Mongodb library
var jwt = require('jsonwebtoken'); // token authentication
var config = require('./config');
var hash = require('./hash');
// var cookieParser = require('cookie-parser');

//var users = require('./user.js');
//console.log(users);

var port = process.env.PORT || config.port; // load port config
var hostname = config.hostname; // load hostname config
mongoose.connect(config.database);

// var mongojs = require('mongojs');
// var db = mongojs('express1:express1@ds245805.mlab.com:45805/db_for_express1',['Customers']);
// console.log(db.Customers);
var Customers = require('./controllers/customerController.js');

var app = express(); //สร้างinstance
//app.use(express.static(path.join(__dirname, 'public'))); //__dirnameคือโฟร์เดอร์ปัจจุบัน

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true} ));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('superSecret', config.secret);
app.use(morgan('dev'));
// app.use(cookieParser());

app.get('/', (request,response) => {
	Customers.getHome(request,response);
});

app.get('/user', (request, response) => {
	// if (request.decoded.admin) {
		Customers.getCustomers(request,response);
	// } else {
	// 	response.status(401).json( {
	// 		success: false, 
	// 		message: 'Unauthorized Access'
	// 	});
	// }
});

app.get('/user/:id', (req, res) => {
	Customers.getCustomerById(req,res);
});

app.post('/user', (request, response) => {
	Customers.AddCustomer(request,response);
});

app.post('/login', (req,res) => {
	Customers.login(req,res);
});

app.use(function(req,res,next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		jwt.verify(token, config.secret, function(err, decoded) {
			if (err) {
				return res.json({ success: false, message: 'Invalid token.' });
			} else {
				req.decoded = decoded; // add decoded token to request obj.
				next(); // continue to the sensitive route
			}
		});
	} else {
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
});

// app.get('/', function(req,res) {
// 	res.render('index', {
// 		title: "Customer List:",
// 		users: users.users
// 	});
// });


// app.get('/user', (req,res) => {
// 	res.json(users.users);
// });



// app.post('/user/add', function(req, res) {
// 	var newUser = {
// 		name: req.body.name,
// 		age: parseInt(req.body.age),
// 		email: req.body.email
// 	}
// 	users.users.push(newUser);
// 	res.render('index', { // redirect to ‘/’
// 		title: 'Customer List',
// 		users: users.users
// 	});
// });





// app.get('/user/:id/edit', function(req,res) {
// 	var id = parseInt(req.params.id);
// 	db.Customers.findOne({id: id}, function(err, doc) {
// 		res.render('edit',{
// 			user: doc
// 		});
// 	});
// });

app.put('/user/:id', function(req,res){
	Customers.UpdateCustomer(req,res);
});

app.delete('/user/:id', function(req,res) {
	Customers.DeleteCustomer(req,res);
});

app.get('/sotus', function(req, res) { //รอรับhttp getที่path '/'(path local)
	res.send('GET Request: Hello World..');
});

app.post('/sotus', function(req, res) { 
	res.send('POST Request: Hello World..');
});

app.listen(port, function() {
	console.log('Simple API started at http://localhost:' + port);
});