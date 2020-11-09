import React from 'react';
import SplashScreen from './src/SplashScreen';
import HomeScreen from './src/HomeScreen';
import DetailsScreen from './src/DetailsScreen';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

const MainNavigator = createStackNavigator({
  
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
  Details: {
    screen: DetailsScreen,
    navigationOptions: ({ navigation }) => ({
      // header: null,
    }),
  },
});

const App = createAppContainer(MainNavigator);

export default App;
