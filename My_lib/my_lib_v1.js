/* A small library to find the percentage of a student in an exam.
   For every subject, a student has to undergo 3 tests and 1 final exam in a semester.
   To obtain the total points obtained by the student for each subject, the average of the 3 tests is added to the final exam.
   The percentage is calculated by summing up the total points obtained in all the subjects by a student divided by the maximum total points 	of all the subjects.
*/

//Basic arithmetic operations
(function() {
  var ArthimeticOperations = {
      addition : function (arr) {
  	var len = arr.length;
  	var sum = 0;
          for(var  i=0; i<len; i++) {
  	    sum += arr[i];
          }
          return sum;
      },
      subtraction : function (number1, number2) {
  	return number1 - number2;
      },
      multiplication : function (number1, number2) {
  	return number1 * number2;
      },
      division : function (number1, number2) {
  	     return number1 / number2;
       },
       dummy: "Dummy property"
  }
  var x;

  // This function would return the average of all the numbers in the array
  var Average = function(arr) {
      x = 5;
      ArthimeticOperations.negation = -1;
      var avg = ArthimeticOperations.addition(arr);
      avg = ArthimeticOperations.division(avg,arr.length);
      function abc() {
        x = 7;
        //ArthimeticOperations.dummy;
        console.log("Doesnt do anything");
      }
      return avg;
  }

  //This function takes an array of test points as its first argument and final exam points as second argument for a single subject
  //eg., arr=[40,45,48] gives the points of 3 tests for a single subject of a student and a=95 gives the final exam points of the respective subject (Note: here tests are evaluated for a maximum of 50 points and final exam to 100 points)

  var Subject_points = function(arr, final_points) {
      ArthimeticOperations.dummy;
      var points = Average(arr);
      points = ArthimeticOperations.addition([points,final_points]);
      percentage([23, 25, 24], 25);
      return points;
  }
console.log('my_lib_v1.......');
  //This function takes an array of subject points of a student as its first argument and the maximum total points of the exam
  //eg., arr = [90,80,95,75,85] is the points of 5 subjects of a student and 500 is the total points (assumed each exam is carried out for a maximum of 100 points)

  function percentage(arr, max_total) {
    if(x == 4) {
      //do nothing
    }
    ArthimeticOperations.negation;
      var percent = ArthimeticOperations.addition(arr);
      percent = ArthimeticOperations.division(percent,max_total);
      percent = ArthimeticOperations.multiplication(percent,100);
      percent = +percent.toFixed(3);
      return percent;
  }
  window.percentage = percentage;
  window.Subject_points = Subject_points;
  window.Average = Average;
  window.ArthimeticOperations = ArthimeticOperations;
})();
