const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const request = require('request');
const bodyParser = require('body-parser');
const moment = require('moment');
const day = moment().dayOfYear();
const year = moment().year();

app.use(express.static(__dirname + '/../react-ui/build'));

app.get('/api', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.send('{"message":"Hello from the custom server!"}');
});

app.get('/outdoor', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.send('{"pm10":"10", "pm25":"25", "pm100":"100"}');
});

app.get('/indoor', function (req, res) {
  res.set('Content-Type', 'application/json');

  updateIndoorLatestData();

  res.send(latestIndoorEntries.data);
});

var numOfEntries = 0;
var latestIndoorEntries = [];
function updateIndoorLatestData() {
  db.find({ requestType: 'air-measure-indoor'}, function(err, docs) {
    console.log("updating numOfEntries...");
    console.log("numOfEntries: " + numOfEntries);
    numOfEntries = docs.length;
  });


  db.find({ $where: function () { return this.measureDateUnixTimestamp == 0; } },
    function (err, docs) {
      console.log(docs.length);
  });
};

// setup a new database
var Datastore = require('nedb'),
// Security note: the database is saved to the file `datafile` on the local filesystem. It's deliberately placed in the `.data` directory
// which doesn't get copied if someone remixes the project.
db = new Datastore({ filename: '.data/datafile', autoload: true });

// parse application/json
app.use(bodyParser.json());

// consider query with getting latest measureDateUnixTimestamp or storing in DB
// the index of latest insert
// for now latest entry is just stored in variables
// TODO:
// - use timestamp from measure not from moment of inserting
app.post("/air-measure-indoor", function (request, response) {
  console.log("New air-measure-indoor: " + JSON.stringify(request.body));

  // Store the measure in DB
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

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
