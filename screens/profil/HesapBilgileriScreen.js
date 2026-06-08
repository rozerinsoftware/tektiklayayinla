import React from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { ProfilMenuSection, ProfilMenuRow } from '../../components/ProfilMenu';
import { colors } from '../../constants/theme';

export default function HesapBilgileriScreen({ navigation }) {
  return (
    <ScrollView style={styles.wrap}>
      <ProfilMenuSection>
        <ProfilMenuRow
          icon="person-outline"
          baslik="Kişisel bilgilerim"
          alt="Ad, telefon, görünen ad"
          onPress={() => navigation.navigate('KisiselBilgiler')}
        />
        <ProfilMenuRow
          icon="close-circle-outline"
          baslik="Hesap iptali"
          alt="Hesabınızı kalıcı olarak silin"
          onPress={() => navigation.navigate('HesapSil')}
          son
        />
      </ProfilMenuSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
});
