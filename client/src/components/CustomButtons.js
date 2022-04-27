import React from 'react';
import {Text, StyleSheet, Pressable} from 'react-native';

const CustomButton = ({onPress, text, bgColor, fgColor}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, bgColor ? {backgroundColor: bgColor} : {}]}>
      <Text style={[styles.text, fgColor ? {color: fgColor} : {}]}>{text}</Text>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },

  text: {
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CustomButton;
