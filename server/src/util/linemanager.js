'use strict';

const admin = require('./firebaseadminutil.js');
const db = admin.database();
const lines = db.ref('/server').child('lines');

const moveToActive = (line) => {
  // get the length of up now
  // check if the event is active
  const toMove = [];
  if (line.up_now.length < line.capacity) {
    line.up_now.sort((a, b) => Object.values(a)[0] - Object.values(b)[0]);
  }
  while (line.up_now.length < line.capacity) {
    // mark people to move to the new line

  }
};

module.exports = () => {
  lines.once('value', (snapshot) => {
    for (let key of Object.keys(snapshot.val())) {
      lines.child(key).child('in_queue').on('child_added', (newItem) => {
          lines.child(key).once('value', (lineSnapshot) => {
            moveToActive(lineSnapshot.val());
          });
      });
    }
  });
};
