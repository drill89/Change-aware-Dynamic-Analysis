(function(sandbox) {
    function PostAnalysis() {
        this.endExecution = function() {
            if(!(sandbox.JITProf) || !(sandbox.JITProf.allWarnings)) return 0;
            var warnings = sandbox.JITProf.allWarnings;
            console.log("Number of JITProf warnings:"+warnings);
        };
    }
    
    sandbox.analysis = new PostAnalysis();
}(J$));