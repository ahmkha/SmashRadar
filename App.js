import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import HomeTextFields from './components/HomeTextFields';

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
        />
        <Button 
          title = "Register" 
          onPress = {() => this.props.navigation.navigate('SignUp')} 
        />
      </View>
    );
  }
}

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
            onclick = {() =>fetch('http://localhost:8000/register/', {
              method: 'POST',
              body: JSON.stringify({
                username: 'user',
                password: 'pass',
              }),
            })} 
          />
          <Text> </Text>
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
});
