import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Keyboard, Image } from 'react-native';
import Loupe from '../assets/images/svg/loupe.svg';

// ── Режимы Header ──
// 1. myLibrary (HomeScreen)  —showSearch=true, searchProps передаются, иконка приложения
// 2. allBooks                —showSearch=true,  иконка allBooks,
// 3. favorites/statistics/user—showSearch=false, иконка раздела, лупа скрыта

export default function Header({
  // ── Режим 1 (myLibrary) ──
  searchVisible, onSearchOpen, searchQuery, onSearchChange, onSearchClose,
  // ── Режим 2 (остальные разделы) ──
  title, HeaderIcon, showSearch = true,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchVisible) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [searchVisible]);

  const handleClose = () => {
    Keyboard.dismiss();
    onSearchClose?.();
  };

  // ── Упрощённый режим (favorites, statistics, user) — showSearch=false ──
  if (!showSearch) {
    return (
      <View style={styles.header}>
        {/* ИКОНКА РАЗДЕЛА */}
        <View style={styles.iconWrapper}>
          <HeaderIcon width={28} height={28} color="#191A1B" />
        </View>
        {/* ЗАГОЛОВОК */}
        <Text style={styles.title}>{title || 'Моя библиотека'}</Text>
      </View>
    );
  }

  // ── Режим allBooks —showSearch=true, но без поля поиска по умолчанию ──
  if (showSearch && !searchVisible && HeaderIcon) {
    return (
      <View style={styles.header}>
        {/* ИКОНКА РАЗДЕЛА вместо иконки приложения */}
        <View style={styles.iconWrapper}>
          <HeaderIcon width={28} height={28} color="#191A1B" />
        </View>
        {/* ЗАГОЛОВОК */}
        <Text style={styles.title}>{title || 'Моя библиотека'}</Text>
        {/* ЛУПА справа */}
        <View style={styles.loupeWrapper}>
          <Loupe width={22} height={22} onPress={onSearchOpen} />
        </View>
      </View>
    );
  }

  // ── Полный режим (myLibrary — поиск открыт) ──
  return (
    <View style={styles.header}>
      <View style={styles.iconWrapper} pointerEvents="none">
        <Image
          source={require('../assets/images/icon.png')}
          style={[styles.icon, searchVisible && styles.hidden]}
        />
      </View>

      <Text style={[styles.title, searchVisible && styles.hidden]}>Моя библиотека</Text>

      {!searchVisible && (
        <View style={styles.loupeWrapper} pointerEvents="box-none">
          <Loupe width={22} height={22} onPress={onSearchOpen} />
        </View>
      )}

      {searchVisible && (
        <View style={styles.searchOverlay}>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="Поиск..."
            placeholderTextColor="#999"
            returnKeyType="search"
            onSubmitEditing={handleClose}
          />
          <Text style={styles.cancelBtn} onPress={handleClose}>Отменить</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 60,
    paddingHorizontal: 25,
    paddingVertical: 12,
    backgroundColor: '#cecece',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 80,
    position: 'relative',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  icon: {
    width: 56,
    height: 56,
  },
  iconWrapper: {
    position: 'absolute',
    left: 25,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  loupeWrapper: {
    position: 'absolute',
    right: 25,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  hidden: {
    opacity: 0,
  },
  searchOverlay: {
    position: 'absolute',
    left: 25,
    right: 25,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#000',
  },
  cancelBtn: {
    marginLeft: 12,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});