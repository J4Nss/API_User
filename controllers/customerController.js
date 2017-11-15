var mongoose = require('mongoose');
var Customer = require('../models/Customer');
var config = require('../config'); 
var hash = require('../hash');
var jwt = require('jsonwebtoken');

exports.getHome = function(req,res) {
	Customer.find( function (err, docs) {
		if(err) {
			console.error(err);
			res.json({ error: true });
		}
		res.render('index', {
			title: 'Customer list:',
			users: docs
		});
	});
};

exports.getCustomers = function(req,res) {
	Customer.find( function (err, docs) {
		if(err) {
			console.error(err);
			res.json({ error: true });
		}
		res.json(docs);
	});
};

exports.getCustomerById = function(req,res) {
	var id = parseInt(req.params.id);
	Customer.findOne({id: id}, function(err, doc) {
		if (doc) {
			res.json(doc);
		} else {
			res.json({ error: true });
		}
	});
};

exports.AddCustomer = function(req,res) {
	var salt = hash.genRandomString(16);
	var pwd_data = hash.sha512(req.body.password, salt);

	Customer.find({}).sort({id: -1}).limit(1).exec( (err, customer) => {
		if(err) res.json({ error: true });
		if(customer && customer.length != 0) {
			var newUser = new Customer({
				id: customer[0].id + 1, // users is an array of User objects
				name: req.body.name,
				age: parseInt(req.body.age),
				email: req.body.email,
				salt: pwd_data.salt,
				passwordhash: pwd_data.passwordHash,
				admin: req.body.admin?req.body.admin:false
			});

			newUser.save( function(err, user) {
				if(err) {
					console.log(err);
					res.json({ error: true });
				} else {
					res.redirect('/');
				}
			});
		} else {
			console.log(err);
			res.json({ error: true });
		}
	});
};

exports.login = function(req,res) {
	Customer.findOne({ email: req.body.email }, function(err, user) {
		if (err) res.json({ error: true });
		if (!user) {
			res.status(401).json({
				success: false,
				message: 'Authentication failed. User not found.'
			});
		} else if(user) {
			var passwdData = hash.sha512(req.body.password, user.salt);
			if (user.passwordhash != passwdData.passwordHash) {
				return res.json({
					success: false,
					message: 'Authentication failed. Wrong password.' 
				});
			} else {
				const payload = {
					id: user.id,
					email: user.email,
					admin: user.admin
				};
				var token = jwt.sign(payload, config.secret, {
					expiresIn: 86400 // expires in 24 hours
				});
				// res.cookie('auth', token);
				return res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}
		}
	});
};

exports.UpdateCustomer = function(req,res) {
	var id = parseInt(req.params.id);
	Customer.update({id: id}, 
		{ $set:
			{name: req.body.name,
			age: parseInt(req.body.age)}
		},
		function(err,result){
			if(err) {
				res.json({ error: true });
			} else {
				res.send(result);
				res.redirect('/');
			}
	});
};

exports.DeleteCustomer = function(req,res) {
	var id = parseInt(req.params.id);
	Customer.remove({id: id}, function(err,result) {
		if(err) {
			res.json({ error: true });	
		} else {
			res.send(result);
			res.redirect('/');
		}
	});
};