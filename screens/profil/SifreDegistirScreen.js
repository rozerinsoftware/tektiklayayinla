import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { changePassword } from '../../auth';
import { PrimaryButton } from '../../components/ui';
import { colors, radius, spacing } from '../../constants/theme';

function SifreInput({ label, value, onChangeText, goster, onToggle }) {
  return (
    <View style={styles.alan}>
      <Text style={styles.etiket}>{label}</Text>
      <View style={styles.inputSatir}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!goster}
          placeholder={label}
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={onToggle} style={styles.goz}>
          <Ionicons name={goster ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function SifreDegistirScreen({ navigation }) {
  const [mevcut, setMevcut] = useState('');
  const [yeni, setYeni] = useState('');
  const [tekrar, setTekrar] = useState('');
  const [goster, setGoster] = useState({ m: false, y: false, t: false });
  const [yukleniyor, setYukleniyor] = useState(false);

  const degistir = async () => {
    if (!mevcut || !yeni || !tekrar) {
      Alert.alert('Uyarı', 'Tüm alanları doldurun.');
      return;
    }
    if (yeni.length < 6) {
      Alert.alert('Uyarı', 'Yeni şifre en az 6 karakter olmalı.');
      return;
    }
    if (yeni !== tekrar) {
      Alert.alert('Uyarı', 'Yeni şifreler eşleşmiyor.');
      return;
    }
    try {
      setYukleniyor(true);
      await changePassword(mevcut, yeni);
      Alert.alert('Başarılı', 'Şifreniz güncellendi.', [
        { text: 'Tamam', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      const kod = e?.code || '';
      let mesaj = e?.message || 'Şifre değiştirilemedi.';
      if (kod === 'auth/wrong-password' || kod === 'auth/invalid-credential') {
        mesaj = 'Mevcut şifre hatalı.';
      }
      Alert.alert('Hata', mesaj);
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={styles.content}>
      <SifreInput
        label="Mevcut şifre"
        value={mevcut}
        onChangeText={setMevcut}
        goster={goster.m}
        onToggle={() => setGoster((s) => ({ ...s, m: !s.m }))}
      />
      <SifreInput
        label="Yeni şifre"
        value={yeni}
        onChangeText={setYeni}
        goster={goster.y}
        onToggle={() => setGoster((s) => ({ ...s, y: !s.y }))}
      />
      <SifreInput
        label="Yeni şifre (tekrar)"
        value={tekrar}
        onChangeText={setTekrar}
        goster={goster.t}
        onToggle={() => setGoster((s) => ({ ...s, t: !s.t }))}
      />
      <PrimaryButton title="Değiştir" onPress={degistir} loading={yukleniyor} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  alan: { marginBottom: spacing.lg },
  etiket: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  inputSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  input: { flex: 1, fontSize: 16, color: colors.text, paddingVertical: 14 },
  goz: { padding: 4 },
});
