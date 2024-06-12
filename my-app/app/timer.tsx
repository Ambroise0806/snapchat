import React, { useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { View, Text } from 'react-native';

const Dropdown = () => {
    const [selectedValue, setSelectedValue] = useState(null);  const placeholder = {
      label: 'Selectionner votre temps',
      value: null,
    };  const options = [
      { label: '1 sec', value: '1' },
      { label: '2 sec', value: '2' },
      { label: '3 sec', value: '3' },
      { label: '4 sec', value: '4' },
      { label: '5 sec', value: '5' },
      { label: '6 sec', value: '6' },
      { label: '7 sec', value: '7' },
      { label: '8 sec', value: '8' },
      { label: '9 sec', value: '9' },
      { label: '10 sec', value: '10' },


    ];  return (
      <View>
        <RNPickerSelect
          placeholder={placeholder}
          items={options}
          onValueChange={(value) => setSelectedValue(value)}
          value={selectedValue}
        />
        {selectedValue && <Text>Selected: {selectedValue}</Text>}
      </View>
    );
  };
export default Dropdown;