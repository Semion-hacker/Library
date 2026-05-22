import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import UserIcon from '../assets/images/svg/user.svg';

export default function UserScreen() {
  return (
    <View style={styles.container}>
      <Header
        title="Профиль"
        HeaderIcon={UserIcon}
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