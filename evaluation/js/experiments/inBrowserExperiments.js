// Author: Michael Pradel

(function() {

    var baseDir = require("process").cwd();

    var express = require("express");
    var path = require("path");
    var fs = require('fs');
    var childProcess = require("child_process");

    var dependency = require("./../../../DependencyGraph");
    var difference = require("./../../../findDiff2");
    var unchangedLines = require("./unchangedLinesAnalyzer");

    var resultDatabase = require("./../helpers/resultDatabase");
    
    var cada = {};

    function experiment(benchmark, executionMode, analysis, previousCommit, commit, continuation) {
        var timestamp = new Date().toString();
        console.log("Experiment: " + benchmark.name + " -- " + executionMode + " -- " + analysis + " -- commit " + commit+" timeStamp:"+timestamp);

        var previousCommitDir = baseDir + "/benchmarks/" + benchmark.name + "/" + previousCommit;
        var commitDir = baseDir + "/benchmarks/" + benchmark.name + "/" + commit;
        var indexFile = "GENERATED_index_" + executionMode + "_" + analysis + ".html";
        
        // compute dependences
        if (executionMode === "changeAwareAnalysis") {
            var previousLibPath = previousCommitDir + "/" + benchmark.libFile;
            var libPath = commitDir + "/" + benchmark.libFile;
            var instrumentedLibJSONPath = commitDir + "/" + benchmark.instrumentedLibJSONFile;
            var t3 = Date.now();
            var changedLines = difference.getDifference(previousLibPath, libPath);
            var dependencies = dependency.getDependency(libPath, commitDir, changedLines, instrumentedLibJSONPath);
            var t4 = Date.now() - t3;
            cada = {cadaTime: t4, totalFunctions: dependencies.totFunc, impactFunctions: dependencies.impFunc};
        }
        
        var mapUnchangedLines = {};
        if(previousCommit !== undefined) {
            console.log("Commit:"+commit+" Previous Commit:"+previousCommit);
            mapUnchangedLines = unchangedLines.unchangedLines(previousCommitDir + "/" + benchmark.libFile, commitDir + "/" + benchmark.libFile);
            fs.writeFileSync(baseDir + "/evaluation/results/" + benchmark.name + "/lines_map_" + commit + ".json", JSON.stringify(mapUnchangedLines, 0, 2));
        } 

        var app = express();
        app.use(express.static(commitDir));

        app.get('/', function(req, res) {
            console.log("Sending html file..."+commitDir + "/" + indexFile);
            res.sendFile(path.join(commitDir + "/" + indexFile));
        });

        app.get('/done', function(req, res) {
            console.log("Closing server...");
            res.send("ok");
            server.close();
            browser.kill();
            continuation();
        });

        app.get('/CADAResult', function (request, response) {
            console.log("Sending CADA results");
            response.send(cada);
        });
        
        app.get('/executionDetails', function (request, response) {
            console.log("Sending details of the execution");
            response.send({instrumentationTime: benchmark.instTime, libraryName: benchmark.name, analysisMode: executionMode, analysisType: analysis, commitNumber: commit, commitId: benchmark.mapper[commit]});
        });
        
        var server = app.listen(3000, function() {
            console.log('Server for in-browser tests listening on port 3000');
        });

        var browser;
        setTimeout(function() {
            // check which browser is available and open it
            var browserCmd = hasCommand("chromium-browser") ? "chromium-browser" : "google-chrome";
            browser = childProcess.spawn(browserCmd, ["--disable-web-security", "http://localhost:3000"]);
        });
    }

    function hasCommand(cmd) {
        var cp = require("child_process");
        var result = cp.execSync("whereis " + cmd, {encoding:"utf8"});
        var regExp = new RegExp(cmd, "g");
        return result.match(regExp).length > 1;
    }

    function createExperiments(benchmark, nextExperimentCallback) {
        var allExperiments = [];

        for (var i = 0; i < benchmark.commits.length; i++) {
            var commit = benchmark.commits[i];
            var previousCommit = i > 0 ? benchmark.commits[i - 1] : undefined;

            var analyses = ["dlint", "jitprof"];
            // perform change-aware analysis only if there's a previous commit
            var executionModes = previousCommit === undefined ? ["noAnalysis", "fullAnalysis"] : ["noAnalysis", "fullAnalysis", "changeAwareAnalysis"];

            for (var j = 0; j < executionModes.length; j++) {
                var executionMode = executionModes[j];
                if (executionMode === "noAnalysis") {
                    var exp = experiment.bind(null, benchmark, executionMode, "", previousCommit, commit, nextExperimentCallback);
                } else {
                    for (var k = 0; k < analyses.length; k++) {
                        var analysis = analyses[k];
                        var exp = experiment.bind(null, benchmark, executionMode, analysis, previousCommit, commit, nextExperimentCallback);
                        allExperiments.push(exp);
                    }
                }

            }
        }

        return allExperiments;
    }

    exports.createExperiments = createExperiments;

})();