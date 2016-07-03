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
    
    var cada = execDetails = {};
    
    $.get("http://localhost:3000/executionDetails").done(function(data) {
        console.log("posting execution details");
        execDetails=data;
    });
    
    $.get("http://localhost:3000/CADAResult").done(function(data) {
        console.log("Posting CADA results");
        cada = data;
    });
    
     ResultSummarizerClient.getCommit = function(summary) {
        return this.executionSetup.commit;
    };   
    
    ResultSummarizerClient.execSummary = function(summary) {
        this.resultExecSummary = summary;
    };
    
    ResultSummarizerClient.postAnalysis = function(postAnalysisSummary) {
        this.allWarnings = postAnalysisSummary;
    };
    
    ResultSummarizerClient.testSummary = function(tests) {
        this.testResult = tests;
    };

    function ResultFromExecution(setup, executionDetails, warnings, executions, browsertests, cadaAnalysis) {
        this.setup = setup;
        this.executionDetails = executionDetails;
        this.warnings = warnings;
        this.countWarnings = warnings.length;
        this.timeStamp = new Date().toString();
        this.executionSummary = executions;
        this.testResults = browsertests;
        this.cadaAnalysis = cadaAnalysis;
    }
    
    ResultSummarizerClient.sendToServer = function() {
        var result = new ResultFromExecution(ResultSummarizerClient.executionSetup, execDetails, ResultSummarizerClient.allWarnings, ResultSummarizerClient.resultExecSummary, ResultSummarizerClient.testResult, cada);
        console.log("Sending results to ResultSummarizer");
        $.post("http://localhost:4000/reportResult", {
            resultFromExecution: result
        });
    };

})(ResultSummarizerClient);

