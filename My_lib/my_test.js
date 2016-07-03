(function() {

test('Finding percentage of a student', function () {
      equal(percentage([100,105,111,110,115,105],750), 86.133, "Tested the Percentage functionality");
});

test('Addition Test', function () {
    strictEqual(ArthimeticOperations.addition([3, 4]), 7, "Tested the addition functionality");
});

test('Subtraction Test', function () {
    strictEqual(ArthimeticOperations.subtraction(2, 5), -3, "Tested the subtraction functionality");
});

test('Multiplication Test', function () {
    strictEqual(ArthimeticOperations.multiplication(2, 5), 10, "Tested the multiplication functionality");
});

test('Division Test', function () {
    strictEqual(ArthimeticOperations.division(10, 5), 2, "Tested the division functionality");
});

test('Finding average of numbers in an array', function () {
    strictEqual(Average([30,30,30]), 30, "Tested the Average functionality");
});

test('Finding points of a subject', function () { //has to be changed for version 3
    strictEqual(Subject_points([23,24,25], 87), 111, "Tested the Subject points functionality");
});


/*
test('Sorting the array', function () {
    deepEqual(incremental_sort([25,24,24]), [24,24,25], "Tested the Sorting functionality");
});

test('Slicing the array', function () {
    deepEqual(array_slice([25,24,23]), [24,23], "Tested the Array slicing functionality");
});*/

})();
