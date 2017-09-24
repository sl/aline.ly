import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

const styles = StyleSheet.create({
    name: {
        fontSize: 20,
    },
    description: {
        fontSize: 15,
    },
});

const Line = (props) => (
    <View style={{flex: 1, flexDirection: 'row'}}>
        <Image style={{height: 50, width: 50}} source={{uri: props.data.image}} />
        <View style={{paddingLeft: 10}}>
            <Text style={styles.name}>
            {props.data.event_name}
            </Text>
            <Text style={styles.descriptions}>
            {props.data.description}
            </Text>
        </View>

    </View>
);

export default Line;
