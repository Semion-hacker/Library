import React from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ShelfBooks({ slots = [], onBookPress, deleteMode, onDeleteBook }) {
  // ФИКСИРОВАННЫЕ РАЗМЕРЫ КНИГИ КАК УКАЗАНО
  const BOOK_WIDTH = 20;
  const BOOK_HEIGHT = 50;

  // Горизонтальное расстояние между книгами в слоте
  const BOOK_SPACING = 10;

  // ── Вычисляем константы в пикселях один раз ──
  const slotHeight = height * 0.13; // 13% от высоты экрана (как в ShelfSlots)
  const slotWidth = width * 0.7; // 70% ширины экрана (как в ShelfSlots)
  const slotTopBase = height * 0.25; // 25% от высоты экрана (начало первого слота)
  const slotSlotSpacing = -34.3; // промежуток между слотами (как в ShelfSlots.spacing)
  
  // ── Отступ слева для центрирования слота в контейнере шириной 100% ──
  const slotLeftOffset = (width - slotWidth) / 2; // (100% - 70%) / 2 = 15%
  
  // ── Массив для хранения всех книг с их позициями ──
  const allBooks = [];
  
  slots.forEach((slot, slotIndex) => {
    const numBooks = slot.books.length;
    if (numBooks === 0) return;
    
    // ── Верхняя позиция слота ──
    const slotTop = slotTopBase + slotIndex * (slotHeight + slotSlotSpacing);
    
    // ── Общая ширина, занимаемая книгами и промежутками между ними ──
    const totalBooksWidth = numBooks * BOOK_WIDTH + (numBooks - 1) * BOOK_SPACING;
    // ── Отступ от левого края слота, чтобы блок книг был центрирован внутри слота ──
    const booksLeftOffset = (slotWidth - totalBooksWidth) / 2;
    
    // ── Верхняя позиция книги (центрируем по вертикали внутри слота) ──
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
    <View style={styles.container}>
      {allBooks.map((bookItem, index) => (
        <View key={'book-' + index} style={[styles.bookWrapper, { top: bookItem.top, left: bookItem.left }]}>
          <Pressable
            style={[
              styles.book,
              { backgroundColor: bookItem.color || '#4ECDC4' },
            ]}
            onPress={() => onBookPress?.(bookItem)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.bookInner} />
          </Pressable>
          
          {deleteMode && (
            <Pressable
              style={styles.deleteBtn}
              onPress={() => onDeleteBook?.(bookItem.id)}
            >
              <View style={styles.deleteIcon} />
            </Pressable>
          )}
        </View>
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
  bookWrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  book: {
    width: 20,
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookInner: {
    width: '100%',
    height: '100%',
  },
  deleteBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  deleteIcon: {
    width: 12,
    height: 12,
    backgroundColor: '#ff6b6b',
    borderRadius: 2,
  },
});