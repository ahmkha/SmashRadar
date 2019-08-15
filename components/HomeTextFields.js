import React, { Component } from 'react';
import { TextInput } from 'react-native';

export default class HomeTextFields extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
      />
    );
  }
}