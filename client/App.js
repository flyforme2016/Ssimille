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

<<<<<<< HEAD
LogBox.ignoreLogs(['Expected', 'Warning: ']);
LogBox.ignoreAllLogs();
=======
LogBox.ignoreLogs(['Expected']);
LogBox.ignoreAllLogs(true);
>>>>>>> origin/gijeong_spotifyTab

const App = () => {
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
