import React from 'React';
import {
        StyleSheet,
        Text,
        View,
        Button,
        ScrollView,
        Dimensions,
        TextInput,
        Alert,
        FlatList,
    } from 'react-native';
import { Notifications } from 'expo';
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
            alerts: [],
            prevNotif: ''
        };
        this.joinLine = this.joinLine.bind(this);
    }

    joinLine(code){
        // this shourd all go to the backend
        const queryRef = firebase.database().ref("/server/lines/").orderByChild("line_code").equalTo(code);
        queryRef.once('value').then(function(snap) {
            if (snap.hasChild(code)){
                var userId = firebase.auth().currentUser.uid
                const addUserRef = firebase.database().ref("/server/lines/" + code + "/in_line/");
                addUserRef.once('value', function(snapshot) {
                    if (snapshot.hasChild(userId))  {
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
                                key = firebase.database().ref("/server/lines/" + code + '/').child('in_line').key;
                                updates = {};

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
    listenForItems(){
        // can be done properly with one query, then I should also attach this to the notification call
        let ctx = this;
        firebase.database().ref().child('/server/lines/').on('value', (snap) => {
            var listOfItems = []
            var listOfAlerts = []
            snap.forEach(function(child){
                var data = child.val()
                if (data.in_line){
                    if (Object.keys(data.in_line).indexOf(firebase.auth().currentUser.uid) !== -1){
                        listOfItems.push(data);
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
        this.listenForItems();

    }

    createNotification(notifications) {
        for (var i in notifications){
            if (notifications[i].event_name != this.state.prevNotif){
                const localNotification = {
                    title: "It's your turn!",
                    body: "The " + notifications[i].event_name + " line is ready for you!",
                    ios: { // (optional) (object) — notification configuration specific to iOS.
                      sound: true // (optional) (boolean) — if true, play a sound. Default: false.
                    },
                android: // (optional) (object) — notification configuration specific to Android.
                    {
                      sound: true,
                      priority: 'high',
                      sticky: false,
                      vibrate: true
                    }
                  };
                Notifications.presentLocalNotificationAsync(localNotification)
                this.setState({
                    prevNotif: notifications[i].event_name
                })
            }
        }
    }
    render() {
        if (this.state.alerts.length > 0){
            this.createNotification(this.state.alerts);
            // Create another Component to display all the ready lists
            return (
                <View>
                    <ScrollView style={{width: Dimensions.get('window').width, padding: 25}}>
                        <FlatList
                        data={this.state.alerts}
                        renderItem={({item}) => <ReadyLine data={item} joinLine={this.joinLine.bind(this)} />}
                        />
                    </ScrollView>
                </View>
            );
        } else{
            // Create another Component to display all the lines they're currrently in
            return (
                <View>
                    <ScrollView style={{width: Dimensions.get('window').width, padding: 25}}>

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
