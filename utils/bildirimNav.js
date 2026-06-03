import { getCurrentUserId } from '../auth';
import { kokNavigasyon } from './requireAuth';

/** Profil zili — misafir: Sahibinden tarzı giriş; oturumlu: bildirim listesi */
export function bildirimZilineBas(navigation) {
  if (getCurrentUserId()) {
    navigation.navigate('Bildirimler');
    return;
  }
  kokNavigasyon(navigation).navigate('GirisBildirim');
}
