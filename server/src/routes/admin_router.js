'use strict';

const admin = require('../util/firebaseadminutil.js');

const shortid = require('shortid');

const bodyParser = require('body-parser');
const express = require('express');

const router = express.Router();
router.use(bodyParser.raw());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

const db = admin.database();
const lines = db.ref('/server/').child('lines');

router.get(/\/(.*)/, async (req, res) => {
  const id = req.params[0];
  if (!shortid.isValid(id)) {
    res.redirect('404.html');
  } else {
    // check if the line exists
    lines.once('value', (snapshot) => {
      const val = snapshot.val();
      if (val.hasOwnProperty(id)) {
        res.redirect(`admin.html?line_id=${id}`);
      } else {
        res.redirect('404.html');
      }
    });
  }
});

module.exports = router;
