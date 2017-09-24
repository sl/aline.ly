import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Button, Component } from 'react-native';
import firebase from 'firebase';

const styles = StyleSheet.create({
    name: {
        fontSize: 30,
    }
});

const ReadyLine = (props) => (
    <View>
        <View style={{flex: 1, flexDirection: 'row', padding: 5}}>
            <Image style={{height: 50, width: 50}} source={{uri: props.data.image}} />
            <View style={{paddingLeft: 10}}>
                <Text style={styles.name}>
                { props.data.event_name} - Go Now!
                </Text>
            </View>
        </View>

        <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{width: (Dimensions.get('window').width - 50) / 3, height: 75, backgroundColor:  props.data.colors[0]}} />
            <View style={{width: (Dimensions.get('window').width - 50) / 3, height: 75, backgroundColor:  props.data.colors[1]}} />
            <View style={{width: (Dimensions.get('window').width - 50) / 3, height: 75, backgroundColor:  props.data.colors[2]}} />
        </View>

        <View style={{flex: 1, flexDirection: 'row'}}>
            <Button
              onPress={() => {
                  firebase.database().ref("/server/lines/" + props.data.line_code + "/up_next/" + firebase.auth().currentUser.uid).remove()
            }}
              title="Leave Line"
              color="#29B6F6"
              accessibilityLabel="Leave this line"
            />
            <Button
              onPress={() => {
                  firebase.database().ref("/server/lines/" + props.data.line_code + "/up_next/" + firebase.auth().currentUser.uid).remove(); props.joinLine(props.data.line_code)
            }}
              title="Move to Back"
              color="#29B6F6"
              accessibilityLabel="Move to back of line"
            />
        </View>
    </View>
)

export default ReadyLine;
