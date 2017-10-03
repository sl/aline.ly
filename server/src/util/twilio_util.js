'use strict';


// todo -- consider this compromised information. We should completely
// revoke any associated auth tokens, and get new onces.
const accountSid = 'ACdf3466047ba8aef288f4d2c272819e33';
const authToken = 'bce66695ab2cf028cfaf341863cef424';
const accountnumber = '16179774253'; // your phone number from twilio

const Twilio = require('twilio');

const client = new Twilio(accountSid, authToken);

const sendAlertText = (phonenumber, eventName, lineCode) => {
  console.log('sending twilio message!');
  client.messages.create({
    body: `You're done waiting! Head straight to ${eventName
    } and show the colors on your screen to the organizer!` +
    `aline.ly/${lineCode}`,
    to: phonenumber, // text sent to this number
    from: accountnumber,
  });
};

module.exports = {
  sendAlertText,
};
