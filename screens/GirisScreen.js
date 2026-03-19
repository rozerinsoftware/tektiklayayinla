import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

export default function GirisScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.icerik}>
        <View style={styles.logoKutu}>
          <Text style={styles.logoYazi}>👆</Text>
        </View>
        
        <Text style={styles.baslik}>TekTıklaYayınla</Text>
        <Text style={styles.slogan}>İlanını bir kere gir,{'\n'}her yerde yayınla!</Text>

        <View style={styles.ozellikler}>
          <Text style={styles.ozellik}>✅ Tek panelden çoklu platform</Text>
          <Text style={styles.ozellik}>✅ Zaman ve para tasarrufu</Text>
          <Text style={styles.ozellik}>✅ Kolay ve hızlı ilan yönetimi</Text>
        </View>

        <TouchableOpacity 
          style={styles.baslaButon}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.baslaButonText}>Hemen Başla 🚀</Text>
        </TouchableOpacity>

        <Text style={styles.altYazi}>Sahibinden • Arabam.com • Letgo • Emlakjet • Hepsiemlak</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a73e8' },
  icerik: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  logoKutu: { width: 100, height: 100, backgroundColor: '#fff', borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 25, elevation: 10 },
  logoYazi: { fontSize: 50 },
  baslik: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  slogan: { fontSize: 18, color: '#e8f0fe', textAlign: 'center', marginBottom: 40, lineHeight: 26 },
  ozellikler: { backgroundColor: 'rgba(255,255,255,0.15)', padding: 20, borderRadius: 15, width: '100%', marginBottom: 40 },
  ozellik: { color: '#fff', fontSize: 16, marginBottom: 10 },
  baslaButon: { backgroundColor: '#fff', padding: 18, borderRadius: 30, width: '100%', alignItems: 'center', elevation: 5 },
  baslaButonText: { color: '#1a73e8', fontSize: 18, fontWeight: 'bold' },
  altYazi: { color: 'rgba(255,255,255,0.6)', marginTop: 30, fontSize: 12, textAlign: 'center' },
});