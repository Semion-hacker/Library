import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import HomeScreen from './screens/HomeScreen';

export default function App() {
  useEffect(() => {
    const hideHomeIndicator = async () => {
      if (Platform.OS === 'ios') {
        await ScreenOrientation.setPrefersHomeIndicatorAutoHiddenAsync(true);
      }
    };
    hideHomeIndicator();

    return () => {
      ScreenOrientation.setPrefersHomeIndicatorAutoHiddenAsync(false);
    };
  }, []);

  return <HomeScreen />;
}