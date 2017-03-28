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
const pg = require('pg');


const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});


var sequelize;


server.connection({
    port: (process.env.PORT || 3000)
});


if (process.env.DATABASE_URL) {
    // the application is executed on Heroku ... use the postgres database
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        logging: true //false
    })
} else {
    sequelize = new Sequelize('db', 'username', 'password', {
        host: 'localhost',
        dialect: 'sqlite',

        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },

        // SQLite only
        storage: 'db.sqlite'
    });
}

var Text = sequelize.define('text', {
	textName: {
		type: Sequelize.STRING
	},
	textContent: {
		type: Sequelize.TEXT
	},
	wordLength: {
		type: Sequelize.INTEGER
	},
	wordsObject: {
		type: Sequelize.TEXT
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
	path: '/graph/{id}',
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

			//makes arrays, one for words, one amounts
			var words = [];
			var counts = [];
			for (word in wordsObject) {
				words.push(word);
				counts.push(wordsObject[word]);
			}

			counts = JSON.stringify(counts);

			reply.view('viewgraph', {
				title: currentUser.textName,
				words: words,
				counts: counts
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

server.route({
    method: 'GET',
    path: '/createDB',
    handler: function (request, reply) {
        // force: true will drop the table if it already exists
        Text.sync({
            force: true
        })
        reply("Database Created")
    }
});



server.start((err) => {

	if (err) {
		throw err;
	}
	console.log(`Server running at: ${server.info.uri}`);

});
