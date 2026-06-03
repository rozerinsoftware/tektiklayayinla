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
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { adminDeleteIlan, adminGetAllIlanlar, adminGetAllUsers, adminOrnekIlanlariYukle } from '../api';
import IlanKart from '../components/IlanKart';
import { colors, radius, shadow, spacing } from '../constants/theme';

export default function AdminPanelScreen({ navigation }) {
  const [ilanlar, setIlanlar] = useState([]);
  const [kullanicilar, setKullanicilar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [ornekYukleniyor, setOrnekYukleniyor] = useState(false);
  const [ornekDurum, setOrnekDurum] = useState(null);
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

  const ornekIlanlariYukle = () => {
    Alert.alert(
      'Örnek ilanları yükle',
      'Vitrin ve kategoriler için 10 demo ilan eklenir. Zaten varsa atlanır. Admin panelinden düzenleyebilirsiniz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Yükle',
          onPress: async () => {
            try {
              setYukleniyor(true);
              const sonuc = await adminOrnekIlanlariYukle();
              Alert.alert('Tamam', sonuc.mesaj);
              await verileriYukle();
            } catch (error) {
              Alert.alert('Hata', error?.message || 'Yüklenemedi.');
            } finally {
              setYukleniyor(false);
            }
          },
        },
      ]
    );
  };

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
          <Ionicons
            name="list-outline"
            size={18}
            color={sekme === 'ilanlar' ? colors.primaryText : colors.textMuted}
          />
          <Text style={[styles.sekmeText, sekme === 'ilanlar' && styles.sekmeTextAktif]}>
            İlanlar ({ilanlar.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sekme, sekme === 'kullanicilar' && styles.sekmeAktif]}
          onPress={() => setSekme('kullanicilar')}
        >
          <Ionicons
            name="people-outline"
            size={18}
            color={sekme === 'kullanicilar' ? colors.primaryText : colors.textMuted}
          />
          <Text style={[styles.sekmeText, sekme === 'kullanicilar' && styles.sekmeTextAktif]}>
            Kullanıcılar ({kullanicilar.length})
          </Text>
        </TouchableOpacity>
      </View>

      {sekme === 'ilanlar' ? (
        <View style={styles.ilanlarWrap}>
          <TouchableOpacity
            style={[styles.ornekBtn, ornekYukleniyor && styles.ornekBtnDisabled]}
            onPress={() => ornekIlanlariYukle(false)}
            activeOpacity={0.85}
            disabled={ornekYukleniyor}
          >
            {ornekYukleniyor ? (
              <ActivityIndicator color={colors.primaryText} />
            ) : (
              <Ionicons name="cloud-download-outline" size={20} color={colors.primaryText} />
            )}
            <Text style={styles.ornekBtnText}>
              {ornekYukleniyor ? 'Yükleniyor…' : 'Örnek ilanları yükle (vitrin demo)'}
            </Text>
          </TouchableOpacity>
          {ornekDurum ? (
            <View
              style={[
                styles.ornekDurumKutu,
                ornekDurum.type === 'ok' && styles.ornekDurumOk,
                ornekDurum.type === 'info' && styles.ornekDurumInfo,
                ornekDurum.type === 'err' && styles.ornekDurumErr,
              ]}
            >
              <Text
                style={[
                  styles.ornekDurumText,
                  ornekDurum.type === 'ok' && styles.ornekDurumTextOk,
                  ornekDurum.type === 'info' && styles.ornekDurumTextInfo,
                  ornekDurum.type === 'err' && styles.ornekDurumTextErr,
                ]}
              >
                {ornekDurum.text}
              </Text>
              {ornekDurum.yenidenGoster ? (
                <TouchableOpacity
                  style={styles.ornekTekrarBtn}
                  onPress={() => ornekIlanlariYukle(true)}
                  disabled={ornekYukleniyor}
                >
                  <Text style={styles.ornekTekrarBtnText}>Eksikleri ekle</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
          <FlatList
            data={ilanlar}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl refreshing={yukleniyor} onRefresh={verileriYukle} />}
            ListEmptyComponent={
              <View style={styles.bosWrap}>
                <Ionicons name="document-text-outline" size={48} color={colors.textMuted} />
                <Text style={styles.bos}>Henüz ilan yok.</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.ilanSatir}>
                <View style={styles.ilanKartWrap}>
                  <IlanKart
                    ilan={item}
                    compact
                    onPress={() => navigation.navigate('AdminIlanDuzenle', { ilan: item })}
                  />
                </View>
                <View style={styles.aksiyonSatir}>
                  <TouchableOpacity
                    style={styles.duzenleButon}
                    onPress={() => navigation.navigate('AdminIlanDuzenle', { ilan: item })}
                  >
                    <Ionicons name="create-outline" size={18} color={colors.primaryText} />
                    <Text style={styles.duzenleButonText}>Düzenle</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.silButon} onPress={() => ilanSil(item.id, item.baslik)}>
                    <Ionicons name="trash-outline" size={18} color={colors.danger} />
                    <Text style={styles.silButonText}>Sil</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.ownerMeta}>Sahip: {item.ownerId || '—'}</Text>
              </View>
            )}
          />
        </View>
      ) : (
        <FlatList
          data={kullanicilar}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={yukleniyor} onRefresh={verileriYukle} />}
          ListEmptyComponent={
            <View style={styles.bosWrap}>
              <Ionicons name="people-outline" size={48} color={colors.textMuted} />
              <Text style={styles.bos}>Henüz kullanıcı yok.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.kullaniciKart}>
              <View style={styles.kullaniciAvatar}>
                <Ionicons name="person" size={24} color={colors.primaryText} />
              </View>
              <View style={styles.kullaniciBilgi}>
                <Text style={styles.kartBaslik}>
                  {item.ad} {item.soyad}
                </Text>
                <Text style={styles.kartDetay}>{item.email}</Text>
                <View style={[styles.rolBadge, item.role === 'admin' && styles.rolAdmin]}>
                  <Ionicons
                    name={item.role === 'admin' ? 'shield-checkmark' : 'person-outline'}
                    size={12}
                    color={item.role === 'admin' ? '#92400E' : '#1D4ED8'}
                  />
                  <Text style={[styles.rolBadgeText, item.role === 'admin' && styles.rolAdminText]}>
                    {item.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  merkez: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sekmeSatir: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
  },
  sekme: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: spacing.md,
  },
  sekmeAktif: { borderBottomWidth: 3, borderBottomColor: colors.primary },
  sekmeText: { color: colors.textMuted, fontWeight: '600', fontSize: 14 },
  sekmeTextAktif: { color: colors.primary, fontWeight: '700' },
  listContent: { padding: spacing.md, paddingBottom: 24 },
  ilanlarWrap: { flex: 1 },
  ornekBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
  },
  ornekBtnText: { color: colors.primaryText, fontWeight: '700', fontSize: 14 },
  ornekBtnDisabled: { opacity: 0.7 },
  ornekDurumKutu: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  ornekDurumOk: { backgroundColor: '#ECFDF5', borderColor: '#6EE7B7' },
  ornekDurumInfo: { backgroundColor: '#EFF6FF', borderColor: '#93C5FD' },
  ornekDurumErr: { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' },
  ornekDurumText: { fontSize: 13, lineHeight: 18 },
  ornekDurumTextOk: { color: '#047857' },
  ornekDurumTextInfo: { color: '#1D4ED8' },
  ornekDurumTextErr: { color: '#B91C1C' },
  ornekTekrarBtn: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
  },
  ornekTekrarBtnText: { color: colors.primaryText, fontWeight: '700', fontSize: 12 },
  ilanSatir: { marginBottom: spacing.lg },
  ilanKartWrap: { marginBottom: spacing.sm },
  ownerMeta: { fontSize: 11, color: colors.textMuted, marginTop: 4, paddingHorizontal: 4 },
  aksiyonSatir: { flexDirection: 'row', gap: spacing.sm },
  duzenleButon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    padding: spacing.sm,
    borderRadius: radius.sm,
    ...shadow.soft,
  },
  duzenleButonText: { color: colors.primaryText, fontWeight: '700' },
  silButon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    padding: spacing.sm,
    borderRadius: radius.sm,
  },
  silButonText: { color: colors.danger, fontWeight: '700' },
  kullaniciKart: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  kullaniciAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  kullaniciBilgi: { flex: 1 },
  kartBaslik: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 4 },
  kartDetay: { color: colors.textSecondary, marginBottom: 8 },
  rolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: '#DBEAFE',
  },
  rolBadgeText: { color: '#1D4ED8', fontWeight: '600', fontSize: 12 },
  rolAdmin: { backgroundColor: '#FEF3C7' },
  rolAdminText: { color: '#92400E' },
  bosWrap: { alignItems: 'center', marginTop: 48, gap: 12 },
  bos: { textAlign: 'center', color: colors.textMuted, fontSize: 16 },
});
