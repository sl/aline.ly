import React, { Component } from 'React';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import firebase from 'firebase';

import Line from '../components/Line';
import { getLineInfo, getColors } from '../utils/LineUtils';

class Lines extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waitingLines: [],
    };
    this.db = firebase.database();
    this.updateWaitingLines();
  }

  // componentDidMount() {
  //   console.log('about to updateWaitingLines');
  //   this.updateWaitingLines();
  // }
  // componentWillReceiveProps() {
  //   console.log('about to updateWaitingLines');
  //
  //   this.updateWaitingLines();
  // }
  getInfo(code) {
    const lineRef = this.db.ref('server/lines/' + code + '/');
    return Promise.all([
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
        length: Object.keys(data[2]).length - 2,
        image: data[3],
        endTime: data[4],
        serviceTime: data[5],
      };
      return lineInfo;
    });
  }
  updateWaitingLines() {
    console.log('updating with data from new props' + JSON.stringify(this.props.lines) + 'Close');
    var updatedWaitingLines = [];
    let ctx = this;
    this.props.lines.forEach(async (line, i) => {
      const lineCode = Object.keys(line)[0];
      newWaitingLine = this.getInfo(lineCode);
      var newWaitingLine = await this.getInfo(lineCode);
      newWaitingLine = JSON.parse(JSON.stringify(newWaitingLine));
      newWaitingLine.key = i;
      updatedWaitingLines.push(newWaitingLine);
      ctx.setState({
        waitingLines: updatedWaitingLines,
      });
    });
    if (!this.props.lines.length) {
      this.setState({
        waitingLines: [],
      });
    }
  }
  render() {
    //
    if (this.state.waitingLines.length) {
      return (
        <View style={{ paddingBottom: 75 }}>
          <Text style={styles.title}>Your Lines</Text>
          <FlatList data={this.props.lines} renderItem={({ item }) => <Line line={item} />} />
        </View>
      );
    } else {
      return (
        <View>
          <Text style={{ textAlign: 'center', paddingTop: 20 }}>You are not in any lines!</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  head: {
    padding: 10,
    textAlign: 'center',
    fontSize: 15,
  },
  title: {
    padding: 10,
    textAlign: 'center',
    fontSize: 30,
    fontFamily: 'didact-gothic',
  },
});

Lines.propTypes = {
  lines: PropTypes.array.isRequired,
};

export default Lines;
