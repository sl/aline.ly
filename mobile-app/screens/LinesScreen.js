import React from 'react';
import { StyleSheet, Text, View, Container, Image, Button, ScrollView, Dimensions, TextInput, Alert } from 'react-native';

const config = require('../config.json');

import firebase from 'firebase';

export default class LinesScreen extends React.Component {
    static navigationOptions = {
        title: 'Lines',
    };

    constructor(props){
    	super(props);
    	this.state = {
            lineCode: "",
            signedIn: firebase.auth().currentUser,
    	};
        this.db = firebase.database()
    }

  joinLine(code){
      queryRef = firebase.database().ref("/server/lines/").orderByChild("line_code").equalTo(code)
      queryRef.once('value').then(function(snap) {
        if (snap.hasChild(code)){
              var userId = firebase.auth().currentUser.uid
              addUserRef = firebase.database().ref("/server/lines/" + code + "/in_line/");
              addUserRef.on('value', function(snapshot) {
                if (snapshot.hasChild(userId)) {
                    Alert.alert(
                        'Oops! ',
                        "You're already in this line. Be patient, and try to do something exciting!",
                        [
                            {text: 'OK'},
                        ],
                        { cancelable: false }
                    )
                } else{
                    var key = firebase.database().ref("/server/lines/" + code + "/in_line/").child(userId).key;
                    var updates = {};
                    updates["/server/lines/" + code + "/in_line/" + key] = new Date().getTime();

                    firebase.database().ref().update(updates);
                }

              });

          }
          else {
              Alert.alert(
                  'Uh oh!',
                  "Looks like that line doesn't exist. Try again!",
                  [
                      {text: 'OK'},
                  ],
                  { cancelable: false }
              )
          }
      });
  }

    componentDidMount() {
        if (!this.state.signedIn){
            firebase.auth().signInAnonymously().catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // ...
            });
        }
    }
    render() {
        return (
            <View>

                <View style={{width: Dimensions.get('window').width, padding: 25}}>
                    <Text style={styles.head}>Have a code? Input it here to get in line! </Text>
                    <TextInput
                        style={{height: 40, backgroundColor: '#fff', padding: 5}}
                        placeholder="Enter your line code"
                        onChangeText={(lineCode) => this.setState({lineCode})}
                        value={this.state.lineCode}
                    />

                    <Button
                        onPress={() => this.joinLine(this.state.lineCode, this.state)}
                        title="Let's Go!"
                        color="#4CAF50"
                    />
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'flex-end',
  alignItems: 'center',
},
map: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
},
    head: {
        padding: 10,
        textAlign: 'center',
        fontSize: 15
    },
    top: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flex: 1
    },
    select: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        flexDirection: 'row'
    },
    item: {
        borderWidth: 1,
        borderColor: '#d6d7da',
    },

  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});
