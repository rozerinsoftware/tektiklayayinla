import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { adminDeleteIlan, adminGetAllIlanlar, adminGetAllUsers } from '../api';
import { colors, radius, formatFiyat } from '../constants/theme';

export default function AdminPanelScreen({ navigation }) {
  const [ilanlar, setIlanlar] = useState([]);
  const [kullanicilar, setKullanicilar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [sekme, setSekme] = useState('ilanlar');

  const verileriYukle = async () => {
    try {
      setYukleniyor(true);
      const [ilanData, kullaniciData] = await Promise.all([
        adminGetAllIlanlar(),
        adminGetAllUsers(),
      ]);
      setIlanlar(ilanData);
      setKullanicilar(kullaniciData);
    } catch (error) {
      Alert.alert('Hata', error?.message || 'Veriler yüklenemedi.');
    } finally {
      setYukleniyor(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      verileriYukle();
    }, [])
  );

  const ilanSil = (id, baslik) => {
    Alert.alert('İlanı Sil', `"${baslik}" silinsin mi?`, [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            await adminDeleteIlan(id);
            setIlanlar((prev) => prev.filter((i) => i.id !== id));
          } catch (error) {
            Alert.alert('Silinemedi', error?.message || 'İlan silinemedi.');
          }
        },
      },
    ]);
  };

  if (yukleniyor && ilanlar.length === 0 && kullanicilar.length === 0) {
    return (
      <View style={styles.merkez}>
        <ActivityIndicator size="large" color={colors.primaryDark} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.sekmeSatir}>
        <TouchableOpacity
          style={[styles.sekme, sekme === 'ilanlar' && styles.sekmeAktif]}
          onPress={() => setSekme('ilanlar')}
        >
          <Text style={[styles.sekmeText, sekme === 'ilanlar' && styles.sekmeTextAktif]}>
            Tüm İlanlar ({ilanlar.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sekme, sekme === 'kullanicilar' && styles.sekmeAktif]}
          onPress={() => setSekme('kullanicilar')}
        >
          <Text style={[styles.sekmeText, sekme === 'kullanicilar' && styles.sekmeTextAktif]}>
            Kullanıcılar ({kullanicilar.length})
          </Text>
        </TouchableOpacity>
      </View>

      {sekme === 'ilanlar' ? (
        <FlatList
          data={ilanlar}
          keyExtractor={(item) => String(item.id)}
          refreshControl={<RefreshControl refreshing={yukleniyor} onRefresh={verileriYukle} />}
          ListEmptyComponent={<Text style={styles.bos}>Henüz ilan yok.</Text>}
          renderItem={({ item }) => (
            <View style={styles.kart}>
              <Text style={styles.kartBaslik}>{item.baslik}</Text>
              <Text style={styles.kartDetay}>{item.aciklama}</Text>
              <Text style={styles.kartFiyat}>{formatFiyat(item.fiyat)}</Text>
              <Text style={styles.kartMeta}>Kategori: {item.kategori || '—'}</Text>
              <Text style={styles.kartMeta}>Sahip: {item.ownerId || '—'}</Text>
              <View style={styles.aksiyonSatir}>
                <TouchableOpacity
                  style={styles.duzenleButon}
                  onPress={() => navigation.navigate('AdminIlanDuzenle', { ilan: item })}
                >
                  <Text style={styles.duzenleButonText}>Düzenle</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.silButon}
                  onPress={() => ilanSil(item.id, item.baslik)}
                >
                  <Text style={styles.silButonText}>Sil</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <FlatList
          data={kullanicilar}
          keyExtractor={(item) => String(item.id)}
          refreshControl={<RefreshControl refreshing={yukleniyor} onRefresh={verileriYukle} />}
          ListEmptyComponent={<Text style={styles.bos}>Henüz kullanıcı yok.</Text>}
          renderItem={({ item }) => (
            <View style={styles.kart}>
              <Text style={styles.kartBaslik}>
                {item.ad} {item.soyad}
              </Text>
              <Text style={styles.kartDetay}>{item.email}</Text>
              <View style={[styles.rolBadge, item.role === 'admin' && styles.rolAdmin]}>
                <Text style={[styles.rolBadgeText, item.role === 'admin' && styles.rolAdminText]}>
                  {item.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  merkez: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sekmeSatir: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  sekme: { flex: 1, padding: 14, alignItems: 'center' },
  sekmeAktif: { borderBottomWidth: 3, borderBottomColor: colors.primaryDark },
  sekmeText: { color: '#666', fontWeight: '600' },
  sekmeTextAktif: { color: colors.primaryText, fontWeight: '700' },
  kart: {
    backgroundColor: '#fff',
    margin: 12,
    marginBottom: 0,
    padding: 14,
    borderRadius: 10,
    elevation: 2,
  },
  kartBaslik: { fontSize: 17, fontWeight: 'bold', marginBottom: 4 },
  kartDetay: { color: '#666', marginBottom: 4 },
  kartFiyat: { color: '#e74c3c', fontWeight: 'bold', marginBottom: 4 },
  kartMeta: { fontSize: 12, color: '#999', marginBottom: 2 },
  aksiyonSatir: { flexDirection: 'row', gap: 10, marginTop: 12 },
  duzenleButon: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  duzenleButonText: { color: colors.primaryText, fontWeight: '700' },
  silButon: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  silButonText: { color: colors.danger, fontWeight: '700' },
  rolBadge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#e8f0fe',
  },
  rolBadgeText: { color: '#1a73e8', fontWeight: '600' },
  rolAdmin: { backgroundColor: '#fff3cd' },
  rolAdminText: { color: '#856404' },
  bos: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 },
});
