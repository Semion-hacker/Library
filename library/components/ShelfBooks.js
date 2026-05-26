import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// ФИКСИРОВАННЫЕ РАЗМЕРЫ КНИГИ КАК УКАЗАНО
const BOOK_WIDTH = 20;
const BOOK_HEIGHT = 50;

// Горизонтальное расстояние между книгами в слоте
const BOOK_SPACING = 10;

export default function ShelfBooks({ slots = [] }) {
  // Вычисляем константы в пикселях один раз
  const slotHeight = height * 0.13; // 13% от высоты экрана (как в ShelfSlots)
  const slotWidth = width * 0.7; // 70% ширины экрана (как в ShelfSlots)
  const slotTopBase = height * 0.25; // 25% от высоты экрана (начало первого слота)
  const slotSpacing = -34.3; // промежуток между слотами (как в ShelfSlots.spacing)
  
  // Отступ слева для центрирования слота в контейнере шириной 100%
  const slotLeftOffset = (width - slotWidth) / 2; // (100% - 70%) / 2 = 15%
  
  // Массив для хранения всех книг с их позициями
  const allBooks = [];
  
  slots.forEach((slot, slotIndex) => {
    const numBooks = slot.books.length;
    if (numBooks === 0) return;
    
    // Верхняя позиция слота
    const slotTop = slotTopBase + slotIndex * (slotHeight + slotSpacing);
    
    // Общая ширина, занимаемая книгами и промежутками между ними
    const totalBooksWidth = numBooks * BOOK_WIDTH + (numBooks - 1) * BOOK_SPACING;
    // Отступ от левого края слота, чтобы блок книг был центрирован внутри слота
    const booksLeftOffset = (slotWidth - totalBooksWidth) / 2;
    
    // Верхняя позиция книги (центрируем по вертикали внутри слота)
    const bookTop = slotTop - 4;
    
    slot.books.forEach((book, bookIndex) => {
      const bookLeft = slotLeftOffset + booksLeftOffset + bookIndex * (BOOK_WIDTH + BOOK_SPACING);
      allBooks.push({
        ...book,
        top: bookTop,
        left: bookLeft,
      });
    });
  });
  
  return (
    <View style={styles.container} pointerEvents="none">
      {allBooks.map((book, index) => (
        <View
          key={'book-' + index} // Используем индекс в массиве allBooks как ключ (уникален)
          style={[
            styles.book,
            { 
              backgroundColor: book.color || '#4ECDC4',
              top: book.top,
              left: book.left,
            }
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height: '100%',
  },
  book: {
    position: 'absolute',
    width: BOOK_WIDTH,
    height: BOOK_HEIGHT,
    borderRadius: 4,
  },
});