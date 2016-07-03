// Author: Michael Pradel

(function() {

    var resultDB = require("./helpers/resultDatabase");
    
    var baseDir = require("process").cwd();
    var resultsBaseDir = baseDir + "/evaluation/results";

    var fs = require("fs");
    
//    var commits = [1235, 1236, 1237, 1238, 1239, 1240, 1241, 1242, 1243, 1244];
    var results;
    function summarizeResults(benchmark, commits) {
        var file1 = "execution_fullAnalysis_dlint";
        var file2 = "execution_fullAnalysis_jitprof";
        var file3 = "execution_changeAwareAnalysis_dlint";
        var file4 = "execution_changeAwareAnalysis_jitprof";
        results = [];

            var benchmarkDir = resultsBaseDir + "/" + benchmark;
            for(var j=1; j<commits.length; j++) {
                var rawObj1 = fs.readFileSync(benchmarkDir +"/"+ file1+"_"+commits[j]+".json", {encoding:"utf8"});
                var obj1 = JSON.parse(rawObj1);

                var rawObj2 = fs.readFileSync(benchmarkDir +"/"+ file2+"_"+commits[j]+".json", {encoding:"utf8"});
                var obj2 = JSON.parse(rawObj2);

                var rawObj3 = fs.readFileSync(benchmarkDir +"/"+ file3+"_"+commits[j]+".json", {encoding:"utf8"});
                var obj3 = JSON.parse(rawObj3);

                var rawObj4 = fs.readFileSync(benchmarkDir +"/"+ file4+"_"+commits[j]+".json", {encoding:"utf8"});
                var obj4 = JSON.parse(rawObj4);

                parseResults(obj1, obj2, obj3, obj4);
            }
            pushResultsToCSV(benchmarkDir, results, benchmark);
    }
    
    function parseResults(obj1, obj2, obj3, obj4) {
        var commit = +obj1.executionDetails.commitNumber;
        var commitId = obj1.executionDetails.commitId;
        var totalTests = +obj1.testResults.countTests;
        
        var instrumentationTime = +obj1.executionDetails.instrumentationTime;
        instrumentationTime = +instrumentationTime.toFixed(0);
        var dlintRuntimeFull = +obj1.testResults.runTime;
        var jitprofRuntimeFull = +obj2.testResults.runTime;
        var cadaDlint = +obj3.cadaAnalysis.cadaTime;
        var cadaJitprof = +obj4.cadaAnalysis.cadaTime;
        var dlintRuntimeCada = +obj3.testResults.runTime;
        var jitprofRuntimeCada = +obj4.testResults.runTime;
        
        var functionsPresent = +obj3.cadaAnalysis.totalFunctions;
        var impactFunctions = +obj3.cadaAnalysis.impactFunctions;
        var instrumentedFunctionsFull = +obj1.executionSummary.instFunc;
        var functionExecsDlintFull = +obj1.executionSummary.funcExecs;
        var functionExecsJitprofFull = +obj2.executionSummary.funcExecs;
        var instrumentedFunctionsCada= +obj3.executionSummary.instFunc;
        var functionExecsDlintCada = +obj3.executionSummary.funcExecs;
        var functionExecsJitprofCada = +obj4.executionSummary.funcExecs;
        var nonInstrumentedFunctions = +instrumentedFunctionsFull - instrumentedFunctionsCada;
        
        var warningsDlintFull = +obj1.countWarnings;
        var warningsDlintCada = +obj3.countWarnings;
        var warningsJitprofFull = +obj2.countWarnings;
        var warningsJitprofCada = +obj4.countWarnings;
        
        var totalDlintTimeFull = instrumentationTime + dlintRuntimeFull;
        var totalDlintTimeCada = instrumentationTime + cadaDlint + dlintRuntimeCada;
        var dlintResultantTime = (100 - (totalDlintTimeCada * 100)/totalDlintTimeFull).toFixed(1);
        var totalJitprofFull = instrumentationTime + jitprofRuntimeFull;
        var totalJitprofCada = instrumentationTime + cadaJitprof + jitprofRuntimeCada;
        var jitprofResultantTime = (100 - (totalJitprofCada * 100)/totalJitprofFull).toFixed(1);
        
        var result = new wrapResults(commit, commitId, totalTests, instrumentationTime, dlintRuntimeFull, jitprofRuntimeFull, cadaDlint, cadaJitprof, dlintRuntimeCada, jitprofRuntimeCada, functionsPresent, impactFunctions, instrumentedFunctionsFull, functionExecsDlintFull, functionExecsJitprofFull, instrumentedFunctionsCada, functionExecsDlintCada, functionExecsJitprofCada, nonInstrumentedFunctions, warningsDlintFull, warningsDlintCada, warningsJitprofFull, warningsJitprofCada, totalDlintTimeFull, totalDlintTimeCada, dlintResultantTime, totalJitprofFull, totalJitprofCada, jitprofResultantTime);
        
        results.push(result);
    }
    
    function wrapResults(commit, commitId, totalTests, instrumentationTime, dlintRuntimeFull, jitprofRuntimeFull, cadaDlint, cadaJitprof, dlintRuntimeCada, jitprofRuntimeCada, functionsPresent, impactFunctions, instrumentedFunctionsFull, functionExecsDlintFull, functionExecsJitprofFull, instrumentedFunctionsCada, functionExecsDlintCada, functionExecsJitprofCada, nonInstrumentedFunctions, warningsDlintFull, warningsDlintCada, warningsJitprofFull, warningsJitprofCada, totalDlintTimeFull, totalDlintTimeCada, dlintResultantTime, totalJitprofFull, totalJitprofCada, jitprofResultantTime) {
        this.Commit = commit;
        this.Commit_ID = commitId;
        this.TestCases = totalTests;
        this.Instrumentation_Time = instrumentationTime;
        this.Dlint_Browser_Time_FullAnalysis = dlintRuntimeFull;
        this.Jitprof_Browser_Time_FullAnalysis = jitprofRuntimeFull;
        this.CadaAnalysis_Dlint = cadaDlint;
        this.CadaAnalysis_Jitprof = cadaJitprof;
        this.Dlint_Browser_Time_CadaAnalysis = dlintRuntimeCada;
        this.Jitprof_Browser_Time_CadaAnalysis = jitprofRuntimeCada;
        this.Functions_Present = functionsPresent;
        this.Impact_Functions = impactFunctions;
        this.Instrumented_Functions_FullAnalysis = instrumentedFunctionsFull;
        this.Dlint_Function_Executions_FullAnalysis = functionExecsDlintFull;
        this.Jitprof_Function_Executions_FullAnalysis = functionExecsJitprofFull;
        this.Instrumented_Functions_CadaAnalysis = instrumentedFunctionsCada;
        this.Dlint_Function_Executions_CadaAnalysis = functionExecsDlintCada;
        this.Jitprof_Function_Executions_CadaAnalysis = functionExecsJitprofCada;
        this.Non_Instrumented_Functions = nonInstrumentedFunctions;
        this.Dlint_warnings_FullAnalysis = warningsDlintFull;
        this.Dlint_warnings_CadaAnalysis = warningsDlintCada;
        this.Jitprof_warnings_FullAnalysis = warningsJitprofFull;
        this.Jitprof_warnings_CadaAnalysis = warningsJitprofCada;
        this.Dlint_Total_Time_FullAnalysis = totalDlintTimeFull;
        this.Dlint_Total_Time_CadaAnalysis = totalDlintTimeCada;
        this.Dlint_Resultant_Time = dlintResultantTime;
        this.Jitprof_Total_Time_FullAnalysis = totalJitprofFull;
        this.Jitprof_Total_Time_CadaAnalysis = totalJitprofCada;
        this.Jitprof_resultant_Time = jitprofResultantTime;
    }
    
    function pushResultsToCSV (benchmarkDir, results, libName) {
//        console.log("Results are:"+JSON.stringify(results, null, 2));
        var CSV = '';
        CSV += libName + '\r\n\n';
        var row = "";
        for(var index in results[0]) {
            row += index + ',';
        }
        row = row.slice(0, -1);
        CSV += row + '\r\n';
        for(var i = 0; i < results.length; i++) {
            row = "";
            for(var index in results[i]) {
                row += '' + results[i][index] + ',';
            }
            row.slice(0, row.length - 1);
            CSV += row + '\r\n';
        }
        
        if(CSV == '')    console.log("Invalid data");
        var fileName = libName + "_report.csv";
        fs.writeFileSync(benchmarkDir + "/" + fileName, CSV, 'utf8');
    }

    exports.summarizeResults = summarizeResults;
})();
