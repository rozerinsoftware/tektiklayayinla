import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { addIlan } from '../api';

const PLATFORMLAR = ['Sahibinden', 'Arabam.com', 'Letgo', 'Hepsiemlak'];

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
      // Backend yoksa simülasyon modunda devam et
      const tamamlananIlan = { ...yeniIlan, platformlar: secilenler };
      navigation.navigate('Yayinla', { ilan: tamamlananIlan });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.baslik}>Platform Seçin</Text>
      <Text style={styles.aciklama}>İlanınızın yayınlanacağı platformları seçin:</Text>

      {PLATFORMLAR.map((platform) => (
        <TouchableOpacity
          key={platform}
          style={[styles.platformKart, secilenler.includes(platform) && styles.secili]}
          onPress={() => platformSec(platform)}
        >
          <Text style={[styles.platformText, secilenler.includes(platform) && styles.seciliText]}>
            {secilenler.includes(platform) ? '✅' : '⬜'} {platform}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.yayinlaButon} onPress={yayinla}>
        <Text style={styles.yayinlaButonText}>🚀 Yayınla</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  baslik: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  aciklama: { color: '#666', marginBottom: 20 },
  platformKart: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, marginBottom: 10 },
  secili: { borderColor: '#2ecc71', backgroundColor: '#eafaf1' },
  platformText: { fontSize: 16, color: '#333' },
  seciliText: { color: '#27ae60', fontWeight: 'bold' },
  yayinlaButon: { backgroundColor: '#e74c3c', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  yayinlaButonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});