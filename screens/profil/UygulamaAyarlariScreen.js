import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ProfilMenuSection, ProfilMenuRow } from '../../components/ProfilMenu';
import { colors } from '../../constants/theme';

export default function UygulamaAyarlariScreen({ navigation }) {
  return (
    <ScrollView style={styles.wrap} contentContainerStyle={styles.content}>
      <ProfilMenuSection>
        <ProfilMenuRow
          baslik="Dil tercihleri"
          onPress={() => navigation.navigate('DilTercihleri')}
          son
        />
      </ProfilMenuSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  content: { paddingTop: 8 },
});
