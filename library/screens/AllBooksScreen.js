import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Image, Pressable } from 'react-native';
import Header from '../components/Header';
import AllBooksIcon from '../assets/images/svg/allBooks.svg';

export default function AllBooksScreen({
  searchVisible, onSearchOpen, searchQuery, onSearchChange, onSearchClose, books = [],
  onToggleFavorite, onBookPress, deleteMode, onDeleteBook
}) {
  // Фильтруем книги по поисковому запросу
  const filteredBooks = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      return books;
    }
    const query = searchQuery.toLowerCase().trim();
    return books.filter(book => 
      book.title && book.title.toLowerCase().includes(query)
    );
  }, [books, searchQuery]);

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Pressable 
        style={styles.bookContent}
        onPress={() => onBookPress?.(item)}
      >
        <View style={[styles.bookColorBox, { backgroundColor: item.color || '#4ECDC4' }]} />
        <View style={styles.titleContainer}>
          <Text style={styles.bookTitle} numberOfLines={1}>
            {item.title || 'Книга'}
          </Text>
        </View>
      </Pressable>
      
      {deleteMode ? (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => onDeleteBook?.(item.id)}
          style={styles.deleteButton}
        >
          <Image
            source={require('../assets/images/bin.png')}
            style={styles.deleteIcon}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => onToggleFavorite(item.id)}
          style={styles.favoriteButton}
        >
          <Image
            source={item.favorite 
              ? require('../assets/images/redHeart.png') 
              : require('../assets/images/heart.png')}
            style={styles.favoriteImage}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Все книги"
        HeaderIcon={AllBooksIcon}
        showSearch={true}
        searchVisible={searchVisible}
        onSearchOpen={onSearchOpen}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onSearchClose={onSearchClose}
      />
      
      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBookItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>Книги не найдены</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 16,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bookContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookColorBox: {
    width: 40,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 16,
  },
  favoriteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteImage: {
    width: 24,
    height: 24,
  },
  deleteButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    width: 20,
    height: 20,
  },
});