import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import HomeTextFields from './components/HomeTextFields';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; 

class LoginScreen extends React.Component {
  render() {

    return(
      <View style={styles.container}>
        <Image 
          source = {require('./assets/ssbu_logo.png')}
          style = {styles.logo_pic}
        />
        <Text> Username: </Text>
        <HomeTextFields />
        <Text> Password: </Text>
        <HomeTextFields />
        <Button 
          title = "Login" 
          onPress = {() => this.props.navigation.navigate('Main')}
        />
        <Button 
          title = "Register" 
          onPress = {() => this.props.navigation.navigate('SignUp')} 
        />
      </View>
    );
  }
}

const request = new Request('https://aqueous-fortress-12378.herokuapp.com/register', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'test2',
    password: 'testpass1',
    address1: '2345 Foster Ave',
    city: 'Brooklyn',
    state: 'NY',
  }),
})

class SignUpScreen extends React.Component {
  render() {
      return (
        <View>
          <Text> Username: </Text>
          <HomeTextFields />
          <Text> Password: </Text>
          <HomeTextFields />
          <Text> E-mail Address: </Text>
          <HomeTextFields />
          <Text> Address: </Text>
          <HomeTextFields />
          <Button 
            title = "Register" 
            onPress = {() => fetch(request).then(response => {if(response.status === 200){
              console.log(response.status);}
            })} 
          />
        </View>
      );
  }
}

class MainScreen extends React.Component{
    render(){
      return(
        <View style={styles.containerMap}>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            region={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
     />
        </View>
      );
    }
}

const MainNavigator = createStackNavigator({
  Login : {
    screen: LoginScreen,
    navigationOptions: {
      header: null,
    }
  },

  SignUp : {
    screen: SignUpScreen,
    navigationOptions: {
      header: null,
    }
  },

  Main : {
    screen: MainScreen,
    navigationOptions: {
      header: null,
    }
  },
});

const AppContainer = createAppContainer(MainNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo_pic: {
    flex: 1,
    width: 300,
    height: 300,
    resizeMode: 'contain',
  }, 
  containerMap: {
    ...StyleSheet.absoluteFillObject,
    height: 500,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
