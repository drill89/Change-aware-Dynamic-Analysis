// Author: Michael Pradel

function foo() {
    // should yield a NaN warning from DLint:
    var x = 23 / "abc";
    return true;
}

function bar() {
    // should yield a NaN warning from DLint:
    var x = 42 / "def";
    return true;
}

function baz() {
    // should yield a NaN warning from DLint:
    var x = 42 / "def";

    // should yield a warning from JITProf:
    for (var i = 0; i < 1001; i++) {
        var u = undefined;
        var y = 4 - u;
    }
    return true;
}