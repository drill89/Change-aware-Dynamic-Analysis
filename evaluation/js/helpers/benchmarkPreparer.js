// Author: Michael Pradel

(function() {

    var baseDir = require("process").cwd();
    var fs = require("fs");
    var instrumenter = require("./../../../CodeInstrumenter");

    var fragmentDir = baseDir + "/evaluation/htmlFragments";
    var jqueryFragment = fs.readFileSync(fragmentDir + "/jquery.html");
    var jalangiFragment = fs.readFileSync(fragmentDir + "/jalangi.html");
    var dlintFragment = fs.readFileSync(fragmentDir + "/dlint.html");
    var jitprofFragment = fs.readFileSync(fragmentDir + "/jitprof.html");
    var finalizeFragment = fs.readFileSync(fragmentDir + "/finalize.html");

    function createHTMLFiles(benchmark) {
        for (var i = 0; i < benchmark.commits.length; i++) {
            var commit = benchmark.commits[i];

            var dir = baseDir + "/benchmarks/" + benchmark.name + "/" + commit;
            var template = fs.readFileSync(dir + "/" + benchmark.indexTemplate, {encoding:"utf8"});

            // index file without any analysis
            var indexNoAnalysis = template.replace("<!-- LIB -->", "<script src='" + benchmark.libFile + "'></script>");
            fs.writeFileSync(dir + "/GENERATED_index_noAnalysis__.html", indexNoAnalysis);

            // index file for full analysis with DLint
            var jsFullDLint = "<script src='GENERATED_js/evalClient_fullAnalysis_dlint.js'></script>";
            var indexFullDLint = template
                  .replace("<!-- PREALL -->", jqueryFragment + "\n\n" + jsFullDLint + "\n\n" + jalangiFragment + "\n\n" + dlintFragment)
                  .replace("<!-- LIB -->", "<script src='" + benchmark.instrumentedLibFile + "'></script>")
                  .replace("<!-- POSTTESTS -->", finalizeFragment);
            fs.writeFileSync(dir + "/GENERATED_index_fullAnalysis_dlint.html", indexFullDLint);

            // index file for full analysis with JITProf
            var jsFullJITProf = "<script src='GENERATED_js/evalClient_fullAnalysis_jitprof.js'></script>";
            var indexFullJITProf = template
                  .replace("<!-- PREALL -->", jqueryFragment + "\n\n" + jsFullJITProf + "\n\n" + jalangiFragment + "\n\n" + jitprofFragment)
                  .replace("<!-- LIB -->", "<script src='" + benchmark.instrumentedLibFile + "'></script>")
                  .replace("<!-- POSTTESTS -->", finalizeFragment);
            fs.writeFileSync(dir + "/GENERATED_index_fullAnalysis_jitprof.html", indexFullJITProf);

            // index file for change-aware analysis with DLint
            var jsChangeAwareDLint = "<script src='GENERATED_js/evalClient_changeAwareAnalysis_dlint.js'></script>";
            var indexChangeAwareDLint = template
                  .replace("<!-- PREALL -->", jqueryFragment + "\n\n" + jsChangeAwareDLint + "\n\n" + jalangiFragment + "\n\n" + dlintFragment)
                  .replace("<!-- LIB -->", "<script src='" + benchmark.instrumentedLibFile + "'></script>")
                  .replace("<!-- POSTTESTS -->", finalizeFragment);
            fs.writeFileSync(dir + "/GENERATED_index_changeAwareAnalysis_dlint.html", indexChangeAwareDLint);

            // index file for change-aware analysis with JITProf
            var jsChangeAwareJITProf = "<script src='GENERATED_js/evalClient_changeAwareAnalysis_jitprof.js'></script>";
            var indexChangeAwareJITProf = template
                  .replace("<!-- PREALL -->", jqueryFragment + "\n\n" + jsChangeAwareJITProf + "\n\n" + jalangiFragment + "\n\n" + jitprofFragment)
                  .replace("<!-- LIB -->", "<script src='" + benchmark.instrumentedLibFile + "'></script>")
                  .replace("<!-- POSTTESTS -->", finalizeFragment);
            fs.writeFileSync(dir + "/GENERATED_index_changeAwareAnalysis_jitprof.html", indexChangeAwareJITProf);
        }
    }

    function adaptAndWriteJSTemplate(jsDir, template, benchmarkName, commit, execMode, analysis) {
        var js = template
              .replace("__PROJECT__", benchmarkName)
              .replace("__COMMIT__", commit)
              .replace("__EXECUTION_MODE__", execMode)
              .replace("__ANALYSIS__", analysis);
        fs.writeFileSync(jsDir + "/evalClient_" + execMode + "_" + analysis + ".js", js);
    }

    function createJSFiles(benchmark) {
        for (var i = 0; i < benchmark.commits.length; i++) {
            var commit = benchmark.commits[i];
            var dir = baseDir + "/benchmarks/" + benchmark.name + "/" + commit;

            var template = fs.readFileSync(baseDir + "/evaluation/js/helpers/evalClient.js", {encoding:"utf8"});

            // create 'js' directory (if not yet there)
            var jsDir = dir + "/GENERATED_js";
            try {
                fs.accessSync(jsDir, fs.F_OK);
            } catch (e) {
                fs.mkdirSync(jsDir);
            }

            adaptAndWriteJSTemplate(jsDir, template, benchmark.name, commit, "fullAnalysis", "dlint");
            adaptAndWriteJSTemplate(jsDir, template, benchmark.name, commit, "fullAnalysis", "jitprof");
            adaptAndWriteJSTemplate(jsDir, template, benchmark.name, commit, "changeAwareAnalysis", "dlint");
            adaptAndWriteJSTemplate(jsDir, template, benchmark.name, commit, "changeAwareAnalysis", "jitprof");
        }
    }

    function instrumentLib(benchmark) {
        for (var i = 0; i < benchmark.commits.length; i++) {
            var commit = benchmark.commits[i];
            var dir = baseDir + "/benchmarks/" + benchmark.name + "/" + commit;
            var libPath = dir + "/" + benchmark.libFile;
            var instrumentedLibPath = dir + "/" + benchmark.instrumentedLibFile;
            var instrumentedLibJSONPath = dir + "/" + benchmark.instrumentedLibJSONFile;

            var originalCode = fs.readFileSync(libPath, "utf8");
            instrumenter.preProcess(originalCode, libPath, instrumentedLibPath, instrumentedLibJSONPath);
        }
    }

    function linkToJalangi(benchmark) {
        var jalangiDir = baseDir + "/jalangiRuntime";
        var jalangi2analysesDir = baseDir + "/jalangi2analyses";
        for (var i = 0; i < benchmark.commits.length; i++) {
            var commit = benchmark.commits[i];
            var commitDir = baseDir + "/benchmarks/" + benchmark.name + "/" + commit;
            var jalangiForCommitDir = commitDir + "/GENERATED_jalangiRuntime";
            var jalangi2analysesForCommitDir = commitDir + "/GENERATED_jalangi2analyses";
            // create symlink for jalangiRuntime (if not yet there)
            try {
                fs.accessSync(jalangiForCommitDir, fs.F_OK);
            } catch (e) {
                fs.symlinkSync(jalangiDir, jalangiForCommitDir);
            }
            // create symlink for jalangi2analyses (if not yet there)
            try {
                fs.accessSync(jalangi2analysesForCommitDir, fs.F_OK);
            } catch (e) {
                fs.symlinkSync(jalangi2analysesDir, jalangi2analysesForCommitDir);
            }

        }
    }

    exports.createHTMLFiles = createHTMLFiles;
    exports.createJSFiles = createJSFiles;
    exports.instrumentLib = instrumentLib;
    exports.linkToJalangi = linkToJalangi;


})();
