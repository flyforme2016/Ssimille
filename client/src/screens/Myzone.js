/* eslint-disable prettier/prettier */

import React from 'react';
import Styled from 'styled-components/native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

const Myzone = () => {
  return (
    <Container>
      <MapView
        style={{flex: 1}}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 37.56667,
          longitude: 126.97806,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    </Container>
  );
};

const Container = Styled.View`
  flex: 1;
`;

export default Myzone;
