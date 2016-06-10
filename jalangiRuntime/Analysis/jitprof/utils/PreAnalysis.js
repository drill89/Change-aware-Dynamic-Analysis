(function(sandbox) {
    function PreAnalysis() {
        this.allWarnings = 0;
    }

    PreAnalysis.prototype.addWarnings = function() {
            this.allWarnings++;
    };
    
    sandbox.JITProf = new PreAnalysis();
}(J$));