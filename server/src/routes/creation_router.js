'use strict';

const bodyParser = require('body-parser');

const express = require('express');
const router = express.Router();
router.use(bodyParser.raw());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

router.post('/', async (req, res) => {
  res.json('test!');
});

module.exports = router;
