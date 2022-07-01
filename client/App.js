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
import {QueryClient, QueryClientProvider} from 'react-query';

LogBox.ignoreLogs(['Expected', 'Warning: ']);
LogBox.ignoreLogs(['EventEmitter.removeListener']);
LogBox.ignoreAllLogs(true);

const queryClient = new QueryClient();
const App = () => {
  return (
    <SafeAreaProvider style={{flex: 1}}>
      <QueryClientProvider client={queryClient}>
        <StatusBar hidden={true} />
        <Provider store={store}>
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>
        </Provider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

export default App;
