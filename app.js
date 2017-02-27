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
    searchByTemplate(req.body, resp);
});

app.get("/api/email/:id", (req, resp) => {
    getEmailById(req.params.id, resp);
});

function getEmailById(id, resp) {
    var options = {
        "hostname": process.env.hostName,
        "port": "9200",
        "path": `/enron_emails/email/${id}`,
        "method": "GET",
        "headers": {
            "Content-Type": "application/json"
        }
    }    

    sendRequest(options, resp, null);
}

function searchByTemplate(searchData, resp) {
    var postData = JSON.stringify(searchData);
    
    var options = {
        "hostname": process.env.hostName,
        "port": "9200",
        "path": "/enron_emails/_search/template",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData)
        }
    }

    sendRequest(options, resp, postData);
}

function sendRequest(options, resp, postData) {
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

    if (postData) {
        req.write(postData);
    }
    
    req.end();    
}

app.listen(port);