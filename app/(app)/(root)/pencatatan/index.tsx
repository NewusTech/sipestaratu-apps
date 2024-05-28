import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import api from '../../../../constants/api';
import { useSession } from '../../../../components/ctx';

import { atom, useAtom } from 'jotai';

export const timbulanAtom = atom([]);

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
    fetch(`${api}/sampah_parent`, {
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
          setDataSampah(
            data.data.map((v: any) => ({
              label: v.nama_sampah,
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
  }, [session]);

  return (
    <View style={{ flex: 1 }} className="bg-white relative">
      <ScrollView className="">
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
                    logbook_group_id: 1,
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
              if (v.logbook_group_id === 1) {
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
            <Link href="/pencatatan/pencatatan_manfaat" asChild>
              <TouchableOpacity className="mx-6 p-4 bg-green-800 rounded-lg">
                <Text className="text-center text-white">Selanjutnya</Text>
              </TouchableOpacity>
            </Link>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
// api - GET - /satuan_berat
// input pilih jenis sampah
// get - /dev
//
// input jumlah berat -> int
//
// Masukan satuan berat
// get - /satuan_berat
//
// action tambah timbunan sampah
// [
//  {
//   nama: sisa makanan,
//   jumlah: 10,
//   satuan: Kg
//  },
//  {
//   nama: Plastik,
//   jumlah: 5,
//   satuan: Kg
//  }
// ]
//
// PEMANFAATAN
//
// pilih jenis sampah
// post - /sampah_child - body: id_parent
//
// input jumlah berat -> int
//
// Masukan satuan berat
// get - /satuan_berat
//
// action tambah pemanfaatan sampah
// [
//  {
//   nama: Pengomposan (Sisa Makanan),
//   jumlah: 5,
//   satuan: Kg
//  },
//  {
//   nama: Pemanfaatan kembali,
//   jumlah: 2
//   satuan: Kg
//  }
// ]
//
// TIDAK TERMANFAATKAN
//
// Data timbunan
// Sisa Makanan 10kg
// Plastik 5kg
//
// Data Manfaat
// Pengomposan (Sisa Makanan) 5kg
// Pemanfaatan kembali (Plastik) 2kg
//
// Data Tidak Termanfaatkan
// Sisa Makanan 5kg
// Plastik 3kg
//
// Input judul laporan
// id_user string
// judul string
// data json
//
// RIWAYAT
// judul
// tanggal
// Timbulan 15kg
// Pemanfaatan 7 kg
// Tidak Termanfaatkan 8 kg
