exports.getDifference = function() {
  var shell = require('shelljs');
  var cmd = 'diff -w -B -I \'//.*$\' -I \'/\*\s*?\*/\' -I \'*.*$\' ./underscore_old/underscore.js ./underscore/underscore.js'; //diff command to find the difference between the two files
//  -I \'//.*$\' -I \'/\*\s*?\*/\' -I \'*.*$\'
  var linediff = []; //to store the line numbers obtained from the diff command w.r.t second file only
  var child = shell.exec(cmd, {silent: true});//
  var temp = null;
    //console.log('stdout: ' + stdout);
    var arr = child.output.toString().split("\n"); //get only the lines numbers
    /*line numbers will be of the form 8d7.
    It denotes that the line number 8 from first file was deleted and it was not found in line number 7 of second file.
    To obtain changes from only second file make necessary computations as done below:*/
    var regex = /(a|c|d)/;
    var inc = 0;
    for(var i=0; i < arr.length; i++){
      //console.log(i+":"+arr[i]);
      if(/^\d/.test(arr[i])){
          //console.log(arr[i]);
          temp = arr[i].split(regex);
          temp = temp[temp.length - 1];
          if(temp.indexOf(',')){ //for line numbers of type 57,58
            temp = temp.split(',');
          }
          temp[0]=parseInt(temp[0]);
	      if(temp[1])  temp[1]=parseInt(temp[1]);
          //console.log(temp);
          inc = temp[0];
          while(inc < temp[1]){
              inc++;
              if(temp.indexOf(inc) == -1)
                  temp.push(inc);
          }
          for(var j = 0; j < temp.length; j++){
            linediff.push(temp[j]);
          }
      }
    }
    //console.log(linediff);
    return linediff;
}
