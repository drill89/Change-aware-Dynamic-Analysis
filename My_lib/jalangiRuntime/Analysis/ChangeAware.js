(function (sandbox) {
sandbox.Config.ENABLE_SAMPLING = true;
  function changeAware () {

    var getIid = [];
    var totalFuncExec = 0;
    var callAnalysis = true;
    console.log('I am in change aware');
  	this.runInstrumentedFunctionBody = function(iid, f, fiid) {
      console.log('I am in runinstrfuncbody...');
  		if (getIid.indexOf(fiid) > -1) {
  			console.log('The iid is ' + fiid);
  			callAnalysis = true;
  			totalFuncExec++;
  		} else {
  			console.log('Inside else: The iid is ' + fiid);
  			callAnalysis = false;
  		}
  		return callAnalysis;
      }
  }
  sandbox.analysis = new changeAware();
})(J$);
