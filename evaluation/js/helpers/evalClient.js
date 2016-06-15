// Author: Michael Pradel

if (typeof ResultSummarizerClient === "undefined") {
    ResultSummarizerClient = {};
}

(function(ResultSummarizerClient) {

    // ADAPT THE FOLLOWING depending on where you include this code:
    ResultSummarizerClient.executionSetup = {
        project: "__PROJECT__",
        commit: "__COMMIT__",
        executionMode: "__EXECUTION_MODE__",  // "noAnalysis", "fullAnalysis", or "changeAwareAnalysis"
        analysis: "__ANALYSIS__"  // "dlint", "jitprof", or "none"
    };
    // The remainder of this file is the same for all experiments

    function ResultFromExecution(setup, warnings, millisTaken) {
        this.setup = setup;
        this.warnings = warnings;
        this.millisTaken = millisTaken;
        this.timeStamp = new Date().toString();
    }

    ResultSummarizerClient.sendToServer = function(warnings, millisTaken) {
        var result = new ResultFromExecution(ResultSummarizerClient.executionSetup, warnings);

        console.log("Sending results to ResultSummarizer");
        $.post("http://localhost:4000/reportResult", {
            resultFromExecution: result
        });
    };

})(ResultSummarizerClient);

