# Datassist Güven Merkezi (Trust Center)

`trust.datassist.com` için düz HTML + JSON tabanlı, çok dilli (TR/EN) güven merkezi sayfası.

## Özellikler

- **Düz HTML** — framework/build adımı yok. Statik hosting'e olduğu gibi yüklenir.
- **JSON tabanlı config** — tüm metinler ve section'lar `config/*.json` dosyalarından yönetilir.
- **TR / EN desteği** — sağ üstteki dil butonuyla anlık geçiş. Tercih `localStorage`'da saklanır.
- **Datassist teması** — lacivert + turuncu renk paleti, `config/site.json > theme` üzerinden değiştirilebilir.

## Çalıştırma

`fetch` ile JSON yüklendiği için sayfa bir HTTP sunucusu üzerinden açılmalıdır (dosyayı çift tıklayarak `file://` ile açmak çalışmaz):

```bash
cd trust-center-ui
python3 -m http.server 8080
# tarayıcıda: http://localhost:8080
```

## Dosya Yapısı

```
trust-center-ui/
├── index.html              # Sayfa iskeleti
├── assets/
│   ├── css/styles.css      # Datassist teması
│   └── js/app.js           # JSON yükleme + render + dil geçişi
├── config/
│   ├── site.json           # Marka, tema renkleri, diller
│   ├── tr.json             # Türkçe içerik
│   └── en.json             # İngilizce içerik
└── README.md
```

## İçerik Düzenleme

Metinleri, sertifikaları, kontrolleri, SSS'i vb. düzenlemek için `config/tr.json` ve `config/en.json`
dosyalarını değiştirmeniz yeterlidir. İki dosyanın yapısı birebir aynıdır.

### Yeni section ekleme

1. `tr.json` ve `en.json` içindeki `sections` dizisine bir obje ekleyin ve bir `type` verin.
2. `assets/js/app.js` içindeki `renderers` nesnesine aynı `type` için bir render fonksiyonu tanımlayın.

Mevcut section tipleri: `certifications`, `controls`, `privacy`, `documents`, `subprocessors`, `faq`, `cta`.

### Tema/renk değiştirme

`config/site.json > theme.colors` altındaki hex değerlerini değiştirin. Değerler sayfa açılışında
CSS değişkenlerine (`--navy`, `--orange`, vb.) uygulanır.

## Notlar

- Belge indirme/talep butonları örnek bir modal form açar; gerçek dosya bağlantıları ve form
  gönderim entegrasyonu (backend/e-posta) sonradan eklenebilir.
- Alt işleyen (subprocessor) listesi ve belge listesi örnek verilerle doldurulmuştur;
  yayına almadan önce güncelleyin.
