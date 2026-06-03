import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthLinkHandler from './components/AuthLinkHandler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import GirisScreen from './screens/GirisScreen';
import GirisBildirimScreen from './screens/GirisBildirimScreen';
import GirisMesajScreen from './screens/GirisMesajScreen';
import MesajDetayScreen from './screens/profil/MesajDetayScreen';
import BildirimlerScreen from './screens/profil/BildirimlerScreen';
import KayitEmailScreen from './screens/KayitEmailScreen';
import KayitDetayScreen from './screens/KayitDetayScreen';
import KayitTamamScreen from './screens/KayitTamamScreen';
import IkinciElVitrinScreen from './screens/IkinciElVitrinScreen';
import IlanListesiScreen from './screens/IlanListesiScreen';
import KategoriAnaScreen from './screens/KategoriAnaScreen';
import KategoriDetayScreen from './screens/KategoriDetayScreen';
import IlanEkleScreen from './screens/IlanEkleScreen';
import VasitaSecimScreen from './screens/ilan/VasitaSecimScreen';
import VasitaHesapDogrulamaScreen from './screens/ilan/VasitaHesapDogrulamaScreen';
import VasitaTemelBilgiScreen from './screens/ilan/VasitaTemelBilgiScreen';
import IlanKonumBaslangicScreen from './screens/ilan/IlanKonumBaslangicScreen';
import IlanKonumIsaretleScreen from './screens/ilan/IlanKonumIsaretleScreen';
import EmlakTemelBilgiScreen from './screens/ilan/EmlakTemelBilgiScreen';
import IkinciElUrunOzellikleriScreen from './screens/ilan/IkinciElUrunOzellikleriScreen';
import IkinciElIlanBilgileriScreen from './screens/ilan/IkinciElIlanBilgileriScreen';
import IkinciElTeslimatScreen from './screens/ilan/IkinciElTeslimatScreen';
import IkinciElFiyatScreen from './screens/ilan/IkinciElFiyatScreen';
import IsMakineleriTemelBilgiScreen from './screens/ilan/IsMakineleriTemelBilgiScreen';
import IlanYonetimScreen from './screens/profil/IlanYonetimScreen';
import IlanYayindanKaldirScreen from './screens/profil/IlanYayindanKaldirScreen';
import PlatformSecScreen from './screens/PlatformSecScreen';
import YayinlaScreen from './screens/YayinlaScreen';
import ProfilScreen from './screens/ProfilScreen';
import AdminPanelScreen from './screens/AdminPanelScreen';
import AdminIlanDuzenleScreen from './screens/AdminIlanDuzenleScreen';
import IlanDetayScreen from './screens/IlanDetayScreen';
import KullaniciIlanlarScreen from './screens/profil/KullaniciIlanlarScreen';
import FavoriListeScreen from './screens/profil/FavoriListeScreen';
import MesajlarScreen from './screens/profil/MesajlarScreen';
import HesapBilgileriScreen from './screens/profil/HesapBilgileriScreen';
import KisiselBilgilerScreen from './screens/profil/KisiselBilgilerScreen';
import AdSoyadDuzenleScreen from './screens/profil/AdSoyadDuzenleScreen';
import GorunenAdScreen from './screens/profil/GorunenAdScreen';
import TelefonDuzenleScreen from './screens/profil/TelefonDuzenleScreen';
import EmailBilgiScreen from './screens/profil/EmailBilgiScreen';
import HesapGuvenligiScreen from './screens/profil/HesapGuvenligiScreen';
import SifreDegistirScreen from './screens/profil/SifreDegistirScreen';
import IkiAsamaliDogrulamaScreen from './screens/profil/IkiAsamaliDogrulamaScreen';
import HesapDogrulamaScreen from './screens/profil/HesapDogrulamaScreen';
import EngellenenHesaplarScreen from './screens/profil/EngellenenHesaplarScreen';
import UygulamaAyarlariScreen from './screens/profil/UygulamaAyarlariScreen';
import AyarlarScreen from './screens/profil/AyarlarScreen';
import DilSecScreen from './screens/profil/DilSecScreen';
import DigerProfilScreen from './screens/profil/DigerProfilScreen';
import KurumsalBilgiScreen from './screens/profil/KurumsalBilgiScreen';
import { getCurrentUserId } from './auth';
import { girisIste } from './utils/requireAuth';
import { colors, stackScreenOptions, tabBarOptions } from './constants/theme';

const Stack = createNativeStackNavigator();
const ProfilStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const IlanStack = createNativeStackNavigator();

const profilAltEkran = (ad, baslik, component) => (
  <ProfilStack.Screen key={ad} name={ad} component={component} options={{ title: baslik, ...stackScreenOptions }} />
);

function ProfilFlow() {
  return (
    <ProfilStack.Navigator screenOptions={stackScreenOptions}>
      <ProfilStack.Screen name="Profil" component={ProfilScreen} options={{ headerShown: false }} />
      {profilAltEkran('YayindaIlanlar', 'İlanlarım', KullaniciIlanlarScreen)}
      {profilAltEkran('YayindaOlmayanIlanlar', 'Yayında Olmayanlar', KullaniciIlanlarScreen)}
      {profilAltEkran('IlanYonetim', 'İlan Yönetimi', IlanYonetimScreen)}
      {profilAltEkran('IlanYayindanKaldir', 'Yayından Kaldır', IlanYayindanKaldirScreen)}
      {profilAltEkran('FavoriIlanlar', 'Favori İlanlarım', FavoriListeScreen)}
      {profilAltEkran('FavoriAramalar', 'Favori Aramalarım', FavoriListeScreen)}
      {profilAltEkran('FavoriSaticilar', 'Favori Satıcılarım', FavoriListeScreen)}
      {profilAltEkran('Mesajlar', 'Mesajlar', MesajlarScreen)}
      {profilAltEkran('MesajDetay', 'Sohbet', MesajDetayScreen)}
      {profilAltEkran('Bildirimler', 'Bildirimler', BildirimlerScreen)}
      {profilAltEkran('HesapBilgileri', 'Hesap bilgilerim', HesapBilgileriScreen)}
      {profilAltEkran('KisiselBilgiler', 'Kişisel bilgilerim', KisiselBilgilerScreen)}
      {profilAltEkran('AdSoyadDuzenle', 'Ad soyad', AdSoyadDuzenleScreen)}
      {profilAltEkran('GorunenAd', 'Görünen ad soyad', GorunenAdScreen)}
      {profilAltEkran('TelefonDuzenle', 'Cep telefonu numarası', TelefonDuzenleScreen)}
      {profilAltEkran('EmailBilgi', 'E-posta adresi', EmailBilgiScreen)}
      {profilAltEkran('HesapGuvenligi', 'Hesap Güvenliği', HesapGuvenligiScreen)}
      {profilAltEkran('SifreDegistir', 'Şifre Değişikliği', SifreDegistirScreen)}
      {profilAltEkran('IkiAsamaliDogrulama', '2 Aşamalı Doğrulama', IkiAsamaliDogrulamaScreen)}
      {profilAltEkran('HesapDogrulama', 'Hesap Doğrulama', HesapDogrulamaScreen)}
      {profilAltEkran('EngellenenHesaplar', 'Engellediğim Hesap Sahipleri', EngellenenHesaplarScreen)}
      {profilAltEkran('UygulamaAyarlari', 'Uygulama ayarları', UygulamaAyarlariScreen)}
      {profilAltEkran('DilTercihleri', 'Ayarlar', AyarlarScreen)}
      {profilAltEkran('DilSec', 'Language', DilSecScreen)}
      <ProfilStack.Screen
        name="DigerProfil"
        component={DigerProfilScreen}
        options={{ title: 'QR İşlemleri', ...stackScreenOptions }}
      />
      <ProfilStack.Screen
        name="KurumsalBilgi"
        component={KurumsalBilgiScreen}
        options={{ headerShown: false, presentation: 'modal' }}
      />
      <ProfilStack.Screen name="IlanDetay" component={IlanDetayScreen} options={{ title: 'İlan Detayı' }} />
      <ProfilStack.Screen name="AdminPanel" component={AdminPanelScreen} options={{ title: 'Admin Paneli' }} />
      <ProfilStack.Screen
        name="AdminIlanDuzenle"
        component={AdminIlanDuzenleScreen}
        options={{ title: 'İlanı Düzenle' }}
      />
    </ProfilStack.Navigator>
  );
}

function IlanFlow() {
  return (
    <IlanStack.Navigator
      initialRouteName="KategoriAna"
      screenOptions={stackScreenOptions}
    >
      <IlanStack.Screen
        name="KategoriAna"
        component={KategoriAnaScreen}
        initialParams={{ secimModu: true }}
        options={{ title: 'İlan Ver' }}
      />
      <IlanStack.Screen
        name="KategoriDetay"
        component={KategoriDetayScreen}
        options={{ title: 'Alt Kategori' }}
      />
      <IlanStack.Screen name="IlanEkle" component={IlanEkleScreen} options={{ title: 'İlan Ekle' }} />
      <IlanStack.Screen name="VasitaSecim" component={VasitaSecimScreen} options={{ title: 'İlan Ver' }} />
      <IlanStack.Screen
        name="VasitaHesapDogrulama"
        component={VasitaHesapDogrulamaScreen}
        options={{ title: 'İlan Ver' }}
      />
      <IlanStack.Screen
        name="VasitaTemelBilgi"
        component={VasitaTemelBilgiScreen}
        options={{ title: 'Temel Bilgiler' }}
      />
      <IlanStack.Screen
        name="IlanKonumBaslangic"
        component={IlanKonumBaslangicScreen}
        options={{ title: 'Adres' }}
      />
      <IlanStack.Screen
        name="EmlakTemelBilgi"
        component={EmlakTemelBilgiScreen}
        options={{ title: 'Temel Bilgiler' }}
      />
      <IlanStack.Screen
        name="IkinciElUrunOzellikleri"
        component={IkinciElUrunOzellikleriScreen}
        options={{ title: 'Ürün Özellikleri' }}
      />
      <IlanStack.Screen
        name="IkinciElIlanBilgileri"
        component={IkinciElIlanBilgileriScreen}
        options={{ title: 'İlan Bilgileri' }}
      />
      <IlanStack.Screen
        name="IkinciElTeslimat"
        component={IkinciElTeslimatScreen}
        options={{ title: 'Teslimat' }}
      />
      <IlanStack.Screen
        name="IkinciElFiyat"
        component={IkinciElFiyatScreen}
        options={{ title: 'Fiyat' }}
      />
      <IlanStack.Screen
        name="IsMakineleriTemelBilgi"
        component={IsMakineleriTemelBilgiScreen}
        options={{ title: 'Temel Bilgiler' }}
      />
      <IlanStack.Screen
        name="IlanKonumIsaretle"
        component={IlanKonumIsaretleScreen}
        options={{ title: 'Konum' }}
      />
      <IlanStack.Screen name="PlatformSec" component={PlatformSecScreen} options={{ title: 'Platform Seç' }} />
      <IlanStack.Screen name="Yayinla" component={YayinlaScreen} options={{ title: 'Yayınla' }} />
    </IlanStack.Navigator>
  );
}

function AnaSayfaFlow() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="IlanListesi"
        component={IlanListesiScreen}
        initialParams={{ aramaModu: false }}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="IlanDetay" component={IlanDetayScreen} options={{ title: 'İlan Detayı' }} />
      <Stack.Screen name="MesajDetay" component={MesajDetayScreen} options={{ title: 'Sohbet' }} />
    </Stack.Navigator>
  );
}

function AraFlow() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="KategoriAna" component={KategoriAnaScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="IkinciElVitrin"
        component={IkinciElVitrinScreen}
        options={{ title: 'İkinci El ve Sıfır Alışveriş' }}
      />
      <Stack.Screen name="KategoriDetay" component={KategoriDetayScreen} />
      <Stack.Screen
        name="IlanListesi"
        component={IlanListesiScreen}
        options={{ title: 'İlanlar', headerShown: true }}
      />
      <Stack.Screen name="IlanDetay" component={IlanDetayScreen} options={{ title: 'İlan Detayı' }} />
      <Stack.Screen name="MesajDetay" component={MesajDetayScreen} options={{ title: 'Sohbet' }} />
    </Stack.Navigator>
  );
}

function AnaSayfa() {
  return <AnaSayfaFlow />;
}

function AraSayfa() {
  return <AraFlow />;
}

function TabNavigator() {
  const insets = useSafeAreaInsets();
  const altBosluk = Math.max(insets.bottom, 10);
  const tabYukseklik = 56 + altBosluk;

  const varsayilanTabBar = {
    paddingBottom: altBosluk,
    paddingTop: 8,
    height: tabYukseklik,
  };

  return (
    <Tab.Navigator
      screenOptions={{
        ...tabBarOptions,
        tabBarStyle: {
          ...varsayilanTabBar,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Ana Sayfa"
        component={AnaSayfa}
        options={{
          tabBarLabel: 'Vitrin',
          tabBarIcon: () => <Text style={{ fontSize: 22 }}>✨</Text>,
        }}
      />
      <Tab.Screen
        name="İlan Ver"
        component={IlanFlow}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!getCurrentUserId()) {
              e.preventDefault();
              girisIste(navigation);
            }
          },
        })}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 28 }}>➕</Text>,
          tabBarStyle: {
            paddingBottom: altBosluk + 6,
            paddingTop: 10,
            height: tabYukseklik + 12,
          },
        }}
      />
      <Tab.Screen
        name="Ara"
        component={AraSayfa}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>🔍</Text> }}
      />
      <Tab.Screen
        name="Profilim"
        component={ProfilFlow}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>👤</Text>, headerShown: false }}
      />
    </Tab.Navigator>
  );
}

const navLinking = {
  prefixes: ['tektiklayayinla://', 'https://tektiklayayinla.firebaseapp.com'],
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthLinkHandler />
      <NavigationContainer
        linking={navLinking}
        fallback={null}
        onUnhandledAction={() => {
          /* deep link auth dışı */
        }}
      >
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Giris" component={GirisScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name="GirisBildirim"
            component={GirisBildirimScreen}
            options={{ headerShown: false, presentation: 'modal' }}
          />
          <Stack.Screen
            name="GirisMesaj"
            component={GirisMesajScreen}
            options={{ headerShown: false, presentation: 'modal' }}
          />
          <Stack.Screen
            name="KurumsalBilgi"
            component={KurumsalBilgiScreen}
            options={{ headerShown: false, presentation: 'modal' }}
          />
          <Stack.Screen
            name="KayitEmail"
            component={KayitEmailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="KayitDetay"
            component={KayitDetayScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="KayitTamam"
            component={KayitTamamScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
