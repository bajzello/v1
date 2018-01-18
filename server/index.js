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
  logger.info("GET /device/sharp");
  res.set('Content-Type', 'application/json');
  console.log(devices.sharp);
  res.send(JSON.stringify(devices.sharp));
});

app.post('/device/sharp', function (req, res) {
  logger.info("POST /device/sharp" + JSON.stringify(req.body));
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

// consider query with getting latest measureDateUnixTimestamp or storing in DB
// the index of latest insert
// for now latest entry is just stored in variables
// TODO:
// - use timestamp from measure not from moment of inserting
app.post("/air-measure-indoor", function (request, response) {
  console.log("New air-measure-indoor: " + JSON.stringify(request.body));

  //Store the measure in DB
  db.insert({ requestType: "air-measure-indoor",
             requestBody: request.body,
             measureDate: moment().format(),
             measureDateUnixTimestamp: moment().unix()
            }, function (err, requestAdded) {
    if(err) console.log("There's a problem with the database: ", err);
    //else if(requestAdded) console.log("New air-measure-indoor request inserted to the database");
    response.end();
  });

  latestIndoorEntries.measureDate = moment().format();
  latestIndoorEntries.measureDateUnixTimestamp = moment().unix();
  latestIndoorEntries.data = request.body;
});

app.post("/log", function (request, response) {
  console.log("log: " + JSON.stringify(request.body));
});

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
