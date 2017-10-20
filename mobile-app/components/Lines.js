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
  }

  render() {
    //
    if (this.props.lines.length) {
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
