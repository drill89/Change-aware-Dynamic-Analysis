(function (sandbox) {

    sandbox.Config.ENABLE_SAMPLING = true;
    var getIid = [];
    var totalFuncExec = 0;
    var callAnalysis = true;

    function loadJSON(file, callback) {
      var xobj = new XMLHttpRequest();
      xobj.open('GET', file, false);
      xobj.responsetype = 'json';
      xobj.onreadystatechange = function () {
          if (xobj.readyState == xobj.DONE && xobj.status == "200") {
            callback(xobj.response);
          }
      };
      xobj.send(null);
    }

    function changeAware () {
      loadJSON("./impactset.json", function(response) {
        getIid = JSON.parse(response).map(Number);
        console.log("The iids are: "+getIid);
      });
        
    	this.runInstrumentedFunctionBody = function(iid, f, fiid) {
    		if (getIid.indexOf(fiid) > -1) {
    			callAnalysis = true;
    			totalFuncExec++;
    		} else {
    			callAnalysis = false;
    		}
    		return callAnalysis;
      }
    }
    sandbox.analysis = new changeAware();
})(J$);
