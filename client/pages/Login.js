import * as React from 'react';
import {Button, View, Text} from 'react-native';

function Login({navigation}) {
  return (
    <>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Login page입니다!</Text>
        <Button title="Loginpage" onPress={() => navigation.push('Home')} />
      </View>
    </>
  );
}

export default Login;
