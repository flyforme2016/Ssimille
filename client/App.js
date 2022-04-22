/* eslint-disable prettier/prettier */

import React from 'react';
import {SafeAreaView as SafeAreaProvider, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {LogBox} from 'react-native';
import Routes from './src/navigation/Routes';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

const App = () => {
  return (
    <SafeAreaProvider style={styles.root}>
      <NavigationContainer>
        <Routes />
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
