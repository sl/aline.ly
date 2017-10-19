import React from 'React';
import { View, ScrollView, Dimensions, StyleSheet, FlatList, Text } from 'react-native';
import { Notifications } from 'expo';
import firebase from 'firebase';

import Lines from '../components/Lines';
import ReadyLine from '../components/ReadyLine';
import LineJoinForm from '../components/LineJoinForm';
import TimerDisplay from '../components/TimerDisplay';

import { removeFromUserLines, getLineInfo, getColors } from '../utils/LineUtils';

export default class LinesScreen extends React.Component {
  static navigationOptions = {
    title: 'Lines',
  };

  constructor(props) {
    super(props);
    this.db = firebase.database();
    this.state = {
      userId: firebase.auth().currentUser.uid,
      signedIn: firebase.auth().currentUser,
      alerts: [],
      hasInitialData: false,
      readyLine: null,
    };
  }
  waitForTurnEnd(code) {
    let ctx = this;
    const userId = firebase.auth().currentUser.uid;
    const lineUrl = '/server/lines/' + code + '/up_next/';
    this.db.ref(lineUrl).on('value', snap => {
      const data = snap.val();
      if (!data || Object.keys(data).indexOf(userId) == -1) {
        ctx.setState({
          readyLine: null,
        });
        removeFromUserLines(code);
      }
    });
  }

  getInfo(code) {
    const lineRef = this.db.ref('server/lines/' + code + '/');
    return Promise.all([
      lineRef.child('event_name').once('value'),
      lineRef.child('image').once('value'),
      lineRef.child('service_time').once('value'),
      lineRef.child('colors').once('value'),
    ]).then(data => {
      var lineInfo = {
        name: data[0],
        image: data[1],
        serviceTime: data[2],
        colors: data[3],
      };
      return lineInfo;
    });
  }
  async collectInfo(code) {
    let data = await this.getInfo(code);
    return data;
  }
  async startTimer(time) {
    this.setState({ timer: time });
    while (this.state.timer > -1) {
      const wait = await new Promise(function(resolve, reject) {
        setTimeout(function() {
          resolve();
        }, 1000);
      });
      this.setState({ timer: this.state.timer - 1 });
    }
  }
  async checkIfNext(code) {
    let ctx = this;
    const lineUrl = '/server/lines/' + code + '/up_next/';
    var upNext = await this.db.ref(lineUrl).once('value');
    upNext = JSON.parse(JSON.stringify(upNext));
    if (upNext && Object.keys(upNext).indexOf(this.state.userId) > -1) {
      const lineRef = this.db.ref('server/lines/' + code + '/');
      var lineInfo = await this.getInfo(code);
      lineInfo = JSON.parse(JSON.stringify(lineInfo));
      this.startTimer(lineInfo.serviceTime * 60);
      const localNotification = {
        title: "It's your turn!",
        body:
          'The ' +
          lineInfo.name +
          ' line is ready for you! You have ' +
          lineInfo.serviceTime +
          ' minutes left!',
        ios: {
          sound: true,
        },
        android: {
          sound: true,
          priority: 'high',
          sticky: true,
          vibrate: true,
        },
      };
      Notifications.presentLocalNotificationAsync(localNotification);
      this.setState({
        readyLine: {
          code: code,
          name: lineInfo.name,
          colors: lineInfo.colors,
          image: lineInfo.image,
          timeRemaining: lineInfo.serviceTime,
        },
      });
      this.waitForTurnEnd(code);
    }
  }
  listenForItems() {
    let ctx = this;
    const userId = firebase.auth().currentUser.uid;
    const userUrl = '/server/users/' + userId + '/';
    this.db.ref(userUrl).on('value', snap => {
      const data = snap.val();
      var userLines = [];
      if (data) {
        snap.forEach(async line => {
          const lineRef = this.db.ref('server/lines/' + line.key + '/');
          var newEntry = await Promise.all([
            lineRef.child('event_name').once('value'),
            lineRef.child('description').once('value'),
            lineRef.child('in_line').once('value'),
            lineRef.child('image').once('value'),
            lineRef.child('end_time').once('value'),
            lineRef.child('service_time').once('value'),
          ]).then(data => {
            var lineInfo = {
              name: data[0],
              description: data[1],
              length: Object.keys(data[2]).length,
              image: data[3],
              endTime: data[4],
              serviceTime: data[5],
            };
            return lineInfo;
          });
          newEntry = JSON.parse(JSON.stringify(newEntry));
          userLines.push(newEntry);
          this.checkIfNext(line.key);

          ctx.setState({
            data: userLines,
          });
        });
      } else {
        ctx.setState({
          data: userLines,
        });
      }
    });
  }

  componentWillMount() {
    this.listenForItems();
  }

  render() {
    if (this.state.readyLine) {
      return (
        <View>
          <Text style={styles.title}>aline</Text>
          <ScrollView style={{ width: Dimensions.get('window').width, padding: 25 }}>
            <ReadyLine line={this.state.readyLine} />
            <TimerDisplay timeLeft={this.state.timer} />
          </ScrollView>
        </View>
      );
    } else {
      if (this.state.data) {
        return (
          <ScrollView style={{ width: Dimensions.get('window').width, padding: 25 }}>
            <Text style={styles.title}>aline</Text>
            <LineJoinForm />
            <Lines lines={this.state.data} />
          </ScrollView>
        );
      } else {
        return (
          <ScrollView style={{ width: Dimensions.get('window').width, padding: 25 }}>
            <Text style={styles.title}>aline</Text>
            <LineJoinForm />
            <Text>Loading your lines...</Text>
          </ScrollView>
        );
      }
    }
  }
}

const styles = StyleSheet.create({
  title: {
    padding: 10,
    textAlign: 'center',
    fontSize: 50,
    fontFamily: 'didact-gothic',
  },
});
