'use strict';

const admin = require('firebase-admin');

const serviceAccount = require('../../mhax-34a9e-firebase-adminsdk-sxm5w-75d76661f6.json');

module.exports = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://mhax-34a9e.firebaseio.com/',
});
