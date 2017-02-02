# Change-aware-Dynamic-Analysis

A static program analysis to reduce the overhead of dynamic analyses for JavaScript.

## Abstract

Dynamic analysis is a powerful technique to detect correctness, performance, and security problems, in particular for programs written in dynamic languages, such as JavaScript. To catch mistakes as early as possible, developers should run such analyses after each code change, e.g., by executing a regression test suite. Unfortunately, the high overhead of these analyses make this approach prohibitively expensive, hindering developers from benefiting from the power of heavyweight dynamic analysis. This paper presents change-aware dynamic program analysis, a generic approach to make an important class of dynamic analyses change-aware. The key idea is to identify parts of the code affected by a change through a lightweight static change impact analysis, and to focus the dynamic analysis on these affected parts. We implement the idea based on the dynamic analysis framework Jalangi and evaluate it with 46 checkers from the DLint and JITProf tools. Our results show that change-aware dynamic analysis reduces the overall analysis time by 40%, on average, and by at least 80% for 31% of all commits.

A paper describing the technique is currently under submission.

## Installation and Usage

Follow these steps for installing the CADA tool:

* Clone this repository and run `npm install`

* Enter the jalangiRuntime directory and clone the jalangi2 repository (https://github.com/drill89/jalangi2)

* Enter the jalangi2 directory and execute `npm install`

* Go back to the root directory and clone the jalangi2analyses repository (https://github.com/drill89/jalangi2analyses.git)

To apply CADA to a the "backbone" library, run:
`node evaluation/js/runAllExperiments.js`
