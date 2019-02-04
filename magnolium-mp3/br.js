'use strict';

//const Alexa = require('alexa-sdk');
//var https = require('http');
//var rp = require('request-promise');
//var querystring = require('querystring');

var Rail = require('national-rail-darwin')
var rail = new Rail('b68b9f85-b0ec-4c81-805c-d28bec03a649');

rail.getDepartureBoard('DUR', {}, function(err,result){
    console.log(JSON.stringify(result));
})