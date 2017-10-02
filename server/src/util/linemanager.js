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
  // const currentDate = +new Date();
  let upNextValue = {};
  if ('up_next' in line) {
    upNextValue = line.up_next;
  }
  let inLineValue = {};
  if ('in_line' in line) {
    inLineValue = line.in_line;
  }
  /* if (currentDate < line.start_time || currentDate > line.end_time) {
    // the event isn't currently active, don't do anything
    return;
  } */
  // get the length of up now
  // check if the event is active
  const toMove = [];
  const inLineUsers = Object.keys(inLineValue);
  if (Object.keys(upNextValue).length < line.capacity) {
    inLineUsers.sort((a, b) => inLineValue[a] - inLineValue[b]); // sort high to low by date joined
  } else {
    return; // there are no open spots in up_next
  }
  let i = 0;
  while (i < inLineUsers.length && i + toMove.length < line.capacity) {
    // mark people to move to the new line
    toMove.push(inLineUsers[i]);
    i += 1;
  }

  toMove.forEach((key) => {
    // add the user to up next
    lines
      .child(line.line_code)
      .child('up_next')
      .child(key)
      .set(inLineValue[key]);

    // remove them from in line
    lines
      .child(line.line_code)
      .child('in_line')
      .child(key)
      .remove();

    // set timer after which to remove the user from up next
    setTimeout(() => removeFromUpNext(key, line.line_code),
      line.service_time * 1000 * 60);

    // send a twilio message to the user
    phones.once('value', (snapshot) => {
      const phoneValues = snapshot.val();
      if (phoneValues == null) {
        return;
      }
      if (key in phoneValues) {
        // found a phone number, send a message to it
        const phoneNumber = phoneValues[key];
        twilioSender.sendAlertText(phoneNumber, line.event_name, line.line_code);
      }
    });
  });
};

const setup = () => {
  console.log('Setting up event hooks...');
  lines.once('value', (snapshot) => {
    if (snapshot.val() == null) {
      return;
    }
    Object.keys(snapshot.val()).forEach((key) => {
      console.log(`Adding hooks for ${key}`);
      lines.child(key).child('in_line').on('value', () => {
        lines.child(key).once('value', (lineSnapshot) => {
          if (lineSnapshot.val() != null) {
            moveToActive(lineSnapshot.val());
          }
        });
      });
      lines.child(key).child('up_next').on('value', () => {
        lines.child(key).once('value', (lineSnapshot) => {
          if (lineSnapshot.val() != null) {
            moveToActive(lineSnapshot.val());
          }
        });
      });
    });
    console.log('Event Hooks set up!');
  });
};

const addHooks = (lineId) => {
  console.log(`Setting up event hooks for ${lineId}`);
  lines.child(lineId).child('in_line').on('value', () => {
    lines.child(lineId).once('value', (lineSnapshot) => {
      if (lineSnapshot.val() != null) {
        moveToActive(lineSnapshot.val());
      }
    });
  });
  lines.child(lineId).child('up_next').on('value', () => {
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
