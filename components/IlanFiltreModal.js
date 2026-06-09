import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../constants/theme';
import { SIRALAMA_SECENEKLERI } from '../utils/ilanYardimci';
import { KONUM_SECENEKLERI } from '../utils/konum';

const DURUM_IKINCI_EL = ['Sıfır', 'Sıfır Ayarında', 'İyi', 'Orta', 'Yıpranmış'];
const KIMDEN_IKINCI_EL = ['Sahibinden', 'Mağazadan'];
const DURUM_IS_MAKINESI = ['Sıfır', '2. El', 'Yenilenmiş'];
const KIMDEN_IS_MAKINESI = ['Sahibinden', 'Galeriden', 'Yetkili Bayiden'];

const IL_SECENEKLERI = [...new Set(KONUM_SECENEKLERI.map((k) => k.il).filter(Boolean))];

const ILAN_TARIHI_FILTRE = [
  { id: '', label: 'Tümü' },
  { id: '1', label: 'Son 24 saat' },
  { id: '3', label: 'Son 3 gün' },
  { id: '7', label: 'Son 7 gün' },
  { id: '15', label: 'Son 15 gün' },
  { id: '30', label: 'Son 30 gün' },
];

const EKRAN_YUKSEKLIGI = Dimensions.get('window').height;
const SHEET_YUKSEKLIGI = EKRAN_YUKSEKLIGI * 0.88;
const SCROLL_YUKSEKLIGI = SHEET_YUKSEKLIGI - 132;

const KATEGORI_FILTRE = [
  { id: '', label: 'Tümü' },
  { id: 'emlak', label: 'Emlak' },
  { id: 'vasita', label: 'Vasıta' },
  { id: 'ikinci-el', label: 'İkinci El' },
  { id: 'is-makineleri', label: 'İş Makineleri' },
];

export function IlanFiltreModal({
  visible,
  onClose,
  filtre,
  onUygula,
  ikinciElModu,
  isMakineleriModu,
  vitrinModu,
  sonucSayisi = 0,
}) {
  const [yerel, setYerel] = useState(filtre || {});

  React.useEffect(() => {
    if (visible) setYerel(filtre || {});
  }, [visible, filtre]);

  const guncelle = (key, val) => setYerel((p) => ({ ...p, [key]: val }));

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.kutu}>
          <View style={styles.baslikSatirMavi}>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.baslikMavi}>Filtrele</Text>
            <View style={{ width: 24 }} />
          </View>
          <ScrollView
            style={[styles.scroll, { maxHeight: SCROLL_YUKSEKLIGI }]}
            contentContainerStyle={styles.icerik}
            showsVerticalScrollIndicator
            keyboardShouldPersistTaps="handled"
            bounces
          >
            {vitrinModu ? (
              <>
                <Text style={styles.bolumBaslik}>SEÇENEKLER</Text>
                <Text style={styles.etiket}>Kategori</Text>
                <View style={styles.secenekWrap}>
                  {KATEGORI_FILTRE.map((k) => (
                    <SecenekChip
                      key={k.id || 'tumu'}
                      label={k.label}
                      secili={(yerel.kategoriKok || '') === k.id}
                      onPress={() => guncelle('kategoriKok', k.id)}
                    />
                  ))}
                </View>

                <Text style={styles.bolumBaslik}>DİĞER KRİTERLER</Text>
                <Text style={styles.etiket}>Adres (İl)</Text>
                <View style={styles.secenekWrap}>
                  <SecenekChip
                    label="Türkiye"
                    secili={!yerel.il}
                    onPress={() => guncelle('il', '')}
                  />
                  {IL_SECENEKLERI.map((il) => (
                    <SecenekChip
                      key={il}
                      label={il}
                      secili={yerel.il === il}
                      onPress={() => guncelle('il', yerel.il === il ? '' : il)}
                    />
                  ))}
                </View>

                <View style={styles.switchSatir}>
                  <Text style={styles.switchLabel}>Haritalı ilanlar</Text>
                  <Switch
                    value={Boolean(yerel.haritaliIlanlar)}
                    onValueChange={(v) => guncelle('haritaliIlanlar', v)}
                    trackColor={{ false: colors.border, true: colors.primary }}
                  />
                </View>
              </>
            ) : null}

            <Text style={styles.etiket}>İlan Tarihi</Text>
            <View style={styles.secenekWrap}>
              {ILAN_TARIHI_FILTRE.map((t) => (
                <SecenekChip
                  key={t.id || 'tumu-tarih'}
                  label={t.label}
                  secili={(yerel.ilanTarihiGun || '') === t.id}
                  onPress={() => guncelle('ilanTarihiGun', t.id)}
                />
              ))}
            </View>

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
            <View style={styles.scrollAltBosluk} />
          </ScrollView>
          <View style={styles.footer}>
            {!vitrinModu ? (
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
            ) : null}
            <TouchableOpacity
              style={[styles.uygulaBtn, vitrinModu && styles.uygulaBtnTam]}
              onPress={() => {
                onUygula(yerel);
                onClose();
              }}
            >
              <Text style={styles.uygulaText}>
                {vitrinModu ? `${sonucSayisi} ilanı görüntüle` : 'Uygula'}
              </Text>
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
          <View style={styles.siraBaslikSatir}>
            <Text style={styles.siraBaslik}>Sıralama</Text>
            <Ionicons name="help-circle-outline" size={20} color={colors.textMuted} />
          </View>
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
              {siralama === s.id ? (
                <Ionicons name="checkmark-circle" size={22} color="#2E7D32" />
              ) : (
                <View style={styles.siraBos} />
              )}
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
  kutu: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    maxHeight: SHEET_YUKSEKLIGI,
    width: '100%',
  },
  scroll: { width: '100%' },
  baslikSatirMavi: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    backgroundColor: colors.headerBg,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  baslikMavi: { fontSize: 17, fontWeight: '700', color: colors.primaryText },
  baslikSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  baslik: { fontSize: 18, fontWeight: '700', color: colors.text },
  icerik: { padding: spacing.lg, paddingBottom: spacing.md },
  scrollAltBosluk: { height: spacing.lg },
  bolumBaslik: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  filtreSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
  },
  filtreSatirLabel: { flex: 1, fontSize: 15, color: colors.text },
  filtreSatirDeger: { fontSize: 14, color: colors.textSecondary, marginRight: 4 },
  switchSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    marginTop: spacing.sm,
  },
  switchLabel: { fontSize: 15, color: colors.text },
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
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.lg,
    paddingBottom: spacing.lg + 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
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
  uygulaBtnTam: { flex: 1 },
  uygulaText: { color: colors.primaryText, fontWeight: '700', fontSize: 15 },
  siraKutu: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl * 2,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  siraBaslikSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  siraBaslik: { fontSize: 17, fontWeight: '700', color: colors.text },
  siraSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  siraText: { fontSize: 15, color: colors.text, flex: 1, paddingRight: 8 },
  siraAktif: { fontWeight: '600' },
  siraBos: { width: 22 },
});
