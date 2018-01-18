const express = require('express');
const Client = require('node-rest-client').Client;
const app = express();
const PORT = process.env.PORT || 5000;
const request = require('request');
const bodyParser = require('body-parser');
const moment = require('moment');
const day = moment().dayOfYear();
const year = moment().year();
const logger = require('heroku-logger')

var client = new Client();

var headers = {
  "Content-Type": "application-json",
}
var httpArgs = {
  "headers": headers
}

app.use(express.static(__dirname + '/../react-ui/build'));

var outdoorAirQuality;

app.get('/nothing', function (req, res) {
  logger.info("/nothing");
  res.set('Content-Type', 'application/json');
  res.send("nothing");
});

app.get('/outdoor-air-quality', function (req, res) {
  logger.info("/outdoor-air-quality");
  client.get("http://api.looko2.com/?method=GPSGetClosestLooko&lat=49.999731&lon=20.094633&token=1510759476", httpArgs, function(data, response) {
    if (response.statusCode == 200) {
      outdoorAirQuality = data;
    }
  });

  res.set('Content-Type', 'application/json');
  res.send(outdoorAirQuality);
});

var weather;

app.get('/weather', function (req, res) {
  logger.info("/weather");
  client.get("https://api.darksky.net/forecast/c3e50046c72f3cfd1f021528cab2684d/49.999731,20.094633?units=auto", httpArgs, function(data, response) {
    if (response.statusCode == 200) {
      weather = data;
    }
  });

  res.set('Content-Type', 'application/json');
  res.send(weather);
});

var latestIndoorEntries = [];
var livingRoom = [];
var kidsRoom = [];

app.use(bodyParser.json());

app.get('/indoor-living-room', function (req, res) {
  logger.info("/indoor-living-room");
  res.set('Content-Type', 'application/json');
  res.send(livingRoom.data);
});

app.get('/indoor-kids-room', function (req, res) {
  logger.info("/indoor-kids-room");
  res.set('Content-Type', 'application/json');
  res.send(kidsRoom.data);
});

/////////------ Devices

var devices = {};
devices.sharp = {};
devices.sharp.mode = "OFF";


app.get('/device/sharp', function (req, res) {
  // logger.info("GET /device/sharp");
  res.set('Content-Type', 'application/json');
  //logger.info(devices.sharp);
  res.send(JSON.stringify(devices.sharp));
});

app.post('/device/sharp', function (req, res) {
  // logger.info("POST /device/sharp" + JSON.stringify(req.body));
  devices.sharp = req.body;

  res.end();
});

app.post("/air-measure-indoor-living-room", function (request, response) {
  logger.info("/air-measure-indoor-living-room");
  livingRoom.measureDate = moment().format();
  livingRoom.measureDateUnixTimestamp = moment().unix();
  livingRoom.data = request.body;

  response.end();
});

app.post("/air-measure-indoor-kids-room", function (request, response) {
  logger.info("/air-measure-indoor-kids-room");
  kidsRoom.measureDate = moment().format();
  kidsRoom.measureDateUnixTimestamp = moment().unix();
  kidsRoom.data = request.body;

  response.end();
});

// setup a new database
var Datastore = require('nedb'),
// Security note: the database is saved to the file `datafile` on the local filesystem. It's deliberately placed in the `.data` directory
// which doesn't get copied if someone remixes the project.
db = new Datastore({ filename: '.data/datafile', autoload: true });

app.post("/log", function (request, response) {
  logger.info("log: " + JSON.stringify(request.body));
});

/////////// CONTROL LOGIC ////////////////////

/////////// CONFIGURATION ////////////

// CONFIGURATION
const MIN_HUMIDITY_THRESHOLD=47
const MAX_HUMIDITY_THRESHOLD=50

const IAQ_THRESHOLD=40

// remember that from time has to be smaller than to time (i.e. earlier would be 0000)
const SHARP_HIGH_SPEED_TIME_FROM_HOUR_MINUTE=0000
const SHARP_HIGH_SPEED_TIME_TO_HOUR_MINUTE=700


// MODES SO THE APP KNOWS WHAT'S THE CURRENT STATUS OF GIVEN DEVICE
const SHARP_MODE_OFF="sharp_off"
const SHARP_MODE_CLEAN="sharp_clean"
const SHARP_MODE_CLEAN_AND_HUMIDIFY="sharp_clean_and_humidify"

const SHARP_MODE_SPEED_LOW="sharp_speed_low"
const SHARP_MODE_SPEED_HIGH="sharp_speed_high"

const AOS_MODE_OFF="aos_off"
const AOS_MODE_ON="aos_on"


// IFFT EVENTS
const IFTTT_EVENT_SHARP_OFF="sharp_off"
const IFTTT_EVENT_SHARP_CLEAN="sharp_clean"
const IFTTT_EVENT_SHARP_CLEAN_AND_HUMIDIFY="sharp_clean_and_humidify"
const IFTTT_EVENT_SHARP_SPEED_PRESS="sharp_speed_press"

const IFTTT_EVENT_AOS_OFF="aos_off"
const IFTTT_EVENT_AOS_ON="aos_on"

const IFTTT_MAKER_URL="https://maker.ifttt.com/use/bMrh_vl_fCzvMIoJEtpnEJ"


// sharp speed
// - does not restart after power cut
// - rotates through auto -> pollen -> max -> med -> low
// - pollen The unit will operate at High Level for 10 minutes, then will alternate between MEDIUM and HIGH.

var iftttId;

// Get the Id from IFTTT Maker URL.i O
if(!IFTTT_MAKER_URL)
  console.log("You need to set your IFTTT Maker URL - copy the URL from https://ifttt.com/services/maker/settings into the .env file against 'IFTTT_MAKER_URL'");
else
  iftttId = IFTTT_MAKER_URL.split('https://maker.ifttt.com/use/')[1];

var baseURL = "https://maker.ifttt.com/trigger/";
var withKey = "/with/key/";

var sharpMode = SHARP_MODE_OFF;
var aosMode = AOS_MODE_OFF;
var sharpSpeedMode = SHARP_MODE_SPEED_LOW;

app.post("/air-measure-indoor", function (request, response) {
  logger.info("New air-measure-indoor: " + JSON.stringify(request.body));

  // // Store the measure in DB
  // db.insert({ requestType: "air-measure-indoor",
  //            requestBody: request.body,
  //            measureDate: moment().format(),
  //            measureDateUnixTimestamp: moment().unix()
  //           }, function (err, requestAdded) {
  //   if(err) logger.info("There's a problem with the database: ", err);
  //   //else if(requestAdded) logger.info("New air-measure-indoor request inserted to the database");
  //   response.end();
  // });

  // check vs. humidity threshold
  var humidity = request.body.Humidity;
  var iaq = request.body.MeasuredAirQuality;

  logger.info("humidity: " + humidity);
  logger.info("iaq: " + iaq);

  var humidityIsTooLow = humidity < +MIN_HUMIDITY_THRESHOLD;
  var humidityIsTooHigh = humidity > +MAX_HUMIDITY_THRESHOLD;

  var airIsClean = iaq < +IAQ_THRESHOLD;

  var humidifierIsOn = false;
  if (sharpMode == SHARP_MODE_CLEAN_AND_HUMIDIFY) {humidifierIsOn = true};

  if (!airIsClean) {logger.info("Air is unclean (" + iaq + ")")}
  if (humidityIsTooLow) {logger.info("Humidity (" + humidity + ") below minimum threshold (" + MIN_HUMIDITY_THRESHOLD + ")");}
  if (humidityIsTooHigh) {logger.info("Humidity (" + humidity + ") above maximum threshold (" + MAX_HUMIDITY_THRESHOLD + ")");}

  var previousSharpMode = sharpMode;

  logger.info("airIsClean: " + airIsClean);
  logger.info("humidityIsTooLow: " + humidityIsTooLow);
  logger.info("humidityIsTooHigh: " + humidityIsTooHigh);
  logger.info("previousSharpMode: " + previousSharpMode);
  logger.info("sharpMode: "+ sharpMode);

  if (humidityIsTooLow && !humidifierIsOn) {
    //logger.info("humidityIsTooLow && !humidifierIsOn");
    // turn on humidifier regardless of air quality (as there is no way to humidify without cleaning)
    sharpCleanAndHumidify();
  }
  else if (humidityIsTooHigh && humidifierIsOn) {
    //logger.info("humidityIsTooHigh && humidifierIsOn");
    // turn off humidifier by turning on clean or turning it off completely depending on air quality
    if (airIsClean && sharpMode != SHARP_MODE_OFF){
      sharpOff();
    }

    if(!airIsClean && sharpMode != SHARP_MODE_CLEAN){
      sharpClean();
    }
  } else {
    if (airIsClean && sharpMode == SHARP_MODE_CLEAN){
      sharpOff();
    }

    if (!airIsClean && sharpMode == SHARP_MODE_OFF){
      sharpClean();
    }
  }

  // AOS
  if (humidityIsTooLow && aosMode == AOS_MODE_OFF) {
    logger.info("AOS should be on");
    aosOn();
  } else if (humidityIsTooHigh && aosMode == AOS_MODE_ON) {
    logger.info("AOS should be off");
    aosOff();
  } else {
    logger.info("AOS tays in mode: " + aosMode);
  }

  if (sharpMode == previousSharpMode) {
    logger.info("--- leaving sharpmode: " + sharpMode);
  }

  // controlling sharp speed
  var hour = moment().utc().hour();
  var minute = moment().utc().minute();
  var hourMinute = (hour * 100 + minute + 100) % 2400; //+100 is to move UK timezone to PL
  logger.info("hourMinute: " + hourMinute);
  logger.info("sharpSpeedMode: " + sharpSpeedMode);
  if (sharpMode == SHARP_MODE_CLEAN || sharpMode == SHARP_MODE_CLEAN_AND_HUMIDIFY) {
    if (sharpSpeedMode == SHARP_MODE_SPEED_LOW && hourMinute >= +SHARP_HIGH_SPEED_TIME_FROM_HOUR_MINUTE && (hourMinute < +SHARP_HIGH_SPEED_TIME_TO_HOUR_MINUTE || +SHARP_HIGH_SPEED_TIME_TO_HOUR_MINUTE < +SHARP_HIGH_SPEED_TIME_FROM_HOUR_MINUTE)) {
        logger.info("setting high speed");
        setTimeout(sharpHighSpeed, 10000);
    } else if (sharpSpeedMode == SHARP_MODE_SPEED_HIGH && hourMinute > +SHARP_HIGH_SPEED_TIME_TO_HOUR_MINUTE) {
        logger.info("setting low speed");
        setTimeout(sharpLowSpeed, 10000);
    }
  }

  logger.info("/air-indoor-measure END --------")
  response.end();
});

function sharpHighSpeed() {
  sharpSpeedMode = SHARP_MODE_SPEED_HIGH;
  setTimeout(sharpSpeedPress, 5000);
  setTimeout(sharpSpeedPress, 10000);
  setTimeout(sharpSpeedPress, 15000);
}

function sharpLowSpeed() {
  sharpSpeedMode = SHARP_MODE_SPEED_LOW;
  setTimeout(sharpSpeedPress, 5000);
  setTimeout(sharpSpeedPress, 10000);
}

function sharpCleanAndHumidify() {
  sharpMode = SHARP_MODE_CLEAN_AND_HUMIDIFY;
  logger.info("--->>> set sharpMode to: " + sharpMode);
  triggerIFTTT(IFTTT_EVENT_SHARP_CLEAN_AND_HUMIDIFY);
}

function sharpClean() {
  sharpMode = SHARP_MODE_CLEAN;
  logger.info("--->>> set sharpMode to: " + sharpMode);
  triggerIFTTT(IFTTT_EVENT_SHARP_CLEAN);
}

function sharpOff() {
  sharpMode = SHARP_MODE_OFF;
  logger.info("--->>> set sharpMode to: " + sharpMode);
  triggerIFTTT(IFTTT_EVENT_SHARP_OFF);
}

function sharpSpeedPress() {
  triggerIFTTT(IFTTT_EVENT_SHARP_SPEED_PRESS);
}

function aosOff() {
  aosMode = AOS_MODE_OFF;
  logger.info("--->>> set aosMode to: " + aosMode);
  triggerIFTTT(IFTTT_EVENT_AOS_OFF);
}

function aosOn() {
  aosMode = AOS_MODE_ON;
  logger.info("--->>> set aosMode to: " + aosMode);
  triggerIFTTT(IFTTT_EVENT_AOS_ON);
}

function triggerIFTTT(triggerEvent){
  // Make a request to baseURL + triggerEvent + withKey + iftttId, which is the complete IFTTT Maker Request URL
  request(baseURL + triggerEvent + withKey + iftttId, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      logger.info(body); // Show the response from IFTTT
    }
  });
}


app.listen(PORT, function () {
  logger.info(`Listening on port ${PORT}`);
});
