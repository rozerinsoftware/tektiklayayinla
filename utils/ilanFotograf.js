import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { getStorageInstance } from '../firebase';

function medyaConfig() {
  const extra = Constants.expoConfig?.extra || {};
  return {
    cloudName: String(extra.cloudinaryCloudName || '').trim(),
    uploadPreset: String(extra.cloudinaryUploadPreset || 'ilanlar').trim(),
    storageBucket: String(extra.firebaseStorageBucket || '').trim(),
  };
}

export function yerelFotoMu(uri) {
  if (!uri || typeof uri !== 'string') return false;
  return (
    uri.startsWith('file://') ||
    uri.startsWith('content://') ||
    uri.startsWith('ph://') ||
    (!uri.startsWith('http://') && !uri.startsWith('https://'))
  );
}

function uzanti(uri) {
  const m = String(uri).match(/\.(jpe?g|png|webp|gif)(\?|$)/i);
  return m ? m[1].toLowerCase() : 'jpg';
}

async function uriToBlob(uri) {
  const response = await fetch(uri);
  if (!response.ok) throw new Error('Fotoğraf okunamadı.');
  return response.blob();
}

/** Cloudinary — Firebase Storage açılmazsa fotoğraflar buraya gider */
async function cloudinaryYukle(uri, { userId, ilanId, index }) {
  const { cloudName, uploadPreset } = medyaConfig();
  if (!cloudName || cloudName.includes('YOUR_')) {
    throw new Error('Cloudinary ayarı eksik: app.json → cloudinaryCloudName doldurun.');
  }

  const ext = uzanti(uri);
  const mime = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
  const dosyaUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
  const form = new FormData();
  form.append('file', {
    uri: dosyaUri,
    type: mime,
    name: `ilan_${index}.${ext}`,
  });
  form.append('upload_preset', uploadPreset);
  form.append('folder', `ilanlar/${userId}/${ilanId}`);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: form,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || 'Cloudinary yükleme hatası.');
  }
  return data.secure_url;
}

/** Firebase Storage — bucket açıksa kullanılır */
async function firebaseStorageYukle(uri, { userId, ilanId, index }) {
  const blob = await uriToBlob(uri);
  const ext = uzanti(uri);
  const path = `ilanlar/${userId}/${ilanId}/${index}_${Date.now()}.${ext}`;
  const storageRef = ref(getStorageInstance(), path);
  await uploadBytes(storageRef, blob, { contentType: blob.type || `image/${ext}` });
  return getDownloadURL(storageRef);
}

async function tekFotoYukle(uri, ctx) {
  const { cloudName } = medyaConfig();
  const cloudinaryHazir = cloudName && !cloudName.includes('YOUR_');

  if (cloudinaryHazir) {
    return cloudinaryYukle(uri, ctx);
  }

  try {
    return await firebaseStorageYukle(uri, ctx);
  } catch (e) {
    throw new Error(
      e?.message ||
        'Fotoğraf yüklenemedi. Cloudinary ayarını kontrol edin veya Firebase Storage bucket oluşturun.'
    );
  }
}

/**
 * Yerel URI'leri yükler; https URL'leri olduğu gibi bırakır.
 */
export async function hazirlaIlanFotograflari(fotograflar, { userId, ilanId }) {
  const liste = Array.isArray(fotograflar) ? fotograflar : [];
  if (!liste.length) return [];

  const sonuc = [];
  for (let i = 0; i < liste.length; i++) {
    const uri = liste[i];
    if (!uri) continue;
    if (yerelFotoMu(uri)) {
      sonuc.push(await tekFotoYukle(uri, { userId, ilanId, index: i }));
    } else {
      sonuc.push(uri);
    }
  }
  return sonuc;
}
