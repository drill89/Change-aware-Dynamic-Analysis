
	var fs = require('fs');
	var _ = require("underscore");

    var baseDir = require("process").cwd();

    var benchmarks = ["backbone"];
    var commits = ["1234", "1235", "1236"];
    var analysis = ["dlint", "jitprof"];
    var allMissedWarnings = {};

    for(var n=0; n<benchmarks.length; n++) {
    	var resultsBaseDir = baseDir + "/evaluation/results/"+benchmarks[n];
	    for(var m=1; m<commits.length; m++) {
	    	console.log("Checking missed warnings for the commit:"+commits[m]);
		    for(var j=0; j<analysis.length; j++) {
		    	console.log("Analysis:"+analysis[j]+"\n---------------------");
			    var readFullv2 = JSON.parse(fs.readFileSync(resultsBaseDir + "/execution_fullAnalysis_"+analysis[j]+"_"+commits[m]+".json", {encoding: "utf8"}));
			    var readFullv1 = JSON.parse(fs.readFileSync(resultsBaseDir + "/execution_fullAnalysis_"+analysis[j]+"_"+commits[m-1]+".json", {encoding: "utf8"}));
			    var readCAv2 = JSON.parse(fs.readFileSync(resultsBaseDir + "/execution_changeAwareAnalysis_"+analysis[j]+"_"+commits[m]+".json", {encoding: "utf8"}));

			    var warningFullv2 = [];
			    var warningFullv1 = [];
			    var warningCAv2 = [];

			    if(readFullv2.countWarnings != 0) {
			    	for(var i=0; i<readFullv2.simplifiedWarnings.length; i++) {
			    		if(readFullv2.simplifiedWarnings[i].line != undefined)
			    			warningFullv2.push(readFullv2.simplifiedWarnings[i].line);
			    	}
			    	// console.log("warning from Full v2:\n"+warningFullv2);
			    }

			    if(readFullv1.countWarnings != 0) {
			    	for(var i=0; i<readFullv1.simplifiedWarnings.length; i++) {
			    		if(readFullv1.simplifiedWarnings[i].line != undefined)
			    			warningFullv1.push(readFullv1.simplifiedWarnings[i].line);
			    	}
			    	// console.log("warning from Full v1:\n"+warningFullv1);
			    }

			    if(readCAv2.countWarnings != 0) {
			    	for(var i=0; i<readCAv2.simplifiedWarnings.length; i++) {
			    		if(readCAv2.simplifiedWarnings[i].line != undefined)
			    			warningCAv2.push(readCAv2.simplifiedWarnings[i].line);
			    	}
			    	// console.log("warning from CA v2:\n"+warningCAv2);
			    }

			    var readV1toV2 = JSON.parse(fs.readFileSync(resultsBaseDir + "/lines_map_"+commits[m]+".json", {encoding: "utf8"}));
			    var mapV1toV2 = [];

			    for(var i=0; i<warningFullv1.length; i++) {
			    	var eachWarning = warningFullv1[i];
			    	if(readV1toV2[eachWarning] != undefined)
			    		mapV1toV2.push(readV1toV2[eachWarning].toString());
			    }
			    // console.log("mapped warnings Full v1:\n"+mapV1toV2);

			    var union = _.union(mapV1toV2, warningCAv2);
			    // console.log("union:\n"+union);

			    var difference = _.difference(warningFullv2, union);
			    console.log("Difference:\n"+difference);

			    if(difference.length>0) {
			    	if(!(allMissedWarnings.hasOwnProperty(benchmarks[n])))
			    		allMissedWarnings[benchmarks[n]] = {};
			    	var a1 = allMissedWarnings[benchmarks[n]];
			    	if(!(a1.hasOwnProperty(commits[m])))
			    		a1[commits[m]] = {};
			    	var a2 = a1[commits[m]];
			    	a2[analysis[j]] = difference.length;
			    }
			}
		}	
	}
	// console.log("missed warnings summary:"+JSON.stringify(allMissedWarnings, null, 2));
	fs.writeFileSync(baseDir+"/evaluation/results/missedWarnings.json", JSON.stringify(allMissedWarnings, null, 2));