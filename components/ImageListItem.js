import React, {PureComponent} from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';

export default class ImageListItem extends PureComponent{
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render(){
    const itemOpacity = this.props.selected ? 1.0 : 0.1;
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View>
          <Image 
            style = {{
              opacity: itemOpacity,
              height: 100,
              width: 100,
              resizeMode: 'contain'
            }} 
            source = {this.props.src} />
        </View>
      </TouchableOpacity>
    );
  }
}
