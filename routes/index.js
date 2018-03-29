'use strict';
var admin =   require('./admin');
var user =    require('./user');
var article = require('./article');

var express = require('express');
var app = express();

app.use('/admin', admin);
app.use('/user', user);
app.use('/article',article);


module.exports = app;