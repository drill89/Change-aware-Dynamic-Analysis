(function(sandbox) {

    function endExecution() {
        if (sandbox.analysis && sandbox.analysis.endExecution) {
            return sandbox.analysis.endExecution();
        }
    }

    QUnit.done(function(details) {
        endExecution();
        console.log("Posting test results");
        if (typeof ResultSummarizerClient !== "undefined") {
            var testResult = {countTests: details.total, runTime: details.runtime};
            ResultSummarizerClient.testSummary(testResult);
            ResultSummarizerClient.sendToServer();
        }
        $.get("http://localhost:3000/done").done(function(data) {
            console.log("Close server:"+data);
        });
        console.log("Total: ", details.total, " Failed: ", details.failed, " Passed: ", details.passed, " Runtime: ", details.runtime);
    });
})(J$);
