import React, { memo } from 'react';
import { Text, TouchableOpacity, ViewStyle } from 'react-native';

const Button = ({
  onPress,
  disabled = false,
  title,
  style,
}: {
  onPress: () => void;
  disabled?: boolean;
  title: string;
  style?: ViewStyle;
}) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: !disabled ? 1 : 0.5,
        ...style,
      }}
      onPress={onPress}
      disabled={disabled}
    >
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

export default memo(Button);
