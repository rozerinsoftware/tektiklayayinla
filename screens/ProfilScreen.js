import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getFirebaseAuth, signOutUser } from '../auth';
import { getIlanlar, getUserProfile, ensureUserProfile, isCurrentUserAdmin } from '../api';
import { kokNavigasyon } from '../utils/requireAuth';
import { bildirimZilineBas } from '../utils/bildirimNav';
import { mesajlaraGit } from '../utils/mesajNav';
import { ProfilMenuSection, ProfilMenuRow } from '../components/ProfilMenu';
import { colors, radius, spacing } from '../constants/theme';

function ilanYayinda(ilan) {
  return Array.isArray(ilan.platformlar) && ilan.platformlar.length > 0;
}

export default function ProfilScreen({ navigation }) {
  const [admin, setAdmin] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kullanici, setKullanici] = useState(getFirebaseAuth().currentUser);
  const [gorunenAd, setGorunenAd] = useState('');
  const [arama, setArama] = useState('');
  const [sayilar, setSayilar] = useState({ yayinda: 0, yayindaDegil: 0 });

  useFocusEffect(
    useCallback(() => {
      const auth = getFirebaseAuth();
      const user = auth.currentUser;
      if (user && !user.emailVerified) {
        signOutUser().catch(() => null);
        setKullanici(null);
        setAdmin(false);
        setYukleniyor(false);
        setGorunenAd('');
        return;
      }
      setKullanici(user);
      if (!user) {
        setAdmin(false);
        setYukleniyor(false);
        setGorunenAd('');
        return;
      }
      let aktif = true;
      (async () => {
        try {
          setYukleniyor(true);
          await ensureUserProfile().catch(() => null);
          const [adminMi, profil, ilanlar] = await Promise.all([
            isCurrentUserAdmin(),
            getUserProfile().catch(() => null),
            getIlanlar().catch(() => []),
          ]);
          if (!aktif) return;
          setAdmin(adminMi);
          const tamAd =
            profil && (profil.ad || profil.soyad)
              ? `${profil.ad || ''} ${profil.soyad || ''}`.trim()
              : '';
          const isim =
            profil?.gorunenAd || tamAd || auth.currentUser?.displayName || 'Kullanıcı';
          setGorunenAd(isim);
          const yayinda = ilanlar.filter(ilanYayinda).length;
          setSayilar({ yayinda, yayindaDegil: ilanlar.length - yayinda });
        } catch {
          if (aktif) {
            setAdmin(false);
            setGorunenAd(auth.currentUser?.displayName || 'Kullanıcı');
          }
        } finally {
          if (aktif) setYukleniyor(false);
        }
      })();
      return () => {
        aktif = false;
      };
    }, [])
  );

  const rootNav = () => kokNavigasyon(navigation);
  const aramaKucuk = arama.trim().toLowerCase();

  const menuGoster = (anahtar) => {
    if (!aramaKucuk) return true;
    return anahtar.toLowerCase().includes(aramaKucuk);
  };

  const cikisYap = () => {
    Alert.alert('Çıkış', 'Hesabınızdan çıkmak istiyor musunuz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Çıkış Yap',
        style: 'destructive',
        onPress: async () => {
          await signOutUser();
          setKullanici(null);
          setAdmin(false);
          rootNav().navigate('Giris');
        },
      },
    ]);
  };

  const misafirGiris = (mesaj = 'Bu özellik için giriş yapmalısınız.') => {
    Alert.alert('Giriş gerekli', mesaj, [
      { text: 'İptal', style: 'cancel' },
      { text: 'Giriş yap', onPress: () => rootNav().navigate('Giris') },
      { text: 'Hesap aç', onPress: () => rootNav().navigate('KayitEmail') },
    ]);
  };

  if (!kullanici) {
    return (
      <View style={styles.container}>
        <SafeAreaView edges={['top']} style={styles.maviHeader}>
          <View style={styles.headerUst}>
            <View style={styles.logoKutu}>
              <Text style={styles.logoHarf}>T</Text>
            </View>
            <View style={styles.headerOrta}>
              <Text style={styles.headerBaslik}>Profilim</Text>
              <Text style={styles.headerAlt}>Bana özel</Text>
            </View>
            <TouchableOpacity hitSlop={12} style={styles.zil} onPress={() => bildirimZilineBas(navigation)}>
              <Ionicons name="notifications-outline" size={24} color={colors.primaryText} />
            </TouchableOpacity>
          </View>
          <View style={styles.aramaKutu}>
            <Ionicons name="search" size={20} color={colors.textMuted} />
            <TextInput
              style={styles.aramaInput}
              placeholder="İşlem ara"
              placeholderTextColor={colors.textMuted}
              value={arama}
              onChangeText={setArama}
              selectionColor={colors.cursor}
            />
          </View>
        </SafeAreaView>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {menuGoster('hesap') ? (
            <ProfilMenuSection>
              <ProfilMenuRow
                icon="person-add-outline"
                baslik="Hesap aç"
                onPress={() => rootNav().navigate('KayitEmail')}
              />
              <ProfilMenuRow
                icon="log-in-outline"
                baslik="Giriş yap"
                onPress={() => rootNav().navigate('Giris')}
                son
              />
            </ProfilMenuSection>
          ) : null}

          {menuGoster('ilan') ? (
            <ProfilMenuSection baslik="İLAN YÖNETİMİ">
              <ProfilMenuRow
                icon="document-text-outline"
                baslik="İlanlarım"
                onPress={() => misafirGiris('İlanlarınızı görmek için giriş yapın.')}
                son
              />
            </ProfilMenuSection>
          ) : null}

          {menuGoster('favori') ? (
            <ProfilMenuSection baslik="FAVORİLERİM">
              <ProfilMenuRow
                icon="star-outline"
                baslik="Favori ilanlarım"
                onPress={() => misafirGiris()}
              />
              <ProfilMenuRow
                icon="search-outline"
                baslik="Favori aramalarım"
                onPress={() => misafirGiris()}
              />
              <ProfilMenuRow
                icon="storefront-outline"
                baslik="Favori satıcılarım"
                onPress={() => misafirGiris()}
                son
              />
            </ProfilMenuSection>
          ) : null}

          {menuGoster('mesaj') ? (
            <ProfilMenuSection baslik="MESAJLAŞMA">
              <ProfilMenuRow
                icon="chatbubble-outline"
                baslik="Mesajlar"
                onPress={() => mesajlaraGit(navigation)}
                son
              />
            </ProfilMenuSection>
          ) : null}

          {menuGoster('ayar') ? (
            <ProfilMenuSection baslik="HESABIM VE AYARLAR">
              <ProfilMenuRow
                icon="settings-outline"
                baslik="Uygulama ayarları"
                onPress={() => navigation.navigate('UygulamaAyarlari')}
                son
              />
            </ProfilMenuSection>
          ) : null}

          {menuGoster('qr') ||
          menuGoster('yardım') ||
          menuGoster('yardim') ||
          menuGoster('gizlilik') ||
          menuGoster('iletisim') ||
          menuGoster('iletişim') ||
          menuGoster('hakkım') ? (
            <ProfilMenuSection baslik="DİĞER">
              {menuGoster('qr') ? (
                <ProfilMenuRow
                  icon="qr-code-outline"
                  baslik="QR işlemleri"
                  onPress={() => navigation.navigate('DigerProfil', { tip: 'qr' })}
                />
              ) : null}
              {menuGoster('yardım') || menuGoster('yardim') ? (
                <ProfilMenuRow
                  icon="help-circle-outline"
                  baslik="Yardım merkezi"
                  onPress={() => navigation.navigate('KurumsalBilgi', { baslangic: 'yardim' })}
                />
              ) : null}
              {menuGoster('gizlilik') ? (
                <ProfilMenuRow
                  icon="lock-closed-outline"
                  baslik="Gizlilik ve kullanım"
                  onPress={() => navigation.navigate('KurumsalBilgi', { baslangic: 'kvkk' })}
                />
              ) : null}
              {menuGoster('iletisim') || menuGoster('iletişim') ? (
                <ProfilMenuRow
                  icon="mail-outline"
                  baslik="İletişim"
                  onPress={() => navigation.navigate('KurumsalBilgi', { baslangic: 'iletisim' })}
                />
              ) : null}
              {menuGoster('hakkım') || menuGoster('hakkinda') ? (
                <ProfilMenuRow
                  icon="information-circle-outline"
                  baslik="Hakkımızda"
                  onPress={() => navigation.navigate('KurumsalBilgi', { baslangic: 'hakkimizda' })}
                  son={
                    !(
                      menuGoster('qr') ||
                      menuGoster('yardım') ||
                      menuGoster('yardim') ||
                      menuGoster('gizlilik') ||
                      menuGoster('iletisim') ||
                      menuGoster('iletişim')
                    )
                  }
                />
              ) : null}
            </ProfilMenuSection>
          ) : null}

          <Text style={styles.surum}>Tek Tıkla Yayınla</Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.maviHeader}>
        <View style={styles.headerUst}>
          <View style={styles.logoKutu}>
            <Text style={styles.logoHarf}>T</Text>
          </View>
          <View style={styles.headerOrta}>
            <Text style={styles.headerBaslik}>Profilim</Text>
            <Text style={styles.headerAlt} numberOfLines={1}>
              {gorunenAd}
            </Text>
          </View>
          <TouchableOpacity hitSlop={12} style={styles.zil} onPress={() => bildirimZilineBas(navigation)}>
            <Ionicons name="notifications-outline" size={24} color={colors.primaryText} />
          </TouchableOpacity>
        </View>
        <View style={styles.aramaKutu}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.aramaInput}
            placeholder="İşlem ara"
            placeholderTextColor={colors.textMuted}
            value={arama}
            onChangeText={setArama}
            selectionColor={colors.cursor}
          />
        </View>
      </SafeAreaView>

      {yukleniyor ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : null}

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {admin && menuGoster('admin') ? (
          <ProfilMenuSection baslik="YÖNETİM">
            <ProfilMenuRow
              icon="shield-checkmark-outline"
              baslik="Admin Paneli"
              alt="Tüm ilanlar ve kullanıcılar"
              onPress={() => navigation.navigate('AdminPanel')}
            />
          </ProfilMenuSection>
        ) : null}

        {menuGoster('ilan') ? (
          <ProfilMenuSection baslik="İLAN YÖNETİMİ">
            <ProfilMenuRow
              icon="document-text-outline"
              baslik={`Yayında olanlar (${sayilar.yayinda})`}
              onPress={() => navigation.navigate('YayindaIlanlar', { mod: 'yayinda' })}
            />
            <ProfilMenuRow
              icon="document-outline"
              baslik={`Yayında olmayanlar (${sayilar.yayindaDegil})`}
              onPress={() => navigation.navigate('YayindaOlmayanIlanlar', { mod: 'pasif' })}
              son
            />
          </ProfilMenuSection>
        ) : null}

        {menuGoster('favori') ? (
          <ProfilMenuSection baslik="FAVORİLERİM">
            <ProfilMenuRow
              icon="star-outline"
              baslik="Favori ilanlarım"
              onPress={() => navigation.navigate('FavoriIlanlar', { tip: 'ilan' })}
            />
            <ProfilMenuRow
              icon="search-outline"
              baslik="Favori aramalarım"
              onPress={() => navigation.navigate('FavoriAramalar', { tip: 'arama' })}
            />
            <ProfilMenuRow
              icon="storefront-outline"
              baslik="Favori satıcılarım"
              onPress={() => navigation.navigate('FavoriSaticilar', { tip: 'satici' })}
              son
            />
          </ProfilMenuSection>
        ) : null}

        {menuGoster('mesaj') ? (
          <ProfilMenuSection baslik="MESAJLAŞMA">
            <ProfilMenuRow
              icon="chatbubble-outline"
              baslik="Mesajlar"
              onPress={() => mesajlaraGit(navigation)}
              son
            />
          </ProfilMenuSection>
        ) : null}

        {menuGoster('hesap') ? (
          <ProfilMenuSection baslik="HESABIM VE AYARLAR">
            <ProfilMenuRow
              icon="person-outline"
              baslik="Hesap bilgilerim"
              onPress={() => navigation.navigate('HesapBilgileri')}
            />
            <ProfilMenuRow
              icon="shield-checkmark-outline"
              baslik="Hesap güvenliği"
              onPress={() => navigation.navigate('HesapGuvenligi')}
            />
            <ProfilMenuRow
              icon="settings-outline"
              baslik="Uygulama ayarları"
              onPress={() => navigation.navigate('UygulamaAyarlari')}
              son
            />
          </ProfilMenuSection>
        ) : null}

        {menuGoster('qr') ||
        menuGoster('yardım') ||
        menuGoster('yardim') ||
        menuGoster('gizlilik') ||
        menuGoster('hakkım') ||
        menuGoster('hakkinda') ? (
          <ProfilMenuSection baslik="DİĞER">
            {menuGoster('qr') ? (
              <ProfilMenuRow
                icon="qr-code-outline"
                baslik="QR işlemleri"
                onPress={() => navigation.navigate('DigerProfil', { tip: 'qr' })}
              />
            ) : null}
            {menuGoster('yardım') || menuGoster('yardim') ? (
              <ProfilMenuRow
                icon="help-circle-outline"
                baslik="Yardım merkezi"
                onPress={() => navigation.navigate('KurumsalBilgi', { baslangic: 'yardim' })}
              />
            ) : null}
            {menuGoster('gizlilik') ? (
              <ProfilMenuRow
                icon="lock-closed-outline"
                baslik="Gizlilik ve kullanım"
                onPress={() => navigation.navigate('KurumsalBilgi', { baslangic: 'kvkk' })}
              />
            ) : null}
            {menuGoster('iletisim') || menuGoster('iletişim') ? (
              <ProfilMenuRow
                icon="mail-outline"
                baslik="İletişim"
                onPress={() => navigation.navigate('KurumsalBilgi', { baslangic: 'iletisim' })}
              />
            ) : null}
            {menuGoster('hakkım') || menuGoster('hakkinda') || menuGoster('hakkimizda') ? (
              <ProfilMenuRow
                icon="information-circle-outline"
                baslik="Hakkımızda"
                onPress={() => navigation.navigate('KurumsalBilgi', { baslangic: 'hakkimizda' })}
                son={
                  !(
                    menuGoster('qr') ||
                    menuGoster('yardım') ||
                    menuGoster('yardim') ||
                    menuGoster('gizlilik') ||
                    menuGoster('iletisim') ||
                    menuGoster('iletişim')
                  )
                }
              />
            ) : null}
          </ProfilMenuSection>
        ) : null}

        <ProfilMenuSection>
          <ProfilMenuRow icon="log-out-outline" baslik="Çıkış yap" onPress={cikisYap} son tehlikeli />
        </ProfilMenuSection>

        <Text style={styles.surum}>Tek Tıkla Yayınla</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  maviHeader: { backgroundColor: colors.headerBg, paddingBottom: spacing.md },
  headerUst: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  logoKutu: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FACC15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  logoHarf: { fontSize: 18, fontWeight: '900', color: '#1A1A1A' },
  headerOrta: { flex: 1 },
  headerBaslik: { fontSize: 18, fontWeight: '800', color: colors.primaryText },
  headerAlt: { fontSize: 13, color: colors.primaryText, opacity: 0.9, marginTop: 2 },
  zil: { padding: 4 },
  aramaKutu: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    height: 44,
    gap: spacing.sm,
  },
  aramaInput: { flex: 1, fontSize: 15, color: colors.text },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  loader: { marginVertical: spacing.md },
  surum: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  misafirContent: { flexGrow: 1 },
  misafirGovde: { padding: spacing.lg, alignItems: 'stretch' },
  avatarBuyuk: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.surface,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  misafirBaslik: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  misafirMetin: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  kayitBtn: { alignItems: 'center', marginTop: spacing.md, padding: spacing.md },
  kayitBtnText: { fontSize: 15, fontWeight: '600', color: colors.link },
});
