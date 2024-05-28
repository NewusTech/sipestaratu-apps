import { Text, View } from 'react-native';
import ListItem from '../../../components/ListItem';
import { useEffect, useState } from 'react';
import api from '../../../constants/api';
import { useSession } from '../../../components/ctx';
import * as SecureStore from 'expo-secure-store';
import { ScrollView } from 'react-native-gesture-handler';

export default function TabTwoScreen() {
  const { session } = useSession();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const formData = new FormData();
    SecureStore.getItemAsync('id').then((id) => {
      formData.append('id', id as string);
      fetch(`${api}/history_logbook`, {
        method: 'POST',
        headers: {
          Authorization: session, // Assuming Bearer token, adjust if different
        },
        body: formData,
      })
        .then((response) => {
          setLoading(false);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          const groupedById = data.data.reduce((acc: any, item: any) => {
            // Check if the group with this id already exists
            let group = acc.find((g: any) => g.id === item.id);
            if (!group) {
              // If not, create a new group
              group = { id: item.id, judul: item.judul, data: [] };
              acc.push(group);
            }

            // Add the current item to the group's data array
            group.data.push(item);

            return acc;
          }, []);

          setData(groupedById);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    });
    // formData.append('id_user', id as string);
  }, []);

  return (
    <View style={{ flex: 1 }} className="bg-white">
      <ScrollView>
        {loading ? (
          <View className="mt-2">
            <Text className="text-lg pt-2 text-center">Loading</Text>
          </View>
        ) : (
          data.map((v) => {

            return (
              <View key={v.id} >
                <View className="mt-2">
                  <Text className="text-lg pt-2 text-center">{v.judul}</Text>
                  <Text className="text-lg text-center">{v.tanggal}</Text>
                  {v.data.map((v, i: number) => (
                    <ListItem
                      key={i}
                      nama={v.logbook_group}
                      jumlah={v.jumlah}
                      satuan={v.satuan_berat}
                    />
                  ))}
                </View>
                <View className="bg-gray-200 h-2 mt-3" />
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
