import { Image, Dimensions, Pressable, View } from 'react-native';

const size = Dimensions.get('window').width;

export default function ShelfImage({ onPress }) {
  return (
    <Pressable onPress={onPress}>
      <View style={{ marginTop: '20%' }}>
        <Image
          source={require('../assets/images/shelves.jpg')}
          style={{
            width: size,
            height: size,
          }}
          resizeMode="cover"
        />
      </View>
    </Pressable>
  );
}