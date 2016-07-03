
(function(sandbox) {

    function ExecutionSummarizer() {
      var count = 0;
      var instFunc = [];

        this.functionEnter = function(iid, f, dis, args) {
          count++;
          if(instFunc.indexOf(iid) == -1)
              instFunc.push(iid);
         };

        this.functionExit = function(iid, returnVal, wrappedExceptionVal) {
            return {returnVal:returnVal, wrappedExceptionVal:wrappedExceptionVal, isBacktrack:false};
        };

      this.endExecution = function() {
	       console.log('Total number of function executions: '+count);
           console.log('Number of instrumented functions:'+instFunc.length);
            if (typeof ResultSummarizerClient !== "undefined") {
                var executionSummary = {instFunc: instFunc.length, funcExecs: count}
                ResultSummarizerClient.execSummary(executionSummary);
            }
      };
    }
    sandbox.analysis = new ExecutionSummarizer();
})(J$);
