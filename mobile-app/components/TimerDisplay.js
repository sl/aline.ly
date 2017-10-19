'use strict';
import React from 'react';
import { Text, Component, View } from 'react-native';

import moment from 'moment';
import 'moment-duration-format';

const TimerDisplay = props => (
  <View>
    <Text>
      You have {moment.duration(props.timeLeft, 'seconds').format('hh:mm:ss', { trim: false })} left
    </Text>
  </View>
);

export default TimerDisplay;
