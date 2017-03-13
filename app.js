'use strict';

const Tools = require('./tools');

const Hapi = require('hapi');
const Blipp = require('blipp');
const Vision = require('vision');
const Inert = require('inert');
const Path = require('path');
const Handlebars = require('handlebars');
const fs = require("fs");
const Sequelize = require('sequelize');
const Fetch = require("node-fetch");
const FormData = require("form-data");

const server = new Hapi.Server({
	connections: {
		routes: {
			files: {
				relativeTo: Path.join(__dirname, 'public')
			}
		}
	}
});

server.connection({
	port: 3000
});

var sequelize = new Sequelize('db', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',

	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},

	storage: 'db.sqlite'
});

var Text = sequelize.define('text', {
	textName: {
		type: Sequelize.STRING
	},
	textContent: {
		type: Sequelize.STRING(1234)
	},
	wordLength: {
		type: Sequelize.INTEGER
	},
	wordsObject: {
		type: Sequelize.STRING(1234)
	}
});

server.register([Blipp, Inert, Vision], () => {});

server.views({
	engines: {
		html: Handlebars
	},
	path: 'views',
	layoutPath: 'views/layout',
	layout: 'layout',
	helpersPath: 'views/helpers'
});

server.route({
	method: 'GET',
	path: '/',
	handler: {
		view: {
			template: 'index'
		}
	}
});

server.route({
	method: 'GET',
	path: '/{param*}',
	handler: {
		directory: {
			path: './',
			listing: false,
			index: false
		}
	}
});

server.route({
	method: 'POST',
	path: '/form',
	handler: function (request, reply) {
		var payload = request.payload;

		console.log('Importing data...');
		var strippedString = payload.textContent.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
		var wordsArray = strippedString.split(" ");
		wordsArray = Tools.stripWords(wordsArray);

		var wordLength = wordsArray.length;

		var wordsObject = Tools.wordsObject(wordsArray);
		var wordsObjectString = JSON.stringify(wordsObject);

		console.log('Saving data...');
		Text.create({
			textName: payload.textName,
			textContent: payload.textContent,
			wordsObject: wordsObjectString,
			wordLength: wordLength
		});

		Text.sync();

		console.log('Data saved');

		reply().redirect('displayAll');
	}
});

server.route({
	method: 'GET',
	path: '/displayAll',
	handler: function (request, reply) {
		Text.findAll().then(function (users) {
			var allUsers = JSON.stringify(users);

			reply.view('dbresponse', {
				dbresponse: allUsers
			});
		})
	}
});

server.route({
	method: 'GET',
	path: '/display/{id}',
	handler: function (request, reply) {
		var id = encodeURIComponent(request.params.id);

		Text.findOne({
			where: {
				id: id
			}
		}).then(function (user) {
			var currentUser = "";
			currentUser = JSON.stringify(user);
			currentUser = JSON.parse(currentUser);
			var newObject = JSON.parse(currentUser.wordsObject);
			var wordsLimit = (currentUser.wordLength / 300);

			console.log(wordsLimit);

			var wordsObject = Tools.topWords(newObject, wordsLimit);

			reply.view('viewtext', {
				title: currentUser.textName,
				wordsObject: wordsObject
			})
		});
	}
});

server.route({
	method: 'GET',
	path: '/delete/{id}',
	handler: function (request, reply) {

		Text.destroy({
			where: {
				id: encodeURIComponent(request.params.id)
			}
		});

		reply().redirect("/displayAll");
	}
});



server.start((err) => {

	if (err) {
		throw err;
	}
	console.log(`Server running at: ${server.info.uri}`);

});
