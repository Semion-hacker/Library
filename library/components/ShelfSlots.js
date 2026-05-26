import {
  Animated,
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ShelfSlots({ visible, opacity, onClose, onSlotPress, slots }) {
  // Slot dimensions as in original style
  const slotWidth = width * 0.7; // 70% of width
  const slotHeight = height * 0.060; // 13% of height
  const slotSpacing = 24.5; // pixels between slots (as in original styles.spacing.marginTop)
  const slotTopBase = height * 0.245; // 25% of height (as in original slotsContainer.top)
  
  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity,
          pointerEvents: visible ? 'auto' : 'none',
        },
      ]}
    >
      {/* фон для закрытия (прозрачный) */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* контейнер слотов - используем абсолютное позиционирование для каждого слота */}
      {slots?.map((slot, slotIndex) => {
        const isFilled = slot.books && slot.books.length >= 8;
        
        // Если слот заполнен 8 книгами, не рендерим его вообще
        if (isFilled) {
          return null;
        }
        
        // Вычисляем позицию слота
        const slotTop = slotTopBase + slotIndex * (slotHeight + slotSpacing);
        const slotLeft = (width - slotWidth) / 2; // центрируем по горизонтали
        
        return (
          <View
            key={`slot-${slot.id}`}
            style={[
              styles.slot,
              {
                position: 'absolute',
                top: slotTop,
                left: slotLeft,
                width: slotWidth,
                height: slotHeight,
              }
            ]}
          >
            <Pressable
              style={styles.plusBtn}
              onPress={() => onSlotPress?.(slotIndex)}
            >
              <Text style={styles.plus}>+</Text>
            </Pressable>
          </View>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height: '100%',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  slot: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#8fd3ff',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusBtn: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plus: {
    fontSize: 32,
    color: '#8fd3ff',
  },
});
