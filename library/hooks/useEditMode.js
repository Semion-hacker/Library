import { useState, useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

export default function useEditMode() {
  const [visible, setVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  const open = () => setVisible(true);
  const close = () => setVisible(false);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 120,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return { visible, open, close, opacity };
}