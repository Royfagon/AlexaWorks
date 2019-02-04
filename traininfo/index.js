'use strict';

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

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'Magnolium Local Train information',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, what\'s the next train to victoria? ... Now, what can I help you with?",
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            HELP_MESSAGE: "You can ask questions such as, what\'s the train status, or, you can say exit...Now, what can I help you with?",
            HELP_REPROMPT: "You can say things like, what\'s the next train to Hove, or you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
        }
    },
    'en-GB': {
        translation: {
            SKILL_NAME: 'Magnolium Local Train information',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, what\'s the next train to victoria? ... Now, what can I help you with?",
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            HELP_MESSAGE: "You can ask questions such as, what\'s the train status, or, you can say exit...Now, what can I help you with?",
            HELP_REPROMPT: "You can say things like, what\'s the next train to Hove, or you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
        }
    }
    
};

//var Rail = require('national-rail-darwin')
//var rail = new Rail('b68b9f85-b0ec-4c81-805c-d28bec03a649');

var http = require('http');
var rp = require('request-promise');
var options = {
    method: 'POST',
    uri: 'http://stiletto.ddns.net/magnoliumapi/train',
    body: {
      'action' : '',
      'token' : 'b68b9f85-b0ec-4c81-805c-d28bec03a649',
      'from' : '',
      'to': '',
      'deviceid' : ''
    },
    json: true
};

const handlers = {
    'LaunchRequest': function () {
        options.body.deviceid = this.event.context.System.device.deviceId;
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },

    'intentCancellation': function () {
        
        options.body.action = "CANCELLATION";
        options.body.deviceid = this.event.context.System.device.deviceId;
        options.body.from = "";
        options.body.to = "";

        httpPost(this, options, (myResult) => {
            let speechOutput = myResult.speech;
            this.emit(':ask', speechOutput);
            this.emit(':responseReady');
        });

    },

    'intentDestination': function () {
        const itemSlot = this.event.request.intent.slots.STATION;
        let itemName = "?";
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }


        options.body.action = "GOING";
        options.body.deviceid = this.event.context.System.device.deviceId;
        options.body.from = itemName;
        options.body.to = itemName;

        httpPost(this, options, (myResult) => {
            let speechOutput = myResult.speech;
            this.emit(':ask', speechOutput);
            this.emit(':responseReady');
        });

    },

    'intentTrainInfo': function () {
        const itemSlot = this.event.request.intent.slots.STATION;
        let itemName = "?";
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }

        options.body.action = "INFO";
        options.body.deviceid = this.event.context.System.device.deviceId;
        options.body.from = itemName;
        options.body.to = itemName;

        httpPost(this, options, (myResult) => {
            let speechOutput = myResult.speech;
            this.emit(':ask', speechOutput);
            this.emit(':responseReady');
        });

    },

    'intentJourney': function () {
        let slot1Value = GetValue( this.event.request.intent.slots, 0);        
        let slot2Value = GetValue( this.event.request.intent.slots, 1);        

        options.body.deviceid = this.event.context.System.device.deviceId;
        options.body.action = "JOURNEY";
        options.body.from = slot1Value;
        options.body.to = slot2Value;
        
        httpPost(this, options, (myResult) => {
            //let json = JSON.stringify(myResult);
            console.log(myResult);
            let speechOutput = myResult.speech;
            this.emit(':ask', speechOutput);
            this.emit(':responseReady');
        });
    },

    ////////////////////////////////////////////////////////////////////////////////
    'intentTimetable': function () {
        const itemSlot = this.event.request.intent.slots.STATION;
        let itemName = "?";
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }

        options.body.action = "TIMETABLE";
        options.body.deviceid = this.event.context.System.device.deviceId;
        options.body.from = itemName;
        options.body.to = itemName;

        httpPost(this, options, (myResult) => {
            let speechOutput = myResult.speech;
            this.emit(':ask', speechOutput);
            this.emit(':responseReady');
        });
    },

    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    /*
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    */
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },

    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },

    'SessionEndedRequest': function () {    
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

function GetValue(slots, index)
{
    let count = 0;        

    let slotValue = null;        

    for (let slot in slots) 
    {
        if(count === index)
            return slots[slot].value;
        count += 1;
    }


    return 0;
}

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
