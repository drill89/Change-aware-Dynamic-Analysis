// Author: Michael Pradel

(function() {

    var benchmarks = require("./helpers/benchmarks");
    var benchmarkPreparer = require("./helpers/benchmarkPreparer");
    var inBrowserExperiments = require("./experiments/inBrowserExperiments");
    var evalServer = require("./helpers/evalServer");
    var resultSummarizer = require("./summarizeAllResults");

    // read all benchmarks
    var allBenchmarks = benchmarks.allBenchmarks();
    console.log(allBenchmarks);

    // prepare benchmarks
    for (var i = 0; i < allBenchmarks.length; i++) {
        var benchmark = allBenchmarks[i];
        benchmarkPreparer.createHTMLFiles(benchmark);
        benchmarkPreparer.createJSFiles(benchmark);
        benchmark.instTime = benchmarkPreparer.instrumentLib(benchmark);
        benchmarkPreparer.linkToJalangi(benchmark);
    }

    // each experiment is a function; pushing an experiment into this array schedules the experiment
    var experimentsToRun = [];  // array of functions

    // runs the next scheduled experiment (which will trigger the next-next, etc.)
    function runNextExperiment() {
        console.log("\n-------------\n" + experimentsToRun.length + " scheduled experiment(s)");
        if (experimentsToRun.length === 0) {
            console.log("Waiting a moment before cleaning up...");
            setTimeout(cleanUp, 5000);
        } else {
            var nextExperiment = experimentsToRun[0];
            experimentsToRun = experimentsToRun.slice(1);
            nextExperiment();
        }
    }

    // called once all experiments have run
    function cleanUp() {
        evalServer.close();
        for(var i = 0; i< allBenchmarks.length; i++) {
            //generate CSV files for benchmark
            console.log("Generating CSV files for:"+allBenchmarks[i].name+ " having commits:"+allBenchmarks[i].commits);
            resultSummarizer.summarizeResults(allBenchmarks[i].name, allBenchmarks[i].commits);
        }
        console.log("Cleaned up. Done.");
    }

    // schedule in-browser experiments
    for (var i = 0; i < allBenchmarks.length; i++) {
        var benchmark = allBenchmarks[i];
        var experiments = inBrowserExperiments.createExperiments(benchmark, runNextExperiment);
        for (var j = 0; j < experiments.length; j++) {
            var experiment = experiments[j];
            experimentsToRun.push(experiment);
        }
    }

    // schedule other experiments
    // TODO: call unchangedLinesAnalyzer for each pair of consecutive commits

    // start ResultSummarizer server
    var evalServer = evalServer.startServer();


    // start all scheduled experiments
    runNextExperiment();

})();