import {
  Animated,
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { slots } from '../data/slots';

const { width } = Dimensions.get('window');

export default function ShelfSlots({ visible, opacity, onClose, onSlotPress }) {
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

      {/* контейнер слотов: клики вне слотов уходят в backdrop */}
      <View style={styles.slotsContainer} pointerEvents="box-none">
        {slots.map((item, index) => (
          <View
            key={item}
            style={[
              styles.slot,
              index !== 0 && styles.spacing,
            ]}
          >
            <Pressable
              style={styles.plusBtn}
              onPress={() => onSlotPress?.(index)}
            >
              <Text style={styles.plus}>+</Text>
            </Pressable>
          </View>
        ))}
      </View>
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
  slotsContainer: {
    position: 'absolute',
    top: '25%',
    width: '100%',
    alignItems: 'center',
  },
  slot: {
    width: '70%',
    height: '13%',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#8fd3ff',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacing: {
    marginTop: 31,
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
