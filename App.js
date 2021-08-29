import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';

// import * as firebase from 'firebase';
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyD4b7eR0RriTwbrdKlxEE3v5GkR-7qNiJw",
  authDomain: "instagram-native-cb814.firebaseapp.com",
  projectId: "instagram-native-cb814",
  storageBucket: "instagram-native-cb814.appspot.com",
  messagingSenderId: "401847870771",
  appId: "1:401847870771:web:cd367c93b7fa30aef8ca46",
  measurementId: "G-505LCVTM44"
};

console.log('firebase :>> ', firebase);
console.log('firebase.apps :>> ', firebase.apps);

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
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>User is logged in </Text>
      </View>
    )

  }
}

export default App;
