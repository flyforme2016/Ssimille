/* eslint-disable prettier/prettier */

import AppLoading from 'expo-app-loading';
import React, {useState} from 'react';
import * as Font from 'expo-font';
import {Ionicons} from '@expo/vector-icons';
import {Asset} from 'expo-asset';
import {
  Image,
  SafeAreaView as SafeAreaProvider,
  StyleSheet,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

import {LogBox} from 'react-native';
import Navigation from './src/navigation/Navigation';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

// const loadFonts = fonts => fonts.map(font => Font.loadAsync(font));

// const loadImages = images =>
//   images.map(image => {
//     if (typeof image === 'string') {
//       return Image.prefetch(image);
//     } else {
//       return Asset.loadAsync(image);
//     }
//   });

const App = () => {
  // const [ready, setReady] = useState(false);

  // const onFinish = () => setReady(true);

  // const startLoading = async () => {
  //   const fonts = loadFonts([Ionicons.font]);
  //   const images = loadImages([require('./logo.png')]);

  //   await Promise.all([...fonts, ...images]);
  // };

  // if (!ready) {
  //   return (
  //     <AppLoading
  //       startAsync={startLoading}
  //       onFinish={onFinish}
  //       onError={console.error}
  //     />
  //   );
  // } else {
  return (
    <SafeAreaProvider style={styles.root}>
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
