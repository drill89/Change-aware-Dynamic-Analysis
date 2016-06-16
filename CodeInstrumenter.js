(function () {
  var fs = require('fs');
  var path = require('path');
  var temp = require('temp');
  var jalangi = require("./jalangiRuntime/jalangi2/src/js/utils/api.js");

  function preProcess(code, readfile, writefile, jsonfile) {
  	readfile = getpath(readfile);
  	writefile = getpath(writefile);
    jsonfile = getpath(jsonfile);
    var options = { inputFileName : readfile,
      outputFile : writefile,
      inlineSourceMap : true,
      inlineSource : true,
      instHandler : { ENABLE_SAMPLING : true}
    };
    var instrumented = jalangi.instrumentString(code, options);
    if (instrumented.instAST === undefined) return; // instrumentation failed; probably code is syntactically incorrect
    delete instrumented.sourceMapObject["code"];
    delete instrumented.sourceMapObject["nBranches"];
    delete instrumented.sourceMapObject["originalCodeFileName"];
    delete instrumented.sourceMapObject["instrumentedCodeFileName"];
    var sourcemap = JSON.stringify(instrumented.sourceMapObject);
    var transformedCode = instrumented.code;
    fs.writeFileSync(writefile,transformedCode);
    fs.writeFileSync(jsonfile,sourcemap);
    //var instrumented_code = transformedCode +'J$.iids = '+ sourcemap + ';' ;
    //return transformedCode;
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
