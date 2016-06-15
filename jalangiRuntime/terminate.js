(function(sandbox) {

    function endExecution() {
        if (sandbox.analysis && sandbox.analysis.endExecution) {
            return sandbox.analysis.endExecution();
        }
    }

    QUnit.done(function(details) {
        console.log("Total: ", details.total, " Failed: ", details.failed, " Passed: ", details.passed, " Runtime: ", details.runtime);
        endExecution();
    });
})(J$);
