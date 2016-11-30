"use strict";
/*jslint nomen: true*/

var express = require('express'),
    bodyparser = require('body-parser'),
    http = require('http'),
    app = express(),
    server,
    port;

app.use(express.static(__dirname));

app.use(bodyparser.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));

server = http.createServer(app);
port = process.env.PORT || 8100;

app.listen(port, function () {
    console.log('Listening on ' + port);
});
