import React from 'react';
import { StyleSheet, Text, View, Container, Image, Button, ScrollView, Dimensions, TextInput, Alert, ListView, FlatList, ListItem } from 'react-native';

const config = require('../config.json');

import firebase from 'firebase';
import Line from '../components/Line';
import ReadyLine from '../components/ReadyLine';

export default class LinesScreen extends React.Component {
    static navigationOptions = {
        title: 'Lines',
    };

    constructor(props){
        super(props);
        this.state = {
            lineCode: "",
            signedIn: firebase.auth().currentUser,
            data: [],
            alerts: []
        };
        this.joinLine = this.joinLine.bind(this);
    }

    joinLine(code){
        queryRef = firebase.database().ref("/server/lines/").orderByChild("line_code").equalTo(code);
        let ctx = this;
        queryRef.once('value').then(function(snap) {
            if (snap.hasChild(code)){
                var userId = firebase.auth().currentUser.uid
                addUserRef = firebase.database().ref("/server/lines/" + code + "/in_line/");
                addUserRef.once('value', function(snapshot) {
                    if (snapshot.hasChild(userId)) {
                        Alert.alert(
                            'Hold!',
                            "You're already in this line. Don't stay here checking your app all the time!",
                            [
                                {text: 'OK'},
                            ],
                            { cancelable: false }
                        )
                    } else{
                        firebase.database().ref("/server/lines/" + code).once('value').then(function(snapshot) {
                            if (snapshot.hasChild('in_line')){

                                var key = firebase.database().ref("/server/lines/" + code + "/in_line/").child(userId).key;
                                var updates = {};
                                updates["/server/lines/" + code + "/in_line/" + key] = new Date().getTime();
                                firebase.database().ref().update(updates);
                                Alert.alert(
                                    'Congrats!',
                                    "You've just been added to the queue!",
                                    [
                                        {text: 'OK'},
                                    ],
                                    { cancelable: false }
                                )

                            } else {
                                var key = firebase.database().ref("/server/lines/" + code + '/').child('in_line').key;
                                var updates = {};

                                updates["/server/lines/" + code + "/" + key + '/' + userId + '/'] = new Date().getTime()
                                firebase.database().ref().update(updates);
                                Alert.alert(
                                    'Congrats!',
                                    "You've just been added to the queue!",
                                    [
                                        {text: 'OK'},
                                    ],
                                    { cancelable: false }
                                )

                            }
                        });
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
    listenForItems(code){
        let ctx = this;
        firebase.database().ref().child('/server/lines/').on('value', (snap) => {
            var listOfItems = []
            var listOfAlerts = []
            snap.forEach(function(child){
                data = child.val()
                if (data.in_line){
                    console.log(Object.keys(data.in_line))
                    if (Object.keys(data.in_line).indexOf(firebase.auth().currentUser.uid) !== -1){
                        listOfItems.push(data);
                        console.log(listOfItems)
                    }
                }
                if (data.up_next){
                    if (Object.keys(data.up_next).indexOf(firebase.auth().currentUser.uid) !== -1){
                        listOfAlerts.push(data);
                    }
                }
            });
            ctx.setState({
                data: listOfItems,
                alerts: listOfAlerts
            })
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
        this.listenForItems();

    }
    render() {
        return (
            <View>
                <ScrollView style={{width: Dimensions.get('window').width, padding: 25}}>
                    <FlatList
                    data={this.state.alerts}
                    renderItem={({item}) => <ReadyLine data={item} joinLine={this.joinLine.bind(this)} />}
                    />
                    <Text style={styles.head}>Have a code? Input it here to get in line!</Text>
                    <View style={{padding: 5}}>
                        <TextInput
                        style={{height: 40, backgroundColor: '#fff', padding: 5}}
                        placeholder="Enter line code"
                        onChangeText={(lineCode) => this.setState({lineCode})}
                        value={this.state.lineCode}
                        />
                    </View>

                    <Button
                    onPress={() => this.joinLine(this.state.lineCode, this.state)}
                    title="Let's Go!"
                    color="#4CAF50"
                    />

                    <Text style={styles.title}>Your Lines</Text>
                    <FlatList
                    data={this.state.data}
                    renderItem={({item}) => <Line data={item} />}
                    />

                </ScrollView>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    head: {
        padding: 10,
        textAlign: 'center',
        fontSize: 15
    },
    title: {
        padding: 10,
        textAlign: 'center',
        fontSize: 25
    }
});
