'use strict';

const express = require('express');

const server = express();
const shortid = require('shortid');

const admin = require('./util/firebaseadminutil.js');

const db = admin.database();
const lines = db.ref('/server/').child('lines');

const path = require('path');

const creationRouter = require('./routes/creation_router.js');

server.use('/api/admin', creationRouter);

const staticPath = path.join(__dirname, '/../../client');

server.use('/', express.static(staticPath));

server.use(/\/admin\/(.*)/, async (req, res) => {
  const id = req.params[0];
  if (!shortid.isValid(id)) {
    res.redirect('../404.html');
  } else {
    // check if the line exists
    lines.once('value', (snapshot) => {
      const val = snapshot.val();
      if (val.hasOwnProperty(id)) {
        res.redirect(`../control.html?line_id=${id}`);
      } else {
        res.redirect('../404.html');
      }
    });
  }
});

server.use(/\/(.*)/, async (req, res) => {
  const id = req.params[0];
  if (!shortid.isValid(id)) {
    res.redirect('404.html');
  } else {
    // check if the line exists
    lines.once('value', (snapshot) => {
      const val = snapshot.val();
      if (val.hasOwnProperty(id)) {
        res.redirect(`monitor.html?line_id=${id}`);
      } else {
        res.redirect('404.html');
      }
    });
  }
});

module.exports = server;
