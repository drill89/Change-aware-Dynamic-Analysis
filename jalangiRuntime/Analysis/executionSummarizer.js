
(function(sandbox) {

    function ExecutionSummarizer() {

        this.invokeFunPre = function(iid, f, base, args, isConstructor, isMethod, functionIid) {
	    console.log('invokeFunPre ');
            return {f:f, base:base, args:args, skip:false};
        };


        this.invokeFun = function(iid, f, base, args, result, isConstructor, isMethod, functionIid) {
	    console.log('invokeFun ');
            return {result:result};
        };


        this.literal = function(iid, val, hasGetterSetter) {
	    console.log('literal');
            return {result:val};
        };

        this.forinObject = function(iid, val) {
	    console.log('forinObject');
            return {result:val};
        };


        this.declare = function(iid, name, val, isArgument, argumentIndex, isCatchParam) {
	    console.log('declare');
            return {result:val};
        };


        this.getFieldPre = function(iid, base, offset, isComputed, isOpAssign, isMethodCall) {
	    console.log('getFieldPre');
            return {base:base, offset:offset, skip:false};
        };


        this.getField = function(iid, base, offset, val, isComputed, isOpAssign, isMethodCall) {
	    console.log('getField');
            return {result:val};
        };


        this.putFieldPre = function(iid, base, offset, val, isComputed, isOpAssign) {
	    console.log('putFieldPre');
            return {base:base, offset:offset, val:val, skip:false};
        };

        this.putField = function(iid, base, offset, val, isComputed, isOpAssign) {
	    console.log('putField');
            return {result:val};
        };

        this.read = function(iid, name, val, isGlobal, isScriptLocal) {
	    console.log('read');
            return {result:val};
        };

        this.write = function(iid, name, val, lhs, isGlobal, isScriptLocal) {
	    console.log('write');
            return {result:val};
        };

        this._return = function(iid, val) {
	    console.log('return');
            return {result:val};
        };

        this._throw = function(iid, val) {
	    console.log('throw');
            return {result:val};
        };

        this._with = function(iid, val) {
	    console.log('with');
            return {result:val};
        };

        this.functionEnter = function(iid, f, dis, args) {
	    console.log('functionEnter '+Object.getOwnPropertyNames(f).forEach(function(val, idx, array) {
		console.log(val + ' -> ' + f[val]);
		})
	    );
        };

        this.functionExit = function(iid, returnVal, wrappedExceptionVal) {
	    console.log('functionExit');
            return {returnVal:returnVal, wrappedExceptionVal:wrappedExceptionVal, isBacktrack:false};
        };

        this.scriptEnter = function(iid, instrumentedFileName, originalFileName) {
	    console.log('ScriptEnter');
        };

        this.scriptExit = function(iid, wrappedExceptionVal) {
	    console.log('ScriptExit');
            return {wrappedExceptionVal:wrappedExceptionVal, isBacktrack:false};
        };

        this.binaryPre = function(iid, op, left, right, isOpAssign, isSwitchCaseComparison, isComputed) {
	    console.log('binaryPre');
            return {op:op, left:left, right:right, skip:false};
        };

        this.binary = function(iid, op, left, right, result, isOpAssign, isSwitchCaseComparison, isComputed) {
	    console.log('binary');
            return {result:result};
        };

        this.unaryPre = function(iid, op, left) {
	    console.log('unaryPre');
            return {op:op, left:left, skip:false};
        };

        this.unary = function(iid, op, left, result) {
	    console.log('unary');
            return {result:result};
        };

        this.conditional = function(iid, result) {
	    console.log('conditional');
            return {result:result};
        };

        this.instrumentCodePre = function(iid, code) {
	    console.log('instrumentCodePre');
            return {code:code, skip:false};
        };

        this.instrumentCode = function(iid, newCode, newAst) {
	    console.log('instrumentCode');
            return {result:newCode};
        };

        this.endExpression = function(iid) {
	    console.log('endExpression');
        };

        this.endExecution = function() {
	    console.log('endExecution');
        };

    }

    sandbox.analysis = new ExecutionSummarizer();
})(J$);



