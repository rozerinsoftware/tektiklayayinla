import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '../constants/theme';

export function PrimaryButton({ title, onPress, loading, disabled, icon }) {
  return (
    <TouchableOpacity
      style={[styles.primaryBtn, (disabled || loading) && styles.btnDisabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={colors.primaryText} />
      ) : (
        <View style={styles.btnRow}>
          {icon ? <Ionicons name={icon} size={20} color={colors.primaryText} style={styles.btnIcon} /> : null}
          <Text style={styles.primaryBtnText}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export function SecondaryButton({ title, onPress, icon, danger }) {
  return (
    <TouchableOpacity
      style={[styles.secondaryBtn, danger && styles.secondaryDanger]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.btnRow}>
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={danger ? colors.danger : colors.text}
            style={styles.btnIcon}
          />
        ) : null}
        <Text style={[styles.secondaryBtnText, danger && styles.secondaryDangerText]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

export function AppInput({ label, icon, style, ...props }) {
  return (
    <View style={styles.inputWrap}>
      {label ? <Text style={styles.inputLabel}>{label}</Text> : null}
      <View style={styles.inputBox}>
        {icon ? (
          <Ionicons name={icon} size={20} color={colors.textMuted} style={styles.inputIcon} />
        ) : null}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.cursor}
          cursorColor={colors.cursor}
          {...props}
        />
      </View>
    </View>
  );
}

export function SectionTitle({ icon, title, subtitle }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionRow}>
        {icon ? (
          <View style={styles.sectionIconBg}>
            <Ionicons name={icon} size={18} color={colors.primary} />
          </View>
        ) : null}
        <View style={styles.sectionText}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle ? <Text style={styles.sectionSub}>{subtitle}</Text> : null}
        </View>
      </View>
    </View>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.md,
    alignItems: 'center',
    ...shadow.card,
  },
  primaryBtnText: { color: colors.primaryText, fontSize: 16, fontWeight: '700' },
  secondaryBtn: {
    backgroundColor: colors.surface,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryBtnText: { color: colors.text, fontSize: 15, fontWeight: '600' },
  secondaryDanger: { borderColor: '#FECACA', backgroundColor: '#FEF2F2' },
  secondaryDangerText: { color: colors.danger },
  btnDisabled: { opacity: 0.65 },
  btnRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  btnIcon: { marginRight: 8 },
  inputWrap: { marginBottom: spacing.md },
  inputLabel: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    ...shadow.card,
  },
  inputIcon: { marginRight: spacing.sm },
  input: { flex: 1, paddingVertical: 14, fontSize: 15, color: colors.text },
  section: { marginBottom: spacing.md, marginTop: spacing.sm },
  sectionRow: { flexDirection: 'row', alignItems: 'center' },
  sectionIconBg: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  sectionSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  sectionText: { flex: 1 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
});
