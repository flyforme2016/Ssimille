import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';

export const CustomButton = ({onPress, text, isFollow}) => {
  return (
    <ControlBtn onPress={onPress} isFollow={isFollow}>
      <BtnText>{text}</BtnText>
    </ControlBtn>
  );
};

export const MusicControlBtn = ({onPress, type}) => {
  return (
    <MusicBtn onPress={onPress}>
      <Ionicons name={type} size={20} />
    </MusicBtn>
  );
};

export const IconControlBtn = ({onPress, type, text, size}) => {
  return (
    <IconBtn onPress={onPress}>
      <Ionicons name={type} size={size} />
      <IconBtnText>{text}</IconBtnText>
    </IconBtn>
  );
};

const ControlBtn = styled.TouchableOpacity`
  width: 80;
  height: 40;
  border-radius: 10;
  justify-content: center;
  align-items: center;
  margin: 5px;
  background-color: ${props => (props.isFollow ? 'white' : '#b7b4df')};
`;
const BtnText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${props => (props.isFollow ? 'black' : 'white')};
`;
const MusicBtn = styled.TouchableOpacity`
  margin: 5px;
`;
const IconBtn = styled.TouchableOpacity``;
const IconBtnText = styled.Text`
  font-size: 14px;
`;
