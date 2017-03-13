const Handlebars = require('handlebars');

Handlebars.registerHelper('rankings', function (context, options) {
	var ret = "<ul>";
	var parsing = context;

	for (word in parsing) {
		var wordHTML = '<li>' + word + ': ' + parsing[word] + '</li>';
		ret += wordHTML;
	}

	return ret;
});
