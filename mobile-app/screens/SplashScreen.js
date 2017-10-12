import React from 'React';
import { View, Alert } from 'react-native';

import firebase from 'firebase';


export default class SplashScreen extends React.Component {
  static navigationOptions = {
    title: 'Login',
  };

  constructor(props){
      super(props);
      this.state = {
          signedIn: firebase.auth().currentUser,
      };
  }

  componentDidMount(){
      if (!this.state.signedIn){
          firebase.auth().signInAnonymously().catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            Alert.alert(
                errorCode + " Sign in Error!",
                errorMessage,
                [
                    {text: 'OK'},
                ],
                { cancelable: false }
            )
          });
      }
    }
  render()  {
        // This should eventually have a view including some kind of introduction to the app, and have an option for users to sign up for a permanent account
        return (
          <View>
          </View>
      );
  }

}
