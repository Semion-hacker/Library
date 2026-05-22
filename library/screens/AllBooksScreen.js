import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import AllBooksIcon from '../assets/images/svg/allBooks.svg';

export default function AllBooksScreen({
  searchVisible, onSearchOpen, searchQuery, onSearchChange, onSearchClose,
}) {
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
