import React, { View, Component, TouchableOpacity, Text } from 'react';

export default class TextListItem extends Component{
    _onPress = () => {
        this.props.onPressItem(this.props.id);
      };
    
      render() {
        const textColor = this.props.selected ? 'red' : 'black';
        return (
          <TouchableOpacity onPress={this._onPress}>
            <View>
              <Text style={{color: textColor}}>{this.props.title}</Text>
            </View>
          </TouchableOpacity>
        );
      }
  }