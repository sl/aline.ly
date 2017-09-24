import React from 'react';
import { WebBrowser } from 'expo';
import { View, StyleSheet, Text, Image, TextInput, Button } from 'react-native';

import { MonoText } from '../components/StyledText';
import firebase from 'firebase';


export default class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login',
  };
  constructor(props){
      super(props);
      this.state = {
          signedIn: firebase.auth().currentUser,
          isLoginScreen : true,
      };
  }

  componentDidMount(){
      if (!this.state.signedIn){
          firebase.auth().signInAnonymously().catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
          });
      }
    }
  render()  {
        return (
          <View>
          </View>
      ); // This is here in case we need to add stuff
  }

}
