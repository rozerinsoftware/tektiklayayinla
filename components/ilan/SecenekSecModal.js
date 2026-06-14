import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../constants/theme';

const LISTE_MAX_YUKSEKLIK = Math.round(Dimensions.get('window').height * 0.55);

/**
 * Kaydırılabilir seçenek listesi (alt sayfa / bottom sheet).
 * Android'de Alert.alert en fazla 3 buton gösterdiği için select alanlarında bu modal kullanılır.
 */
export default function SecenekSecModal({
  gorunur,
  baslik,
  secenekler = [],
  seciliDeger,
  onSec,
  onKapat,
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={gorunur}
      transparent
      animationType="slide"
      onRequestClose={onKapat}
      statusBarTranslucent
    >
      <Pressable style={styles.arkaplan} onPress={onKapat}>
        <Pressable style={[styles.kart, { paddingBottom: insets.bottom + 8 }]} onPress={() => {}}>
          <View style={styles.baslikSatir}>
            <Text style={styles.baslik} numberOfLines={1}>
              {baslik}
            </Text>
            <TouchableOpacity
              onPress={onKapat}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={{ maxHeight: LISTE_MAX_YUKSEKLIK }}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            {secenekler.map((item, i) => {
              const secili = item === seciliDeger;
              return (
                <TouchableOpacity
                  key={`${item}-${i}`}
                  style={styles.satir}
                  onPress={() => onSec(item)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.satirMetin, secili && styles.satirMetinSecili]}>
                    {item}
                  </Text>
                  {secili ? (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  arkaplan: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  kart: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    maxHeight: '85%',
  },
  baslikSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  baslik: { fontSize: 17, fontWeight: '700', color: colors.text, flex: 1, marginRight: spacing.sm },
  satir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  satirMetin: { fontSize: 16, color: colors.text },
  satirMetinSecili: { color: colors.primary, fontWeight: '700' },
});
