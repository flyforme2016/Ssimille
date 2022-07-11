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

export const FollowButton = ({onPress, text, isFollow}) => {
  return (
    <FollowBtn onPress={onPress} isFollow={isFollow}>
      <FollowText isFollow={isFollow}>{text}</FollowText>
    </FollowBtn>
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
  background-color: #b7b4df;
`;
const BtnText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: white;
`;
const FollowBtn = styled.TouchableOpacity`
  width: 80;
  height: 40;
  border-radius: 10;
  justify-content: center;
  align-items: center;
  margin: 5px;
  border: ${props => (props.isFollow ? '#b7b4df' : 'white')};
  background-color: ${props => (props.isFollow ? 'white' : '#b7b4df')};
`;
const FollowText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${props => (props.isFollow ? '#b7b4df' : 'white')};
`;
const MusicBtn = styled.TouchableOpacity`
  margin: 5px;
`;
const IconBtn = styled.TouchableOpacity``;
const IconBtnText = styled.Text`
  font-size: 14px;
`;
