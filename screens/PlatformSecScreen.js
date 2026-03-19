import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { addIlan } from '../api';

const PLATFORMLAR = [
  { isim: 'Sahibinden', renk: '#FFD700', logo: require('../assets/sahibinden.png') },
  { isim: 'Arabam.com', renk: '#FF4500', logo: require('../assets/arabamcom.png') },
  { isim: 'Letgo', renk: '#6C5CE7', logo: require('../assets/letgo.png') },
  { isim: 'Emlakjet', renk: '#FF6B35', logo: require('../assets/emlakjet.png') },
];

export default function PlatformSecScreen({ navigation, route }) {
  const [secilenler, setSecilenler] = useState([]);
  const { yeniIlan } = route.params;

  const platformSec = (platform) => {
    if (secilenler.includes(platform)) {
      setSecilenler(secilenler.filter(p => p !== platform));
    } else {
      setSecilenler([...secilenler, platform]);
    }
  };

  const yayinla = async () => {
    if (secilenler.length === 0) {
      Alert.alert('Hata', 'En az bir platform seçin!');
      return;
    }
    try {
      const tamamlananIlan = { ...yeniIlan, platformlar: secilenler };
      await addIlan(tamamlananIlan);
      navigation.navigate('Yayinla', { ilan: tamamlananIlan });
    } catch (error) {
      const tamamlananIlan = { ...yeniIlan, platformlar: secilenler };
      navigation.navigate('Yayinla', { ilan: tamamlananIlan });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.baslik}>Platform Seçin</Text>
      <Text style={styles.aciklama}>İlanınızı yayınlamak istediğiniz platformları seçin:</Text>

      {PLATFORMLAR.map((platform) => (
        <TouchableOpacity
          key={platform.isim}
          style={[styles.platformKart, secilenler.includes(platform.isim) && { borderColor: platform.renk, borderWidth: 2.5 }]}
          onPress={() => platformSec(platform.isim)}
        >
          <Image source={platform.logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.platformText}>{platform.isim}</Text>
          <Text style={styles.check}>{secilenler.includes(platform.isim) ? '✅' : '⬜'}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.yayinlaButon} onPress={yayinla}>
        <Text style={styles.yayinlaButonText}>🚀 Yayınla ({secilenler.length} platform)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  baslik: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  aciklama: { color: '#666', marginBottom: 20 },
  platformKart: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', padding: 15, borderRadius: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  logo: { width: 50, height: 50, marginRight: 15, borderRadius: 8 },
  platformText: { fontSize: 16, fontWeight: '600', flex: 1, color: '#333' },
  check: { fontSize: 20 },
  yayinlaButon: { backgroundColor: '#2d3436', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  yayinlaButonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});