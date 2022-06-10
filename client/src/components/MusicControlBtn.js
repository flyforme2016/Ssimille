import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';

export const MusicControlBtn = ({onPress, type}) => {
  return (
    <ControlBtn onPress={onPress}>
      <Ionicons name={type} size={20} />
    </ControlBtn>
  );
};

const ControlBtn = styled.TouchableOpacity`
  margin: 5px;
`;
