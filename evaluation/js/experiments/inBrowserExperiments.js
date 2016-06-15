// Author: Michael Pradel

(function() {

    var baseDir = require("process").cwd();

    var express = require("express");
    var path = require("path");
    var fs = require('fs');
    var childProcess = require("child_process");

    var dependency = require("./../../../DependencyGraph");
    var difference = require("./../../../findDiff2");

    function experiment(benchmark, executionMode, analysis, previousCommit, commit, continuation) {
        console.log("Experiment: " + benchmark.name + " -- " + executionMode + " -- " + analysis + " -- commit " + commit);

        var previousCommitDir = baseDir + "/benchmarks/" + benchmark.name + "/" + previousCommit;
        var commitDir = baseDir + "/benchmarks/" + benchmark.name + "/" + commit;
        var indexFile = "index_" + executionMode + "_" + analysis + ".html";

        // compute dependences
        if (executionMode === "changeAwareAnalysis") {
            var previousLibPath = previousCommitDir + "/" + benchmark.libFile;
            var libPath = commitDir + "/" + benchmark.libFile;
            var instrumentedLibJSONPath = commitDir + "/" + benchmark.instrumentedLibJSONFile;
            var changedLines = difference.getDifference(previousLibPath, libPath);
            dependency.getDependency(libPath, changedLines, instrumentedLibJSONPath);
        }

        var app = express();
        app.use(express.static(commitDir));

        app.get('/', function(req, res) {
            res.sendFile(path.join(commitDir + "/" + indexFile));
        });

        app.get('/done', function(req, res) {
            res.send("ok");
            server.close();
            browser.kill();
            continuation();
        });

        var server = app.listen(3000, function() {
            console.log('Server for in-browser tests listening on port 3000');
        });

        var browser;
        setTimeout(function() {
            browser = childProcess.spawn("chromium-browser", ["--disable-web-security", "http://localhost:3000"]);
        });
    }

    function createExperiments(benchmark, nextExperimentCallback) {
        var allExperiments = [];


        for (var i = 0; i < benchmark.commits.length; i++) {
            var commit = benchmark.commits[i];
            var previousCommit = i > 0 ? benchmark.commits[i - 1] : undefined;

            var analyses = ["dlint"/*, "jitprof"*/]; // TODO: also do it for jitprof
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