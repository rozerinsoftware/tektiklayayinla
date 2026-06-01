/** Aynı stack içinde detay/liste ekranını üste ekler (başa dönmez). */
export function openIlanDetay(navigation, ilan) {
  if (!ilan?.id && !ilan?.baslik) return;
  navigation.push('IlanDetay', { ilan });
}

export function openIlanListesi(navigation, params) {
  navigation.push('IlanListesi', {
    aramaModu: true,
    ...params,
  });
}
