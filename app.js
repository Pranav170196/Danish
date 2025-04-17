'use strict';

// Module Dependencies
const express     = require('express');
const bodyParser  = require('body-parser');
const errorhandler = require('errorhandler');
const path        = require('path');
const request     = require('request');
const routes      = require('./routes');
const activity    = require('./routes/activity');
require('dotenv').config();

const app = express();

// Configure Express
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// Optional: Development-only error handler
// if (process.env.NODE_ENV === 'development') {
//   app.use(errorhandler());
// }

// HubExchange Routes
app.get('/', routes.index);
app.post('/login', routes.login);
app.post('/logout', routes.logout);
app.post('/submit', routes.submit);

// Custom Journey Builder Activity Routes
app.post('/journeybuilder/save/', activity.save);
app.post('/journeybuilder/validate/', activity.validate);
app.post('/journeybuilder/publish/', activity.publish);
app.post('/journeybuilder/execute/', activity.execute);

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`Listening on port ${port}`);
});

// Export the Express app as a Cloud Function
exports.app = app;
