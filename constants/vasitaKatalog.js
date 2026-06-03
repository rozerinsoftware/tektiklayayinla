/**
 * Vasıta marka/model ağacı — ilan verme drill-down.
 * Önce minivan & otomobil detaylı; diğer tipler basit marka→model.
 */

function donanim(baslik, ozellikler, ek = {}) {
  return { baslik, ozellikler, ...ek };
}

const MINIVAN_PEUGEOT_PARTNER = {
  Partner: {
    Dizel: {
      'Panel Van 5 kapı': {
        Manuel: [
          donanim('Partner 1.5 BlueHDI Uzun Comfort', [
            'Dizel',
            'Panel Van 5 kapı',
            '100 HP',
            '1499 cm³',
            'Manuel',
            '2019 - 2021',
          ], { hp: 100, cc: 1499, yilAralik: '2019-2021' }),
        ],
      },
      'Panel Van 4 kapı': {
        Manuel: [
          donanim('Partner 1.5 BlueHDI Comfort', [
            'Dizel',
            'Panel Van 4 kapı',
            '100 HP',
            '1499 cm³',
            'Manuel',
            '2019 - 2021',
          ], { hp: 100, cc: 1499, yilAralik: '2019-2021' }),
        ],
      },
    },
  },
  Expert: {
    Dizel: {
      'Panel Van': {
        Manuel: [
          donanim('Expert 2.0 BlueHDI Premium', ['Dizel', 'Panel Van', '150 HP', '1997 cm³', 'Manuel'], {
            hp: 150,
            cc: 1997,
          }),
        ],
        Otomatik: [
          donanim('Expert 2.0 BlueHDI Otomatik', ['Dizel', 'Panel Van', '150 HP', 'Otomatik'], { hp: 150 }),
        ],
      },
    },
  },
  Rifter: {
    Dizel: {
      'MPV': {
        Manuel: [donanim('Rifter 1.5 BlueHDI Active', ['Dizel', 'MPV', '130 HP', 'Manuel'], { hp: 130 })],
      },
    },
  },
};

const MINIVAN_KATALOG = {
  Peugeot: MINIVAN_PEUGEOT_PARTNER,
  Citroen: {
    Berlingo: {
      Dizel: {
        'Panel Van': {
          Manuel: [donanim('Berlingo 1.5 BlueHDI', ['Dizel', 'Panel Van', 'Manuel'], { hp: 100 })],
        },
      },
    },
    Jumpy: {
      Dizel: {
        'Panel Van': {
          Manuel: [donanim('Jumpy 2.0 BlueHDI', ['Dizel', 'Panel Van', 'Manuel'], { hp: 145 })],
        },
      },
    },
  },
  Ford: {
    'Tourneo Connect': {
      Dizel: {
        Kombi: {
          Manuel: [donanim('Tourneo Connect 1.5 EcoBlue', ['Dizel', 'Kombi', 'Manuel'], { hp: 120 })],
        },
      },
    },
    'Transit Connect': {
      Dizel: {
        'Panel Van': {
          Manuel: [donanim('Transit Connect 1.5 EcoBlue', ['Dizel', 'Panel Van', 'Manuel'], { hp: 100 })],
        },
      },
    },
  },
  Renault: {
    Kangoo: {
      Dizel: {
        'Panel Van': {
          Manuel: [donanim('Kangoo 1.5 dCi', ['Dizel', 'Panel Van', 'Manuel'], { hp: 95 })],
        },
      },
    },
    Trafic: {
      Dizel: {
        'Panel Van': {
          Manuel: [donanim('Trafic 2.0 dCi', ['Dizel', 'Panel Van', 'Manuel'], { hp: 145 })],
        },
      },
    },
  },
  Volkswagen: {
    Caddy: {
      Dizel: {
        'Panel Van': {
          Manuel: [donanim('Caddy 2.0 TDI', ['Dizel', 'Panel Van', 'Manuel'], { hp: 122 })],
        },
      },
    },
    Transporter: {
      Dizel: {
        'Panel Van': {
          Manuel: [donanim('Transporter 2.0 TDI', ['Dizel', 'Panel Van', 'Manuel'], { hp: 150 })],
        },
      },
    },
  },
  Fiat: {
    Fiorino: {
      Dizel: {
        'Panel Van': {
          Manuel: [donanim('Fiorino 1.3 Multijet', ['Dizel', 'Panel Van', 'Manuel'], { hp: 95 })],
        },
      },
    },
    Doblo: {
      Dizel: {
        'Panel Van': {
          Manuel: [donanim('Doblo 1.6 Multijet', ['Dizel', 'Panel Van', 'Manuel'], { hp: 105 })],
        },
      },
    },
  },
  'Mercedes-Benz': {
    'Vito': {
      Dizel: {
        'Panel Van': {
          Manuel: [donanim('Vito 116 CDI', ['Dizel', 'Panel Van', 'Manuel'], { hp: 163 })],
        },
      },
    },
  },
  Opel: {
    Combo: {
      Dizel: {
        'Panel Van': {
          Manuel: [donanim('Combo 1.5 CDTI', ['Dizel', 'Panel Van', 'Manuel'], { hp: 100 })],
        },
      },
    },
  },
  Toyota: {
    Proace: {
      Dizel: {
        'Panel Van': {
          Manuel: [donanim('Proace 2.0 D', ['Dizel', 'Panel Van', 'Manuel'], { hp: 145 })],
        },
      },
    },
  },
  Dacia: {
    Dokker: {
      Dizel: {
        'Panel Van': {
          Manuel: [donanim('Dokker 1.5 dCi', ['Dizel', 'Panel Van', 'Manuel'], { hp: 95 })],
        },
      },
    },
  },
};

function basitModel(marka, model, yakit = 'Benzin') {
  return {
    [model]: {
      [yakit]: {
        Sedan: {
          Manuel: [donanim(`${marka} ${model}`, [yakit, 'Sedan', 'Manuel'])],
          Otomatik: [donanim(`${marka} ${model} Otomatik`, [yakit, 'Sedan', 'Otomatik'])],
        },
      },
    },
  };
}

const OTOMOBIL_KATALOG = {
  Toyota: {
    ...basitModel('Toyota', 'Corolla'),
    Yaris: basitModel('Toyota', 'Yaris').Yaris,
    'C-HR': basitModel('Toyota', 'C-HR')['C-HR'],
  },
  Volkswagen: {
    Golf: basitModel('Volkswagen', 'Golf').Golf,
    Polo: basitModel('Volkswagen', 'Polo').Polo,
    Passat: basitModel('Volkswagen', 'Passat', 'Dizel').Passat,
  },
  Renault: {
    Clio: basitModel('Renault', 'Clio').Clio,
    Megane: basitModel('Renault', 'Megane').Megane,
    Talisman: basitModel('Renault', 'Talisman', 'Dizel').Talisman,
  },
  Ford: {
    Focus: basitModel('Ford', 'Focus').Focus,
    Fiesta: basitModel('Ford', 'Fiesta').Fiesta,
    Kuga: basitModel('Ford', 'Kuga', 'Dizel').Kuga,
  },
  Fiat: {
    Egea: basitModel('Fiat', 'Egea').Egea,
    '500X': basitModel('Fiat', '500X')['500X'],
  },
  Hyundai: {
    i20: basitModel('Hyundai', 'i20').i20,
    i10: basitModel('Hyundai', 'i10').i10,
    Tucson: basitModel('Hyundai', 'Tucson', 'Dizel').Tucson,
  },
  Honda: {
    Civic: basitModel('Honda', 'Civic').Civic,
    'CR-V': basitModel('Honda', 'CR-V', 'Dizel')['CR-V'],
  },
  BMW: {
    '3 Serisi': basitModel('BMW', '3 Serisi', 'Dizel')['3 Serisi'],
    '5 Serisi': basitModel('BMW', '5 Serisi', 'Dizel')['5 Serisi'],
  },
  'Mercedes-Benz': {
    'C Serisi': basitModel('Mercedes-Benz', 'C Serisi', 'Dizel')['C Serisi'],
    'E Serisi': basitModel('Mercedes-Benz', 'E Serisi', 'Dizel')['E Serisi'],
  },
  Audi: {
    A3: basitModel('Audi', 'A3').A3,
    A4: basitModel('Audi', 'A4', 'Dizel').A4,
  },
  Peugeot: {
    '308': basitModel('Peugeot', '308')['308'],
    '3008': basitModel('Peugeot', '3008', 'Dizel')['3008'],
  },
  Opel: {
    Corsa: basitModel('Opel', 'Corsa').Corsa,
    Astra: basitModel('Opel', 'Astra').Astra,
  },
  Citroen: {
    C3: basitModel('Citroen', 'C3').C3,
    C4: basitModel('Citroen', 'C4').C4,
  },
  Dacia: {
    Sandero: basitModel('Dacia', 'Sandero').Sandero,
    Duster: basitModel('Dacia', 'Duster', 'Dizel').Duster,
  },
  Nissan: {
    Qashqai: basitModel('Nissan', 'Qashqai', 'Dizel').Qashqai,
    Micra: basitModel('Nissan', 'Micra').Micra,
  },
  Kia: {
    Sportage: basitModel('Kia', 'Sportage', 'Dizel').Sportage,
    Rio: basitModel('Kia', 'Rio').Rio,
  },
  Skoda: {
    Octavia: basitModel('Skoda', 'Octavia', 'Dizel').Octavia,
    Fabia: basitModel('Skoda', 'Fabia').Fabia,
  },
};

const SUV_KATALOG = {
  Toyota: { RAV4: basitModel('Toyota', 'RAV4', 'Hibrit').RAV4 },
  Volkswagen: { Tiguan: basitModel('Volkswagen', 'Tiguan', 'Dizel').Tiguan },
  Renault: { Austral: basitModel('Renault', 'Austral', 'Dizel').Austral },
  Ford: { 'Kuga': basitModel('Ford', 'Kuga', 'Dizel').Kuga },
  Hyundai: { 'Santa Fe': basitModel('Hyundai', 'Santa Fe', 'Dizel')['Santa Fe'] },
  BMW: { 'X3': basitModel('BMW', 'X3', 'Dizel').X3 },
  'Mercedes-Benz': { 'GLC': basitModel('Mercedes-Benz', 'GLC', 'Dizel').GLC },
  Dacia: { Duster: basitModel('Dacia', 'Duster', 'Dizel').Duster },
};

const MOTOSIKLET_KATALOG = {
  Honda: {
    PCX: { Benzin: { Scooter: { Otomatik: [donanim('PCX 125', ['Benzin', 'Scooter'])] } } },
  },
  Yamaha: {
    NMAX: { Benzin: { Scooter: { Otomatik: [donanim('NMAX 155', ['Benzin', 'Scooter'])] } } },
  },
  Kawasaki: {
    Ninja: { Benzin: { Sport: { Manuel: [donanim('Ninja 400', ['Benzin', 'Sport'])] } } },
  },
  BMW: {
    'G 310 R': { Benzin: { Naked: { Manuel: [donanim('G 310 R', ['Benzin', 'Naked'])] } } },
  },
};

/** aracTipId → marka ağacı */
export const VASITA_TIP_KATALOG = {
  minivan: MINIVAN_KATALOG,
  otomobil: OTOMOBIL_KATALOG,
  'arazi-suv': SUV_KATALOG,
  elektrikli: OTOMOBIL_KATALOG,
  motosiklet: MOTOSIKLET_KATALOG,
  ticari: MINIVAN_KATALOG,
  deniz: {},
  hasarli: OTOMOBIL_KATALOG,
};

function dugumGetir(kok, yol) {
  let n = kok;
  for (const key of yol) {
    if (!n || typeof n !== 'object') return null;
    n = n[key];
  }
  return n;
}

export function vasitaKatalogVarMi(aracTipId) {
  const k = VASITA_TIP_KATALOG[aracTipId];
  return k && Object.keys(k).length > 0;
}

export function vasitaSecenekleri(aracTipId, secimler, adimKey) {
  const katalog = VASITA_TIP_KATALOG[aracTipId];
  if (!katalog) return [];

  if (adimKey === 'yil') {
    const yil = new Date().getFullYear() + 1;
    const liste = [];
    for (let y = yil; y >= 1980; y -= 1) liste.push({ id: String(y), baslik: String(y) });
    return liste;
  }

  if (adimKey === 'marka') {
    return Object.keys(katalog)
      .sort((a, b) => a.localeCompare(b, 'tr'))
      .map((m) => ({ id: m, baslik: m }));
  }

  if (adimKey === 'model') {
    const modeller = katalog[secimler.marka];
    if (!modeller) return [];
    return Object.keys(modeller)
      .sort((a, b) => a.localeCompare(b, 'tr'))
      .map((m) => ({ id: m, baslik: m }));
  }

  const yol = [];
  if (secimler.marka) yol.push(secimler.marka);
  if (secimler.model) yol.push(secimler.model);

  if (adimKey === 'yakit') {
    const mod = dugumGetir(katalog, yol);
    if (!mod) return [];
    return Object.keys(mod).map((y) => ({ id: y, baslik: y }));
  }
  if (secimler.yakit) yol.push(secimler.yakit);

  if (adimKey === 'kasaTipi') {
    const y = dugumGetir(katalog, yol);
    if (!y) return [];
    return Object.keys(y).map((k) => ({ id: k, baslik: k }));
  }
  if (secimler.kasaTipi) yol.push(secimler.kasaTipi);

  if (adimKey === 'vites') {
    const v = dugumGetir(katalog, yol);
    if (!v) return [];
    return Object.keys(v).map((t) => ({ id: t, baslik: t }));
  }

  return [];
}

export function vasitaDonanimListesi(aracTipId, secimler) {
  const katalog = VASITA_TIP_KATALOG[aracTipId];
  if (!katalog || !secimler.marka || !secimler.model || !secimler.yakit || !secimler.kasaTipi || !secimler.vites) {
    return [];
  }
  const yol = [
    secimler.marka,
    secimler.model,
    secimler.yakit,
    secimler.kasaTipi,
    secimler.vites,
  ];
  const liste = dugumGetir(katalog, yol);
  if (!Array.isArray(liste)) return [];
  return liste.map((d, i) => ({ id: `d-${i}`, ...d }));
}

export function vasitaSonrakiAdim(secimler) {
  if (!secimler.yil) return 'yil';
  if (!secimler.marka) return 'marka';
  if (!secimler.model) return 'model';
  if (!secimler.yakit) return 'yakit';
  if (!secimler.kasaTipi) return 'kasaTipi';
  if (!secimler.vites) return 'vites';
  if (!secimler.donanim) return 'donanim';
  return 'onay';
}
