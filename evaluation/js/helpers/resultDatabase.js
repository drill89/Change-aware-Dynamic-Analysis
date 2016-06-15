// Author: Michael Pradel

(function() {

    var baseDir = require("process").cwd();
    var resultsBaseDir = baseDir + "/evaluation/results";

    var fs = require("fs");

    function SimplifiedWarning(file, line, kind) {
        this.file = file;
        this.line = line;
        this.kind = kind;
    }

    function addNewExecutionResult(result) {
        var project = result.setup.project;
        console.log("ResultsDataBase: Received a new execution result for " + project);
        var dirName = getOrCreateDirForProject(project);
        var fileName = "execution_" + result.setup.executionMode + "_" + result.setup.analysis + "_" + result.setup.commit + ".json";
        result.simplifiedWarnings = simplifyDLintWarnings(result.warnings);
        fs.writeFileSync(dirName + "/" + fileName, JSON.stringify(result, 0, 2));
    }

    function getOrCreateDirForProject(project) {
        var dirName = resultsBaseDir + "/" + project;
        try {
            fs.accessSync(dirName, fs.F_OK);
        } catch (e) {
            fs.mkdirSync(dirName);
        }
        return dirName;
    }

    function simplifyDLintWarnings(warnings) {
        var simplifiedWarnings = [];
        for (var i = 0; i < warnings.length; i++) {
            var warning = warnings[i];
            var splittedLocation = warning.locationString.split(":");
            var splittedPath = splittedLocation[0].split("/");
            var file = splittedPath[splittedPath.length - 1];
            var line = splittedLocation[1];
            var kind = warning.analysis;
            simplifiedWarnings.push(new SimplifiedWarning(file, line, kind));
        }
        return simplifiedWarnings;
    }

    function addNewUnchangedLinesResult(project, commit1, commit2, unchangedLines) {
        console.log("ResultsDataBase: Adding a new result about unchanged lines for " + project);
        var dirName = getOrCreateDirForProject(project);
        var fileName = "unchangedLines_" + commit1+ "_" + commit2 + ".json";
        var results = {
            unchangedLines: unchangedLines,
            timeStamp: new Date().toString()
        };
        fs.writeFileSync(dirName+"/"+fileName, JSON.stringify(unchangedLines));
    }

    function loadAllResults() {
        var results = {
            executionResults: [],
            unchangedLinesResults: []
        };
        return results;
    }

    exports.addNewExecutionResult = addNewExecutionResult;
    exports.addNewUnchangedLinesResult = addNewUnchangedLinesResult;
    exports.loadAllResults = loadAllResults;

})();