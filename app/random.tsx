import Button from '@/components/Button';
import { useAppSelector } from '@/context/store';
import useBooksLoader from '@/hooks/useBooksLoader';
import { router } from 'expo-router';
import React, { memo, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

export type BookItem = {
  title: string;
  author: string;
  image: string;
  link: string;
  id: string;
};

const RandomScreen = () => {
  const { width } = useWindowDimensions();
  const { loadBooksForShelf } = useBooksLoader();

  const { rssData } = useAppSelector((state) => state.main);

  const [selectedList, setSelectedList] = useState('');
  const [numberToDisplay, setNumberToDisplay] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [randomResult, setRandomResult] = useState<BookItem[]>([]);
  const [allPages, setAllPages] = useState<BookItem[]>([]);

  const arrayRssData = useMemo(() => {
    if (rssData) {
      let result: { rssName: string; value: string }[] = [];
      for (let key in rssData) {
        result.push({ rssName: key, value: rssData[key] });
      }
      return result;
    }
    return [];
  }, [rssData]);

  const handleRandomizePress = async () => {
    setIsLoading(true);

    const pages = !!allPages?.length
      ? allPages
      : await loadBooksForShelf(selectedList);

    if (!allPages?.length) setAllPages(pages);

    let randomIndexes: number[] = [];

    for (let i = 0; i < +numberToDisplay; i++) {
      const index = Math.floor(Math.random() * pages.length);
      randomIndexes.push(index);
    }

    setRandomResult(
      pages.filter((_: any, index: number) =>
        randomIndexes.some((sItem) => sItem === index),
      ),
    );
    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View style={{ borderBottomWidth: 1, borderColor: '#fff' }}>
        <TouchableOpacity
          onPress={router.back}
          style={{ padding: 12, paddingLeft: 32 }}
        >
          <Text style={{ color: '#fff', fontSize: 20 }}>Back</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <ActivityIndicator size={'large'} color={'#fff'} />
        </View>
      ) : !!randomResult?.length ? (
        <>
          <View style={{ flex: 1, paddingHorizontal: 32, paddingTop: 16 }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: '500',
                marginBottom: 12,
              }}
            >
              Results:
            </Text>
            <ScrollView>
              <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                {randomResult.map((item, index) => (
                  <TouchableOpacity
                    key={`random-book-${item.id}`}
                    onPress={() => Linking.openURL(item.link)}
                    onLongPress={() => {}}
                    style={{
                      width: (width - 70) / 2,
                      marginRight: index % 2 === 0 ? 6 : 0,
                      alignItems: 'center',
                      marginBottom: 6,
                    }}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={{
                        width: (width - 70) / 2,
                        height: ((width - 70) / 2) * 1.55,
                      }}
                    />
                    <Text
                      style={{
                        color: '#fff',
                        fontWeight: '500',
                        textAlign: 'center',
                        fontSize: 16,
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text style={{ color: '#fff', textAlign: 'center' }}>
                      {item.author}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
          <View
            style={{
              paddingVertical: 12,
              paddingHorizontal: 32,
              borderTopWidth: 1,
              borderColor: '#fff',
            }}
          >
            <Button onPress={handleRandomizePress} title="Try again" />
          </View>
        </>
      ) : (
        <TouchableOpacity
          style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 32 }}
          activeOpacity={1}
          onPress={Keyboard.dismiss}
        >
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ color: '#fff' }}>Pick shelf:</Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#fff',
                  borderRadius: 8,
                  overflow: 'hidden',
                  maxHeight: 120,
                  width: width / 2,
                }}
              >
                <ScrollView>
                  {arrayRssData.map((item, index) => (
                    <TouchableOpacity
                      key={`rss-shelf-${item.rssName}`}
                      onPress={() => setSelectedList(item.rssName)}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderBottomWidth: 1,
                        borderColor:
                          index + 1 === arrayRssData?.length ? '#000' : '#fff',
                        backgroundColor:
                          selectedList === item.rssName ? '#fff' : '#000',
                      }}
                    >
                      <Text
                        style={{
                          color:
                            selectedList === item.rssName ? '#000' : '#fff',
                        }}
                      >
                        {item.rssName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 16,
              }}
            >
              <Text style={{ color: '#fff' }}>Items to display:</Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#fff',
                  padding: 12,
                  borderRadius: 8,
                  width: width / 2,
                }}
              >
                <TextInput
                  value={numberToDisplay}
                  onChangeText={setNumberToDisplay}
                  style={{ color: '#fff' }}
                  keyboardType={'number-pad'}
                />
              </View>
            </View>
          </View>
          <Button
            onPress={handleRandomizePress}
            title="Randomize"
            style={{ marginTop: 32 }}
            disabled={!selectedList || !numberToDisplay}
          />
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
};

export default memo(RandomScreen);
