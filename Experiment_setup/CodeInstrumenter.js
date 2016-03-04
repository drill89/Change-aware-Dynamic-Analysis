(function () {
  var path = require('path');
  var temp = require('temp');
  var jalangi = require("./underscore/test/jalangi2analyses/node_modules/jalangi2/src/js/utils/api.js");

  function preProcess(code, readfile, writefile) {
  	readfile = getpath(readfile);
  	writefile = getpath(writefile);
    var options = { inputFileName : readfile,
      outputFile : writefile,
      inlineSourceMap : true,
      inlineSource : true
    };
    var instrumented = jalangi.instrumentString(code, options);
    if (instrumented.instAST === undefined) return; // instrumentation failed; probably code is syntactically incorrect
    //var sourcemap = JSON.stringify(instrumented.sourceMapObject);
    var transformedCode = instrumented.code;
    //var instrumented_code = transformedCode +'J$.iids = '+ sourcemap + ';' ;
    return transformedCode;
  }

  function getpath(filePath) {
    if (filePath) {
        return path.resolve(filePath);
    } else {
        return temp.path({suffix: '.js'});
    }
  }
  exports.preProcess = preProcess;
})();
