'use strict';

const express = require('express');
const router = express.Router();
const server = express();
const shortid = require('shortid');

const path = require('path');

const creationRouter = require('./routes/creation_router.js');

server.use('/api/admin', creationRouter);

const staticPath = path.join(__dirname, '/../../client');

server.use('/', express.static(staticPath));

server.use(/\/(.*)/, async (req, res) => {
  const id = req.params[0];
  if (!shortid.isValid(id)) {
    res.redirect('404.html');
  } else {
    res.redirect(`monitor.html?line_id=${id}`);
  }
});

module.exports = server;
