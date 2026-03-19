import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import IlanListesiScreen from './screens/IlanListesiScreen';
import IlanEkleScreen from './screens/IlanEkleScreen';
import PlatformSecScreen from './screens/PlatformSecScreen';
import YayinlaScreen from './screens/YayinlaScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="IlanListesi">
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
    </NavigationContainer>
  );
}