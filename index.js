const Alexa = require('alexa-sdk');
const time = require('time');
const Forecast = require('forecast');

const APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).


const forecast = new Forecast({
  service: 'darksky',
  key: '290a75c0183e0026e78b17a48d997d3b',
  units: 'celcius',
  cache: true,      // Cache API requests 
  ttl: {           
    minutes: 27,
    seconds: 45
  }
});

const handlers = {
    //Use LaunchRequest, instead of NewSession if you want to use the one-shot model
    // Alexa, ask [my-skill-invocation-name] to (do something)...
    'LaunchRequest': function () {
        this.attributes.speechOutput = 'Welcom to custom Alexa skill whith short status of weather an time in your location';
        this.attributes.repromptSpeech = 'For instructions on what you can say, please say help me.';
        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
    'RecipeIntent': function () {
        const itemSlot = this.event.request.intent.slots.Item;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }

        if (itemName === 'status') {
			forecast.get([49.842, 24.0316], function(err, weather) {
			  	if(err) return console.dir(err);
			  	
				var now = new time.Date();
				now.setTimezone('Europe/Kiev');			
				const statusText = 'Current time is ' + now.toString() + ' with weather in Lviv' + weather.currently.temperature;

				this.attributes.speechOutput = statusText;
	            this.attributes.repromptSpeech = 'Repeat status'

	            this.response.speak(statusText).listen(this.attributes.repromptSpeech);
	            this.response.cardRenderer('Status', statusText);
	            this.emit(':responseReady');
			});


        } 
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput =  'Please ask Alexa about status';
        this.attributes.repromptSpeech = 'Just say Alexa Status';

        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
    'AMAZON.RepeatIntent': function () {
        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        console.log(`Session ended: ${this.event.request.reason}`);
    },
    'Unhandled': function () {
        this.attributes.speechOutput = 'Please ask Alexa about status';
        this.attributes.repromptSpeech = 'Just say Alexa Status';
        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};