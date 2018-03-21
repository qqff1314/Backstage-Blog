'use strict';
var admin = require('./admin');
var express = require('express');
var app = express();

app.use('/admin', admin);


module.exports = app