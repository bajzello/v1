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

  updateNumOfEntries();

  res.send('{"pm25":' + numOfEntries + ', "pm100":"10"}');
});

var numOfEntries = 0;
function updateNumOfEntries() {
  db.find({ requestType: 'air-measure-indoor'}, function(err, docs) {
    numOfEntries = docs.length;
})};

// setup a new database
var Datastore = require('nedb'),
// Security note: the database is saved to the file `datafile` on the local filesystem. It's deliberately placed in the `.data` directory
// which doesn't get copied if someone remixes the project.
db = new Datastore({ filename: '.data/datafile', autoload: true });

// parse application/json
app.use(bodyParser.json());


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
});

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
