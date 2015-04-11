'use strict';

// Require config & logging modules
var config = require('config');
var winston = require('winston');

//New Relic setup
// if(config.get('newrelic.use') === true) {
//   require('newrelic');
// }

// Bring in Express 4.0 framework
var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var morgan = require('morgan');

// Bring in route services
var hospitals = require('./routes/hospitals');

// Initialize & Configure Express Server
var app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json({limit: '1mb'})); // for parsing application/json

app.use(compression()); // compress all requests

// TODO: Set up access logs to write to a file
// var stream = require('logrotate-stream');
// var accessLogStream = stream({ file: config.get('logs.access.path'), size: config.get('logs.access.size'), keep: config.get('logs.access.keep') });
// app.use(morgan('combined', {
//   stream: accessLogStream
// }));

// Set up the router
var router = express.Router();
router.get('/', function (req, res) {
  res.json({
    result: 'success'
  });
});

// Define service routes
router.get('/hospitals', hospitals.getHospitals);

router.get('/healthcheck', function (req, res)
{
    res.status(200).send();
});

// Assign the router to everything under /api
app.use('/api/', router);

//error handling
 app.use(function(err, req, res, next) {
      // log it
      winston.error(err.stack);
      // respond with 500 "Internal Server Error".
      res.sendStatus(500);
  });

//   __  __    __    ____  _  _
//  (  \/  )  /__\  (_  _)( \( )
//   )    (  /(__)\  _)(_  )  (
//  (_/\/\_)(__)(__)(____)(_)\_)

console.log('');
console.log('***************************************************************');
console.log('Launching server on port ' + app.get('port'));

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
