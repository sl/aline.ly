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

module.exports = server;

server.use('/', express.static(staticPath));

server.use(/\/admin\/(.*)/, async (req, res) => {
  const id = req.params[0];
  if (!shortid.isValid(id)) {
    res.redirect('../404.html');
  } else {
    // check if the line exists
    lines.once('value', (snapshot) => {
      const val = snapshot.val();
      if (id in val) {
        res.redirect(`../control.html?line_id=${id}`);
      } else {
        res.redirect('../404.html');
      }
    });
  }
});

server.get('/api/lines', async (req, res) => {
  var lineData = [];
  lines.once('value', (snap) => {
    var data = snap.val()
    Object.keys(data).forEach(key => {
        lineData.push({
          id: key,
          code: data[key].line_code || null,
          inLine: data[key].in_line || null
        })
    });
    res.json({ lines: lineData})
  })
});

server.use(/\/(.*)/, async (req, res) => {
  const id = req.params[0];
  console.log("this one")
  if (!shortid.isValid(id)) {
    res.redirect('404.html');
  } else {
    // check if the line exists
    lines.once('value', (snapshot) => {
      const val = JSON.parse(JSON.stringify(snapshot.val()));
      var lines = [];
      Object.keys(val).forEach(lineKey => {
        console.log(val[lineKey])
        lines.append({
          code: val[lineKey].line_code,
          id: lineKey,
        })
      })
      var foundLine = false;
      lines.forEach(line => {
        if (id == line.code){
          res.redirect(`monitor.html?line_id=${line.id}`);
          foundLine = true;
        }
      })
      if (!foundLine) {
        res.redirect('404.html');
      }
    });
  }
});
