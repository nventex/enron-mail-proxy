var http = require("http");

var defaultOptions = {
    "hostname": process.env.hostName,
    "port": "9200"
}

var elasticSearchClient = {
    searchByTemplate: function (searchData, resp) {
        var postData = JSON.stringify(searchData);

        var options = Object.assign(defaultOptions, 
        {
            "path": "/enron_emails/_search/template",
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(postData)
            }
        });

        sendRequest(options, resp, postData);
    },

    getEmailById: function(id, resp) {
        var options = Object.assign(defaultOptions, 
        {
            "path": `/enron_emails/email/${id}`,
            "method": "GET",
            "headers": {
                "Content-Type": "application/json"
            }
        });

        sendRequest(options, resp, null);
    },

    log: function(searchData, resp) {
        var postData = JSON.stringify(searchData);
        
        var options = Object.assign(defaultOptions, 
        {
            "path": "/enron_emails.log/log",
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(postData)
            }
        });        

        sendRequest(options, resp, postData);
    }
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

module.exports = elasticSearchClient;