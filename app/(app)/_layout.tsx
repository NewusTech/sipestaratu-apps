import { Stack, useRouter, useSegments, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const unstable_settings = {
  initialRouteName: "(root)"
}


// export default function AppLayout() {
//   const { session, isLoading } = useSession();
//
//   // You can keep the splash screen open, or render a loading screen like we do here.
//   if (isLoading) {
//     return <Text>Loading...</Text>;
//   }
//
//   // Only require authentication within the (app) group's layout as users
//   // need to be able to access the (auth) group and sign in again.
//   if (!session) {
//     // On web, static rendering will stop here as the user is not authenticated
//     // in the headless Node process that the pages are rendered in.
//     return <Redirect href="/sign-in" />;
//   }
//
//   // This layout can be deferred because it's not the root layout.
//   return <Stack />;
// }
//

export default function AppLayout() {

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name='(root)'
          options={{
            statusBarTranslucent: true,
            statusBarStyle: 'light'
          }}
        />
        <Stack.Screen
          name="sign-in"
          options={{
            presentation: "modal"
          }}
        />
      </Stack>
    </SafeAreaProvider >
  )
}
