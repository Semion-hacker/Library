import { View, StyleSheet, FlatList, Text, TouchableOpacity, Image, Pressable } from 'react-native';
import Header from '../components/Header';
import FavoritesIcon from '../assets/images/svg/favorites.svg';

export default function FavoritesScreen({ books = [], onToggleFavorite, onBookPress }) {
  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Pressable 
        style={styles.bookContent}
        onPress={() => onBookPress?.(item)}
      >
        <View style={[styles.bookColorBox, { backgroundColor: item.color || '#4ECDC4' }]} />
        <View style={styles.titleContainer}>
          <Text style={styles.bookTitle} numberOfLines={1}>
            {item.title || 'Первая книга'}
          </Text>
        </View>
      </Pressable>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => onToggleFavorite(item.id)}
        style={styles.favoriteButton}
      >
        <Image
          source={require('../assets/images/redHeart.png')}
          style={styles.favoriteImage}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Избранное"
        HeaderIcon={FavoritesIcon}
        showSearch={false}
      />
      
      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBookItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>Список избранных книг пуст</Text>}
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
});