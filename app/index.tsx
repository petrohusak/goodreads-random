import { useAppSelector } from '@/context/store';
import { router } from 'expo-router';
import React, { memo, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

const InitialScreen = () => {
  const { rssData } = useAppSelector((state) => state.main);

  useEffect(() => {
    if (rssData) {
      router.replace('/menu');
    } else {
      router.replace('/sign-in');
    }
  }, [rssData]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size={'large'} color={'#fff'} />
    </View>
  );
};

export default memo(InitialScreen);
