import { Stack } from "expo-router";

export default function AppLayout() {

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
        headerShadowVisible: true,
        headerTintColor: 'white',
        headerStyle: { backgroundColor: 'rgb(22 101 52)' },
      }}
    >
      <Stack.Screen
        name='index'
        options={{
          headerTitle: "Pencatatan Timbulan",
          statusBarTranslucent: true,
          statusBarStyle: 'light'
        }}
      />
      <Stack.Screen
        name="pencatatan_manfaat"
        options={{
          headerTitle: "Pemanfaatan",
          statusBarTranslucent: true,
          statusBarStyle: 'light'
        }}
      />
      <Stack.Screen
        name="pencatatan_takmanfaat"
        options={{
          headerTitle: "Tidak Termanfaatkan",
          statusBarTranslucent: true,
          statusBarStyle: 'light'
        }}
      />
    </Stack>
  )
}
