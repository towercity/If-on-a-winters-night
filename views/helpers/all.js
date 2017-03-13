const Handlebars = require('handlebars');

Handlebars.registerHelper('all', function (context, options) {
	var ret = "";
	var parsing = context;

	parsing = JSON.parse(parsing);

	for (var i = 0; i < parsing.length; i++) {
		ret = ret + options.fn(parsing[i]);
	}

	return ret;
});
