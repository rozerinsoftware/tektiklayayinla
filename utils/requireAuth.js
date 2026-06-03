import { Alert } from 'react-native';
import { getCurrentUserId } from '../auth';

export function kokNavigasyon(navigation) {
  let nav = navigation;
  while (nav.getParent()) nav = nav.getParent();
  return nav;
}

export function girisIste(navigation, mesaj = 'İlan eklemek için giriş yapmalısınız.') {
  if (getCurrentUserId()) return true;

  const root = kokNavigasyon(navigation);
  Alert.alert('Giriş gerekli', mesaj, [
    { text: 'İptal', style: 'cancel' },
    {
      text: 'Giriş Yap',
      onPress: () => root.navigate('Giris', { afterLogin: 'IlanVer' }),
    },
    {
      text: 'Kayıt Ol',
      onPress: () => root.navigate('KayitEmail'),
    },
  ]);
  return false;
}
