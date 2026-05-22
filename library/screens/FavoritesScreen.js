import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import FavoritesIcon from '../assets/images/svg/favorites.svg';

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <Header
        title="Избранное"
        HeaderIcon={FavoritesIcon}
        showSearch={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
