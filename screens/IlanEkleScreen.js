import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function IlanEkleScreen({ navigation, route }) {
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [fiyat, setFiyat] = useState('');

  const devamEt = () => {
    if (!baslik || !aciklama || !fiyat) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun!');
      return;
    }
    navigation.navigate('PlatformSec', {
      yeniIlan: { baslik, aciklama, fiyat },
      setIlanlar: route.params?.setIlanlar,
      ilanlar: route.params?.ilanlar,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>İlan Başlığı</Text>
      <TextInput
        style={styles.input}
        placeholder="Örn: Satılık Araba"
        value={baslik}
        onChangeText={setBaslik}
      />
      <Text style={styles.label}>Açıklama</Text>
      <TextInput
        style={styles.input}
        placeholder="İlanınızı açıklayın"
        value={aciklama}
        onChangeText={setAciklama}
        multiline
      />
      <Text style={styles.label}>Fiyat (TL)</Text>
      <TextInput
        style={styles.input}
        placeholder="Örn: 15000"
        value={fiyat}
        onChangeText={setFiyat}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.buton} onPress={devamEt}>
        <Text style={styles.butonText}>Devam Et →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 15, fontSize: 16 },
  buton: { backgroundColor: '#3498db', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  butonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});