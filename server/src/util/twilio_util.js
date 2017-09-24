const accountSid = 'ACdf3466047ba8aef288f4d2c272819e33';
const authToken = 'bce66695ab2cf028cfaf341863cef424';
const accountnumber = '16179774253'; //your phone number from twilio

const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

const sendAlertText = function(phonenumber, event_name, line_code) {
  console.log('sending twilio message!');
  client.messages.create({
    body: 'You\'re done waiting! Head straight to ' + event_name +
    ' and show the colors on your screen to the organizer!' +
    'aline.ly/' + line_code,
    to: phonenumber,  // text sent to this number
    from: accountnumber
  });
};

module.exports = {
  sendAlertText
};
