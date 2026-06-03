import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  BASLANGIC_SAYFA,
  ICERIKLER,
  ILETISIM_ALANLARI,
  YOL_TARIFLERI,
  YASAL_LINKLER,
  GUVENLI_ALICI,
  GUVENLI_SATICI,
  DESTEK_EPOSTA,
  menuBul,
  sayfaBasligi,
} from '../../constants/kurumsalIcerik';
import { konumHaritadaAc } from '../../utils/konum';
import { colors, spacing, radius } from '../../constants/theme';

const OFIS_KONUM = {
  latitude: 40.9923,
  longitude: 29.1244,
  etiket: 'Ataşehir, İstanbul',
};

function MenuSatir({ item, secili, onPress, son }) {
  const ok = item.tip === 'grup';
  return (
    <TouchableOpacity
      style={[styles.menuSatir, secili && styles.menuSecili, son && styles.menuSon]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {item.geri ? (
        <Ionicons name="chevron-back" size={18} color={colors.textSecondary} style={styles.menuGeri} />
      ) : null}
      <Text style={[styles.menuEtiket, secili && styles.menuEtiketSecili]}>{item.etiket}</Text>
      {ok ? <Ionicons name="chevron-forward" size={18} color={colors.textMuted} /> : null}
    </TouchableOpacity>
  );
}

function BilgiAlani({ etiket, deger, link }) {
  return (
    <View style={styles.alan}>
      <Text style={styles.alanEtiket}>{etiket}</Text>
      {link ? (
        <TouchableOpacity onPress={() => Linking.openURL(link)}>
          <Text style={styles.alanLink}>{deger}</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.alanDeger}>{deger}</Text>
      )}
    </View>
  );
}

function YolAdimlari({ renk, adimlar }) {
  return (
    <View style={styles.yolBlok}>
      {adimlar.map((metin, i) => (
        <View key={i} style={styles.yolSatir}>
          <View style={[styles.yolNo, { backgroundColor: renk }]}>
            <Text style={styles.yolNoText}>{i + 1}</Text>
          </View>
          <Text style={styles.yolMetin}>{metin}</Text>
        </View>
      ))}
    </View>
  );
}

function GuvenliIcerik() {
  const [sekme, setSekme] = useState('alici');
  const [acik, setAcik] = useState({});
  const veri = sekme === 'alici' ? GUVENLI_ALICI : GUVENLI_SATICI;

  return (
    <View>
      <View style={styles.sekmeSatir}>
        {[
          { id: 'alici', label: 'Alıcıyım' },
          { id: 'satici', label: 'Satıcıyım' },
        ].map((s) => (
          <TouchableOpacity
            key={s.id}
            style={[styles.sekme, sekme === s.id && styles.sekmeAktif]}
            onPress={() => setSekme(s.id)}
          >
            <Text style={[styles.sekmeText, sekme === s.id && styles.sekmeTextAktif]}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {veri.giris.map((m, i) => (
        <Text key={i} style={styles.madde}>
          • {m}
        </Text>
      ))}
      {veri.bolumler.map((b) => {
        const ac = acik[b.id];
        return (
          <View key={b.id} style={styles.accordion}>
            <TouchableOpacity
              style={styles.accordionBas}
              onPress={() => setAcik((p) => ({ ...p, [b.id]: !p[b.id] }))}
            >
              <View style={[styles.accordionIkon, { backgroundColor: b.renk }]}>
                <Ionicons name={b.ikon} size={20} color="#fff" />
              </View>
              <Text style={styles.accordionBaslik}>{b.baslik}</Text>
              <Ionicons name={ac ? 'chevron-up' : 'chevron-down'} size={20} color={colors.primary} />
            </TouchableOpacity>
            {ac
              ? b.maddeler.map((m, i) => (
                  <Text key={i} style={styles.accordionMadde}>
                    • {m}
                  </Text>
                ))
              : null}
          </View>
        );
      })}
      <View style={styles.iletisimKutu}>
        <Ionicons name="chatbubble-ellipses-outline" size={28} color={colors.textMuted} />
        <Text style={styles.iletisimKutuBaslik}>Bizimle İletişime Geçin</Text>
        <Text style={styles.iletisimKutuMetin}>
          Şüpheli ilanları{' '}
          <Text style={styles.link} onPress={() => Linking.openURL(`mailto:${DESTEK_EPOSTA}`)}>
            {DESTEK_EPOSTA}
          </Text>{' '}
          adresine bildirin. T.C. kimlik no, şifre ve kart bilgilerinizi kimseyle paylaşmayın.
        </Text>
      </View>
      <Text style={styles.guvenliFooter}>
        Güvenli alışveriş ipuçlarına uyduğunuzda işlemlerinizin daha güvenli tamamlanacağını unutmayın.
      </Text>
    </View>
  );
}

function IletisimIcerik() {
  return (
    <View>
      {ILETISIM_ALANLARI.map((a, i) => (
        <BilgiAlani key={i} {...a} />
      ))}
      <TouchableOpacity
        style={styles.haritaBtn}
        onPress={() => konumHaritadaAc(OFIS_KONUM)}
      >
        <Ionicons name="map-outline" size={20} color={colors.primaryText} />
        <Text style={styles.haritaBtnText}>Haritayı büyük görmek için tıklayın</Text>
      </TouchableOpacity>
      <Text style={styles.altBolumBaslik}>Yol tarifi (örnek — Ataşehir)</Text>
      <YolAdimlari renk="#2563EB" adimlar={YOL_TARIFLERI.mavi} />
      <YolAdimlari renk="#DC2626" adimlar={YOL_TARIFLERI.kirmizi} />
      <Text style={styles.altBolumBaslik}>İlgili kanun ve yönetmelikler</Text>
      {YASAL_LINKLER.map((l, i) => (
        <TouchableOpacity key={i} onPress={() => Linking.openURL(l.url)}>
          <Text style={styles.yasalLink}>• {l.etiket}</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.cagriMerkezi}>
        * Destek konusunu bulamazsanız{' '}
        <Text style={styles.link} onPress={() => Linking.openURL(`mailto:${DESTEK_EPOSTA}`)}>
          {DESTEK_EPOSTA}
        </Text>{' '}
        üzerinden yazabilirsiniz.
      </Text>
      <Text style={styles.cagriMerkezi}>
        İstanbul Ticaret Odası davranış kuralları:{' '}
        <Text style={styles.link} onPress={() => Linking.openURL('https://www.ito.org.tr')}>
          www.ito.org.tr
        </Text>
      </Text>
    </View>
  );
}

function GovdeIcerik({ sayfaId }) {
  const sayfa = ICERIKLER[sayfaId];
  if (!sayfa) {
    return <Text style={styles.metin}>İçerik bulunamadı.</Text>;
  }
  if (sayfa.tip === 'guvenli') return <GuvenliIcerik />;
  if (sayfa.tip === 'iletisim') return <IletisimIcerik />;

  return (
    <>
      {(sayfa.govde || []).map((blok, i) => {
        if (blok.tip === 'baslik') {
          return (
            <Text key={i} style={styles.icerikBaslik}>
              {blok.metin}
            </Text>
          );
        }
        if (blok.tip === 'metin') {
          return (
            <Text key={i} style={styles.metin}>
              {blok.metin}
            </Text>
          );
        }
        if (blok.tip === 'altMenu') {
          return (
            <Text key={i} style={styles.altMenuNot}>
              İlgili alt başlıkları üst menüden seçebilirsiniz.
            </Text>
          );
        }
        return null;
      })}
    </>
  );
}

export default function KurumsalBilgiScreen({ navigation, route }) {
  const baslangic = route.params?.baslangic || 'hakkimizda';
  const ilkSayfa = BASLANGIC_SAYFA[baslangic] || baslangic;

  const [menuYol, setMenuYol] = useState(route.params?.menuYol || []);
  const [seciliSayfa, setSeciliSayfa] = useState(ilkSayfa);

  const { items: menuItems, baslik: grupBaslik } = useMemo(() => menuBul(menuYol), [menuYol]);

  const menuListe = useMemo(() => {
    const liste = [];
    if (menuYol.length > 0) {
      liste.push({
        id: '__geri',
        etiket: grupBaslik || 'Geri',
        tip: 'geri',
        geri: true,
      });
    }
    return [...liste, ...menuItems];
  }, [menuItems, menuYol, grupBaslik]);

  const menuTikla = (item) => {
    if (item.id === '__geri') {
      setMenuYol((y) => y.slice(0, -1));
      return;
    }
    if (item.tip === 'grup') {
      setMenuYol((y) => [...y, item.id]);
      return;
    }
    setSeciliSayfa(item.id);
  };

  const kapat = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('Profil');
  };

  const baslik = sayfaBasligi(seciliSayfa);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <Text style={styles.headerBaslik} numberOfLines={1}>
          {baslik}
        </Text>
        <TouchableOpacity onPress={kapat} hitSlop={12}>
          <Text style={styles.kapat}>Kapat</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <View style={styles.menuKutu}>
        {menuListe.map((item, i) => (
          <MenuSatir
            key={item.id}
            item={item}
            secili={item.tip === 'icerik' && seciliSayfa === item.id}
            onPress={() => menuTikla(item)}
            son={i === menuListe.length - 1}
          />
        ))}
      </View>

      <ScrollView style={styles.icerikScroll} contentContainerStyle={styles.icerikContent}>
        <View style={styles.icerikKart}>
          <Text style={styles.icerikKartBaslik}>{baslik}</Text>
          <View style={styles.ayrac} />
          <GovdeIcerik sayfaId={seciliSayfa} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.headerBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  headerBaslik: { flex: 1, fontSize: 17, fontWeight: '700', color: colors.primaryText },
  kapat: { fontSize: 16, fontWeight: '600', color: colors.primaryText },
  menuKutu: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    maxHeight: 280,
  },
  menuSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuSon: { borderBottomWidth: 0 },
  menuSecili: { backgroundColor: colors.primaryLight },
  menuGeri: { marginRight: 4 },
  menuEtiket: { flex: 1, fontSize: 16, color: colors.text, fontWeight: '500' },
  menuEtiketSecili: { color: colors.primary, fontWeight: '700' },
  icerikScroll: { flex: 1 },
  icerikContent: { padding: spacing.lg, paddingBottom: 40 },
  icerikKart: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icerikKartBaslik: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },
  ayrac: { height: 1, backgroundColor: colors.border, marginBottom: spacing.lg },
  metin: { fontSize: 15, color: colors.text, lineHeight: 24, marginBottom: spacing.md },
  icerikBaslik: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
    letterSpacing: 0.3,
  },
  altMenuNot: { fontSize: 14, color: colors.textSecondary, fontStyle: 'italic' },
  alan: { marginBottom: spacing.lg },
  alanEtiket: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 4 },
  alanDeger: { fontSize: 15, color: colors.text, lineHeight: 22 },
  alanLink: { fontSize: 15, color: colors.link, fontWeight: '600' },
  haritaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    marginVertical: spacing.lg,
  },
  haritaBtnText: { color: colors.primaryText, fontWeight: '700', fontSize: 15 },
  altBolumBaslik: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
  yolBlok: { marginBottom: spacing.md },
  yolSatir: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  yolNo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yolNoText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  yolMetin: { flex: 1, fontSize: 14, color: colors.text, lineHeight: 20 },
  yasalLink: { fontSize: 14, color: colors.link, marginBottom: 8, lineHeight: 20 },
  cagriMerkezi: { fontSize: 13, color: colors.textSecondary, lineHeight: 20, marginTop: spacing.md },
  link: { color: colors.link, fontWeight: '600' },
  sekmeSatir: { flexDirection: 'row', marginBottom: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  sekme: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  sekmeAktif: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  sekmeText: { fontSize: 15, color: colors.textMuted, fontWeight: '600' },
  sekmeTextAktif: { color: colors.primary },
  madde: { fontSize: 14, color: colors.text, lineHeight: 21, marginBottom: 6 },
  accordion: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  accordionBas: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: 10 },
  accordionIkon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accordionBaslik: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },
  accordionMadde: {
    fontSize: 14,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    lineHeight: 20,
  },
  iletisimKutu: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  iletisimKutuBaslik: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  iletisimKutuMetin: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: spacing.sm,
  },
  guvenliFooter: { fontSize: 13, color: colors.textMuted, lineHeight: 20, marginTop: spacing.lg },
});
