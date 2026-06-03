/** Sahibinden tarzı bilgisayar alt ağacı */

const LAPTOP_MARKALARI = [
  'Acer',
  'Apple Macbook',
  'Asus',
  'Casper',
  'Dell',
  'HP',
  'Lenovo',
  'MSI',
  'Samsung',
  'Huawei',
  'Monster',
  'Diğer',
];

function markaId(marka) {
  return `laptop-${String(marka)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`;
}

export const BILGISAYAR_ALT_AGAC = {
  id: 'bilgisayar',
  baslik: 'Bilgisayar',
  cocuklar: [
    {
      id: 'masaustu',
      baslik: 'Masaüstü',
      cocuklar: [
        {
          id: 'masaustu-modeller',
          baslik: 'Modeller',
          cocuklar: [
            { id: 'toplama', baslik: 'Toplama', yaprak: true },
            { id: 'marka-pc', baslik: 'Marka PC', yaprak: true },
            { id: 'all-in-one', baslik: 'All-in-One', yaprak: true },
          ],
        },
        { id: 'masaustu-donanim', baslik: 'Donanım', yaprak: true },
        { id: 'masaustu-yedek-parca', baslik: 'Yedek Parça', yaprak: true },
      ],
    },
    {
      id: 'dizustu',
      baslik: 'Dizüstü (Notebook)',
      cocuklar: [
        {
          id: 'laptop',
          baslik: 'Laptop',
          cocuklar: LAPTOP_MARKALARI.map((m) => ({
            id: markaId(m),
            baslik: m,
            yaprak: true,
          })),
        },
        { id: 'dizustu-donanim', baslik: 'Donanım', yaprak: true },
        { id: 'dizustu-yedek-parca', baslik: 'Yedek Parça', yaprak: true },
      ],
    },
    { id: 'tablet', baslik: 'Tablet', yaprak: true },
    { id: 'monitor', baslik: 'Monitör', yaprak: true },
  ],
};

export const CEP_TELEFONU_ALT_AGAC = {
  id: 'cep-telefonu',
  baslik: 'Cep Telefonu',
  cocuklar: [
    { id: 'telefon-apple', baslik: 'Apple iPhone', yaprak: true },
    { id: 'telefon-samsung', baslik: 'Samsung', yaprak: true },
    { id: 'telefon-xiaomi', baslik: 'Xiaomi', yaprak: true },
    { id: 'telefon-huawei', baslik: 'Huawei', yaprak: true },
    { id: 'telefon-diger', baslik: 'Diğer Markalar', yaprak: true },
    { id: 'telefon-aksesuar', baslik: 'Aksesuar', yaprak: true },
  ],
};
