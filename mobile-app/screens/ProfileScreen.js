import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native';
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
    return(
        <View style={{width: Dimensions.get('window').width, padding: 25}}>
            <Text fontWeight='bold'>ID: </Text><Text>{this.state.user.uid}</Text>
        </View>
    );
  }

}
