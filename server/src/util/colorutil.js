const admin = require('./firebaseadminutil.js');
const db = admin.database();
const lines = db.ref('/server').child('lines');

const randColor = () => {
  // gets a random number between hex #000000 and #FFFFFF
  return '#' + Math.floor(Math.random()*16777215).toString(16);
};

const chooseColors = (lineCode) => {
  console.log(`Updating colors for '${lineCode}.'`);
  const colors = lines.child(lineCode).child('colors');
  colors.child('0').set(randColor());
  colors.child('1').set(randColor());
  colors.child('2').set(randColor());
};

const initializeColorsForLineCode = (lineCode) => {
  chooseColors(lineCode);
  setInterval(() => chooseColors(lineCode), 60000);
};

const initializeAllExisting = () => {
  lines.once('value', (snapshot) => {
    for (let key of Object.keys(snapshot.val())) {
      initializeColorsForLineCode(key);
    }
  });
};

module.exports = {
  initializeColorsForLineCode,
  initializeAllExisting,
}
