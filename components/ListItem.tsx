import { Text, View } from 'react-native';

export default function ListItem({ nama, jumlah, satuan }: any) {
  return (
    <View className="flex flex-row justify-between px-6 mb-3">
      <View>
        <Text>{nama}</Text>
      </View>
      <View className="flex flex-row space-x-3">
        <Text>
          {jumlah} {satuan}
        </Text>
      </View>
    </View>
  );
}
