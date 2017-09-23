'use strict';

const express = require('express');
const router = express.Router();
const server = express();

const path = require('path');

const creationRouter = require('./routes/creation_router.js');

server.use('/api/create', creationRouter);

module.exports = server;
