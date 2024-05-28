import { Link, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import api from '../../../../constants/api';
import { useSession } from '../../../../components/ctx';

import { useAtom } from 'jotai';
import { timbulanAtom } from '.';

export default function Pencatatan() {
  const [timbulan, setTimbulan] = useAtom(timbulanAtom);
  const { session } = useSession();
  const [open, setOpen] = useState({
    jenis: false,
    jumlah: false,
    satuan: false,
  });
  const [jenis, setJenis] = useState(null);
  const [jumlah, setJumlah] = useState('');
  const [satuan, setSatuan] = useState(null);

  const [dataSatuan, setDataSatuan] = useState([
    { label: 'test', value: 'test' },
  ]);
  const [dataSampah, setDataSampah] = useState([
    { label: 'test', value: 'test' },
  ]);

  useEffect(() => {
    fetch(`${api}/satuan_berat`, {
      method: 'GET',
      headers: {
        Authorization: session, // Assuming Bearer token, adjust if different
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        try {
          setDataSatuan(
            data.data.map((v: any) => ({
              label: v.satuan_berat,
              value: v.id,
            }))
          );
        } catch (e) {
          console.error('Parsing error:', e);
          // Handle the parsing error (e.g., show a message to the user)
        }
      })
      .catch((error) => {
        console.error('Fetch error:', error.message);
      });

    async function fetchPostWithIdParent(idParent: any) {
      const formData = new FormData();
      formData.append('id_parent', idParent);

      return fetch(`${api}/sampah_child`, {
        method: 'POST',
        headers: {
          Authorization: session, // Assuming Bearer token, adjust if different
        },
        body: formData,
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      });
    }

    Promise.all(timbulan.map((v: any) => fetchPostWithIdParent(v.sampah_id)))
      .then((dataArray) => {
        dataArray.forEach((data) => {
          try {
            const formattedData = data.data.map((val: any) => ({
              label: val.nama_sampah, // Adjust based on your actual response structure
              value: val.id,
            }));
            setDataSampah((yuk) => [...yuk, ...formattedData]);
            // Use formattedData as needed
          } catch (error) {
            console.error('Parsing error:', error);
            // Handle the parsing error
          }
        });
      })
      .catch((error) => {
        console.error('Fetch error:', error.message);
        // Handle fetch error
      });
  }, [session]);

  return (
    <View style={{ flex: 1 }} className="bg-white relative">
      <Stack.Screen

        options={{

        }}
      />
      <ScrollView className="">
        <View className="mt-2 space-y-3">
          <Text className="text-lg pt-2 text-center">Data Timbulan</Text>
          {timbulan.map((v: any, i: number) => {
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
        <View className="p-6 space-y-3 ">
          <View className="space-y-3">
            <Text className="text-base">Pilih Jenis Sampah</Text>
            <DropDownPicker
              searchable={true}
              listMode="MODAL"
              open={open.jenis}
              value={jenis}
              items={dataSampah}
              setOpen={(open) => {
                setOpen({ jenis: open as any, jumlah: false, satuan: false });
              }}
              setValue={setJenis}
            />
          </View>
          <View className="space-y-3">
            <Text className="text-base">Masukan Jumlah Berat</Text>
            <TextInput
              className="border rounded-lg py-[10px] px-3"
              value={jumlah}
              onChangeText={setJumlah}
              placeholder="Input Satuan"
              keyboardType="numeric"
            />
          </View>
          <View className="space-y-3">
            <Text className="text-base">Masukan Satuan Berat</Text>
            <DropDownPicker
              listMode="MODAL"
              searchable={true}
              open={open.satuan}
              value={satuan}
              items={dataSatuan as any}
              setOpen={(open) => {
                setOpen({ jenis: false, jumlah: false, satuan: open as any });
              }}
              setValue={setSatuan}
            />
          </View>
          <View>
            <TouchableOpacity
              disabled={!jenis || !jumlah || !satuan}
              onPress={() => {
                setTimbulan((val) => [
                  ...val,
                  {
                    sampah_id: jenis,
                    sampah_nama: dataSampah.find((obj) => obj.value === jenis)
                      ?.label,
                    jumlah: jumlah,
                    logbook_group_id: 2,
                    satuan_id: satuan,
                    satuan_nama: dataSatuan.find((obj) => obj.value === satuan)
                      ?.label,
                  },
                ]);

                setJenis(null);
                setJumlah('');
                setSatuan(null);
              }}
              className="p-4 bg-yellow-600 rounded-lg"
            >
              <Text className="text-center text-white">
                Tambah Timbulan Sampah
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="bg-gray-200 h-2" />
        <View className="mt-2 space-y-3">
          {timbulan.length > 0 && (
            <Text className="text-lg pt-2 text-center">
              Data yang sudah di inputkan
            </Text>
          )}
          {timbulan.length > 0 &&
            timbulan.map((v: any) => {
              if (v.logbook_group_id === 2) {
                return (
                  <View
                    key={v.sampah_id}
                    className="flex flex-row justify-between px-6"
                  >
                    <View>
                      <Text>{v.sampah_nama}</Text>
                    </View>
                    <View className="flex flex-row space-x-3">
                      <Text>
                        {v.jumlah} {v.satuan_nama}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          const newData = timbulan.filter((r) => r.sampah_id !== v.sampah_id)
                          setTimbulan(newData)
                        }}
                      >
                        <Text>Hapus</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }
            })}
          {timbulan.length > 0 && (
            <Link href="/pencatatan/pencatatan_takmanfaat" asChild>
              <TouchableOpacity
                onPress={() => {
                  const group2Summary = timbulan
                    .filter((item: any) => item.logbook_group_id === 2)
                    .reduce((acc: anyny, item: any) => {
                      const lowercaseName = item.sampah_nama.toLowerCase();
                      const match = lowercaseName.match(/\(([^)]+)\)/);
                      const key = match ? match[1] : lowercaseName;
                      if (!acc[key]) {
                        acc[key] = {
                          total: 0,
                          originalName: item.sampah_nama.match(/\(([^)]+)\)/)
                            ? item.sampah_nama.match(/\(([^)]+)\)/)[1]
                            : item.sampah_nama,
                        };
                      }
                      acc[key].total += parseInt(item.jumlah, 10);
                      return acc;
                    }, {});

                  // Create result array with data from logbook_group_id 1, matched (ignoring case) and grouped
                  const result = Object.entries(group2Summary)
                    .map(([key, data]: any) => {
                      const match: any = timbulan.find(
                        (item: any) =>
                          item.logbook_group_id === 1 &&
                          item.sampah_nama.toLowerCase().includes(key)
                      );
                      if (match) {
                        return {
                          jumlah: String(match.jumlah - data.total),
                          logbook_group_id: 3,
                          sampah_id: match.sampah_id,
                          sampah_nama: match.sampah_nama,
                          satuan_id: match.satuan_id,
                          satuan_nama: match.satuan_nama,
                        };
                      }
                    })
                    .filter((item) => item);
                  setTimbulan((v) => [...v, ...result] as any);
                }}
                className="mx-6 p-4 bg-green-800 rounded-lg"
              >
                <Text className="text-center text-white">Selanjutnya</Text>
              </TouchableOpacity>
            </Link>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
