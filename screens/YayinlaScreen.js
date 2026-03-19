import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function YayinlaScreen({ navigation, route }) {
  const { ilan } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.baslik}>İlanınız Yayınlandı!</Text>
      
      <View style={styles.detayKart}>
        <Text style={styles.detayBaslik}>{ilan.baslik}</Text>
        <Text style={styles.detayAciklama}>{ilan.aciklama}</Text>
        <Text style={styles.detayFiyat}>{ilan.fiyat} TL</Text>
        <Text style={styles.platformBaslik}>Yayınlanan Platformlar:</Text>
        {ilan.platformlar.map((platform) => (
          <Text key={platform} style={styles.platformItem}>✅ {platform}</Text>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.buton} 
        onPress={() => navigation.navigate('IlanListesi')}
      >
        <Text style={styles.butonText}>Ana Sayfaya Dön</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 80, marginBottom: 20 },
  baslik: { fontSize: 26, fontWeight: 'bold', color: '#2ecc71', marginBottom: 20 },
  detayKart: { backgroundColor: '#f9f9f9', padding: 20, borderRadius: 15, width: '100%', marginBottom: 30 },
  detayBaslik: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  detayAciklama: { color: '#666', marginBottom: 5 },
  detayFiyat: { color: '#e74c3c', fontWeight: 'bold', fontSize: 18, marginBottom: 15 },
  platformBaslik: { fontWeight: 'bold', marginBottom: 8, color: '#333' },
  platformItem: { color: '#27ae60', fontSize: 16, marginBottom: 4 },
  buton: { backgroundColor: '#3498db', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center' },
  butonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});