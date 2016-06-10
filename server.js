(function() {
console.time("Server");
	var express = require("express");
	var app = express();
	var path = require("path");
	var fs = require('fs');
	var codeprocess = require("./CodeInstrumenter.js");
	var dependency = require("./DependencyGraph.js");
    var difference = require("./findDiff.js");

	app.use(express.static(__dirname));

	var oldfile = "./underscore_old/underscore.js";
	var newfile = "./underscore/underscore.js";
	var writefile = "./source_instrumented.js";
	var jsonfile = "./output/source_instrumented.json";
    
    console.time("Instrumentation");
	var data = fs.readFileSync(newfile, 'utf8');
	codeprocess.preProcess(data, newfile, writefile, jsonfile);
	//fs.writeFileSync(writefile,instrumented);
    console.timeEnd("Instrumentation");
    
    console.time("Diff_Utility");
    var changedLines = difference.getDifference();
    console.log("Difference:"+changedLines);
    console.timeEnd("Diff_Utility");
//var changedLines = [35, 105];
	dependency.getDependency(newfile, changedLines, jsonfile);

	app.get('/', function(req, res) {
		res.sendFile(path.join(__dirname+'/underscore/test/index.html'));
	});

	var server = app.listen(3000, function() {
        console.timeEnd("Server");
		console.log('Listening on port 3000');
	});

}());
