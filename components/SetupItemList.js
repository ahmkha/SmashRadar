import React, {PureComponent} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';

export default class SetupItemList extends PureComponent{
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render(){
    const borderCol = this.props.selected ? 'red' : 'black';
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View>
          <Text style={{borderColor: borderCol, borderWidth: 1, marginBottom: 20}}>{this.props.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

