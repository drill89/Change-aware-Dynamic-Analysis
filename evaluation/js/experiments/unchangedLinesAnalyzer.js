// Author: Michael Pradel

(function() {

    /**
     * Finds unchanged lines in the two given files, and
     * returns a map from old line to new line.
     * Intended for single files (at the moment; could be extended
     * to handle multiple files).
     */
    function unchangedLines(path1, path2) {
        var shell = require('shelljs');
        // diff command to find unchanged lines between the two files
        var cmd = "diff --unchanged-group-format='### %df,%dl --> %dF,%dL ###' --changed-group-format='' " + path1 + " " + path2;
        var child = shell.exec(cmd, {silent: true});

        if (child.code === 0 || child.code === 1) {
            var output = child.stdout;
            var oldLineToNewLine = {};
            if (output.length > 0) {
                var unwrapped = output.replace(/^### /, "").replace(/ ###$/, "");
                var groups = unwrapped.split(" ###### ");
                for (var i = 0; i < groups.length; i++) {
                    var group = groups[i];
                    var splitGroup = group.split(" --> ");
                    var oldFileRange = splitGroup[0].split(",");
                    var newFileRange = splitGroup[1].split(",");
                    if (oldFileRange[1]-oldFileRange[0] !== newFileRange[1]-newFileRange[0]) {
                        throw "Unexpected line ranges returned by diff: " + oldFileRange + " and " + newFileRange;
                    }
                    var newFileLine = Number(newFileRange[0]);
                    for (var oldFileLine = Number(oldFileRange[0]); oldFileLine <= Number(oldFileRange[1]); newFileLine++, oldFileLine++) {
                        oldLineToNewLine[oldFileLine] = newFileLine;
                    }
                }
            }
            return oldLineToNewLine;
        } else {
            throw "diff has returned error code:\n"+child.stderr+"\n"+child.stdout;
        }


    }

    exports.unchangedLines = unchangedLines;

})();