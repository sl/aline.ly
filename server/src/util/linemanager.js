'use strict';

const admin = require('./firebaseadminutil.js');
const db = admin.database();
const lines = db.ref('/server').child('lines');

const removeFromUpNext = (user, lineCode) => {
  lines.child(lineCode).child('up_next').child(user).remove();
};

const moveToActive = (line) => {
  console.log('should update!');
  const currentDate = +new Date();
  if (!line.hasOwnProperty('up_next')) {
    line.up_next = {};
  }
  if (!line.hasOwnProperty('in_line')) {
    line.in_line = {};
  }
  /*if (currentDate < line.start_time || currentDate > line.end_time) {
    // the event isn't currently active, don't do anything
    return;
  }*/
  // get the length of up now
  // check if the event is active
  const toMove = [];
  const inLineUsers = Object.keys(line.in_line);
  console.log(line);
  if (Object.keys(line.up_next).length < line.capacity) {
    // sort in reverse order
    inLineUsers.sort((a, b) => line.in_line[b] - line.in_line[a]); // sort high to low by date joined
  } else {
    return; // there are no open spots in up_next
  }
  console.log(inLineUsers);
  let i = 0;
  while (i < inLineUsers.length && i + toMove.length < line.capacity) {
    // mark people to move to the new line
    toMove.push(inLineUsers[i++]);
  }

  for (let key of toMove) {
    console.log(key);
    lines.child(line.line_code).child('up_next').child(key).set(line.in_line[key]);
    lines.child(line.line_code).child('in_line').child(key).remove();
    setTimeout(() => removeFromUpNext(key, line.line_code), line.service_time * 1000 * 60);
  }
};

const setup = () => {
  console.log('Setting up event hooks...');
  lines.once('value', (snapshot) => {
    for (let key of Object.keys(snapshot.val())) {
      console.log(`Adding hooks for ${key}`);
      lines.child(key).child('in_line').on('value', (newItem) => {
        console.log('hook triggered!');
        lines.child(key).once('value', (lineSnapshot) => {
          moveToActive(lineSnapshot.val());
        });
      });
      lines.child(key).child('up_next').on('value', (newItem) => {
        lines.child(key).once('value', (lineSnapshot) => {
          moveToActive(lineSnapshot.val());
        });
      })
    }
    console.log('Event Hooks set up!');
  });
};

module.exports = {
  setup,
  moveToActive,
};
