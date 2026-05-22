import { useState, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Header from '../components/Header';
import ShelfImage from '../components/ShelfImage';
import ShelfSlots from '../components/ShelfSlots';
import TabBar from '../components/TabBar';
import useEditMode from '../hooks/useEditMode';
import useSearchMode from '../hooks/useSearchMode';
import useBookPicker from '../hooks/useBookPicker';
import { slots as initialSlots } from '../data/slots';

// ── Импорты экранов разделов ──
import AllBooksScreen from './AllBooksScreen';
import FavoritesScreen from './FavoritesScreen';
import StatisticsScreen from './StatisticsScreen';
import UserScreen from './UserScreen';

export default function HomeScreen() {
  const { visible, open, close, opacity } = useEditMode();
  const { visible: searchVisible, open: openSearch, close: closeSearch, query, setQuery } = useSearchMode();
  const { pickBook } = useBookPicker();
  const [activeTab, setActiveTab] = useState(0);
  const [slots, setSlots] = useState(initialSlots);

  const handleTabPress = useCallback((index) => setActiveTab(index), []);

  const handleSlotPress = useCallback(async (slotIndex) => {
    const file = await pickBook();
    if (file) {
      setSlots((prev) =>
        prev.map((slot, i) =>
          i === slotIndex ? { ...slot, fileName: file.name } : slot
        )
      );
    }
  }, [pickBook]);

  // ── Выбор контента по активному табу ──
  const renderContent = () => {
    switch (activeTab) {
      case 1:
         return <AllBooksScreen
           searchVisible={searchVisible}
           onSearchOpen={openSearch}
           searchQuery={query}
           onSearchChange={setQuery}
           onSearchClose={closeSearch}
         />;
      case 2:
        return <FavoritesScreen />;
      case 3:
        return <StatisticsScreen />;
      case 4:
        return <UserScreen />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* ── Шапка — только для главного экрана (tab 0) ── */}
      {activeTab === 0 && (
        <Header
          searchVisible={searchVisible}
          onSearchOpen={openSearch}
          searchQuery={query}
          onSearchChange={setQuery}
          onSearchClose={closeSearch}
        />
      )}

      {/* ── Картинка и слоты только на главном экране ── */}
      {activeTab === 0 && (
        <>
          <ShelfImage onPress={open} />
          <ShelfSlots
            visible={visible}
            opacity={opacity}
            onClose={close}
            onSlotPress={handleSlotPress}
          />
        </>
      )}

      {/* ── Контент других разделов ── */}
      {renderContent()}

      {/* ── Нижнее меню ── */}
      <TabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});