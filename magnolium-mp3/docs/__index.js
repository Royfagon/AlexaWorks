'use strict';

const Alexa = require('alexa-sdk');

var querystring = require('querystring');
var myRequest = 'Florida';
//require('request');
//const request = require('request-promise' 4.1.1.);
/*
const getStatus = function getStatus() {
    return request.get("https://status.github.com/api/status.json");
}
*/
const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    //By having a single 'Unhandled' handler, we ensure all requests are route to it
    'Unhandled': function () {

        //log the event sent by the Alexa Service in human readable format
        console.log(JSON.stringify(this.event));
        let skillId, requestType, dialogState, intent ,intentName, intentConfirmationStatus, slotArray, slots, count;

        var value = "";
        var slotSelected = "nothing";
        
        try {
            //Parse necessary data from JSON object using dot notation
            //build output strings and check for undefined
            skillId = this.event.session.application.applicationId;
            requestType = "The request type is, "+this.event.request.type+" .";
            dialogState = this.event.request.dialogState;
            intent = this.event.request.intent;
            if (intent != undefined) {
                intentName = " The intent name is, "+this.event.request.intent.name+" .";
                slotArray = this.event.request.intent.slots;
                intentConfirmationStatus = this.event.request.intent.confirmationStatus;

                if (intentConfirmationStatus != "NONE" && intentConfirmationStatus != undefined ) {
                    intentConfirmationStatus = " and its confirmation status is "+ intentConfirmationStatus+" . ";
                    intentName = intentName+intentConfirmationStatus;
                }
            } else {
                intentName = "";
                slotArray = "";
                
                intentConfirmationStatus = "";
            }

            slots = "";
            count = 0;
            value = "No artist";
            
            if (slotArray == undefined || slots == undefined) {
                slots = "";
            }

            //Iterating through slot array
            for (let slot in slotArray) 
            {
                count += 1;
                
                let slotName = slotArray[slot].name;
                let slotValue = slotArray[slot].value;
                slotSelected = slotArray[slot].value;
                value = slotArray[slot].value;
                let slotConfirmationStatus = slotArray[slot].confirmationStatus;
                slots = slots + "The <say-as interpret-as='ordinal'>"+count+"</say-as> slot is, " + slotName + ", its value is, " +slotValue;

                if (slotConfirmationStatus!= undefined && slotConfirmationStatus != "NONE") {
                  slots = slots+" and its confirmation status is "+slotConfirmationStatus+" . ";
                } else {
                  slots = slots+" . ";
                }
            }

        /*       
            var options = {
                method: 'POST',
                uri: 'http://stiletto.ddns.net/jukeboxapi/music',
                body: {
                  'value' : 'GET-ALBUMS',
                  'artist': slotSelected
                },
                json: true // Automatically stringifies the body to JSON
            };
        */
            //Delegate to Dialog Manager when needed
            //<reference to docs>
            if (dialogState == "STARTED" || dialogState == "IN_PROGRESS") 
            {
                value = "ZONE 1";
                this.emit(":delegate");
            }
            else if (dialogState == "COMPLETED") {
                //let confirmSpeech = "Ok will now look for " + slotSelected;
      
                          

                HttpPost(this, slotSelected,  (myResult) => {
                        //let confirmSpeech = 'I have located '; // + myResult.albums.length + ' albums for' + slotSelected;
                        
                        this.response.speak(myResult);
                        this.emit(':responseReady');
                    }
                );   
                         
                //this.response.speak(confirmSpeech);
                //let confirmSpeech = "Ok will now look for " + slotSelected;
                //this.response.speak(confirmSpeech);
                //this.emit(':responseReady');
            }
            
        } catch(err) {
            value = err.message;
        }
        
        this.emit(':responseReady');

    }
};

var https = require('http');
//const rp = require('request-promise');

function HttpPost(that, myData, callback) {

        //that.response.speak("Inside the function Roy");
        //that.emit(':responseReady');
/*
        var options = {
            method: 'POST',
            uri: 'http://stiletto.ddns.net/jukeboxapi/music',
            body: {
                    'value' : 'GET-ALBUMS',
                    'artist': myData
            },
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };


        rp(options)
            .then(function (parsedBody) {
                callback("bingo");  
            })
            .catch(function (err) {
                callback("FAILED"); 
            });

 */       



    var post_data = querystring.stringify({
          'value' : 'GET-ALBUMS',
          'artist': myData
    });

    // Update these options with the details of the web service you would like to call
    var options = {
        host: '82.17.37.211',
        path: '/jukeboxapi/music',
        method: 'POST',
        port: '80',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data)
        }
        // if x509 certs are required:
        // key: fs.readFileSync('certs/my-key.pem'),
        // cert: fs.readFileSync('certs/my-cert.pem')
    };

    var returnData = "";
    var req = https.request(options, res => {
        res.setEncoding('utf8');
        
        res.on('data', chunk => {
             callback("chunking"); 
            returnData = returnData + chunk;
        });

        res.on('end', () => {
            callback("Bingo");  // this will execute whatever function the caller defined, with one argument

        });

        res.on('error', () => {
            callback("Error");  // this will execute whatever function the caller defined, with one argument
        });
        callback("hooray");  
    });
    req.end();
    //callback("hooray");  
};

