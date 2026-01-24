import Button from '@/components/Button';
import { setRssData } from '@/context/main';
import { useAppDispatch, useAppSelector } from '@/context/store';
import { router } from 'expo-router';
import React, { memo, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

const SignInScreen = () => {
  const dispatch = useAppDispatch();
  const { rssData } = useAppSelector((state) => state.main);
  const { width } = useWindowDimensions();

  const [screenData, setScreenData] = useState<
    { rssName: string; value: string }[]
  >([]);

  useEffect(() => {
    if (rssData) {
      let result: { rssName: string; value: string }[] = [];
      for (let key in rssData) {
        result.push({ rssName: key, value: rssData[key] });
      }
      setScreenData(result);
    }
  }, [rssData]);

  const handleNameChange = (index: number, value: string) => {
    let result = [...screenData];
    result[index] = { ...result[index], rssName: value };
    setScreenData(result);
  };

  const handleValueChange = (index: number, value: string) => {
    let result = [...screenData];
    result[index] = { ...result[index], value };
    setScreenData(result);
  };

  const handleSubmit = () => {
    let result: { [rssName: string]: string } = {};

    screenData.forEach((item) => {
      result[item.rssName] = item.value;
    });

    dispatch(setRssData(result));
    router.navigate('/menu');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={'padding'}>
      <View style={{ flex: 1, paddingVertical: 12 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ width, paddingHorizontal: 32 }}>
            {screenData.map((item, index) => (
              <View
                key={`rss-key-${index}`}
                style={{
                  borderBottomWidth: 1,
                  borderColor:
                    index + 1 === screenData?.length ? '#000' : '#fff',
                  paddingBottom: 16,
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: '#fff', marginBottom: 8 }}>Rss Name</Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#fff',
                    padding: 12,
                    borderRadius: 8,
                  }}
                >
                  <TextInput
                    value={item.rssName}
                    onChangeText={(value) => handleNameChange(index, value)}
                    style={{ color: '#fff' }}
                  />
                </View>
                <Text style={{ color: '#fff', marginVertical: 8 }}>
                  Rss Value
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#fff',
                    padding: 12,
                    borderRadius: 8,
                  }}
                >
                  <TextInput
                    value={item.value}
                    onChangeText={(value) => handleValueChange(index, value)}
                    style={{ color: '#fff' }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 12,
                  }}
                >
                  <View />
                  <Button
                    onPress={() =>
                      setScreenData(
                        [...screenData].filter((_, fIndex) => fIndex !== index),
                      )
                    }
                    title="Delete field"
                  />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 16,
            paddingHorizontal: 32,
          }}
        >
          <Button
            onPress={() =>
              setScreenData([...screenData, { rssName: '', value: '' }])
            }
            title="Add field"
          />
          <Button
            onPress={handleSubmit}
            disabled={
              !screenData?.length ||
              !screenData?.every((item) => !!item.rssName && !!item.value)
            }
            title="Submit"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default memo(SignInScreen);
