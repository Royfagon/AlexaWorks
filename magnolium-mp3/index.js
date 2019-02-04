const Alexa = require('alexa-sdk');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var options = {
    method: 'POST',
    uri: 'http://stiletto.ddns.net/magnoliumapi/music',
    body: {
      'action' : 'GET-ARTIST',
      'artist': '',
      'deviceid': ''
    },
    json: true // Automatically stringifies the body to JSON
};

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'Magnolium Music Helper',
            WELCOME_MESSAGE: "Welcome to %s.",
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            HELP_MESSAGE: "You can ask questions such as,  You can ask a question like, get me artist ABBA?",
            HELP_REPROMPT: " You can ask a question like, get me artist ABBA?",
            STOP_MESSAGE: 'Goodbye!',
        }
    },
    'en-GB': {
        translation: {
            SKILL_NAME: 'British Magnolium Music Helper',
            WELCOME_MESSAGE: "Welcome to %s.",
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            HELP_MESSAGE: "You can ask questions such as,  You can ask a question like, get me artist ABBA?",
            HELP_REPROMPT: " You can ask a question like, get me artist ABBA?",
            STOP_MESSAGE: 'Goodbye!',
        }
    }
    
};

const handlers = {
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'GetNewFactIntent': function () {

        let skillId, dialogState, intent ,intentName, intentConfirmationStatus, slotArray, slots;
        let value = "";

        try {
            //Parse necessary data from JSON object using dot notation
            //build output strings and check for undefined
            skillId = this.event.session.application.applicationId;

            dialogState = this.event.request.dialogState;

            intent = this.event.request.intent;

            if (intent != undefined) {
                slotArray = this.event.request.intent.slots;
            } else {
                intentName = "";
                slotArray = "";
            }

            slots = "";
            value = "No artist";
            
            if (slotArray == undefined || slots == undefined) {
                slots = "";
            }

            //Iterating through slot array
            for (let slot in slotArray) 
            {
                //let slotName = slotArray[slot].name;
                //let slotValue = slotArray[slot].value;
                let slotSelected = slotArray[slot].value;

                //Delegate to Dialog Manager when needed
                //<reference to docs>
                if (dialogState == "STARTED" || dialogState == "IN_PROGRESS") 
                {
                    //value = "ZONE 1";
                    this.emit(":delegate");
                }
                else if (dialogState == "COMPLETED") 
                {
                   httpPost(this, slotSelected,  (myResult) => {
                        var val = myResult.albums.length;
                        let confirmSpeech = 'I have located ' +  val + ' albums for' + slotSelected;
                        this.response.speak(confirmSpeech);
                        this.emit(':responseReady');
                    });
                }
            } //for (let slot in slotArray) 
        } catch(err) {
            value = err.message;
        }
        
    },
    
    'PlayArtistIntent': function () {

        let skillId, dialogState, intent ,intentName, intentConfirmationStatus, slotArray, slots;
        let value = "";

        try {
            //Parse necessary data from JSON object using dot notation
            //build output strings and check for undefined
            skillId = this.event.session.application.applicationId;

            dialogState = this.event.request.dialogState;

            intent = this.event.request.intent;

            if (intent != undefined) {
                slotArray = this.event.request.intent.slots;
            } else {
                intentName = "";
                slotArray = "";
            }

            slots = "";
            value = "No artist";
            
            if (slotArray == undefined || slots == undefined) {
                slots = "";
            }

            //Iterating through slot array
            for (let slot in slotArray) 
            {
                //let slotName = slotArray[slot].name;
                //let slotValue = slotArray[slot].value;
                let slotSelected = slotArray[slot].value;

                //Delegate to Dialog Manager when needed
                //<reference to docs>
                if (dialogState == "STARTED" || dialogState == "IN_PROGRESS") 
                {
                    //value = "ZONE 1";
                    this.emit(":delegate");
                }
                else if (dialogState == "COMPLETED") 
                {
                    let confirmSpeech = 'playing artist ' + slotSelected;
                    this.response.speak(confirmSpeech);
                    this.emit(':responseReady');

                   /* 
                   httpPost(this, slotSelected,  (myResult) => {
                        var val = myResult.albums.length;
                        let confirmSpeech = 'I have located ' +  val + ' albums for' + slotSelected;
                        this.response.speak(confirmSpeech);
                        this.emit(':responseReady');
                    });
                    */
                }
            } //for (let slot in slotArray) 
        } catch(err) {
            value = err.message;
        }
        
    }

};


var http = require('http');
var rp = require('request-promise');

function httpPost(that, myData, callback) {
    
    console.log("httpPost-->["+myData+"]");

    var options = {
        method: 'POST',
        uri: 'http://stiletto.ddns.net/magnoliumapi/music',
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
            let resp = 'This call has failed';
            that.response.speak(resp);
            that.emit(':responseReady');
        });    
}
