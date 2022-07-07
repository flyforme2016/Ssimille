import React from 'react';
import styled from 'styled-components/native';

const BigPicture = ({route}) => {
  const ProfleImg = route.params.userprofile;
  return (
    <Container>
      <BGImageContainer
        resizeMode="stretch"
        source={{
          uri: ProfleImg,
        }}
      />
    </Container>
  );
};
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #000;
`;

const BGImageContainer = styled.ImageBackground`
  flex: 0.75;
  width: 100%;
  height: 100%;
  position: relative;
  bottom: -100px;
`;

export default BigPicture;
