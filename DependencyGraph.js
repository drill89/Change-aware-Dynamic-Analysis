exports.getDependency = function(file, lines, insfile) {
  console.time("Dependency");
  var fs = require("fs");
  var ternModule = require("tern");
  var tern = new ternModule.Server({});
  var estraverse = require("estraverse");
  var acorn = require("acorn");
  var _ = require("underscore");

  //var file = "./tests/underscore_new.js";
  var filename = file.match(/[^\\/]+\.[^\\/]+$/)[0];
  //console.log(filename);

  //read the instrumented source file to calculate the IIDs of every function
  var jsonfile = fs.readFileSync(insfile);
  var json = JSON.parse(jsonfile);

  var code = fs.readFileSync(file);
  var data = acorn.parse(code,{locations: true});
//  fs.writeFileSync("./output/dup_ast.json",JSON.stringify(data, null, 4));

  var funcCount = 0; //total number of functions in a program
  var storeFunctions = {};//startline, endline, startchar, endchar for each function
  var functionsList = [];//array to push the new functions
  var functoIID = {};////function id to IID mapping
  var offset = []; //function start line number, start column number, end line number, end column number
  var CallertoCallee = {};//{ funcA:[funcB, funcC] } i.e funcA influences upon funcB and funcC
  var charOffset = []; //each function's start and end char offset 
  var callExpr = {}; //store all the call expressions from each function
  var retFunc = []; //functions which contains the return statements
  var functionDependency = {};//function which influences other functions through variable/property reads
  var varPropRefs = {};//variables or properties which are referenced in other functions that has been defined in the function('key')
  var varPropDefn = [];//variables or properties definitions
  var changedFunctions = [];//function that has been modified
  var enclFunc = []; //enclosing functions of the changed function
  var functionImpactSet = [];//functions that has been affected due to modifications in other function
  var IIDImpactSet = [];//IIDs of the function in the impact set
  //var lines = [96,507,595,625,638,655,710,726,962,994,995,1030,1061,1065,1188,1319,1423];

  // parse and analyze files
  tern.addFile(filename, fs.readFileSync(file));

  var lastfunc;
  estraverse.traverse(data, {
    enter: function(node, parent) {
      switch(node.type) {
        case 'Program':
            functionsList.push(filename+"_Script");
            //console.log("Pushing: Script");
          break;

        case 'FunctionExpression':
            offset = [node.loc.start.line, node.loc.start.column + 1, node.loc.end.line, node.loc.end.column + 1];
            if(parent.type === 'VariableDeclarator' || parent.type === 'AssignmentExpression' || parent.type === 'Property')
                charOffset = [node.start - node.loc.start.column, node.end];
            else
                charOffset = [node.start, node.end];
            funcCount++;
            functionComputations(offset, charOffset);
          break;

        case 'FunctionDeclaration':
            offset = [node.loc.start.line, node.loc.start.column + 1, node.loc.end.line, node.loc.end.column + 1];
            charOffset = [node.start, node.end];
            funcCount++;
            functionComputations(offset, charOffset);
          break;

        //function calls
        case 'CallExpression':
              if(node.callee.type === "MemberExpression") {
                callExpressionComputations(node.callee.property.start, node.callee.property.end);
              }
              else if(node.callee.type === "Identifier") {
                  callExpressionComputations(node.callee.start, node.callee.end);
              }
          break;

        //functions which contain the return statement
        case 'ReturnStatement':
              lastfunc = functionsList[functionsList.length - 1];
              if(retFunc.indexOf(lastfunc) == -1)
                    retFunc.push(lastfunc);
          break;
              
        //collecting the variables declared within a function
        case 'VariableDeclarator':
              if((node.init != null && node.init.type === 'FunctionExpression') || (node.init != null && node.init.type === 'ObjectExpression')) {
                  break;
              }
              else {
//                  console.log("variable "+node.id.name+" start and end is:"+node.id.start+" "+node.id.end);
                    varPropComputations(node.id.start, node.id.end);
                    varPropDefn.push(node.id.end);
              }
          break;
              
        //collecting the properties of an object defined within a function
        case 'ObjectExpression':
              for(var j=0; j<node.properties.length; j++) {
                  if(node.properties[j].value.type != 'FunctionExpression'){
//                        console.log("property "+node.properties[j].key.name+" start and end is:"+node.properties[j].key.start+" "+node.properties[j].key.end);
                        varPropComputations(node.properties[j].key.start, node.properties[j].key.end);
                        varPropDefn.push(node.properties[j].key.end);
                  }
              }
          break;
              
              
        //collecting all the variables/properties which is overwritten within a function
        case 'AssignmentExpression':
              if(node.right.type != 'FunctionExpression' && node.right.type != 'ObjectExpression'){
                if(node.left.type === 'MemberExpression'){
//                    console.log("assignment left "+node.left.property.name+" start and end is:"+node.left.property.start+" "+node.left.property.end);
                    if(node.left.property.name === 'prototype') break;
                    else {
                        varPropComputations(node.left.property.start, node.left.property.end);
                        varPropDefn.push(node.left.property.end);
                    }
                    
                }
                else{
//                    console.log("assignment left "+node.left.name+" start and end is:"+node.left.start+" "+node.left.end);
                    varPropComputations(node.left.start, node.left.end);
                    varPropDefn.push(node.left.end);
                }
              }
          break;
      }
    },

    leave: function(node, parent) {
      switch (node.type) {
        case 'FunctionExpression':
              var c = functionsList.pop();
              //console.log("Popped function: "+c);
              break;

          case 'FunctionDeclaration':
              var c = functionsList.pop();
              //console.log("Popped function: "+c);
              break;

          case 'Program':
              var c = functionsList.pop();
              //console.log("Popped: "+c);
              break;
      }
    }
  });

  function functionComputations(o, c) {
    var a, id, iid, caller, callees;  
    //capturing nested functions
//    caller = functionsList[functionsList.length - 1];
//    if(!(CallertoCallee.hasOwnProperty(caller))) {
//      CallertoCallee[caller] = [];
//    }
//    callees = CallertoCallee[caller];
    iid = fetchIID(o);
    //id for each function
    id = filename+"_"+iid;
//    callees.push(id);
    functionsList.push(id);
    functoIID[id] = iid;
    //console.log("Pushing function definition: "+id);
    //start and end lines of each function
    if(!(storeFunctions.hasOwnProperty(id))) {
        storeFunctions[id] = [o[0], o[2], c[0], c[1]];
    }
  }

//check the offset with the json instrumented file for the respective functions IID.
  function fetchIID(o) {
    for(var k in json) {
      a = json[k];
      if(_.isEqual(o, a)){
        return k;
      }
    }
  }

    function callExpressionComputations(s, e) {
        var query, callid, func, calls;
//        console.log("Start: "+s+" End: "+e);
        func = functionsList[functionsList.length - 1];
        query = { 
                    query:{type:"definition", end:e, start: s, file:filename}
                    //lineCharPositions: true
                }
        //querying tern server requesting for the offset of the function definition for each call
        tern.request(query, function(err, da) {
            if(da.start) {
                if(!(callExpr.hasOwnProperty(func))) {
                    callExpr[func] = [];
                }
                calls = callExpr[func];
                calls.push(da.end);
            }
        });
    }

    callGraph();// obtain the call graph

    function callGraph() {
        var arr, v, ret, callees;
        for(var c in callExpr) {
            arr = callExpr[c];
            for(var i=0; i<arr.length; i++) {
                for(var k in storeFunctions) {
                    v = storeFunctions[k];
                    if(arr[i] >= v[2] && arr[i] <= v[3]) {
                        ret = k;
                    }
                }
                 arr[i] = ret;
                if(!(CallertoCallee.hasOwnProperty(c))) {
                    CallertoCallee[c] = [];
                }
                callees = CallertoCallee[c];
                if(callees.indexOf(ret) == -1 && ret!=c)
                    callees.push(ret);
            }
        }
    }
    
    functionDependencyGraph();
    
    function functionDependencyGraph() {
        var arr, d, query;
//        console.log("Functions containing return functions are: "+retFunc);
        //functions which reads the values returned from other functions
        for(var c in callExpr) {
            arr = callExpr[c];
            for(var i=0; i<retFunc.length; i++) {
                if(arr.indexOf(retFunc[i]) != -1) {
                    if(!(CallertoCallee.hasOwnProperty(retFunc[i]))) {
                        CallertoCallee[retFunc[i]] = [];
                    }
                    d = CallertoCallee[retFunc[i]];
                    if(d.indexOf(c) == -1)
                        d.push(c);
                }
            }
        }
        
//        console.log("varpropdefns is: "+varPropDefn);
//        console.log("Varproprefs is: "+JSON.stringify(varPropRefs, null, 4));
        //variable and property dependencies
        var a, v, ret, callees;
        for(var c in varPropRefs) {
            a = varPropRefs[c];
            a = _.difference(a, varPropDefn);
//            console.log(c+": [ "+a+" ]");
            for(var i=0; i<a.length; i++) {
                for(var k in storeFunctions) {
                    v = storeFunctions[k];
                    if(a[i] >= v[2] && a[i] <= v[3]) {
                        ret = k;
                    }
                }
                 a[i] = ret;
                if(!(CallertoCallee.hasOwnProperty(c))) {
                    CallertoCallee[c] = [];
                }
                callees = CallertoCallee[c];
                if(ret != c && callees.indexOf(ret) == -1)
                    callees.push(ret);
            }
//            console.log(c+": [ "+a+" ]");
            varPropRefs[c] = _.uniq(a);
        }
//        console.log("Varproprefs is: "+JSON.stringify(varPropRefs, null, 4));
    }
    
    function varPropComputations(s, e) {
        var query, calls;
        lastfunc = functionsList[functionsList.length - 1];
//        console.log("Last function is:"+lastfunc);
        query = { 
                    query:{type:"refs", end:e, start: s, file:filename}
                    //lineCharPositions: true
                }
        //querying tern server requesting for the offset of the variable/property referenced in other functions
        tern.request(query, function(err, da) {
            if(da) {
//                console.log("references are: "+JSON.stringify(da, null, 4));
                for(var i=0; i<da.refs.length; i++) {
                    if(!(varPropRefs.hasOwnProperty(lastfunc))) {
                        varPropRefs[lastfunc] = [];
                    }
                    calls = varPropRefs[lastfunc];
                    if(calls. indexOf(da.refs[i].end) == -1 && da.refs[i].end != e)
                        calls.push(da.refs[i].end);
                }
            }
        });
//        console.log(lastfunc+ " : ["+calls+"]");
    }
    
    fs.writeFileSync("./output/dependency.json",JSON.stringify(CallertoCallee, null, 4));
    console.timeEnd("Dependency");
    
    console.time("ImpactSet");
    getChangedFunction();
    
    function getChangedFunction() {
        var ret, v;
        for(var i=0; i<lines.length; i++){
            for(var k in storeFunctions) {
                v = storeFunctions[k];
                if(lines[i] >= v[0] && lines[i] <= v[1]) {
                    ret = k;
                    enclFunc.push(k);
                }
            }
            if(changedFunctions.indexOf(ret) == -1)
                changedFunctions.push(ret);
        }
    }
    //console.log(changedFunctions);
    
    functionImpactSet = changedFunctions;
    getImpactSet();
    
    function getImpactSet() {
        var c, val;
        for(var i = 0; i < functionImpactSet.length; i++) {
            c = functionImpactSet[i];
            if(CallertoCallee.hasOwnProperty(c)) {
                val = CallertoCallee[c];
                for(var j = 0; j < val.length; j++) {
                    if(functionImpactSet.indexOf(val[j]) == -1)
                        functionImpactSet.push(val[j]);
                    }
            }
        }
        for(var i = 0; i < enclFunc.length; i++) {
            if(functionImpactSet.indexOf(enclFunc[i]) == -1)
                functionImpactSet.push(enclFunc[i]);
        }
    }
    //console.log(functionImpactSet);
    
    getIIDs();
    
    function getIIDs() {
        for(var i = 0; i < functionImpactSet.length; i++) {
            var id = functoIID[functionImpactSet[i]];
            IIDImpactSet.push(id);
        }
    }
    //console.log(IIDImpactSet);
    
    console.log("Total number of functions: "+funcCount);
    console.log("No of Impact functions are: "+functionImpactSet.length);

  fs.writeFileSync("./output/impactset.json",JSON.stringify(IIDImpactSet, null, 4));
  console.timeEnd("ImpactSet");
  fs.writeFileSync("./output/storeFunctions.json",JSON.stringify(storeFunctions, null, 4));
  //fs.writeFileSync("./output/callExpr.json",JSON.stringify(callExpr, null, 4));
  //fs.writeFileSync("./output/functiondependency.json",JSON.stringify(functionDependency, null, 4));
  //fs.writeFileSync("./output/varPropRefs.json",JSON.stringify(varPropRefs, null, 4));
  //console.timeEnd("Dependency");
  //return IIDImpactSet;
}
