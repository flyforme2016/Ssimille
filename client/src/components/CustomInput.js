/* eslint-disable prettier/prettier */

import React from 'react';
import {Text, View, TextInput, StyleSheet} from 'react-native';

const Custominput = ({
  value,
  setValue,
  placeholder,
  secureTextEntry,
  style,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        style={style}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',

    borderColor: '#b7b4df',
    borderWidth: 1,
    borderRadius: 5,

    paddingHorizontal: 10,
    marginVertical: 10,
  },
  input: {},
});

export default Custominput;
