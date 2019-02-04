'use strict';

const Alexa = require('alexa-sdk');
var https = require('http');
var rp = require('request-promise');
var querystring = require('querystring');

xHttpPost("ABBA",  (myResult) => {
        //var obj = JSON.parse(myResult);
        console.log("RETURNED:", myResult.albums.length);
    }
);    

/*
HttpGet("ABBA",  (myResult) => {
        var obj = JSON.parse(myResult);
        console.log("RETURNED:", obj.artists[0]);
    }
);    
*/

function xHttpGet(myData, callback) {
		//console.log("Here-0");
    // GET is a web service request that is fully defined by a URL string
    // Try GET in your browser:
    // https://cp6gckjt97.execute-api.us-east-1.amazonaws.com/prod/stateresource?usstate=New%20Jersey
    var post_data = querystring.stringify({
          'value' : 'GET-ALBUMS',
          'artist': myData
    });

    // Update these options with the details of the web service you would like to call
    var options = {
        host: '82.17.37.211',
        path: '/jukeboxapi/music',
        method: 'GET',
        port: '80'
        //headers: {
        //  'Content-Type': 'application/x-www-form-urlencoded',
        //  'Content-Length': Buffer.byteLength(post_data)
        //}
        // if x509 certs are required:
        // key: fs.readFileSync('certs/my-key.pem'),
        // cert: fs.readFileSync('certs/my-cert.pem')
    };

    var returnData = "";
    var req = https.request(options, res => {
        res.setEncoding('utf8');
        
				//console.log("Here-1");
        res.on('data', chunk => {
            //console.log("Here:", chunk);
            returnData = returnData + chunk;
        });

        res.on('end', () => {
            callback(returnData);  // this will execute whatever function the caller defined, with one argument
        });

    });
    req.end();

}

function xHttpPost(myData, callback) {
    console.log("STARTED"); 
    var options = {
        method: 'POST',
        uri: 'http://stiletto.ddns.net/jukeboxapi/music',
        body: {
          'value' : 'GET-ALBUMS',
          'artist': myData
        },
        json: true // Automatically stringifies the body to JSON
    };

    rp(options)
        .then(function (parsedBody) {
            callback(parsedBody);  
        })
        .catch(function (err) {
            console.log("FAILED"); 
        });
}