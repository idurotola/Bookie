'use strict';

// Load the possible environment files
require('dotenv').config({silent: true});

const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const server = require('./config/express');

const app = express();

// Connect to the database
mongoose.Promise = global.Promise;
mongoose.connect(config.dbUrl);

mongoose.connection.on('connected', () => {
    console.log('😀 MongoDB connection established!');
});

mongoose.connection.on('error', () => {
  console.log('😡 MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});

// Expose the app module
module.exports = {
    app
};

// Bootstrap express 
server(app);

function listen () {
    if (app.get('env') === 'test') return;
    app.listen(config.port);
    console.log(`🔥 Bookie is listening on Port ${config.port}`);
}

// Run Bookie Book
listen();
