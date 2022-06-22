import React from 'react';
import {
  SafeAreaView as SafeAreaProvider,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {LogBox} from 'react-native';
import Navigation from './src/navigation/Navigation';
import {Provider} from 'react-redux';
import store from './src/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

LogBox.ignoreLogs(['Expected', 'Warning: ']);
LogBox.ignoreLogs(['EventEmitter.removeListener'])
LogBox.ignoreAllLogs(true);

const App = () => {
  // const removeData = async () => {
  //   await AsyncStorage.removeItem('userNumber');
  // }
  // removeData();

  return (
    <SafeAreaProvider style={styles.root}>
      <StatusBar hidden={true} />
      <Provider store={store}>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f9fbfc',
  },
});

export default App;
