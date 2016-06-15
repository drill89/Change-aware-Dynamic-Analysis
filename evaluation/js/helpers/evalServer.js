// Author: Michael Pradel

(function() {

    var express = require('express');
    var bodyParser = require('body-parser');

    var resultDatabase = require("./resultDatabase");

    function startServer() {
        var app = express();
        app.use(express.static('client'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: true
        }));

        app.post('/reportResult', function (request, response) {
            var resultFromExecution = request.body.resultFromExecution;
            resultDatabase.addNewExecutionResult(resultFromExecution);
            response.send("OK");
        });

        var server = app.listen(4000, function () {
            var host = server.address().address;
            var port = server.address().port;

            console.log("\nEvalServer listing at http://%s:%s", host, port);
        });

        return server;
    }

    exports.startServer = startServer;

})();