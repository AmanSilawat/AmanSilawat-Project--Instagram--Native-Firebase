import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';
import LoginScreen from './components/auth/Login';
import MainScreen from './components/Main';
import AddScreen from './components/main/Add';
import SaveScreen from './components/main/Save';
import CommentScreen from './components/main/Comment';


// import * as firebase from 'firebase';
import firebase from 'firebase';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

const firebaseConfig = {
  apiKey: "AIzaSyD4b7eR0RriTwbrdKlxEE3v5GkR-7qNiJw",
  authDomain: "instagram-native-cb814.firebaseapp.com",
  projectId: "instagram-native-cb814",
  storageBucket: "instagram-native-cb814.appspot.com",
  messagingSenderId: "401847870771",
  appId: "1:401847870771:web:cd367c93b7fa30aef8ca46",
  measurementId: "G-505LCVTM44"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}


const Stack = createStackNavigator();

export class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loaded: false,
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true
        })
      }
    })
  }

  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <View>
          <Text>
            Loading...
          </Text>
        </View>
      )
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Landing'>
            <Stack.Screen name='Landing' component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Register' component={RegisterScreen} />
            <Stack.Screen name='Login' component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Main'>
            <Stack.Screen name='Main' component={MainScreen} />
            <Stack.Screen name='Add' component={AddScreen} navigation={this.props.navigation} />
            <Stack.Screen name='Save' component={SaveScreen} navigation={this.props.navigation} />
            <Stack.Screen name='Comment' component={CommentScreen} navigation={this.props.navigation} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )

  }
}

export default App;
