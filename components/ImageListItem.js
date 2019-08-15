import React, { Component, TouchableOpacity, Image } from 'react';

class ListItem extends Component{
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render(){
    const itemOpacity = this.props.selected ? 100 : 50;
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View>
          <Image 
            style = {{opacity = itemOpacity}} 
            source = {this.props.src} />
        </View>
      </TouchableOpacity>
    );
  }
}
