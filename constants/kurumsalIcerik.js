/** Kurumsal / yasal içerik — Tek Tıkla Yayınla */

export const DESTEK_EPOSTA = 'destek@tektiklayayinla.com';
export const UYGULAMA_ADI = 'Tek Tıkla Yayınla';
export const MARKA = 'tektiklayayinla.com';

export const MENU_ANA = [
  { id: 'hakkimizda', etiket: 'Hakkımızda', tip: 'icerik' },
  { id: 'surdurulebilirlik', etiket: 'Sürdürülebilirlik', tip: 'icerik' },
  { id: 'insanKaynaklari', etiket: 'İnsan Kaynakları', tip: 'icerik' },
  {
    id: 'politikalar',
    etiket: 'Politikalarımız',
    tip: 'grup',
    alt: [
      {
        id: 'sozlesmeler',
        etiket: 'Sözleşmeler',
        tip: 'grup',
        alt: [{ id: 'bireyselSozlesme', etiket: 'Bireysel Hesap Sözleşmesi', tip: 'icerik' }],
      },
      {
        id: 'kurallar',
        etiket: 'Kurallar ve Politikalar',
        tip: 'grup',
        alt: [
          { id: 'kullanimKosullari', etiket: 'Kullanım Koşulları', tip: 'icerik' },
          { id: 'ilanKurallari', etiket: 'İlan Verme Kuralları', tip: 'icerik' },
          { id: 'hesapDurdurma', etiket: 'Hesap Durdurma', tip: 'icerik' },
        ],
      },
      { id: 'kvkk', etiket: 'Kişisel Verilerin Korunması', tip: 'icerik' },
      { id: 'cerez', etiket: 'Çerez Yönetimi', tip: 'icerik' },
    ],
  },
  {
    id: 'raporlar',
    etiket: 'Raporlar',
    tip: 'grup',
    alt: [
      { id: 'konutPiyasasi', etiket: 'Konut Piyasası', tip: 'icerik' },
      { id: 'vasitaPiyasasi', etiket: 'Vasıta Piyasası', tip: 'icerik' },
    ],
  },
  { id: 'haberler', etiket: 'Haberler', tip: 'icerik' },
  { id: 'guvenliAlisveris', etiket: 'Güvenli Alışverişin İpuçları', tip: 'icerik' },
  { id: 'yardim', etiket: 'Yardım Merkezi', tip: 'icerik' },
  { id: 'iletisim', etiket: 'İletişim', tip: 'icerik' },
];

export const ICERIKLER = {
  hakkimizda: {
    baslik: 'Hakkımızda',
    govde: [
      {
        tip: 'metin',
        metin:
          'Tek Tıkla Yayınla, ilanınızı bir kez oluşturup birden fazla platformda yayınlamayı hedefleyen mobil bir ilan yönetim uygulamasıdır. Amacımız, bireysel ve kurumsal kullanıcıların ilan sürecini sadeleştirmektir.',
      },
      { tip: 'altMenu', ids: ['dundenBugune', 'sayilarla', 'misyon'] },
    ],
  },
  dundenBugune: {
    baslik: 'Dünden Bugüne',
    govde: [
      {
        tip: 'metin',
        metin:
          'Uygulama, ilan verenlerin zaman kaybetmeden içeriklerini düzenleyebileceği bir deneyim sunmak için geliştirilmektedir. Platform entegrasyonları aşamalı olarak devreye alınacaktır.',
      },
    ],
  },
  sayilarla: {
    baslik: `Sayılarla ${UYGULAMA_ADI}`,
    govde: [
      {
        tip: 'metin',
        metin:
          '• Çoklu kategori desteği (emlak, vasıta, ikinci el, iş makineleri)\n• Konum işaretleme ve haritada gösterme\n• Favori ilan ve arama kaydı\n• E-posta doğrulamalı güvenli hesap',
      },
    ],
  },
  misyon: {
    baslik: 'Misyonumuz',
    govde: [
      {
        tip: 'metin',
        metin:
          'Güvenilir, şeffaf ve kullanıcı odaklı bir ilan deneyimi sunmak; kişisel verileri mevzuata uygun şekilde korumaktır.',
      },
    ],
  },
  surdurulebilirlik: {
    baslik: 'Sürdürülebilirlik',
    govde: [
      {
        tip: 'metin',
        metin:
          'Dijital ilan modeli, basılı ilanlara kıyasla kağıt ve dağıtım kaynaklı atığı azaltmayı hedefler. Altyapımızı verimli kullanarak enerji tüketimini düşük tutmaya çalışıyoruz.',
      },
    ],
  },
  insanKaynaklari: {
    baslik: 'İnsan Kaynakları',
    govde: [
      {
        tip: 'metin',
        metin: `Ekibimize katılmak için özgeçmişinizi ${DESTEK_EPOSTA} adresine gönderebilirsiniz. Açık pozisyonlar duyuruldukça bu bölüm güncellenecektir.`,
      },
    ],
  },
  bireyselSozlesme: {
    baslik: 'Bireysel Hesap Sözleşmesi',
    govde: [
      {
        tip: 'metin',
        metin:
          '1. TARAFLAR\n\nBu sözleşme, Tek Tıkla Yayınla uygulamasını kullanan bireysel kullanıcı ("Kullanıcı") ile hizmeti sunan işletme ("Şirket") arasında akdedilmiştir.\n\n2. HİZMET\n\nUygulama; ilan oluşturma, düzenleme, favorilere ekleme ve platform seçimi gibi özellikler sunar. Üçüncü taraf platformlara otomatik yayın, entegrasyon tamamlandığında devreye girer.\n\n3. KULLANICI YÜKÜMLÜLÜKLERİ\n\nKullanıcı, verdiği bilgilerin doğru olmasından, ilan içeriklerinin mevzuata ve genel ahlaka uygun olmasından sorumludur.\n\n4. ÜCRET\n\nTemel özellikler ücretsizdir. Ücretli hizmetler ayrıca duyurulur.\n\n5. FESİH\n\nKullanıcı hesabını kapatabilir; Şirket, kurallara aykırı kullanımda hesabı askıya alabilir.',
      },
    ],
  },
  kullanimKosullari: {
    baslik: 'Kullanım Koşulları',
    govde: [
      {
        tip: 'baslik',
        metin: '1. KULLANIM KOŞULLARI',
      },
      {
        tip: 'metin',
        metin: `www.${MARKA} ve Tek Tıkla Yayınla mobil uygulaması ("Portal"), kullanıcıların ilan yönetimi yapmasına imkân tanır. Portala üye olan veya ziyaret eden herkes bu koşulları okumuş ve kabul etmiş sayılır.\n\n"Kullanıcı", Portalda hesap oluşturan gerçek veya tüzel kişiyi; "İlan", kullanıcının yayınladığı içeriği ifade eder. Şirket, Portalın işleyişini, tasarımını ve sunulan hizmetleri önceden bildirmeksizin güncelleyebilir.`,
      },
    ],
  },
  ilanKurallari: {
    baslik: 'İlan Verme Kuralları',
    govde: [
      {
        tip: 'metin',
        metin:
          '• İlan başlık ve açıklaması gerçeği yansıtmalıdır.\n• Yanıltıcı fiyat, sahte fotoğraf veya başkasına ait içerik yasaktır.\n• Emlak, vasıta ve benzeri kategorilerde konum bilgisi zorunludur.\n• Yasaklı ürün ve hizmetler listelenemez.\n• Aynı ilanın tekrarlı spam yayını engellenir.',
      },
    ],
  },
  hesapDurdurma: {
    baslik: 'Hesap Durdurma',
    govde: [
      {
        tip: 'metin',
        metin:
          'Dolandırıcılık şüphesi, hakaret, telif ihlali, sahte ilan veya sistem güvenliğini tehdit eden davranışlarda hesap geçici veya kalıcı olarak durdurulabilir. Kullanıcı, destek kanalından itiraz talebinde bulunabilir.',
      },
    ],
  },
  kvkk: {
    baslik: `Kişisel Verilerin Korunması - ${MARKA}`,
    govde: [
      {
        tip: 'baslik',
        metin: 'Kişisel Verilerin Korunması ve İşlenmesi Hakkında Aydınlatma Metni',
      },
      {
        tip: 'metin',
        metin: `6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, Tek Tıkla Yayınla olarak; üyelik, ilan yönetimi, güvenlik ve destek süreçlerinde işlediğimiz kimlik, iletişim, konum, işlem güvenliği ve kullanım verilerinizi mevzuata uygun, ölçülü ve şeffaf şekilde işliyoruz.\n\nVerileriniz; hizmet sunumu, kimlik doğrulama, dolandırıcılık önleme, yasal yükümlülükler ve açık rızanız dahilinde işlenir. Firebase altyapısı (kimlik doğrulama ve veritabanı) kullanılmaktadır.\n\nHaklarınız (erişim, düzeltme, silme, itiraz vb.) için ${DESTEK_EPOSTA} adresine başvurabilirsiniz.`,
      },
    ],
  },
  cerez: {
    baslik: 'Çerez Yönetimi',
    govde: [
      {
        tip: 'metin',
        metin:
          'Mobil uygulamada oturum ve tercihleriniz cihazınızda ve güvenli sunucularda saklanabilir. Zorunlu çerezler hizmetin çalışması için gereklidir. Analitik çerezler (varsa) yalnızca onayınızla kullanılır.',
      },
    ],
  },
  konutPiyasasi: {
    baslik: 'Konut Piyasası',
    govde: [
      {
        tip: 'metin',
        metin:
          'Piyasa özet raporları hazırlık aşamasındadır. Emlak kategorisindeki ilan verilerinden anonim istatistikler ileride bu bölümde paylaşılacaktır.',
      },
    ],
  },
  vasitaPiyasasi: {
    baslik: 'Vasıta Piyasası',
    govde: [
      {
        tip: 'metin',
        metin:
          'Vasıta kategorisine ait trend ve fiyat aralığı raporları planlanmaktadır. Güncellemeler uygulama içinden duyurulacaktır.',
      },
    ],
  },
  haberler: {
    baslik: 'Haberler',
    govde: [
      {
        tip: 'metin',
        metin:
          'Uygulama güncellemeleri, yeni kategori ve platform entegrasyonları burada yayınlanacaktır.',
      },
    ],
  },
  guvenliAlisveris: {
    baslik: 'Güvenli Alışverişin İpuçları',
    tip: 'guvenli',
  },
  yardim: {
    baslik: 'Yardım Merkezi',
    govde: [
      {
        tip: 'metin',
        metin: `Sık sorulan sorular\n\n• İlan nasıl verilir?\nİlan Ver sekmesinden kategori seçin, formu doldurun, konum işaretleyin ve platformları seçin.\n\n• E-posta onayı zorunlu mu?\nEvet. Hesabınızı e-posta bağlantısıyla doğruladıktan sonra giriş yapabilirsiniz.\n\n• İlanlar gerçekten dış platformlara gidiyor mu?\nŞu an yayın simülasyonudur; ilanlar Firebase veritabanında saklanır.\n\n• Destek\n${DESTEK_EPOSTA}`,
      },
    ],
  },
  iletisim: {
    baslik: 'İletişim',
    tip: 'iletisim',
  },
};

export const ILETISIM_ALANLARI = [
  { etiket: 'İşletme Adı / Tescilli Marka', deger: MARKA },
  { etiket: 'Uygulama', deger: UYGULAMA_ADI },
  { etiket: 'Sorumlu Kişi', deger: 'Destek Ekibi' },
  { etiket: 'E-posta', deger: DESTEK_EPOSTA, link: `mailto:${DESTEK_EPOSTA}` },
  {
    etiket: 'Merkez',
    deger: 'Ataşehir, İstanbul, Türkiye (uzaktan hizmet)',
  },
  { etiket: 'Çağrı Merkezi', deger: 'Uygulama içi destek ve e-posta (yakında telefon)' },
];

export const YOL_TARIFLERI = {
  mavi: [
    'D-100 Kadıköy–Ankara yönünde ilerleyin',
    'İçerenköy–K.Bakkalköy çıkışına girin',
    'Bostancı yönüne dönün',
    'Ofis / buluşma noktası için önceden randevu alın',
  ],
  kirmizi: [
    'D-100 Ankara–Kadıköy yönünde ilerleyin',
    'Ataşehir çıkışlarını takip edin',
  ],
};

export const YASAL_LINKLER = [
  { etiket: 'Tüketicinin korunması hakkında kanun', url: 'https://www.mevzuat.gov.tr' },
  { etiket: 'Mesafeli sözleşmeler yönetmeliği', url: 'https://www.mevzuat.gov.tr' },
  { etiket: 'Elektronik ticaretin düzenlenmesi hakkında kanun', url: 'https://www.mevzuat.gov.tr' },
];

export const GUVENLI_ALICI = {
  giris: [
    'Ödeme öncesi ürünü ve satıcıyı mümkünse yerinde görün.',
    'Kapora veya ön ödeme taleplerinde dikkatli olun; teslim alamama riski size aittir.',
    'Resmî evrak ve fatura isteyin.',
  ],
  bolumler: [
    {
      id: 'vasita',
      baslik: 'Vasıta Satın Alma ve Kiralama İçin Güvenlik İpuçları',
      ikon: 'car-outline',
      renk: '#DC2626',
      maddeler: [
        'Ruhsat ve şasi numarasını kontrol edin.',
        'Ekspertiz raporu alın.',
        'Tapuda devir öncesi ödemeyi güvenli yöntemle yapın.',
      ],
    },
    {
      id: 'alisveris',
      baslik: 'Alışverişiniz İçin Güvenlik İpuçları',
      ikon: 'cart-outline',
      renk: '#7C3AED',
      maddeler: [
        'Satıcı profilini ve geçmiş ilanlarını inceleyin.',
        'Şüpheli fiyatlardan kaçının.',
        'Kişisel verilerinizi mesajla paylaşmayın.',
      ],
    },
  ],
};

export const GUVENLI_SATICI = {
  giris: [
    'İlanınızda net fotoğraf ve doğru açıklama kullanın.',
    'Konum zorunlu kategorilerde haritayı doğru işaretleyin.',
    'Mesajlara hızlı ve nazik yanıt verin.',
  ],
  bolumler: [
    {
      id: 'ilan',
      baslik: 'İlan Verme Güvenliği',
      ikon: 'document-text-outline',
      renk: '#2563EB',
      maddeler: [
        'Yanıltıcı bilgi paylaşmayın.',
        'Platform kurallarına uyun.',
        'Şüpheli alıcıları destek ekibine bildirin.',
      ],
    },
  ],
};

/** route.params.baslangic → sayfa id */
export const BASLANGIC_SAYFA = {
  hakkimizda: 'hakkimizda',
  gizlilik: 'kvkk',
  kvkk: 'kvkk',
  yardim: 'yardim',
  iletisim: 'iletisim',
  guvenli: 'guvenliAlisveris',
  kullanim: 'kullanimKosullari',
  sozlesme: 'bireyselSozlesme',
};

export function menuBul(yol) {
  if (!yol || yol.length === 0) return { items: MENU_ANA, baslik: null };
  let items = MENU_ANA;
  let baslik = null;
  for (const parca of yol) {
    const bul = items.find((m) => m.id === parca);
    if (!bul?.alt) return { items: MENU_ANA, baslik: null };
    baslik = bul.etiket;
    items = bul.alt;
  }
  return { items, baslik };
}

export function sayfaBasligi(sayfaId) {
  return ICERIKLER[sayfaId]?.baslik || 'Bilgi';
}
