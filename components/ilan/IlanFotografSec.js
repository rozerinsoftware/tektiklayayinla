import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../constants/theme';

export default function IlanFotografSec({ fotograflar = [], onChange, max = 10 }) {
  const liste = Array.isArray(fotograflar) ? fotograflar : [];

  const fotoEkle = async () => {
    if (liste.length >= max) {
      Alert.alert('Limit', `En fazla ${max} fotoğraf ekleyebilirsiniz.`);
      return;
    }
    const izin = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!izin.granted) {
      Alert.alert('İzin gerekli', 'Galeri izni vermeniz gerekiyor.');
      return;
    }
    const sonuc = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: max - liste.length,
    });
    if (!sonuc.canceled && sonuc.assets?.length) {
      const yeni = sonuc.assets.map((a) => a.uri).filter(Boolean);
      onChange([...liste, ...yeni].slice(0, max));
    }
  };

  const fotoSil = (index) => {
    onChange(liste.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Fotoğraflar ({liste.length}/{max})</Text>
      {liste.length === 0 ? (
        <Text style={styles.ipucu}>
          Fotoğraf Ekle’ye basınca telefon galerisi açılır. Bir fotoğrafa dokun — seçince bu ekrana küçük önizleme gelir.
        </Text>
      ) : null}
      <View style={styles.satir}>
        <TouchableOpacity style={styles.ekle} onPress={fotoEkle}>
          <Ionicons name="add" size={28} color={colors.primary} />
          <Text style={styles.ekleText}>Fotoğraf Ekle</Text>
        </TouchableOpacity>
        {liste.map((uri, i) => (
          <TouchableOpacity key={uri + i} style={styles.kutu} onPress={() => fotoSil(i)}>
            <Image source={{ uri }} style={styles.onizleme} />
            <View style={styles.sil}>
              <Ionicons name="close" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  ipucu: { fontSize: 12, color: colors.textMuted, lineHeight: 17, marginBottom: spacing.sm },
  satir: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  ekle: {
    width: 88,
    height: 88,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  ekleText: { fontSize: 10, color: colors.primary, marginTop: 4, fontWeight: '600' },
  kutu: { position: 'relative' },
  onizleme: { width: 88, height: 88, borderRadius: radius.sm },
  sil: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
