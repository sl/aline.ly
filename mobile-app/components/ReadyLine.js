import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Button, Component } from 'react-native';
import firebase from 'firebase';
import { removeFromUserLines, getLineInfo, getColors } from '../utils/LineUtils';

const styles = StyleSheet.create({
  name: {
    fontSize: 30,
  },
});

const ReadyLine = props => (
  <View>
    <View style={{ flex: 1, flexDirection: 'row', padding: 5 }}>
      <Image style={{ height: 50, width: 50 }} source={{ uri: props.line.image }} />
      <View style={{ paddingLeft: 10 }}>
        <Text style={styles.name}>{props.line.event_name} - Go Now!</Text>
      </View>
    </View>

    <View style={{ flex: 1, flexDirection: 'row' }}>
      <View
        style={{
          width: (Dimensions.get('window').width - 50) / 3,
          height: 75,
          backgroundColor: props.line.colors[0],
        }}
      />
      <View
        style={{
          width: (Dimensions.get('window').width - 50) / 3,
          height: 75,
          backgroundColor: props.line.colors[1],
        }}
      />
      <View
        style={{
          width: (Dimensions.get('window').width - 50) / 3,
          height: 75,
          backgroundColor: props.line.colors[2],
        }}
      />
    </View>

    <View style={{ flex: 1, flexDirection: 'row' }}>
      <Button
        onPress={() => {
          firebase
            .database()
            .ref('/server/lines/' + props.line.code + '/up_next/' + firebase.auth().currentUser.uid)
            .remove();
        }}
        title="Leave Line"
        color="#29B6F6"
        accessibilityLabel="Leave this line"
      />
    </View>
  </View>
);

export default ReadyLine;
