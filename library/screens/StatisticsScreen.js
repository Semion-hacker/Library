import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import Header from '../components/Header';
import StatisticsIcon from '../assets/images/svg/statistics.svg';

export default function StatisticsScreen({ slots = [], readingProgress = {}, totalPages = {} }) {
  // Get all books with their progress data
  const booksWithProgress = useMemo(() => {
    const allBooks = [];
    slots.forEach((slot) => {
      slot.books.forEach((book) => {
        allBooks.push({
          id: book.id,
          title: book.title || `Книга ${book.id}`,
          color: book.color,
          currentPage: readingProgress[book.id] || 0,
          totalPages: totalPages[book.id] || 0,
        });
      });
    });
    return allBooks;
  }, [slots, readingProgress, totalPages]);

  // Calculate total statistics
  const totalBooks = booksWithProgress.length;
  const totalReadPages = booksWithProgress.reduce((sum, book) => sum + (book.currentPage || 0), 0);
  const totalPagesCount = booksWithProgress.reduce((sum, book) => sum + (book.totalPages || 0), 0);
  const averageProgress = totalPagesCount > 0 ? Math.round((totalReadPages / totalPagesCount) * 100) : 0;

  const renderBookItem = ({ item }) => {
    const progressPercent = item.totalPages > 0 ? Math.round(((item.currentPage + 1) / item.totalPages) * 100) : 0;
    const progressWidth = Math.min(progressPercent, 100);
    
    return (
      <View style={styles.bookItem}>
        <View style={styles.bookHeader}>
          <View style={[styles.bookColorBox, { backgroundColor: item.color || '#4ECDC4' }]} />
          <Text style={styles.bookTitle} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${progressWidth}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {item.totalPages > 0 ? `${item.currentPage + 1}/${item.totalPages}` : 'Не открыто'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Статистика"
        HeaderIcon={StatisticsIcon}
        showSearch={false}
      />
      
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Общая статистика</Text>
        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalBooks}</Text>
            <Text style={styles.statLabel}>Книг</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalReadPages}</Text>
            <Text style={styles.statLabel}>Прочитано страниц</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{averageProgress}%</Text>
            <Text style={styles.statLabel}>Прогресс</Text>
          </View>
        </View>
      </View>
      
      <FlatList
        data={booksWithProgress}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBookItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Нет книг для отображения статистики</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#94664E',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#ddd',
  },
  list: {
    padding: 16,
  },
  bookItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookColorBox: {
    width: 30,
    height: 40,
    borderRadius: 4,
    marginRight: 10,
  },
  bookTitle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#94664E',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    minWidth: 50,
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 16,
  },
});