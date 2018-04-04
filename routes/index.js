'use strict';
const admin    =require('./admin');
const user     =require('./user');
const article  =require('./article');
const classify =require('./classify');
const express  =require('express');
const commit   =require('./commit');
const com      =require('./com');

const app = express();

app.use('/admin', admin);//管理员模块
app.use('/user', user);//用户模块
app.use('/article',article);//文章模块
app.use('/classify',classify);//分类模块
app.use('/commit',commit);//评论模块
app.use('/com',com);//共用模块



module.exports = app;