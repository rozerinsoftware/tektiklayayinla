import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const baslangiçIlanlar = [
  { id: '1', baslik: 'Satılık Araba', aciklama: '2015 model, az kullanılmış', fiyat: '150000', platformlar: ['Sahibinden', 'Arabam.com'] },
  { id: '2', baslik: 'Kiralık Daire', aciklama: 'Merkezi konumda 2+1 daire', fiyat: '8000', platformlar: ['Sahibinden', 'Hepsiemlak'] },
  { id: '3', baslik: 'İkinci El Telefon', aciklama: 'iPhone 12, kutulu', fiyat: '15000', platformlar: ['Letgo', 'Sahibinden'] },
];

export default function IlanListesiScreen({ navigation }) {
  const [ilanlar, setIlanlar] = useState(baslangiçIlanlar);

  return (
    <View style={styles.container}>
      <FlatList
        data={ilanlar}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.ilanKart}>
            <Text style={styles.baslik}>{item.baslik}</Text>
            <Text style={styles.aciklama}>{item.aciklama}</Text>
            <Text style={styles.fiyat}>{item.fiyat} TL</Text>
            <Text style={styles.platformlar}>📍 {item.platformlar.join(', ')}</Text>
          </View>
        )}
      />
      <TouchableOpacity 
        style={styles.ekleButon}
        onPress={() => navigation.navigate('IlanEkle', { setIlanlar, ilanlar })}
      >
        <Text style={styles.ekleButonText}>+ Yeni İlan Ekle</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
  ilanKart: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  baslik: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  aciklama: { color: '#666', marginBottom: 5 },
  fiyat: { color: '#e74c3c', fontWeight: 'bold', fontSize: 16 },
  platformlar: { color: '#3498db', marginTop: 5 },
  ekleButon: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  ekleButonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});