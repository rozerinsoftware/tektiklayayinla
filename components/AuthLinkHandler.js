import { useEffect, useRef } from 'react';
import { Alert, Linking } from 'react-native';
import { emailDogrulamaLinkiniIsle, onayLinkiMi } from '../utils/emailDogrulamaLink';

/** Onay e-postasındaki bağlantıyı uygulama açıkken veya deep link ile işler */
export default function AuthLinkHandler() {
  const isleniyor = useRef(false);

  useEffect(() => {
    const isle = async (url) => {
      if (!url || !onayLinkiMi(url) || isleniyor.current) return;
      isleniyor.current = true;
      try {
        const sonuc = await emailDogrulamaLinkiniIsle(url);
        if (sonuc.ok) {
          Alert.alert(
            'E-posta onaylandı',
            'Hesabınız doğrulandı. Şimdi Giriş yap ekranından e-posta ve şifrenizle giriş yapın.',
            [{ text: 'Tamam' }]
          );
        } else {
          Alert.alert('Onay', sonuc.reason || 'Bağlantı işlenemedi.');
        }
      } catch (e) {
        const mesaj = e?.message || 'Onay tamamlanamadı.';
        Alert.alert(
          'Onay hatası',
          `${mesaj}\n\nİpucu: Bağlantıyı uzun basıp Chrome ile açmayı deneyin. Sayfa açılsa bile onay tamamlanmış olabilir; uygulamada Giriş → Onayladım deyin.`
        );
      } finally {
        isleniyor.current = false;
      }
    };

    Linking.getInitialURL().then((url) => {
      if (url) isle(url);
    });
    const sub = Linking.addEventListener('url', ({ url }) => isle(url));
    return () => sub.remove();
  }, []);

  return null;
}
