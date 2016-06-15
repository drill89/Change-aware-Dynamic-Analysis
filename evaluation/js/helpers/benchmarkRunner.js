// Author: Michael Pradel

(function() {

    var express = require("express");
    var path = require("path");
    var fs = require('fs');
    var childProcess = require("child_process");

    var codeprocess = require("./../../../CodeInstrumenter");
    var dependency = require("./../../../DependencyGraph");
    var difference = require("./../../../findDiff2");

    function runExperiment(executionMode, analysis, previousCommitDir, commitDir, continuation) {
        var libFile = "library.js";
        var libPath = commitDir + "/library.js";
        var instrLibPath = commitDir + "/library_instrumented.js";
        var instrLibJSONPath = commitDir + "/library_instrumented.json";

        var app = express();
        app.use(express.static(commitDir));

        var indexFile = "index_" + executionMode + "_" + analysis + ".html";

        if (executionMode === "fullAnalysis" || executionMode === "changeAwareAnalysis") {
            //console.time("Instrumentation");
            var originalCode = fs.readFileSync(libPath, "utf8");
            codeprocess.preProcess(originalCode, libPath, instrLibPath, instrLibJSONPath);
            //console.timeEnd("Instrumentation");

            if (executionMode === "changeAwareAnalysis") {
                //console.time("Diff_Utility");
                var oldLibPath = previousCommitDir + "/" + libFile;
                var changedLines = difference.getDifference(oldLibPath, libPath);
                //console.timeEnd("Diff_Utility");
                dependency.getDependency(libPath, changedLines, instrLibJSONPath);
            }

        } else if (executionMode === "noAnalysis") {
            indexFile = "index.html";
            throw "TODO: create index.html";
        }

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

    function getLibPath(commitDir) {
        return commitDir + "/library.js";
    }

    exports.runExperiment = runExperiment;
    exports.getLibPath = getLibPath;

})();