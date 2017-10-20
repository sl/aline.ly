import React, { Component } from 'React';
import PropTypes from 'prop-types';

import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import firebase from 'firebase';

class Line extends Component {
  constructor(props) {
    super(props);
    this.state = {
      line: JSON.parse(JSON.stringify(this.props.line)),
    };
    this.db = firebase.database();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props != nextProps) {
      this.setState({
        line: JSON.parse(JSON.stringify(nextProps.line)),
      });
    }
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <Image
          style={{ width: 75, height: 75 }}
          resizeMode="cover"
          source={{ uri: this.state.line.image }}
        />
        <View style={{ paddingLeft: 10, width: Dimensions.get('window').width - 50 }}>
          <Text style={styles.name}>{this.state.line.name}</Text>
          <Text style={styles.descriptions}>{this.state.line.description}</Text>
          <Text>{this.state.line.numPeople} people in line</Text>
          <Text>Around {this.state.line.serviceTime}min per person</Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  name: {
    fontSize: 20,
  },
  description: {
    fontSize: 15,
    fontStyle: 'italic',
  },
});

Line.propTypes = {
  line: PropTypes.object.isRequired,
};

export default Line;
