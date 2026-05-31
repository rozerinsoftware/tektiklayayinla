/** Sahibinden tarzı ilan uygulaması renk paleti */
export const colors = {
  primary: '#FFC800',
  primaryDark: '#E6B400',
  primaryText: '#1A1A1A',
  background: '#F0F2F5',
  surface: '#FFFFFF',
  border: '#E4E7EC',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  price: '#1A1A1A',
  link: '#2563EB',
  success: '#059669',
  danger: '#DC2626',
  headerBg: '#FFC800',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
};

export const tabBarOptions = {
  tabBarActiveTintColor: colors.primaryText,
  tabBarInactiveTintColor: colors.textMuted,
  tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
};

export const stackScreenOptions = {
  headerStyle: { backgroundColor: colors.headerBg },
  headerTintColor: colors.primaryText,
  headerTitleStyle: { fontWeight: '700', fontSize: 17 },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.background },
};

export const KATEGORI_META = {
  Emlak: { emoji: '🏠', renk: '#0D9488', bg: '#CCFBF1' },
  Araç: { emoji: '🚗', renk: '#EA580C', bg: '#FFEDD5' },
  'İkinci El': { emoji: '📦', renk: '#7C3AED', bg: '#EDE9FE' },
};

export function getKategoriMeta(kategori) {
  return KATEGORI_META[kategori] || { emoji: '📋', renk: '#6B7280', bg: '#F3F4F6' };
}

export function formatFiyat(fiyat) {
  const n = Number(String(fiyat ?? '').replace(/\D/g, ''));
  if (!Number.isFinite(n)) return String(fiyat ?? '');
  return `${n.toLocaleString('tr-TR')} TL`;
}
