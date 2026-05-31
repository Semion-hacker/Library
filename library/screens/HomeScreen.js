import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import ShelfImage from '../components/ShelfImage';
import ShelfSlots from '../components/ShelfSlots';
import ShelfBooks from '../components/ShelfBooks';
import TabBar from '../components/TabBar';
import ReaderScreen from './ReaderScreen';
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
  const [readingBook, setReadingBook] = useState(null);

  const handleTabPress = useCallback((index) => setActiveTab(index), []);

  const getRandomColor = () => BOOK_COLORS[Math.floor(Math.random() * BOOK_COLORS.length)];

  const handleSlotPress = useCallback(async (slotIndex) => {
    const file = await pickBook();
    if (file) {
      console.log('Выбранный файл:', JSON.stringify(file, null, 2));
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
                    uri: file.uri, // Добавляем uri для чтения
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
          uri: book.uri,
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
            uri: book.uri,
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

  // ── Открыть читалку ──
  const openReader = (book) => {
    console.log('Открываем читалку для книги:', JSON.stringify(book, null, 2));
    setReadingBook(book);
  };

  // ── Закрыть читалку ──
  const closeReader = () => {
    console.log('Закрываем читалку');
    setReadingBook(null);
  };

  // ── Выбор контента по активному табу ──
  const renderContent = () => {
    switch (activeTab) {
      case 1:
        return <AllBooksScreen
          books={getBooksList()}
          onToggleFavorite={toggleFavorite}
          onBookPress={openReader}
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
          onBookPress={openReader}
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
      {!readingBook && activeTab === 0 && (
        <Header
          searchVisible={searchVisible}
          onSearchOpen={openSearch}
          searchQuery={query}
          onSearchChange={setQuery}
          onSearchClose={closeSearch}
        />
      )}

      {/* ── Картинка и слоты только на главном экране ── */}
      {!readingBook && activeTab === 0 && (
        <>
          <ShelfImage onPress={open} />
          <ShelfBooks slots={slots} onBookPress={openReader} />
          <ShelfSlots
            visible={visible}
            opacity={opacity}
            onClose={close}
            onSlotPress={handleSlotPress}
            slots={slots}
          />
        </>
      )}

      {/* ── Читалка или контент других разделов ── */}
      {readingBook ? (
        <ReaderScreen book={readingBook} onClose={closeReader} />
      ) : (
        renderContent()
      )}

      {/* ── Нижнее меню ── */}
      {!readingBook && (
        <TabBar activeTab={activeTab} onTabPress={handleTabPress} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});