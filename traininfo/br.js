'use strict';

var http = require('http');
var rp = require('request-promise');

var options = {
    method: 'POST',
    uri: 'http://stiletto.ddns.net/magnoliumapi/train',
    body: {
      'action' : 'GOING',
      'token' : 'b68b9f85-b0ec-4c81-805c-d28bec03a649',
      'from' : 'durrington',
      'to': 'victoria'
    },
    json: true
};

//const Alexa = require('alexa-sdk');
//var https = require('http');
//var rp = require('request-promise');
//var querystring = require('querystring');

console.log("Started");
httpPost(this, options, (myResult) => {
    console.log("Response:", myResult.speech);
});
console.log("Finished");

function httpPost(that, options, callback) {

    rp(options)
        .then(function (parsedBody) {
            callback(parsedBody);  
        })
        .catch(function (err) {
            let resp = 'This call has failed';
            that.response.speak(resp);
            that.emit(':responseReady');
        }).finally(function () {
        }); 
    
}


/*
var Rail = require('national-rail-darwin')
var rail = new Rail('b68b9f85-b0ec-4c81-805c-d28bec03a649');
//D3842ebb4b-4a9e-4d6f-902b-7b406e8689a3

rail.getDepartureBoardWithDetails('DUR', 'VIC', function(err, result){
    //console.log(result.trainServices[0]);
    console.log(result);
    //console.log("count:", result.trainServices.length);
})
*/
/*
var rp = require('request-promise');
var options = {
    method: 'POST',
    uri: 'http://stiletto.ddns.net/magnoliumapi/train',
    body: {
      'action' : '',
      'token' : 'b68b9f85-b0ec-4c81-805c-d28bec03a649',
      'from' : '',
      'to': ''
    },
    json: true
};


options.body.action = "JOURNEY";
options.body.from = "durrington";
options.body.to = "victoria";

httpPost(this, options, (myResult) => {
    //let json = JSON.stringify(myResult);
    console.log(myResult);
    //let speechOutput = myResult.speech;
    //this.emit(':ask', speechOutput);
    //this.emit(':responseReady');
});



function httpPost(that, options, callback) {

    rp(options)
        .then(function (parsedBody) {
            callback(parsedBody);  
        })
        .catch(function (err) {
            //let resp = 'This call has failed';
            //that.response.speak(resp);
            //that.emit(':responseReady');
            console.log('This call has failed');
        }).finally(function () {
        }); 
    
}
*/
