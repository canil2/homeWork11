var express = require("express");
var app = express();

var routerapi = require("./app.js");
var router = require("./db/app.js");
app.use("/", router);
app.listen(5000);
console.log(
  "App is listening on 5000 port. Open http://localhost:5000 in browser to run"
);
