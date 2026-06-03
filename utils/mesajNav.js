import { getCurrentUserId } from '../auth';
import { kokNavigasyon } from './requireAuth';

export function mesajlaraGit(navigation) {
  if (getCurrentUserId()) {
    navigation.navigate('Mesajlar');
    return;
  }
  kokNavigasyon(navigation).navigate('GirisMesaj');
}

/** İlan detayından sohbet — kök veya profil yığınında MesajDetay açar */
export function mesajDetayGit(navigation, params) {
  const nav = navigation;
  try {
    nav.navigate('MesajDetay', params);
  } catch {
    kokNavigasyon(navigation).navigate('MesajDetay', params);
  }
}
