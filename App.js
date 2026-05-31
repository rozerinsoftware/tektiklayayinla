import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import GirisScreen from './screens/GirisScreen';
import KayitScreen from './screens/KayitScreen';
import IlanListesiScreen from './screens/IlanListesiScreen';
import IlanEkleScreen from './screens/IlanEkleScreen';
import PlatformSecScreen from './screens/PlatformSecScreen';
import YayinlaScreen from './screens/YayinlaScreen';
import ProfilScreen from './screens/ProfilScreen';
import AdminPanelScreen from './screens/AdminPanelScreen';
import AdminIlanDuzenleScreen from './screens/AdminIlanDuzenleScreen';
import IlanDetayScreen from './screens/IlanDetayScreen';
import { colors, stackScreenOptions, tabBarOptions } from './constants/theme';

function TabIcon({ name, focused, size = 24 }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={focused ? name : `${name}-outline`} size={size} color={focused ? colors.primaryText : colors.textMuted} />
    </View>
  );
}

const Stack = createNativeStackNavigator();
const ProfilStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const IlanStack = createNativeStackNavigator();

function ProfilFlow() {
  return (
    <ProfilStack.Navigator>
      <ProfilStack.Screen
        name="Profil"
        component={ProfilScreen}
        options={{ title: 'Profilim', ...stackScreenOptions }}
      />
      <ProfilStack.Screen
        name="AdminPanel"
        component={AdminPanelScreen}
        options={{ title: 'Admin Paneli', ...stackScreenOptions }}
      />
      <ProfilStack.Screen
        name="AdminIlanDuzenle"
        component={AdminIlanDuzenleScreen}
        options={{ title: 'İlanı Düzenle', ...stackScreenOptions }}
      />
    </ProfilStack.Navigator>
  );
}

function IlanFlow() {
  return (
    <IlanStack.Navigator screenOptions={stackScreenOptions}>
      <IlanStack.Screen name="IlanEkle" component={IlanEkleScreen} options={{ title: 'İlan Ekle' }} />
      <IlanStack.Screen name="PlatformSec" component={PlatformSecScreen} options={{ title: 'Platform Seç' }} />
      <IlanStack.Screen name="Yayinla" component={YayinlaScreen} options={{ title: 'Yayınla' }} />
    </IlanStack.Navigator>
  );
}

function ListeFlow({ aramaModu }) {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="IlanListesi"
        component={IlanListesiScreen}
        initialParams={{ aramaModu }}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="IlanDetay" component={IlanDetayScreen} options={{ title: 'İlan Detayı' }} />
    </Stack.Navigator>
  );
}

function AnaSayfa() {
  return <ListeFlow aramaModu={false} />;
}

function AraSayfa() {
  return <ListeFlow aramaModu={true} />;
}

function TabNavigator() {
  const insets = useSafeAreaInsets();
  const altBosluk = Math.max(insets.bottom, 10);
  const tabYukseklik = 56 + altBosluk;

  const varsayilanTabBar = {
    paddingBottom: altBosluk,
    paddingTop: 8,
    height: tabYukseklik,
  };

  return (
    <Tab.Navigator
      screenOptions={{
        ...tabBarOptions,
        tabBarStyle: {
          ...varsayilanTabBar,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Ana Sayfa" 
        component={AnaSayfa}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} /> }}
      />
      <Tab.Screen 
        name="İlan Ver" 
        component={IlanFlow}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="add-circle" focused={focused} size={28} />,
          tabBarStyle: {
            paddingBottom: altBosluk + 6,
            paddingTop: 10,
            height: tabYukseklik + 12,
          },
        }}
      />
      <Tab.Screen 
        name="Ara" 
        component={AraSayfa}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="search" focused={focused} /> }}
      />
      <Tab.Screen 
        name="Profilim" 
        component={ProfilFlow}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="person" focused={focused} />, headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Giris">
        <Stack.Screen 
          name="Giris" 
          component={GirisScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Kayit"
          component={KayitScreen}
          options={{ title: 'Hesap Oluştur', ...stackScreenOptions }}
        />
        <Stack.Screen 
          name="Main" 
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}