import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, usePathname } from 'expo-router';
import { Pressable, useColorScheme } from 'react-native';
import Colors from '../../../constants/Colors';


/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const path = usePathname()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'rgb(22 101 52)',
        tabBarStyle: { display: path.split("/").length >= 3 ? "none" : "flex" }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarShowLabel: false,
          title: 'Tab One',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="pencatatan"
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault()
            navigation.navigate('pencatatan', {
              screen: 'index'
            })
          }
        })}
        options={{

          headerShown: false,
          tabBarShowLabel: false,
          title: 'Pencatatan ',
          tabBarIcon: ({ color }) => <TabBarIcon name="recycle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarShowLabel: false,
          headerTitleAlign: 'center',
          headerShadowVisible: true,
          headerTintColor: 'white',
          headerStyle: { backgroundColor: 'rgb(22 101 52)' },
          title: 'Riwayat',
          tabBarIcon: ({ color }) => <TabBarIcon name="sticky-note" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarShowLabel: false,
          headerTitleAlign: 'center',
          headerShadowVisible: true,
          headerTintColor: 'white',
          headerStyle: { backgroundColor: 'rgb(22 101 52)' },
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
