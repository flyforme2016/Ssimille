import React from 'react';
import {Text, View, StatusBar, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
const Splash = ({navigation}) => {
  async function temp() {
    const myUid = await AsyncStorage.getItem('userNumber');
    console.log('is there myUid in AsyncStorage? : ', myUid);
  }
  setTimeout(() => {
    navigation.replace('Login');
  }, 3000);

  return (
    <View
      style={{
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <StatusBar hidden={true} />
      <Image
        source={require('../../assets/sample/Ssimillelogo.jpg')}
        style={{width: 300, height: 300}}
      />
      <Text
        style={{
          fontFamily: 'sans-serif-medium',
          fontWeight: 'bold',
          fontSize: 50,
          color: '#b7b4df',
        }}>
        SSimille
      </Text>
    </View>
  );
};

export default Splash;
