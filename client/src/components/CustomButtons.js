import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';

export const CustomButton = ({onPress, text}) => {
  return (
    <ControlBtn onPress={onPress}>
      <BtnText>{text}</BtnText>
    </ControlBtn>
  );
};

export const MusicControlBtn = ({onPress, type, isFollow}) => {
  return (
    <MusicBtn onPress={onPress} isFollow={isFollow}>
      <Ionicons name={type} size={20} />
    </MusicBtn>
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
const MusicBtn = styled.TouchableOpacity``;
