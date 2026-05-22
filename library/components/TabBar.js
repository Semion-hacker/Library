import { useRef, useEffect } from 'react';
import { View, StyleSheet, Pressable, Dimensions, Animated } from 'react-native';
import MyLibraryIcon from '../assets/images/svg/myLibrary.svg';
import AllBooksIcon from '../assets/images/svg/allBooks.svg';
import FavoritesIcon from '../assets/images/svg/favorites.svg';
import StatisticsIcon from '../assets/images/svg/statistics.svg';
// import UserIcon from '../assets/images/svg/user.svg'; // УДАЛЕНО

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_COUNT = 4; // ИЗМЕНЕНО с 5 на 4
const TAB_WIDTH = SCREEN_WIDTH / TAB_COUNT;

const ICONS = [
  { name: 'myLibrary', Icon: MyLibraryIcon },
  { name: 'allBooks', Icon: AllBooksIcon },
  { name: 'favorites', Icon: FavoritesIcon },
  { name: 'statistics', Icon: StatisticsIcon },
  // { name: 'user', Icon: UserIcon }, // УДАЛЕНО
];

const inactiveColor = '#E8E8E8';
const activeColor = '#191A1B';

export default function TabBar({ activeTab, onTabPress }) {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: activeTab * TAB_WIDTH,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [activeTab, TAB_WIDTH]);

  return (
    <View style={styles.container}>
      {/* ── Белая плашка под активной иконкой ── */}
      <Animated.View
        style={[
          styles.indicator,
          {
            width: TAB_WIDTH,
            transform: [{ translateX }],
            borderRadius: 24,
          },
        ]}
      />

      {/* ── Иконки ── */}
      {ICONS.map(({ name, Icon }, index) => (
        <Pressable
          key={name}
          style={styles.tab}
          onPress={() => onTabPress(index)}
          hitSlop={{ top: 10, bottom: 10, left: 4, right: 4 }}
        >
          <Icon
            width={26}
            height={26}
            color={activeTab === index ? activeColor : inactiveColor}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: 'rgba(20,20,20,0.75)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 14,
    paddingBottom: 50,
    zIndex: 2,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    bottom: 36,
    backgroundColor: '#94664E',
  },
});