import Button from '@/components/Button';
import { router } from 'expo-router';
import React, { memo } from 'react';
import { View } from 'react-native';

const MenuScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
      }}
    >
      <Button
        onPress={() => router.navigate('/random')}
        title="Pick random from shelf"
        style={{ width: '100%' }}
      />
      <Button
        onPress={() => router.navigate('/backups')}
        title="Import data"
        style={{ width: '100%', marginVertical: 16 }}
      />
      <Button
        onPress={() => router.navigate('/sign-in')}
        title="Add lists"
        style={{ width: '100%' }}
      />
    </View>
  );
};

export default memo(MenuScreen);
