import React, { Component } from 'react';
import ImageListItem from './components/ImageListItem';
import { FlatList } from 'react-native';

var data = [{source: image1}, {source: image2},{source: image3},{source: image4},{source: image5},
  {source: image6},{source: image7},{source: image8},{source: image9},{source: image10},
  {source: image11},{source: image12},{source: image13},{source: image14},{source: image15}]

export default class MultiList extends Component {
  state = {selected: (new Map())}; //MAP<STRING, BOOLEAN>

  _keyExtractor = (item, index) => item.id;

  _onPressItem = (id) => {
    this.setState((state) => {
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id));
      return {selected};
    });
  };

  _renderItem = ({item}) => (
    <ImageListItem
      id={item.id}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.id)}
      src={item.source}
    />
  );

  render() {
    return (
      <FlatList
        data={this.props.data}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}
