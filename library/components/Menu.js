import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import AllBooksIcon from '../assets/images/svg/allBooks.svg';
import FavoritesIcon from '../assets/images/svg/favorites.svg';
import StatisticsIcon from '../assets/images/svg/statistics.svg';

export default function Menu({ visible, onClose, onNavigate, onDeleteMode, onDeleteModeActive }) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => { onDeleteMode(); onClose(); }}
        >
          <Image source={require('../assets/images/bin.png')} style={styles.menuIcon} />
          <Text style={styles.menuText}>Удалить</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => { onNavigate(1); onClose(); }}
        >
          <AllBooksIcon width={24} height={24} color="#191A1B" style={styles.menuIcon} />
          <Text style={styles.menuText}>Все книги</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => { onNavigate(2); onClose(); }}
        >
          <FavoritesIcon width={24} height={24} color="#191A1B" style={styles.menuIcon} />
          <Text style={styles.menuText}>Избранное</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => { onNavigate(3); onClose(); }}
        >
          <StatisticsIcon width={24} height={24} color="#191A1B" style={styles.menuIcon} />
          <Text style={styles.menuText}>Статистика</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  menuContainer: {
    position: 'absolute',
    top: 120,
    right: 25,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 180,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});