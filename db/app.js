var test_express = require("express");
var fs = require("fs");
var test_path = require("path");
const app = test_express();
const router = test_express.Router();
var uuid = require("uuid");

router.get("/assets/js/index.js", function (req, res) {
  res.sendFile(test_path.join(__dirname + "/../public/assets/js/index.js"));
});

router.get("/assets/css/styles.css", function (req, res) {
  res.sendFile(test_path.join(__dirname + "/../public/assets/css/styles.css"));
});

router.get("/notes", function (req, res) {
  res.sendFile(test_path.join(__dirname + "/../public/notes.html"));
});

router.get("*", function (req, res) {
  res.sendFile(test_path.join(__dirname + "/../public/index.html"));
});

router.put("/api/notes", function (req, res) {
  fs.readFile("db/db.json", function (err, data) {
    if (err) throw err;
    else {
      let db;
      if (data == undefined || data == "" || data == " ") {
        db = [];
      } else {
        db = JSON.parse(data);
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(db));
      return res.end();
    }
  });
});

app.use(test_express.urlencoded());

app.use(test_express.json());

var { parse } = require("querystring");

router.post("/api/notes", function (req, res) {
  var body = "";

  var bodyToWrite;
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", (chunk) => {
    fs.readFile("db/db.json", function (err, data) {
      if (err) throw err;
      else {
        let db;
        if (data == undefined || data == "" || data == " ") {
          db = [];
        } else {
          db = JSON.parse(data);
        }
        body = body + "&id=" + uuid.v1();
        db.push(parse(body));

        fs.writeFile("db/db.json", JSON.stringify(db), function (err, data) {
          if (err) throw err;
          else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(parse(body)));
            return res.end();
          }
        });
      }
    });
  });
});

router.delete("/api/notes/:id", function (req, res) {
  fs.readFile("db/db.json", function (err, data) {
    var dataFromFile = JSON.parse(data);
    for (var i = 0; i < dataFromFile.length; i++) {
      var reqid = req.params.id;
      if (dataFromFile[i].id == reqid) {
        dataFromFile.splice(i, 1);
      }
    }
    fs.writeFile("db/db.json", JSON.stringify(dataFromFile), function (
      err,
      data
    ) {
      if (err) throw err;
      else {
        return res.end();
      }
    });
  });
});

module.exports = router;
