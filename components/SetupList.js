import React, {PureComponent} from 'react';
import { FlatList, StyleSheet } from 'react-native';
import SetupItemList from './SetupItemList';

export default class SetupList extends PureComponent {
  state = {
    selected: (new Map()),  //MAP<STRING, BOOLEAN>
    selectedArr: [], //String arr
  }; 

  _keyExtractor = (item, index) => item.id;

  _onPressItem = (id) => {
    this.setState((state) => {
      const selected = new Map(state.selected);
      const selectedArr = state.selectedArr;
      selected.set(id, !selected.get(id));
      
      const isSelected = selected.get(id);
      if (isSelected){
        selectedArr.push(id);
      }else{
        var index = selectedArr.indexOf(id);
        selectedArr.splice(index, 1);
      }
      this.props.setSetup(selectedArr);
      return {selected, selectedArr};
    });
  };

  _renderItem = ({item}) => (
    <SetupItemList
      id={item.id}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.id)}
      title={item.title}
    />
  );

  render() {
    return (
        <FlatList
          contentContainerStyle = {styles.list}
          style = {{flex: 1}}
          data={this.props.data}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
    );
  }
}

const styles = StyleSheet.create({
  list: {
    alignItems: 'center',
  }
});

