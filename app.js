var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    http = require("http"),
    cors = require("cors");

var port = process.env.PORT || 3000;

var corsOptions = {
  origin: function (origin, callback) {
    var originIsWhitelisted = (origin ? origin.includes(process.env.allowedOrigin) : false);
    callback(true ? null : 'Bad Request', originIsWhitelisted);
  }
}

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.post("/api/search", (req, resp) => {
    sendToElasticSearch(req.body, resp);
});

function sendToElasticSearch(searchData, resp) {
    var postData = JSON.stringify(searchData);
    
    var options = {
        "hostname": "edmondtang.com",
        "port": "9200",
        "path": "/enron_emails/_search",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData)
        }
    }

    var req = http.request(options, res => {
        res.setEncoding("utf8");

        let rawData = "";

        res.on("data", chunk => {
            rawData += chunk;
        });

        res.on("end", () => {
            resp.json(JSON.parse(rawData));
        });

        res.on("error", error => {
            console.log(`Error: ${error.message}`);
        });
    });

    req.write(postData);
    req.end();
}

app.listen(port);