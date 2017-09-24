import React from 'react';
import { WebBrowser } from 'expo';
import { View, StyleSheet, Text, Image, TextInput, Button } from 'react-native';

import { MonoText } from '../components/StyledText';
import firebase from 'firebase';
import Dimensions from 'Dimensions';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile',
  };

  constructor(props){
      super(props);
      this.state = {
          user: firebase.auth().currentUser,
      };
  }

  render() {
      console.log(this.state.user);
    return(
        <View style={{width: Dimensions.get('window').width, padding: 25}}>
            <Text fontWeight='bold'>ID: </Text><Text>{this.state.user.uid}</Text>

            </View>
    );
  }

}

const styles = StyleSheet.create({
    title: {
        fontSize: 25,
    }
});
