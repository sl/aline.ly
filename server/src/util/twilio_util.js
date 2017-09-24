const accountSid = 'ACdf3466047ba8aef288f4d2c272819e33';
const authToken = 'bce66695ab2cf028cfaf341863cef424'; 
const accountnumber = '16179774253'; //your phone number from twilio

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

function send_text(phonenumber, event_name, line_code){
  client.messages.create({
    body: 'You\'re done waiting! Head straight to ' + event_name + 
    '. Please confirm your ticket and you will recieve a color code that you must show to the organizers. ' + 
    'aline.ly/' + line_code,
    to: phonenumber,  // text sent to this number
    from: accountnumber 
  });
}
