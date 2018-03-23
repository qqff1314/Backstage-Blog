'use strict';
var admin = require('./admin');
var user = require('./user');
var express = require('express');
var app = express();

app.use('/admin', admin);
app.use('/user', user);


module.exports = app;