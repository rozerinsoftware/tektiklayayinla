import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../constants/theme';
import { SIRALAMA_SECENEKLERI } from '../utils/ilanYardimci';

const DURUM_IKINCI_EL = ['Sıfır', 'Sıfır Ayarında', 'İyi', 'Orta', 'Yıpranmış'];
const KIMDEN_IKINCI_EL = ['Sahibinden', 'Mağazadan'];
const DURUM_IS_MAKINESI = ['Sıfır', '2. El', 'Yenilenmiş'];
const KIMDEN_IS_MAKINESI = ['Sahibinden', 'Galeriden', 'Yetkili Bayiden'];

export function IlanFiltreModal({ visible, onClose, filtre, onUygula, ikinciElModu, isMakineleriModu }) {
  const [yerel, setYerel] = useState(filtre || {});

  React.useEffect(() => {
    if (visible) setYerel(filtre || {});
  }, [visible, filtre]);

  const guncelle = (key, val) => setYerel((p) => ({ ...p, [key]: val }));

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.kutu}>
          <View style={styles.baslikSatir}>
            <Text style={styles.baslik}>Filtrele</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.icerik}>
            <Text style={styles.etiket}>Min fiyat (TL)</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={String(yerel.minFiyat ?? '')}
              onChangeText={(t) => guncelle('minFiyat', t.replace(/\D/g, ''))}
            />
            <Text style={styles.etiket}>Max fiyat (TL)</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={String(yerel.maxFiyat ?? '')}
              onChangeText={(t) => guncelle('maxFiyat', t.replace(/\D/g, ''))}
            />
            {ikinciElModu || isMakineleriModu ? (
              <>
                <Text style={styles.etiket}>Durum</Text>
                <View style={styles.secenekWrap}>
                  {(isMakineleriModu ? DURUM_IS_MAKINESI : DURUM_IKINCI_EL).map((d) => (
                    <SecenekChip
                      key={d}
                      label={d}
                      secili={yerel.durum === d}
                      onPress={() => guncelle('durum', yerel.durum === d ? '' : d)}
                    />
                  ))}
                </View>
                <Text style={styles.etiket}>Kimden</Text>
                <View style={styles.secenekWrap}>
                  {(isMakineleriModu ? KIMDEN_IS_MAKINESI : KIMDEN_IKINCI_EL).map((d) => (
                    <SecenekChip
                      key={d}
                      label={d}
                      secili={yerel.kimden === d}
                      onPress={() => guncelle('kimden', yerel.kimden === d ? '' : d)}
                    />
                  ))}
                </View>
              </>
            ) : null}
          </ScrollView>
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.temizleBtn}
              onPress={() => {
                setYerel({});
                onUygula({});
                onClose();
              }}
            >
              <Text style={styles.temizleText}>Temizle</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.uygulaBtn}
              onPress={() => {
                onUygula(yerel);
                onClose();
              }}
            >
              <Text style={styles.uygulaText}>Uygula</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function IlanSiralamaModal({ visible, onClose, siralama, onSec }) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.siraKutu}>
          {SIRALAMA_SECENEKLERI.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={styles.siraSatir}
              onPress={() => {
                onSec(s.id);
                onClose();
              }}
            >
              <Text style={[styles.siraText, siralama === s.id && styles.siraAktif]}>{s.label}</Text>
              {siralama === s.id ? <Ionicons name="checkmark" size={20} color={colors.primary} /> : null}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

function SecenekChip({ label, secili, onPress }) {
  return (
    <TouchableOpacity style={[styles.chip, secili && styles.chipAktif]} onPress={onPress}>
      <Text style={[styles.chipText, secili && styles.chipTextAktif]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  kutu: { backgroundColor: colors.surface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, maxHeight: '80%' },
  baslikSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  baslik: { fontSize: 18, fontWeight: '700', color: colors.text },
  icerik: { padding: spacing.lg },
  etiket: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 6, marginTop: spacing.sm },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.background,
  },
  secenekWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  chipAktif: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  chipText: { fontSize: 13, color: colors.textSecondary },
  chipTextAktif: { color: colors.primary, fontWeight: '600' },
  footer: { flexDirection: 'row', gap: spacing.sm, padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
  temizleBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  temizleText: { color: colors.primary, fontWeight: '700' },
  uygulaBtn: { flex: 1, paddingVertical: 14, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: 'center' },
  uygulaText: { color: colors.primaryText, fontWeight: '700' },
  siraKutu: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl * 2,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  siraSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  siraText: { fontSize: 16, color: colors.text },
  siraAktif: { color: colors.primary, fontWeight: '700' },
});
