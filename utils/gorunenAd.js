/** Ad + soyaddan Sahibinden tarzı görünen ad seçenekleri */
export function gorunenAdSecenekleri(ad, soyad) {
  const a = String(ad || '').trim();
  const s = String(soyad || '').trim();
  if (!a && !s) return [];
  const parcalar = a.split(/\s+/).filter(Boolean);
  const ilkAd = parcalar[0] || a;
  const sonAd = parcalar.length > 1 ? parcalar[parcalar.length - 1] : '';
  const orta = parcalar.length > 2 ? parcalar.slice(1, -1).join(' ') : '';
  const sHarf = s ? `${s.charAt(0).toUpperCase()}.` : '';

  const set = new Set();
  if (a && s) set.add(`${a} ${s}`);
  if (ilkAd && s) set.add(`${ilkAd} ${s}`);
  if (orta && s) set.add(`${orta} ${s}`);
  if (sonAd && s) set.add(`${sonAd} ${s}`);
  if (ilkAd && sHarf) set.add(`${ilkAd} ${sHarf}`);
  if (sonAd && sHarf) set.add(`${sonAd} ${sHarf}`);
  if (a && sHarf) set.add(`${a} ${sHarf}`);
  if (a && !s) set.add(a);
  if (!a && s) set.add(s);

  return [...set].filter(Boolean);
}

export function varsayilanGorunenAd(ad, soyad, mevcut) {
  if (mevcut) return mevcut;
  const liste = gorunenAdSecenekleri(ad, soyad);
  return liste[0] || '';
}
