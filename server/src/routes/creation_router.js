'use strict';

const bodyParser = require('body-parser');

const admin = require('../util/firebaseadminutil.js');

const crypto = require('crypto');

const shortid = require('shortid');

const express = require('express');

const linemanager = require('../util/linemanager.js');
const colorutil = require('../util/colorutil.js');

const router = express.Router();
router.use(bodyParser.raw());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true,
}));

const db = admin.database();
const ref = db.ref('/server');

router.post('/create', async (req, res) => {
  /*
  {
    event_name: <String>, // the name of the event for the line
    service_time: <Number> // time to serve in minutes
    description: <String>, // an optional description of the event
    password: <Number>, // the password of the line
    image: <String>, // an optional image for the event
    capacity: <Number>, // number of people who can be simultaneously physically present
    start_time: <Number>, // the start time as a unix date (milliseconds since the unix epoch)
    end_time: <Number>, // the end time as a unix date (milliseconds since the unix epoch)
  }
  */
  const lines = ref.child('lines');
  const salt = (+new Date()).toString();
  const hash = crypto.createHash('sha256');
  const hashedPassword = hash.update(req.body.password + salt).digest('base64');
  const lineCode = shortid.generate();

  const queueObj = {
    capacity: req.body.capacity,
    service_time: req.body.service_time,
    event_name: req.body.event_name,
    line_code: lineCode,
    description: req.body.description,
    image: req.body.image,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    salt,
    password_hashed: hashedPassword,
  };
  try {
    lines.child(lineCode).set(queueObj);
    linemanager.addHooks(lineCode);
    colorutil.initializeColorsForLineCode(lineCode);
    res.json({
      line_code: lineCode,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post('/join', async (req, res) => {
  /*
  {
    password: <String>
    line_code: <String>
    user_id: <String>
  }
  */
  const line = ref
    .child('lines')
    .child(req.body.line_code);
  const userPrivileges = ref
    .child('user_privileges');
  line.once('value', (snapshot) => {
    const result = snapshot.val();
    const hashedAdminPassword = result.password_hashed;
    const salt = result.salt;
    const hash = crypto.createHash('sha256');
    const challengeAttempt = hash.update(req.body.password + salt).digest('base64');
    if (hashedAdminPassword === challengeAttempt) {
      userPrivileges.child(req.body.user_id).set({ line_code: req.body.line_code });
      res.json({
        status: 'success',
      });
    } else {
      res.json({
        status: 'failed',
      });
    }
  });
});

module.exports = router;
