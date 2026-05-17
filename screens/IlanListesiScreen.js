import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getIlanlar, deleteIlan } from '../api';

export default function IlanListesiScreen({ navigation }) {
  const [ilanlar, setIlanlar] = useState([]);

  const ilanlariGetir = async () => {
    try {
      const data = await getIlanlar();
      setIlanlar(data);
    } catch (error) {
      setIlanlar([]);
      Alert.alert('Veri Hatası', error?.message || 'İlanlar yüklenemedi.');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', ilanlariGetir);
    return unsubscribe;
  }, [navigation]);

  const ilanSil = async (id) => {
    Alert.alert('İlan Sil', 'Bu ilanı silmek istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: async () => {
        try {
          await deleteIlan(id);
          ilanlariGetir();
        } catch (error) {
          Alert.alert('Silinemedi', error?.message || 'İlan silinirken bir hata oluştu.');
        }
      }},
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={ilanlar}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.ilanKart}>
            <Text style={styles.baslik}>{item.baslik}</Text>
            <Text style={styles.aciklama}>{item.aciklama}</Text>
            <Text style={styles.fiyat}>{item.fiyat} TL</Text>
            <Text style={styles.platformlar}>📍 {Array.isArray(item.platformlar) ? item.platformlar.join(', ') : item.platformlar}</Text>
            <TouchableOpacity style={styles.silButon} onPress={() => ilanSil(item.id)}>
              <Text style={styles.silButonText}>🗑️ Sil</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity 
        style={styles.ekleButon}
        onPress={() => {
          const tabNav = navigation.getParent();
          if (tabNav) {
            tabNav.navigate('İlan Ver', { screen: 'IlanEkle' });
            return;
          }
          navigation.navigate('IlanEkle');
        }}
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
  silButon: { marginTop: 10, backgroundColor: '#fee', padding: 8, borderRadius: 5, alignItems: 'center' },
  silButonText: { color: '#e74c3c' },
  ekleButon: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  ekleButonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});