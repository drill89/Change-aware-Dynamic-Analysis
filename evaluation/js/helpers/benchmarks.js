// Author: Michael Pradel

(function() {

    var baseDir = require("process").cwd();
    var fs = require("fs");

    function Benchmark(name, commits, indexTemplate, libFile) {
        this.name = name;
        this.commits = commits;
        this.indexTemplate = indexTemplate;
        this.libFile = libFile;
        this.instrumentedLibFile = "GENERATED_" + libFile.replace(/.js$/, "_instrumented.js");
        this.instrumentedLibJSONFile = "GENERATED_" + libFile.replace(/.js$/, "_instrumented.json");
    }

    function allBenchmarks() {
        var result = [];

        // find all benchmarks + commits
        var benchmarkBaseDir = baseDir + "/benchmarks";
        var benchmarks = fs.readdirSync(benchmarkBaseDir).filter(function(elem) {
            return fs.lstatSync(benchmarkBaseDir + "/" + elem).isDirectory();
        });
        for (var i = 0; i < benchmarks.length; i++) {
            var benchmark = benchmarks[i];
            var benchmarkDir = benchmarkBaseDir + "/" + benchmark;
            var commits = fs.readdirSync(benchmarkDir).filter(function(elem) {
                return fs.lstatSync(benchmarkDir + "/" + elem).isDirectory();
            });

            // read benchmark.json, which is required in each benchmark directory
            var rawBenchmarkInfo = fs.readFileSync(benchmarkDir + "/benchmark.json", {encoding:"utf8"});
            var benchmarkInfo = JSON.parse(rawBenchmarkInfo);

            result.push(new Benchmark(benchmark, commits, benchmarkInfo.indexTemplate, benchmarkInfo.libFile));
        }

        return result;
    }

    function prepareBenchmark(benchmark) {
        // prepare each commit directory by creating index_* files
        var commits = benchmark.commits;
        for (var i = 0; i < commits.length; i++) {
            var commit = commits[i];
            var commitDir = baseDir + "/benchmarks/" + benchmark.name + "/" + commit;

        }
    }

    exports.allBenchmarks = allBenchmarks;
    exports.prepareBenchmark = prepareBenchmark;

})();