'use strict';

const admin = require('./firebaseadminutil.js');
const db = admin.database();
const lines = db.ref('/server').child('lines');
const phones = db.ref('/server').child('phones');
const twilioSender = require('./twilio_util.js');

const removeFromUpNext = (user, lineCode) => {
  console.log(`removed user ${user} from up next`);
  lines.child(lineCode).child('up_next').child(user).remove();
};

const moveToActive = (line) => {
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
  if (Object.keys(line.up_next).length < line.capacity) {
    inLineUsers.sort((a, b) => line.in_line[a] - line.in_line[b]); // sort high to low by date joined
  } else {
    return; // there are no open spots in up_next
  }
  let i = 0;
  while (i < inLineUsers.length && i + toMove.length < line.capacity) {
    // mark people to move to the new line
    toMove.push(inLineUsers[i++]);
  }

  for (let key of toMove) {
    lines.child(line.line_code).child('up_next').child(key).set(line.in_line[key]);
    lines.child(line.line_code).child('in_line').child(key).remove();
    console.log(`setting timeout to remove user ${key}`);
    setTimeout(() => removeFromUpNext(key, line.line_code), line.service_time * 1000 * 60);
    // send a twilio message to the user
    phones.once('value', (snapshot) => {
      const phoneValues = snapshot.val();
      if (phoneValues.hasOwnProperty(key)) {
        // found a phone number, send a message to it
        const phoneNumber = phoneValues[key];
        twilioSender.sendAlertText(phoneNumber, line.event_name, line.line_code);
      }
    });
  }
};

const setup = () => {
  console.log('Setting up event hooks...');
  lines.once('value', (snapshot) => {
    if (snapshot.val() == null) {
      return;
    }
    for (let key of Object.keys(snapshot.val())) {
      console.log(`Adding hooks for ${key}`);
      lines.child(key).child('in_line').on('value', (newItem) => {
        lines.child(key).once('value', (lineSnapshot) => {
          if (lineSnapshot.val() != null) {
            moveToActive(lineSnapshot.val());
          }
        });
      });
      lines.child(key).child('up_next').on('value', (newItem) => {
        lines.child(key).once('value', (lineSnapshot) => {
          if (lineSnapshot.val() != null) {
            moveToActive(lineSnapshot.val());
          }
        });
      })
    }
    console.log('Event Hooks set up!');
  });
};

const addHooks = (lineId) => {
  console.log(`Setting up event hooks for ${lineId}`);
  lines.child(lineId).child('in_line').on('value', (newItem) => {
    lines.child(lineId).once('value', (lineSnapshot) => {
      if (lineSnapshot.val() != null) {
        moveToActive(lineSnapshot.val());
      }
    });
  });
  lines.child(lineId).child('up_next').on('value', (newItem) => {
    lines.child(lineId).once('value', (lineSnapshot) => {
      if (lineSnapshot.val() != null) {
        moveToActive(lineSnapshot.val());
      }
    });
  });
  console.log('Event Hooks set up!');
};

module.exports = {
  setup,
  addHooks,
  moveToActive,
};
