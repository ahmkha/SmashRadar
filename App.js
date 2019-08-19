import React from 'react';
import { Alert, StyleSheet, ScrollView, View, Button, Image, TextInput } from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; 
import MainsList from './components/MainsList';
import SetupList from './components/SetupList';

//Images
const image1 = require('./assets/banjo.png')
const image2 = require('./assets/bayonetta.png')
const image3 = require('./assets/bowser.png')
const image4 = require('./assets/bowserjr.png')
const image5 = require('./assets/captainfalcon.png')
const image6 = require('./assets/chrom.png')
const image7 = require('./assets/cloud.png')
const image8 = require('./assets/corrin.png')
const image9 = require('./assets/daisy.png')
const image10 = require('./assets/darkpit.png')
const image11 = require('./assets/darksamus.png')
const image12 = require('./assets/dedede.png')
const image13 = require('./assets/diddy.png')
const image14 = require('./assets/dk.png')
const image15 = require('./assets/drmario.png')

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  handleLogin = () => {
    request =  new Request('https://aqueous-fortress-12378.herokuapp.com/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    });

    fetch(request).then(response => {
      if(response.status === 200){
        this.props.navigation.navigate('Main');
      }
      else{
        Alert.alert("Didn't work bro pls.");
      }  
    })
  };

  render() {
    return(
      <View style={styles.container}>
        <Image 
          source = {require('./assets/ssbu_logo.png')}
          style = {styles.logo_pic}
        />

        <TextInput 
          value = {this.state.username}
          onChangeText = {(username) => {this.setState({username})}}
          placeholder = "Username"
          style={{borderColor: 'red', borderWidth: 1}}
        />

        <TextInput 
          value = {this.state.password}
          onChangeText = {(password) => {this.setState({password})}}
          secureTextEntry={true}
          placeholder = "Password"  
          style = {{borderColor: 'red', borderWidth: 1}}        
        />

        <Button 
          title = "Login" 
          onPress = {this.handleLogin}
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
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      address1: '',
      city: '',
      stateResidence: '',
      mains: [],
      setup: [],
    };
  }

  handleRegister = () => {
    request =  new Request('https://aqueous-fortress-12378.herokuapp.com/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
        address1: this.state.address1,
        city: this.state.city,
        state: this.state.stateResidence,
        mains: this.state.mains,
        setup: this.state.setup,
      }),
    });

    fetch(request).then(response => {
      if(response.status === 200){
        this.props.navigation.navigate('Login');
      }
      else{
        Alert.alert("Didn't work bro pls. " + this.state.setup[1]);
      }  
    })
  };

  render() {
      return (
        <ScrollView>
          <TextInput 
            value = {this.state.username}
            onChangeText = {(username) => {this.setState({username})}}
            placeholder = "Username"
            style={{borderColor: 'red', borderWidth: 1}}
          />

          <TextInput 
            value = {this.state.password}
            onChangeText = {(password) => {this.setState({password})}}
            secureTextEntry={true}
            placeholder = "Password"  
            style = {{borderColor: 'red', borderWidth: 1}}        
          />

          <TextInput 
            value = {this.state.address1}
            onChangeText = {(address1) => {this.setState({address1})}}
            placeholder = "Address Line 1" 
            style = {{borderColor: 'red', borderWidth: 1}}         
          />

          <TextInput 
            value = {this.state.city}
            onChangeText = {(city) => {this.setState({city})}}
            placeholder = "City"     
            style = {{borderColor: 'red', borderWidth: 1}}     
          />

          <TextInput 
            value = {this.state.stateResidence}
            onChangeText = {(stateResidence) => {this.setState({stateResidence})}}
            placeholder = "State"        
            style = {{borderColor: 'red', borderWidth: 1}}  
          />  

          <View style = {{flex:1, alignItems: 'center',}}>
            <MainsList
              data = {[{id: 'banjo', source: image1}, {id: 'bayonetta', source: image2},{id: 'bowser',source: image3},
              {id: 'bowserjr', source: image4},{id: 'captainfalcon', source: image5},
              {id: 'chrom', source: image6},{id: 'cloud', source: image7},{id: 'corrin', source: image8},
              {id: 'daisy',source: image9},{id: 'darkpit', source: image10},
              {id: 'darksamus', source: image11},{id: 'dedede', source: image12},{id: 'diddy', source: image13},
              {id: 'dk', source: image14},{id: 'drmario', source: image15}]}
              setMains = {(mains) => {this.setState({mains})}}
            />   
          </View>    

          <View style = {{flex:1, alignItems: 'center',}}>
            <SetupList
              data = {[{id: 'Gamecube Controller Adapter', title: 'Gamecube Controller Adapter'},
              {id: 'Lan Adapter', title:'Lan Adapter'}, {id: '1 GC Controller', title: '1 GC Controller'}]}
              setSetup = {(setup) => {this.setState({setup})}}
            />   
          </View> 

          <Button 
            title = "Register" 
            onPress = {this.handleRegister} 
          />
        </ScrollView>
      );
  }
}

class MainScreen extends React.Component{
    render(){
      return(
        <View style = {{flex: 1}}>
          <View>
            <Button 
              title = 'Quick Search'
            />
          </View>

          <View style={styles.containerMap}> 
            <MapView
              provider={PROVIDER_GOOGLE} 
              style={styles.map}
              region={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
            />
          </View>

          <View style = {styles.navBarContainer}>
            <Button title = 'Main'/>
            <Button title = 'Profile'/>
            <Button title = 'Session Test'/>
            <Button title = 'Logout' />
          </View>

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
  navBarContainer: {
    flexDirection: 'row',
    flex: 1, 
    justifyContent: 'space-between',
    backgroundColor: '#29cff0',
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom: 0,
  },
});
