import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSession } from '../../../components/ctx';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../../../constants/api';

export default function Page() {
  const { session, signOut } = useSession();
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({ subjek: '', kabupaten: '', kecamatan: '', kelurahan: '' })


  useEffect(() => {
    setLoading(true);
    const formData = new FormData();
    SecureStore.getItemAsync('id').then((id) => {
      formData.append('id', id as string);
      fetch(`${api}/profile_item`, {
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
        .then((res) => {
          const data = res.data.head[0]
          setData({
            subjek: data.nama_subjek,
            kabupaten: data.kabupaten_kota,
            kecamatan: data.kecamatan,
            kelurahan: data.kelurahan
          })
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
      {loading ? (
        <View className="mt-2">
          <Text className="text-lg pt-2 text-center">Loading</Text>
        </View>
      ) : (

        <View className="mt-2">
          <Text className="text-lg pt-2 text-center">
            Identitas Lokasi dan Subjek
          </Text>
          <View className="px-6 pt-4 space-y-3">
            <Text>Subjek: {data.subjek}</Text>
            <Text>Kabupaten:  {data.kabupaten}</Text>
            <Text>Kecamatan: {data.kecamatan}</Text>
            <Text>Kelurahan: {data.kelurahan}</Text>
          </View>
          <View className="bg-gray-200 h-2 mt-3" />
          <TouchableOpacity
            onPress={() => {
              signOut();
              router.replace('/sign-in');
            }}
            className="bg-red-600 mx-6 p-3 rounded-lg mt-6"
          >
            <Text className="text-center text-white">Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
