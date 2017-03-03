var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    cors = require("cors");

var elasticSearchClient = require("./elasticSearchClient");

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
    elasticSearchClient.searchByTemplate(req.body, resp);
});

app.get("/api/email/:id", (req, resp) => {
    elasticSearchClient.getEmailById(req.params.id, resp);
});

app.post("/api/log", (req, resp) => {
    var ip = getIpAddress(req);
    req.body.ip_address = ip;
    elasticSearchClient.log(req.body, resp, ip);
});

function getIpAddress(request) {
    var ip = request.headers["x-forwarded-for"] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;    

    return ip;
}

app.listen(port);