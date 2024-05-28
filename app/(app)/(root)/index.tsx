import { Image, Text, View } from 'react-native';
import { useSession } from '../../../components/ctx';
import { Redirect, Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import api from '../../../constants/api';

const TheComponent = ({ session }: { session: string }) => {
  const [nama, setNama] = useState('loading');
  const [dataSampah, setDataSampah] = useState({ harian: 0, bulanan: 0 })

  useEffect(() => {
    SecureStore.getItemAsync('nama').then((v) => setNama(v));
    SecureStore.getItemAsync('id').then((v) => {
      const formData = new FormData()
      formData.append('id', v as string)
      // Define your endpoint URLs and any associated data
      const endpoints = [
        `${api}/harian_sampah`,
        `${api}/bulanan_sampah`,
      ];

      // Create an array of fetch promises with POST method
      const fetchPromises = endpoints.map(endpoint =>
        fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': session
          },
          body: formData
        })
      );

      // Use Promise.all to handle all fetch promises
      Promise.all(fetchPromises)
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => {
          setDataSampah({ harian: data[0].data, bulanan: data[1].data })
          // Handle the data from all endpoints
          // Continue processing the data as needed
        })
        .catch(error => {
          // Handle any errors that occurred during fetch
          console.error('Error fetching data:', error);
        });
    });

  }, [nama]);

  return (
    <View style={{ flex: 1 }}>
      <View className="bg-green-800 rounded-b-2xl pt-20 px-6 pb-14">
        <View>
          <Text className="text-white text-xl">Dashboard</Text>
        </View>
        <View className="flex flex-row pt-5 justify-between relative">
          <View>
            <Text className="text-white text-2xl pb-2">Hello {nama}</Text>
            <Text className="text-white">
              Ini rangkuman pendataan sampah kamu
            </Text>
          </View>
          <View className="absolute right-0 -top-5">
            <Image
              className="rounded-full"
              source={require('../../../assets/images/user.jpeg')}
              style={{ width: 60, height: 60 }}
            />
          </View>
        </View>
      </View>
      <View className="px-6 mt-9 space-y-6">
        <View className="flex flex-row justify-between bg-red-400 rounded-xl p-6">
          <View>
            <Text className="text-white">Data sampah</Text>
            <Text className="text-3xl text-white py-3">Harian</Text>
            <Text className="text-white">Satuan Kilogram (Kg)</Text>
          </View>
          <View className="flex flex-col justify-center">
            <Text className="text-white text-2xl">{dataSampah.harian} Kg</Text>
          </View>
        </View>
        <View className="flex flex-row justify-between bg-blue-400 rounded-xl p-6">
          <View>
            <Text className="text-white">Data sampah</Text>
            <Text className="text-3xl text-white py-3">Bulanan</Text>
            <Text className="text-white">Satuan Kilogram (Kg)</Text>
          </View>
          <View className="flex flex-col justify-center">
            <Text className="text-white text-2xl">{dataSampah.bulanan} Kg</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function Index() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <TheComponent session={session} />
    </>
  );
}
