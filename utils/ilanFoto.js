/** Kullanıcının yüklediği gerçek fotoğraf URL'si mi (Cloudinary vb.) */
export function gecerliKapakFoto(fotograflar) {
  const url = Array.isArray(fotograflar) ? fotograflar[0] : null;
  if (!url || typeof url !== 'string') return null;
  if (!url.startsWith('http://') && !url.startsWith('https://')) return null;
  if (
    url.includes('picsum.photos') ||
    url.includes('pexels.com') ||
    url.includes('unsplash.com') ||
    url.includes('placehold.co') ||
    url.includes('placeholder.com')
  ) {
    return null;
  }
  return url;
}

/** Stok / demo fotoğraf URL'si mi */
export function stokFotoUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return (
    url.includes('picsum.photos') ||
    url.includes('pexels.com') ||
    url.includes('unsplash.com') ||
    url.includes('placehold.co') ||
    url.includes('placeholder.com')
  );
}
