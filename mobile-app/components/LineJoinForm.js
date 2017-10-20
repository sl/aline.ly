import React, { Component } from 'React';
import { StyleSheet, View, Text, Button, TextInput, Alert, Platform } from 'react-native';
import PropTypes from 'prop-types';

import firebase from 'firebase';
import request from 'superagent';

class LineJoinForm extends Component {
  constructor(props) {
    super(props);
    this.db = firebase.database();
    this.state = {
      userId: firebase.auth().currentUser.uid,
      signedIn: firebase.auth().currentUser,
      data: null,
      alerts: [],
      hasInitialData: false,
    };
  }

  getLines(callback) {
    request.get('http://aline.ly/api/lines').end(callback);
  }

  joinLine(code) {
    this.getLines((err, res) => {
      const data = JSON.parse(res.text).lines;
      var foundLine = false;
      data.forEach(line => {
        if (line.code == code) {
          foundLine = true;
          const userId = firebase.auth().currentUser.uid;

          // If line is empty or user is already in the line
          if ((line.inLine && Object.keys(line.inLine).indexOf(userId) > -1) || !line.inLine) {
            var inLineUrl = '/server/lines/' + line.code + '/in_line/';
            var lineKey = this.db.ref(inLineUrl).child(userId).key;
            var lineUpdates = {};
            lineUpdates[inLineUrl + lineKey] = new Date().getTime();
            this.db.ref().update(lineUpdates);

            var userUrl = '/server/users/' + userId + '/' + line.code + '/';
            var userUpdates = {};
            userUpdates[userUrl] = new Date().getTime();
            this.db.ref().update(userUpdates);
            Alert.alert('Congrats!', "You've just been added to the queue!", [{ text: 'OK' }], {
              cancelable: false,
            });
          } else {
            Alert.alert(
              'Hodl!',
              "You're already in this line. Don't stay here checking your app all the time!",
              [{ text: 'OK' }],
              { cancelable: false }
            );
          }
        }
      });

      if (!foundLine) {
        Alert.alert('Uh oh!', "Looks like that line doesn't exist. Try again!", [{ text: 'OK' }], {
          cancelable: false,
        });
      }
    });
  }
  render() {
    return (
      <View>
        <Text style={styles.head}>Have a line code? Input it here to get in line!</Text>
        <View style={{ padding: 5 }}>
          <TextInput
            style={styles.textField}
            placeholder="Enter line code"
            onChangeText={lineCode => this.setState({ lineCode })}
            value={this.state.lineCode}
          />
        </View>

        <Button
          onPress={() => this.joinLine(this.state.lineCode, this.state)}
          title="Let's Go!"
          color="#4CAF50"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  head: {
    padding: 10,
    textAlign: 'center',
    fontSize: 15,
  },
  title: {
    padding: 10,
    textAlign: 'center',
    fontSize: 25,
  },
  textField: {
    backgroundColor: Platform.OS === 'ios' ? 'white' : 'transparent',
    height: 40,
    padding: 5,
  },
});

export default LineJoinForm;
