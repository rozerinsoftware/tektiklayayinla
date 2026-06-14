import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { getCurrentUserId } from '../../auth';
import { dinleMesajlar, mesajGonder, konusmaOkunduIsaretle } from '../../api/mesajlar';
import { colors, radius, spacing } from '../../constants/theme';

function formatSaat(ts) {
  if (!ts?.toDate) return '';
  return ts.toDate().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

export default function MesajDetayScreen({ navigation, route }) {
  const { konusmaId, ilanBaslik, karsiAd } = route.params || {};
  const uid = getCurrentUserId();
  const headerHeight = useHeaderHeight();
  const [mesajlar, setMesajlar] = useState([]);
  const [metin, setMetin] = useState('');
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({ title: karsiAd || 'Sohbet' });
  }, [navigation, karsiAd]);

  useEffect(() => {
    if (!konusmaId) return undefined;
    konusmaOkunduIsaretle(konusmaId).catch(() => null);
    const unsub = dinleMesajlar(
      konusmaId,
      (data) => {
        setMesajlar(data.filter((m) => m.metin));
        setTimeout(() => listRef.current?.scrollToEnd?.({ animated: true }), 100);
      },
      (err) => Alert.alert('Hata', err?.message || 'Mesajlar yüklenemedi.')
    );
    return unsub;
  }, [konusmaId]);

  const gonder = async () => {
    const t = metin.trim();
    if (!t || gonderiliyor) return;
    try {
      setGonderiliyor(true);
      setMetin('');
      await mesajGonder(konusmaId, t);
    } catch (e) {
      setMetin(t);
      Alert.alert('Hata', e?.message || 'Mesaj gönderilemedi.');
    } finally {
      setGonderiliyor(false);
    }
  };

  const renderMesaj = ({ item }) => {
    const benim = item.gonderenId === uid;
    return (
      <View style={[styles.balonSatir, benim && styles.balonSatirBenim]}>
        <View style={[styles.balon, benim ? styles.balonBenim : styles.balonDiger]}>
          <Text style={[styles.balonMetin, benim && styles.balonMetinBenim]}>{item.metin}</Text>
          <Text style={[styles.balonSaat, benim && styles.balonSaatBenim]}>{formatSaat(item.createdAt)}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrap}
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      {ilanBaslik ? (
        <TouchableOpacity
          style={styles.ilanBand}
          onPress={() => navigation.navigate('IlanDetay', { ilan: { id: route.params?.ilanId } })}
          disabled={!route.params?.ilanId}
        >
          <Ionicons name="pricetag-outline" size={16} color={colors.link} />
          <Text style={styles.ilanBandText} numberOfLines={1}>
            {ilanBaslik}
          </Text>
        </TouchableOpacity>
      ) : null}

      <FlatList
        ref={listRef}
        data={mesajlar}
        keyExtractor={(item) => item.id}
        renderItem={renderMesaj}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => listRef.current?.scrollToEnd?.({ animated: false })}
        ListEmptyComponent={
          <Text style={styles.bos}>İlk mesajınızı yazın. Karşı taraf anında görebilir.</Text>
        }
      />

      <View style={styles.girisSatir}>
        <TextInput
          style={styles.input}
          placeholder="Mesaj yazın…"
          placeholderTextColor={colors.textMuted}
          value={metin}
          onChangeText={setMetin}
          multiline
          maxLength={2000}
          autoCorrect={false}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="sentences"
          keyboardType="default"
          textContentType="none"
          importantForAutofill="no"
        />
        <TouchableOpacity
          style={[styles.gonderBtn, (!metin.trim() || gonderiliyor) && styles.gonderBtnPasif]}
          onPress={gonder}
          disabled={!metin.trim() || gonderiliyor}
        >
          {gonderiliyor ? (
            <ActivityIndicator size="small" color={colors.primaryText} />
          ) : (
            <Ionicons name="send" size={22} color={colors.primaryText} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  ilanBand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  ilanBandText: { flex: 1, fontSize: 13, color: colors.link, fontWeight: '600' },
  list: { padding: spacing.lg, paddingBottom: spacing.md },
  bos: { textAlign: 'center', color: colors.textMuted, marginTop: 40, fontSize: 14, lineHeight: 22 },
  balonSatir: { marginBottom: spacing.sm, alignItems: 'flex-start' },
  balonSatirBenim: { alignItems: 'flex-end' },
  balon: {
    maxWidth: '82%',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  balonDiger: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  balonBenim: { backgroundColor: colors.primary },
  balonMetin: { fontSize: 15, color: colors.text, lineHeight: 21 },
  balonMetinBenim: { color: colors.primaryText },
  balonSaat: { fontSize: 11, color: colors.textMuted, marginTop: 4, alignSelf: 'flex-end' },
  balonSaatBenim: { color: 'rgba(255,255,255,0.85)' },
  girisSatir: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  gonderBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gonderBtnPasif: { opacity: 0.5 },
});
