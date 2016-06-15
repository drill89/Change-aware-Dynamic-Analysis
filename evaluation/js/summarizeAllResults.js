// Author: Michael Pradel

(function() {

    var resultDB = require("./helpers/resultDatabase");

    function summarizeWarnings() {
        var allResults = resultDB.loadAllResults();
        for (var i = 0; i < allResults.unchangedLinesResults.length; i++) {
            var unchangedLinesResult = allResults.unchangedLinesResults[i];

        }
    }

    summarizeWarnings();

})();