/**
 * Örnek ilan demo fotoğrafları — upload.wikimedia.org (960px, React Native uyumlu).
 */

const ORNEK_FOTO_URLS = {
  'ornek-emlak-daire-kadikoy':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Living_room.jpg/960px-Living_room.jpg',
  'ornek-emlak-rezidans-besiktas':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Wongamat-tower-pattaya-naklua.jpg/960px-Wongamat-tower-pattaya-naklua.jpg',
  'ornek-emlak-kiralik-uskudar':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Modern_luxury_living_room_with_kitchen_interior.jpg/960px-Modern_luxury_living_room_with_kitchen_interior.jpg',
  'ornek-emlak-villa-bodrum':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/3D_Rendering_of_Modern_Luxury_Villa_Exterior_with_Pool.jpg/960px-3D_Rendering_of_Modern_Luxury_Villa_Exterior_with_Pool.jpg',
  'ornek-vasita-corolla':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/2020_Toyota_Corolla_LE_sedan.jpg/960px-2020_Toyota_Corolla_LE_sedan.jpg',
  'ornek-ikinci-el-iphone':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/IPhone_14_vector.svg/960px-IPhone_14_vector.svg.png',
  'ornek-ikinci-el-macbook':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/MacBook_Air_keyboard_1.jpg/960px-MacBook_Air_keyboard_1.jpg',
  'ornek-ekskavator-cat':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Caterpillar_330_excavator_on_a_pile_of_dirt.jpg/960px-Caterpillar_330_excavator_on_a_pile_of_dirt.jpg',
  'ornek-beko-jcb':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/JCB_3CX_backhoe_loader.jpg/960px-JCB_3CX_backhoe_loader.jpg',
  'ornek-emlak-daire-izmir':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Apartment_building_in_Izmir%2C_Turkey.jpg/960px-Apartment_building_in_Izmir%2C_Turkey.jpg',
  'ornek-emlak-daire-antalya':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Modern_apartment_buildings_in_Antalya%2C_Turkey.jpg/960px-Modern_apartment_buildings_in_Antalya%2C_Turkey.jpg',
  'ornek-emlak-kiralik-ankara':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Living_room_with_sofa_and_television.jpg/960px-Living_room_with_sofa_and_television.jpg',
  'ornek-vasita-honda-civic':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/2018_Honda_Civic_Sedan_in_Modern_Steel_Metallic%2C_front_11.30.18.jpg/960px-2018_Honda_Civic_Sedan_in_Modern_Steel_Metallic%2C_front_11.30.18.jpg',
  'ornek-vasita-bmw-320':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW_320d_%28F30%29_FL_M_Sportpaket_%282014-2017%29_front.jpg/960px-BMW_320d_%28F30%29_FL_M_Sportpaket_%282014-2017%29_front.jpg',
  'ornek-vasita-tesla-model3':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Tesla_Model_3_Performance_%282019%29_front.jpg/960px-Tesla_Model_3_Performance_%282019%29_front.jpg',
};

export function ornekIlanFotograflar(ornekKey) {
  const url = ORNEK_FOTO_URLS[ornekKey];
  return url ? [url] : [];
}

/** Eski başlıklar → ornekKey (Firestore eşleştirme) */
export const ORNEK_ESKI_BASLIKLAR = {
  '2019 John Deere Traktör': 'ornek-traktor-john-deere',
  '2020 Toyota Corolla 1.6 Vision': 'ornek-vasita-corolla',
  'iPhone 14 Pro Max 256 GB': 'ornek-ikinci-el-iphone',
};
