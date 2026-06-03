import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dinleKonusmalar } from '../../api/mesajlar';
import { colors, spacing, radius } from '../../constants/theme';

function formatZaman(ts) {
  if (!ts?.toDate) return '';
  const d = ts.toDate();
  const now = new Date();
  const ayniGun =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (ayniGun) {
    return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}

export default function MesajlarScreen({ navigation }) {
  const [liste, setListe] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState('');
  const [filtre, setFiltre] = useState('tumu');

  useEffect(() => {
    const unsub = dinleKonusmalar(
      (data) => {
        setListe(data);
        setYukleniyor(false);
        setHata('');
      },
      (err) => {
        setYukleniyor(false);
        const msg = err?.message || '';
        if (msg.includes('index') || err?.code === 'failed-precondition') {
          setHata(
            'Firestore indeksi gerekli. Firebase Console → Firestore → Indexes bölümündeki linki açıp indeksi oluşturun.'
          );
        } else {
          setHata(msg || 'Mesajlar yüklenemedi.');
        }
      }
    );
    return unsub;
  }, []);

  const gorunen = useMemo(() => {
    if (filtre === 'okunmamis') return liste.filter((k) => k.okunmadi);
    return liste;
  }, [liste, filtre]);

  const satirAc = (item) => {
    navigation.navigate('MesajDetay', {
      konusmaId: item.id,
      ilanBaslik: item.ilanBaslik,
      ilanId: item.ilanId,
      karsiAd: item.digerAd,
    });
  };

  const renderSatir = ({ item }) => (
    <TouchableOpacity style={styles.satir} onPress={() => satirAc(item)} activeOpacity={0.7}>
      <View style={styles.avatar}>
        <Ionicons name="person-outline" size={22} color={colors.textSecondary} />
      </View>
      <View style={styles.satirOrta}>
        <View style={styles.satirUst}>
          <Text style={[styles.satirAd, item.okunmadi && styles.satirAdKalın]} numberOfLines={1}>
            {item.digerAd}
          </Text>
          <Text style={styles.zaman}>{formatZaman(item.sonMesajAt)}</Text>
        </View>
        <Text style={styles.ilanBaslik} numberOfLines={1}>
          {item.ilanBaslik}
        </Text>
        <Text style={[styles.sonMesaj, item.okunmadi && styles.sonMesajKalın]} numberOfLines={1}>
          {item.sonMesaj || 'Henüz mesaj yok'}
        </Text>
      </View>
      {item.okunmadi ? <View style={styles.okBadge} /> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrap}>
      <View style={styles.filtreSatir}>
        <View style={styles.segment}>
          <TouchableOpacity
            style={[styles.segBtn, filtre === 'tumu' && styles.segBtnAktif]}
            onPress={() => setFiltre('tumu')}
          >
            <Text style={[styles.segText, filtre === 'tumu' && styles.segTextAktif]}>Tümü</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segBtn, filtre === 'okunmamis' && styles.segBtnAktif]}
            onPress={() => setFiltre('okunmamis')}
          >
            <Text style={[styles.segText, filtre === 'okunmamis' && styles.segTextAktif]}>
              Okunmamış
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tumMesajlar}>
          <Text style={styles.tumMesajlarText}>Tüm Mesajlar</Text>
          <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
        </View>
      </View>

      {yukleniyor ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : hata ? (
        <Text style={styles.hataMetin}>{hata}</Text>
      ) : gorunen.length === 0 ? (
        <Text style={styles.bosMetin}>Mesaj bulunmamaktadır.</Text>
      ) : (
        <FlatList
          data={gorunen}
          keyExtractor={(item) => item.id}
          renderItem={renderSatir}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.surface },
  filtreSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  segment: { flexDirection: 'row', borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm },
  segBtn: { paddingHorizontal: 16, paddingVertical: 8 },
  segBtnAktif: { backgroundColor: '#1e3a5f' },
  segText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  segTextAktif: { color: colors.primaryText },
  tumMesajlar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  tumMesajlarText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  loader: { marginTop: 48 },
  bosMetin: {
    textAlign: 'center',
    marginTop: 48,
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: '500',
  },
  hataMetin: {
    textAlign: 'center',
    marginTop: 32,
    paddingHorizontal: spacing.xl,
    fontSize: 14,
    color: colors.danger,
    lineHeight: 22,
  },
  list: { paddingBottom: 24 },
  satir: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  satirOrta: { flex: 1 },
  satirUst: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  satirAd: { flex: 1, fontSize: 16, color: colors.text, fontWeight: '500' },
  satirAdKalın: { fontWeight: '800' },
  zaman: { fontSize: 12, color: colors.textMuted },
  ilanBaslik: { fontSize: 13, color: colors.link, marginTop: 2 },
  sonMesaj: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  sonMesajKalın: { color: colors.text, fontWeight: '600' },
  okBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
});
