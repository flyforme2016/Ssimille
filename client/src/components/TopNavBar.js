import React from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TopNavBar = ({navText, iconName, onPress}) => {
  return (
    <NavBar>
      <NavText>{navText}</NavText>
      <Btn onPress={onPress}>
        <Ionicons name={iconName} size={30} />
      </Btn>
    </NavBar>
  );
};

const NavBar = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 7px 0;
`;
const NavText = styled.Text`
  color: #9b59b6;
  font-size: 20;
`;
const Btn = styled.TouchableOpacity`
  width: 60px;
  position: absolute;
  right: -1px;
`;
export default TopNavBar;
