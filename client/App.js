/* eslint-disable prettier/prettier */

import React from 'react';
import {
  SafeAreaView as SafeAreaProvider,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

import {LogBox} from 'react-native';
import Navigation from './src/navigation/Navigation';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

const App = () => {
  return (
    <SafeAreaProvider style={styles.root}>
      <StatusBar hidden={true} />
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
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
