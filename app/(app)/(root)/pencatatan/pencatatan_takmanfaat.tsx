import { useAtom } from 'jotai';
import { useState } from 'react';
import { Button, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { timbulanAtom } from '.';
import api from '../../../../constants/api';
import { useSession } from '../../../../components/ctx';
import { Stack, router, } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Icon from '@expo/vector-icons/AntDesign';

export default function Page() {
  const [timbulan, setTimbulan] = useAtom(timbulanAtom);
  const [judul, setJudul] = useState('');
  const [loading, setLoading] = useState(false);
  const { session } = useSession();

  return (
    <View style={{ flex: 1 }} className="bg-white">
      <Stack.Screen
        options={{

          headerLeft: (props) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  router.back()
                  setTimbulan(timbulan.filter((v: any) => v.logbook_group_id !== 3))

                }}
              >
                <Icon name='arrowleft' color="white" size={24} />

              </TouchableOpacity>

            )
          }
        }}

      />
      <View className="mt-2 space-y-3">
        <Text className="text-lg pt-2 text-center">Data Timbulan</Text>
        {timbulan.map((v: any, i) => {
          if (v.logbook_group_id === 1) {
            return (
              <View key={i} className="flex flex-row justify-between px-6">
                <View>
                  <Text>{v.sampah_nama}</Text>
                </View>
                <View className="flex flex-row space-x-3">
                  <Text>
                    {v.jumlah} {v.satuan_nama}
                  </Text>
                </View>
              </View>
            );
          }
        })}
      </View>
      <View className="bg-gray-200 h-2 mt-3" />
      {timbulan.some((item: any) => item.logbook_group_id === 2) && (
        <>
          <View className="mt-2 space-y-3">
            <Text className="text-lg pt-2 text-center">Data Termanfaatkan</Text>
            {timbulan.map((v: any, i) => {
              if (v.logbook_group_id === 2) {
                return (
                  <View key={i} className="flex flex-row justify-between px-6">
                    <View>
                      <Text>{v.sampah_nama}</Text>
                    </View>
                    <View className="flex flex-row space-x-3">
                      <Text>
                        {v.jumlah} {v.satuan_nama}
                      </Text>
                    </View>
                  </View>
                );
              }
            })}
          </View>
          <View className="bg-gray-200 h-2 mt-3" />
        </>
      )}

      {timbulan.some((item: any) => item.logbook_group_id === 2) && (
        <>
          <View className="mt-2 space-y-3">
            <Text className="text-lg pt-2 text-center">Data Termanfaatkan</Text>
            {timbulan.map((v: any, i) => {
              if (v.logbook_group_id === 3) {
                return (
                  <View key={i} className="flex flex-row justify-between px-6">
                    <View>
                      <Text>{v.sampah_nama}</Text>
                    </View>
                    <View className="flex flex-row space-x-3">
                      <Text>
                        {v.jumlah} {v.satuan_nama}
                      </Text>
                    </View>
                  </View>
                );
              }
            })}
          </View>
          <View className="bg-gray-200 h-2 mt-3" />
        </>
      )}

      <View className="mx-6 pt-6">
        <View className="space-y-3">
          <Text className="text-base">Input Judul Laporan</Text>
          <TextInput
            className="border rounded-lg py-[10px] px-3"
            value={judul}
            onChangeText={setJudul}
            placeholder="Input Judul"
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={async () => {
          // id_user
          // judul
          // data timbulan
          setLoading(true);
          const formData = new FormData();
          const id = await SecureStore.getItemAsync('id');
          formData.append('id_user', id as string);
          formData.append('judul', judul);
          formData.append('data', JSON.stringify(timbulan));


          fetch(`${api}/logbook`, {
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
              setLoading(false);
              setTimbulan([])
              router.replace('/history');
            })
            .catch((error) => {
              console.error('Error:', error);
            });

        }}
        className="mx-6 p-4 bg-green-800 rounded-lg my-6"
      >
        <Text className="text-center text-white">
          {loading ? 'Loading' : 'Submit Data'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
