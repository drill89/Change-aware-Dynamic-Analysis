/* A small library to find the percentage of a student in an exam.
   For every subject, a student has to undergo 3 tests and 1 final exam in a semester.
   To obtain the total points obtained by the student for each subject, the average of the 3 tests is added to the final exam.
   The percentage is calculated by summing up the total points obtained in all the subjects by a student divided by the maximum total points 	of all the subjects.
*/

//Basic arithmetic operations

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
      }
  }

  // This function would return the average of all the numbers in the array
  var Average = function(arr) {
      var avg = ArthimeticOperations.addition(arr);
      avg = ArthimeticOperations.division(avg,arr.length);
      return avg;
  }

  //This function takes an array of test points as its first argument and final exam points as second argument for a single subject
  //eg., arr=[40,45,48] gives the points of 3 tests for a single subject of a student and a=95 gives the final exam points of the respective subject (Note: here tests are evaluated for a maximum of 50 points and final exam to 100 points)

  var Subject_points = function(arr, final_points) {
      var points = Average(arr);
      points = ArthimeticOperations.addition([points,final_points]);
      return points;
  }

  //This function takes an array of subject points of a student as its first argument and the maximum total points of the exam
  //eg., arr = [90,80,95,75,85] is the points of 5 subjects of a student and 500 is the total points (assumed each exam is carried out for a maximum of 100 points)

  var percentage = function(arr, max_total) {
      var percent = ArthimeticOperations.addition(arr);
      percent = ArthimeticOperations.division(percent,max_total);
      percent = ArthimeticOperations.multiplication(percent,100);
      percent = +percent.toFixed(3);
      return percent;
  }
