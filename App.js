import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import GirisScreen from './screens/GirisScreen';
import IlanListesiScreen from './screens/IlanListesiScreen';
import IlanEkleScreen from './screens/IlanEkleScreen';
import PlatformSecScreen from './screens/PlatformSecScreen';
import YayinlaScreen from './screens/YayinlaScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AnaSayfa() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="IlanListesi" 
        component={IlanListesiScreen}
        options={{ title: 'TekTıklaYayınla' }}
      />
      <Stack.Screen 
        name="IlanEkle" 
        component={IlanEkleScreen}
        options={{ title: 'İlan Ekle' }}
      />
      <Stack.Screen 
        name="PlatformSec" 
        component={PlatformSecScreen}
        options={{ title: 'Platform Seç' }}
      />
      <Stack.Screen 
        name="Yayinla" 
        component={YayinlaScreen}
        options={{ title: 'Yayınla' }}
      />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#1a73e8',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { paddingBottom: 5, height: 60 },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Ana Sayfa" 
        component={AnaSayfa}
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>🏠</Text> }}
      />
      <Tab.Screen 
        name="İlan Ver" 
        component={IlanEkleScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 28 }}>➕</Text>, tabBarStyle: { paddingBottom: 20, height: 80 }, }}
      />
      <Tab.Screen 
        name="Ara" 
        component={IlanListesiScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>🔍</Text> }}
      />
      <Tab.Screen 
        name="Profilim" 
        component={IlanListesiScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>👤</Text> }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Giris">
        <Stack.Screen 
          name="Giris" 
          component={GirisScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Main" 
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}