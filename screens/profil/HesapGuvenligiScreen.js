import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ProfilMenuSection, ProfilMenuRow } from '../../components/ProfilMenu';
import { colors } from '../../constants/theme';

export default function HesapGuvenligiScreen({ navigation }) {
  return (
    <ScrollView style={styles.wrap}>
      <ProfilMenuSection>
        <ProfilMenuRow
          icon="key-outline"
          baslik="Şifre değiştirme"
          onPress={() => navigation.navigate('SifreDegistir')}
        />
        <ProfilMenuRow
          icon="shield-checkmark-outline"
          baslik="2 aşamalı doğrulama"
          onPress={() => navigation.navigate('IkiAsamaliDogrulama')}
        />
        <ProfilMenuRow
          icon="checkmark-circle-outline"
          baslik="Hesap doğrulama"
          onPress={() => navigation.navigate('HesapDogrulama')}
        />
        <ProfilMenuRow
          icon="ban-outline"
          baslik="Engellediğim hesap sahipleri"
          onPress={() => navigation.navigate('EngellenenHesaplar')}
          son
        />
      </ProfilMenuSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
});
