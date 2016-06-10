
(function(sandbox) {

    function ExecutionSummarizer() {
      var count = 0;
      var instFunc = [];

        this.functionEnter = function(iid, f, dis, args) {
          count++;
          if(instFunc.indexOf(iid) == -1)
              instFunc.push(iid);
//	        console.log('functionEnter '+iid);
         };

        this.functionExit = function(iid, returnVal, wrappedExceptionVal) {
	    //console.log('functionExit');
            return {returnVal:returnVal, wrappedExceptionVal:wrappedExceptionVal, isBacktrack:false};
        };

      this.endExecution = function() {
	       console.log('End Execution, total number of functions executed dynamically: '+count);
           console.log('Number of instrumented functions:'+instFunc.length);
//           console.log('Insrumented functions are:'+instFunc);
      };
    }
    sandbox.analysis = new ExecutionSummarizer();
})(J$);
