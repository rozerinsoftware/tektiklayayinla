/** İlan Ver stack'inde güvenli geri / ana kategori listesi */
export function anaKategoriListesineDon(navigation) {
  try {
    const state = navigation.getState?.();
    if (state && state.index > 0) {
      navigation.popToTop();
      return;
    }
  } catch {
    // popToTop başarısız
  }
  navigation.navigate('KategoriAna', { secimModu: true });
}
