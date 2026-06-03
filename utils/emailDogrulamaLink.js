import { applyActionCode, getAuth } from 'firebase/auth';

function queryParam(url, key) {
  const match = url.match(new RegExp(`[?&]${key}=([^&]+)`));
  return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;
}

/** Firebase onay mailindeki URL'den oobCode çıkarır */
export function authLinkindenKodCikar(url) {
  if (!url || typeof url !== 'string') return null;

  const mode = queryParam(url, 'mode');
  const oobCode = queryParam(url, 'oobCode');
  if (mode === 'verifyEmail' && oobCode) return oobCode;

  if (url.includes('verifyEmail')) {
    const match = url.match(/oobCode=([^&]+)/);
    if (match) return decodeURIComponent(match[1]);
  }
  return null;
}

export function onayLinkiMi(url) {
  return !!authLinkindenKodCikar(url);
}

/** E-posta doğrulama kodunu Firebase'e uygular */
export async function emailDogrulamaLinkiniIsle(url) {
  const oobCode = authLinkindenKodCikar(url);
  if (!oobCode) {
    return { ok: false, reason: 'Geçersiz veya eksik onay bağlantısı.' };
  }
  await applyActionCode(getAuth(), oobCode);
  return { ok: true };
}
