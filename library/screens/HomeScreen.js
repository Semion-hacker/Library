import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import ShelfImage from '../components/ShelfImage';
import ShelfSlots from '../components/ShelfSlots';
import ShelfBooks from '../components/ShelfBooks';
import TabBar from '../components/TabBar';
import useEditMode from '../hooks/useEditMode';
import useSearchMode from '../hooks/useSearchMode';
import useBookPicker from '../hooks/useBookPicker';
import { slots as initialSlots, BOOK_COLORS } from '../data/slots';

// ── Импорты экранов разделов ──
import AllBooksScreen from './AllBooksScreen';
import FavoritesScreen from './FavoritesScreen';
import StatisticsScreen from './StatisticsScreen';

export default function HomeScreen() {
  const { visible, open, close, opacity } = useEditMode();
  const { visible: searchVisible, open: openSearch, close: closeSearch, query, setQuery } = useSearchMode();
  const { pickBook } = useBookPicker();
  const [activeTab, setActiveTab] = useState(0);
  const [slots, setSlots] = useState(initialSlots);

  const handleTabPress = useCallback((index) => setActiveTab(index), []);

  const getRandomColor = () => BOOK_COLORS[Math.floor(Math.random() * BOOK_COLORS.length)];

  const handleSlotPress = useCallback(async (slotIndex) => {
    const file = await pickBook();
    if (file) {
      setSlots((prev) =>
        prev.map((slot, i) =>
          i === slotIndex
            ? {
                ...slot,
                books: [
                  ...slot.books,
                  { 
                    fileName: file.name,
                    title: file.title,
                    author: file.author,
                    color: getRandomColor(),
                    favorite: false,
                    id: slotIndex * 8 + slot.books.length + 1, // Unique ID
                  },
                ],
              }
            : slot
        )
      );
      close(); // Закрываем слоты после выбора книги
    }
  }, [pickBook, close]);

  // ── Получить список книг (для AllBooksScreen) ──
  const getBooksList = () => {
    const allBooks = [];
    slots.forEach((slot, slotIndex) => {
      slot.books.forEach((book) => {
        allBooks.push({
          id: book.id,
          title: book.title || `Книга ${book.id}`,
          color: book.color,
          favorite: book.favorite,
        });
      });
    });
    return allBooks;
  };

  // ── Получить список избранных книг (для FavoritesScreen) ──
  const getFavoriteBooksList = () => {
    const favoriteBooks = [];
    slots.forEach((slot) => {
      slot.books.forEach((book) => {
        if (book.favorite) {
          favoriteBooks.push({
            id: book.id,
            title: book.title,
            color: book.color,
          });
        }
      });
    });
    return favoriteBooks;
  };

  // ── Переключить статус избранного для книги ──
  const toggleFavorite = (bookId) => {
    setSlots((prev) =>
      prev.map((slot) => ({
        ...slot,
        books: slot.books.map((book) =>
          book.id === bookId
            ? { ...book, favorite: !book.favorite }
            : book
        ),
      }))
    );
  };

  // ── Выбор контента по активному табу ──
  const renderContent = () => {
    switch (activeTab) {
      case 1:
        return <AllBooksScreen
          books={getBooksList()}
          onToggleFavorite={toggleFavorite}
          searchVisible={searchVisible}
          onSearchOpen={openSearch}
          searchQuery={query}
          onSearchChange={setQuery}
          onSearchClose={closeSearch}
        />;
      case 2:
        return <FavoritesScreen 
          books={getFavoriteBooksList()}
          onToggleFavorite={toggleFavorite}
        />;
      case 3:
        return <StatisticsScreen />;
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
          <ShelfBooks slots={slots} />
          <ShelfSlots
            visible={visible}
            opacity={opacity}
            onClose={close}
            onSlotPress={handleSlotPress}
            slots={slots}
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