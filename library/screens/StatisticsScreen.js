import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import StatisticsIcon from '../assets/images/svg/statistics.svg';

export default function StatisticsScreen() {
  return (
    <View style={styles.container}>
      <Header
        title="Статистика"
        HeaderIcon={StatisticsIcon}
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
