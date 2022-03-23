import React from 'react';
import {SafeAreaView, ScrollView, StatusBar} from 'react-native';

const App = () => {
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}></ScrollView>
    </SafeAreaView>
  );
};

export default App;
