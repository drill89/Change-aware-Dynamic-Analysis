(function() {

	var express = require("express");
	var app = express();
	var path = require("path");
	var fs = require('fs');
	var codeprocess = require("./CodeInstrumenter.js");

	app.use(express.static('underscore/test'));

	var readfile = "./underscore/underscore.js";
	var writefile = "./underscore/test/source_instrumented.js";

	var data = fs.readFileSync(readfile, 'utf8');
	var instrumented = codeprocess.preProcess(data, readfile, writefile);
	fs.writeFileSync(writefile,instrumented);

	app.get('/', function(req, res) {
		res.sendFile(path.join(__dirname+'/underscore/test/index.html'));
	});

	var server = app.listen(3000, function() {
		console.log('Listening on port 3000');
	});

}());
