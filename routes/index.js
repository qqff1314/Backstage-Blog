'use strict';
const admin    =require('./admin');
const article  =require('./article');
const classify =require('./classify');
const express  =require('express');
const commit   =require('./commit');
const com      =require('./com');

const app = express();

app.use('/api/admin', admin);//管理员模块
app.use('/api/article',article);//文章模块
app.use('/api/classify',classify);//分类模块
app.use('/api/com',com);//共用模块

app.use('/api/commit',commit);//评论模块



module.exports = app;