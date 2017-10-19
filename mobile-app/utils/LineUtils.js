import firebase from 'firebase';

function removeFromUserLines(code) {
  const userId = firebase.auth().currentUser.uid;
  const lineUrl = '/server/users/' + userId + '/' + code + '/';
  const lineRef = firebase.database().ref(lineUrl);
  console.log("About to hit that remove button")
  lineRef.remove();
}

function getLineInfo(code) {
  const lineRef = firebase.database().ref('server/lines/' + code + '/');
  Promise.all([
    lineRef.child('event_name').once('value'),
    lineRef.child('description').once('value'),
    lineRef.child('in_line').once('value'),
    lineRef.child('image').once('value'),
    lineRef.child('end_time').once('value'),
    lineRef.child('service_time').once('value'),
  ]).then(data => {
    const res = {
      name: data[0],
      description: data[1],
      length: Object.keys(data[2]).length,
      image: data[3],
      endTime: new Date(data[4]),
      serviceTime: data[5],
    };
    return res;
  });
}
function getColors(code) {
  const colorRef = firebase.database().ref('server/lines/' + code + '/colors/');
  colorRef.once('value').then(snap => {
    return snap.val();
  });
}
export { removeFromUserLines, getLineInfo, getColors };
