/*
 * Copyright 2014 University of California, Berkeley.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Author: Liang Gong
// Ported to Jalangi2 by Koushik Sen

/**
 * Check Rule: Do not do binary operation on undefined values
 *
 * binary operation (e.g., +, -, * , /, % etc.) on undefined values
 * can be very slow as the JIT-compiler has to insert runtime checks.
 */

((function (sandbox) {
    function BinaryOpOnUndef() {
        var Constants = sandbox.Constants;
        var HOP = Constants.HOP;
        var iidToLocation = sandbox.iidToLocation;

        var RuntimeDB = sandbox.RuntimeDB;
        var db = new RuntimeDB();

        var warning_limit = Number.MAX_VALUE;
        var ACCESS_THRESHOLD = 999;

        // ---- JIT library functions start ----

        function checkBinaryOpOnUndefined(iid, op, left, right) {
            if (typeof left === 'undefined' || typeof right === 'undefined') {
                if (op === '|' || op === '^' || op === '&' || op === '~' || op === '+' || op === '-' || op === '*' || op === '/' || op === '%') {
                    db.addCountByIndexArr(['JIT-checker', 'binary-undefined-op', sandbox.getGlobalIID(iid)]);
                }
            }
        }

        // ---- JIT library functions end ----

        this.endExecution = function () {
            this.printResult();
        };

        this.binaryPre = function (iid, op, left, right, isOpAssign, isSwitchCaseComparison) {
            checkBinaryOpOnUndefined(iid, op, left, right);
        };

        this.printResult = function () {
            try {
                sandbox.log("---------------------------");

                sandbox.log('<b>Report of binary operation on undefined value:</b>');
                var binaryUndefinedArr = [];
                var binaryUndefinedDB = db.getByIndexArr(['JIT-checker', 'binary-undefined-op']);
                var num = 0;
                for (var prop in binaryUndefinedDB) {
                    if (HOP(binaryUndefinedDB, prop)) {
                        if(binaryUndefinedDB[prop].count > ACCESS_THRESHOLD) {
                            binaryUndefinedArr.push({'iid': prop, 'count': binaryUndefinedDB[prop].count});
                            num++;
                            sandbox.JITProf.addWarnings();
                        }
                    }
                }
                binaryUndefinedArr.sort(function compare(a, b) {
                    return b.count - a.count;
                });
                for (var i = 0; i < binaryUndefinedArr.length && i < warning_limit; i++) {
                    sandbox.log(' * [location: ' + iidToLocation(binaryUndefinedArr[i].iid) + ']: <br/> &nbsp; Number of usages: ' + binaryUndefinedArr[i].count);
                }
                sandbox.log('Number of statements that perform binary operation on undefined values: ' + num);
                sandbox.log('[****]BinaryOpUndef: ' + num);


            } catch (e) {
                console.log("error!!");
                console.log(e);
            }
        }
    }

    sandbox.analysis = new BinaryOpOnUndef();

})(J$));
