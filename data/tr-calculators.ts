// Turkish Calculator definitions — /tr/
export interface TrCalculator {
    id: string;
    title: string;
    keyword: string;
    calcType: string;
    icon: string;
    subtitle: string;
    explanation: { heading: string; paragraphs: string[]; highlight: string };
    faq: { question: string; answer: string }[];
    richSections?: { heading: string; paragraphs?: string[]; bullets?: string[]; table?: { headers: string[]; rows: string[][] } }[];
    relatedIds?: string[];
}

export const TR_CALCULATORS: TrCalculator[] = [
    {
        id: "konut-kredi-hesaplama",
        title: "Konut Kredisi Hesaplama — Mortgage Hesaplayıcı",
        keyword: "konut kredisi hesaplama",
        calcType: "mortgage",
        icon: "🏠",
        subtitle: "Konut kredisi taksit tutarını hesaplayın. Kredi tutarı, faiz oranı ve vade bilgilerini girerek aylık ödeme planınızı öğrenin.",
        explanation: {
            heading: "Konut Kredisi Nasıl Hesaplanır?",
            paragraphs: [
                "Konut kredisi, ev satın almak için bankalardan alınan uzun vadeli bir kredidir. Türkiye'de konut kredisi faiz oranları aylık %1,5-3 arasında değişmektedir. Vade 120 aya (10 yıl) kadar çıkabilir. Taksitler eşit aylık (annüite) yöntemiyle hesaplanır.",
                "Aylık taksit formülü: Taksit = P × r × (1+r)^n / ((1+r)^n - 1). P = anapara, r = aylık faiz oranı, n = toplam taksit sayısı. Bankaların uyguladığı BSMV (%10) ve KKDF (%0) oranları da toplam maliyeti etkiler.",
            ],
            highlight: "Örnek: 2.000.000 ₺ kredi, aylık %1,79 faiz, 120 ay vade → Aylık taksit ≈ 38.500 ₺. Toplam geri ödeme: 4.620.000 ₺ — toplam faiz maliyeti 2.620.000 ₺!",
        },
        faq: [
            { question: "Konut kredisi faiz oranları ne kadar?", answer: "2026 itibarıyla aylık %1,5-3 arasında. Kamu bankaları (Ziraat, Halkbank, Vakıfbank) genellikle daha düşük faiz sunar. Kampanya dönemlerinde %1,29'a kadar düşebilir." },
            { question: "Konut kredisinde peşinat zorunlu mu?", answer: "Evet, BDDK düzenlemesine göre konut değerinin en az %20'si peşinat olarak ödenmelidir. 1.000.000 ₺ değerindeki ev için minimum 200.000 ₺ peşinat gerekir." },
            { question: "Konut kredisi masrafları nelerdir?", answer: "Ekspertiz ücreti (3.000-10.000 ₺), ipotek tesis ücreti, DASK (zorunlu deprem sigortası), BSMV (%10 faiz üzerinden), dosya masrafı. Toplam ek maliyet kredinin %3-5'i olabilir." },
        ],
        relatedIds: ["kredi-taksit-hesaplama", "faiz-hesaplama", "yatirim-hesaplama"],
    },
    {
        id: "tasit-kredi-hesaplama",
        title: "Taşıt Kredisi Hesaplama — Araba Kredisi Taksit",
        keyword: "taşıt kredisi hesaplama",
        calcType: "emi",
        icon: "🚗",
        subtitle: "Taşıt kredisi taksit tutarını ve toplam geri ödeme miktarını hesaplayın. Araç fiyatı, peşinat ve vade bilgilerini girin.",
        explanation: {
            heading: "Taşıt Kredisi Nasıl Hesaplanır?",
            paragraphs: [
                "Taşıt kredisi, sıfır veya ikinci el araç alımı için kullanılır. Sıfır araçlarda vade 60 aya, ikinci el araçlarda 48 aya kadar çıkabilir. Faiz oranları aylık %2-4 arasında değişir. Sıfır araçlarda marka kampanyalarıyla %0,99'a kadar düşebilir.",
                "BSMV (Banka ve Sigorta Muameleleri Vergisi) %15 oranında faiz üzerinden alınır. Bu, efektif faiz oranını artırır. Sigorta ve kasko masrafları da hesaba katılmalıdır.",
            ],
            highlight: "500.000 ₺ araç, %30 peşinat (150.000 ₺), 350.000 ₺ kredi, aylık %2,49 faiz, 48 ay → Aylık taksit ≈ 13.200 ₺. Toplam ödeme: 633.600 ₺.",
        },
        faq: [
            { question: "Taşıt kredisinde peşinat zorunlu mu?", answer: "Sıfır araçlarda minimum %20, ikinci el araçlarda minimum %30 peşinat zorunludur (BDDK düzenlemesi). Bazı banka kampanyalarında daha düşük oranlar mümkün olabilir." },
            { question: "Sıfır ve ikinci el araç kredisi farkı nedir?", answer: "Sıfır araçlarda daha düşük faiz, daha uzun vade ve marka kampanyaları mevcut. İkinci el araçlarda faiz daha yüksek, vade daha kısa ve araç yaşı sınırı var (genellikle max 10 yaş)." },
        ],
        relatedIds: ["kredi-taksit-hesaplama", "ihtiyac-kredi-hesaplama"],
    },
    {
        id: "ihtiyac-kredi-hesaplama",
        title: "İhtiyaç Kredisi Hesaplama — Taksit ve Faiz",
        keyword: "ihtiyaç kredisi hesaplama",
        calcType: "emi",
        icon: "💳",
        subtitle: "İhtiyaç kredisi taksit tutarını hesaplayın. Farklı banka kampanyalarını karşılaştırın ve en uygun krediyi bulun.",
        explanation: {
            heading: "İhtiyaç Kredisi Hesaplama Yöntemleri",
            paragraphs: [
                "İhtiyaç kredisi, herhangi bir teminat gerektirmeden kullanılan tüketici kredisidir. Türkiye'de faiz oranları aylık %2,5-5 arasında değişir. Vade 3-36 ay arasındadır. Yüksek kredi notuna sahip müşterilere daha düşük faiz uygulanır.",
                "Dikkat edilecek noktalar: yıllık maliyet oranı (efektif faiz), BSMV (%15), dosya masrafı, hayat sigortası zorunluluğu. Bazı bankalar dosya masrafı almaz ancak faiz oranını yüksek tutar.",
            ],
            highlight: "100.000 ₺ ihtiyaç kredisi, aylık %3,49 faiz, 36 ay → Aylık taksit ≈ 4.730 ₺. Toplam geri ödeme: 170.280 ₺. Toplam faiz + maliyet: 70.280 ₺.",
        },
        faq: [
            { question: "İhtiyaç kredisi faiz oranları ne kadar?", answer: "2026 itibarıyla aylık %2,5-5 arasında. Maaş müşterilerine %2,29'dan başlayan oranlar, yeni müşterilere %3,49'dan başlayan oranlar uygulanmaktadır." },
            { question: "Kredi notu nasıl etkilenir?", answer: "Findeks (KKB) kredi notu 1-1900 arasında puanlanır. 1500+ iyi, 1700+ mükemmel sayılır. Düzenli ödemeler notu yükseltir, gecikmeler düşürür." },
        ],
        relatedIds: ["kredi-taksit-hesaplama", "konut-kredi-hesaplama"],
    },
    {
        id: "kredi-taksit-hesaplama",
        title: "Kredi Taksit Hesaplama — Aylık Ödeme Planı",
        keyword: "kredi taksit hesaplama",
        calcType: "emi",
        icon: "📅",
        subtitle: "Her türlü kredi için taksit hesaplama: konut, taşıt, ihtiyaç. Aylık taksit tutarı, toplam geri ödeme ve faiz maliyetini öğrenin.",
        explanation: {
            heading: "Kredi Taksiti Nasıl Hesaplanır?",
            paragraphs: [
                "Banka kredilerinde taksitler eşit aylık ödeme (annüite) yöntemiyle hesaplanır. Her taksitte anapara ve faiz payı bulunur. İlk taksitlerde faiz payı büyük, son taksitlerde anapara payı büyüktür.",
                "Sağlıklı borçlanma kuralı: Toplam kredi taksitleriniz aylık gelirinizin %40'ını geçmemelidir. Birden fazla krediniz varsa hepsinin toplamı bu orana dahildir.",
            ],
            highlight: "%40 kuralı: Aylık gelir 30.000 ₺ → maksimum toplam taksit 12.000 ₺. Gelir 50.000 ₺ → maksimum taksit 20.000 ₺. Bu sınırı aşmak ödeme güçlüğüne yol açabilir.",
        },
        faq: [
            { question: "Kredi taksitini geciktirirsem ne olur?", answer: "Gecikme faizi uygulanır (yasal faiz + %50'ye kadar ek faiz). Kredi notu (Findeks) düşer. 90 günü aşan gecikmelerde kara listeye alınırsınız." },
        ],
        relatedIds: ["konut-kredi-hesaplama", "tasit-kredi-hesaplama", "ihtiyac-kredi-hesaplama"],
    },
    {
        id: "faiz-hesaplama",
        title: "Faiz Hesaplama — Bileşik ve Basit Faiz",
        keyword: "faiz hesaplama",
        calcType: "compound-interest",
        icon: "📊",
        subtitle: "Bileşik faiz ve basit faiz hesaplama. Yatırımınızın zamanla nasıl büyüyeceğini görün. Mevduat, fon ve yatırım getirisi hesaplayın.",
        explanation: {
            heading: "Bileşik Faiz Nasıl Çalışır?",
            paragraphs: [
                "Bileşik faiz, anaparaya eklenen faizin de faiz kazanmasıdır. Formül: Gelecek Değer = P × (1 + r/n)^(n×t). P = anapara, r = yıllık faiz, n = yılda kaç kez bileşik, t = yıl sayısı.",
                "Türkiye'de mevduat faiz oranları %30-50 arasında (yıllık). Enflasyon %40-60 arasında olduğu dönemlerde reel getiri düşük kalabilir. Alternatifler: devlet tahvili, eurobond, altın, döviz.",
            ],
            highlight: "100.000 ₺ yıllık %45 bileşik faizle: 1 yıl = 145.000 ₺, 3 yıl = 304.000 ₺, 5 yıl = 660.000 ₺. 72 kuralı: 72 ÷ 45 = 1,6 yılda paranız ikiye katlanır.",
        },
        faq: [
            { question: "Basit faiz ile bileşik faiz farkı nedir?", answer: "Basit faiz: sadece anapara üzerinden hesaplanır. Bileşik faiz: anapara + birikmiş faiz üzerinden hesaplanır. Uzun vadede bileşik faiz çok daha yüksek getiri sağlar." },
            { question: "72 kuralı nedir?", answer: "72'yi faiz oranına bölün → paranızın kaç yılda ikiye katlanacağını bulun. %6 faiz → 12 yıl, %12 → 6 yıl, %36 → 2 yıl." },
        ],
        relatedIds: ["yatirim-hesaplama", "mevduat-hesaplama", "enflasyon-hesaplama"],
    },
    {
        id: "mevduat-hesaplama",
        title: "Mevduat Faiz Hesaplama — Vadeli Mevduat Getirisi",
        keyword: "mevduat faiz hesaplama",
        calcType: "compound-interest",
        icon: "🏦",
        subtitle: "Vadeli mevduat faiz getirisini hesaplayın. Stopaj kesintisi dahil net kazancınızı öğrenin. Banka faiz oranlarını karşılaştırın.",
        explanation: {
            heading: "Vadeli Mevduat Getirisi Nasıl Hesaplanır?",
            paragraphs: [
                "Vadeli mevduat getirisi: Anapara × Faiz Oranı × (Gün/365) = Brüt Faiz. Net Faiz = Brüt Faiz × (1 - Stopaj Oranı). TL mevduatta stopaj %15, döviz mevduatında %25'tir (2026 güncel oranlar değişkendir).",
                "Vade seçenekleri: 32 gün, 91 gün, 180 gün, 365 gün. Genellikle kısa vadeli faiz oranları daha yüksektir. KKM (Kur Korumalı Mevduat) hesapları da alternatif olarak değerlendirilebilir.",
            ],
            highlight: "500.000 ₺, yıllık %45, 180 gün vade → Brüt faiz: 110.959 ₺. Stopaj (%15): 16.644 ₺. Net faiz: 94.315 ₺. Toplam: 594.315 ₺.",
        },
        faq: [
            { question: "Mevduat stopaj oranı nedir?", answer: "TL mevduat: %15, Döviz mevduat: %25, KKM: %0 (teşvik kapsamında). Bu oranlar hükümet kararlarıyla değişebilir." },
        ],
        relatedIds: ["faiz-hesaplama", "yatirim-hesaplama", "enflasyon-hesaplama"],
    },
    {
        id: "yatirim-hesaplama",
        title: "Yatırım Getiri Hesaplama — Portföy Büyümesi",
        keyword: "yatırım hesaplama",
        calcType: "compound-interest",
        icon: "📈",
        subtitle: "Yatırım getirinizi hesaplayın: hisse senedi, fon, altın, döviz veya mevduat. Düzenli yatırımla portföyünüzün büyümesini simüle edin.",
        explanation: {
            heading: "Yatırım Getirisi Nasıl Hesaplanır?",
            paragraphs: [
                "Yatırım getirisi, başlangıç sermayesi, düzenli katkı, beklenen getiri oranı ve süreye bağlıdır. Türkiye'de popüler yatırım araçları: mevduat (%35-50), devlet tahvili (%30-45), BIST 100 (değişken), altın (%20-40 yıllık ortalama), döviz (değişken).",
                "BIST 100 endeksi son 10 yılda ortalama TL bazında %25-35 yıllık getiri sağlamıştır. Ancak reel getiri (enflasyon düşüldükten sonra) çok daha düşüktür. Uzun vadeli yatırımda düzenli alım (maliyet ortalama) önemlidir.",
            ],
            highlight: "Aylık 5.000 ₺ yatırım, yıllık %30 getiri, 10 yıl → Portföy değeri: 11.000.000 ₺. Toplam yatırılan: 600.000 ₺. Kazanç: 10.400.000 ₺!",
        },
        faq: [
            { question: "Türkiye'de en iyi yatırım aracı hangisi?", answer: "Enflasyona karşı korunma için altın ve döviz, büyüme için hisse senedi/fon, güvenli getiri için devlet tahvili ve mevduat. Risk profilinize göre çeşitlendirme yapın." },
        ],
        relatedIds: ["faiz-hesaplama", "mevduat-hesaplama", "enflasyon-hesaplama"],
    },
    {
        id: "enflasyon-hesaplama",
        title: "Enflasyon Hesaplama — Paranızın Gerçek Değeri",
        keyword: "enflasyon hesaplama",
        calcType: "compound-interest",
        icon: "📉",
        subtitle: "Enflasyonun paranızın satın alma gücünü nasıl etkilediğini hesaplayın. Geçmiş ve gelecek değerleri karşılaştırın.",
        explanation: {
            heading: "Enflasyonun Paranıza Etkisi",
            paragraphs: [
                "Enflasyon, genel fiyat düzeyinin artmasıdır. Türkiye'de TÜFE (Tüketici Fiyat Endeksi) TÜİK tarafından açıklanır. 2022-2024 döneminde enflasyon %40-85 arasında seyretti. 2026'da tek haneli enflasyon hedeflenmektedir.",
                "Reel getiri = Nominal getiri - Enflasyon. Mevduat faizi %45, enflasyon %40 ise reel getiri sadece %5. Paranızı korumanız için enflasyonun üzerinde getiri sağlayan yatırımlar seçmelisiniz.",
            ],
            highlight: "100.000 ₺'nin değeri %40 enflasyonla: 1 yıl sonra 71.429 ₺ (bugünkü değer), 3 yıl sonra 36.443 ₺, 5 yıl sonra 18.593 ₺. Paranız 5 yılda %81 değer kaybeder!",
        },
        faq: [
            { question: "TÜFE ve ÜFE farkı nedir?", answer: "TÜFE: tüketici fiyatları (halkın hissettiği enflasyon). ÜFE: üretici fiyatları (üretim maliyetleri). ÜFE genellikle TÜFE'yi 2-6 ay önceden tahmin eder." },
        ],
        relatedIds: ["faiz-hesaplama", "yatirim-hesaplama", "mevduat-hesaplama"],
    },
    {
        id: "kdv-hesaplama",
        title: "KDV Hesaplama — Katma Değer Vergisi %1-%20",
        keyword: "KDV hesaplama",
        calcType: "kdv",
        icon: "🧾",
        subtitle: "KDV hesaplama: %1, %10 veya %20 oranlarıyla KDV ekleyin veya KDV dahil fiyattan KDV tutarını çıkarın.",
        explanation: {
            heading: "KDV Nasıl Hesaplanır?",
            paragraphs: [
                "KDV (Katma Değer Vergisi) Türkiye'de 3 oran uygulanır: %1 (temel gıda, gazete), %10 (tekstil, turizm, gıda servisi) ve %20 (genel oran). KDV ekleme: Fiyat × (1 + KDV oranı). KDV çıkarma: KDV dahil fiyat ÷ (1 + KDV oranı) × KDV oranı.",
                "Mükelleflerin KDV beyannamesi aylık verilir. İndirilecek KDV (alışlardaki KDV) ile hesaplanan KDV (satışlardaki KDV) arasındaki fark ödenir. KDV iade hakkı ihracatçılar ve bazı sektörler için geçerlidir.",
            ],
            highlight: "1.000 ₺ fiyat + %20 KDV = 200 ₺ KDV → 1.200 ₺ toplam. KDV dahil 1.200 ₺ → KDV hariç 1.000 ₺, KDV tutarı 200 ₺. %10 KDV: 1.000 ₺ → 1.100 ₺.",
        },
        faq: [
            { question: "Hangi ürünlere hangi KDV oranı uygulanır?", answer: "%1: ekmek, un, pirinç, süt, gazete. %10: et, balık, tekstil, otel, lokanta. %20: elektronik, otomobil, mobilya ve diğer genel tüketim malları." },
            { question: "e-Fatura ve e-Arşiv Fatura zorunluluğu nedir?", answer: "Brüt satış hasılatı 1 milyon ₺'yi aşan mükellefler e-Fatura, tüm mükellefler e-Arşiv Fatura kullanmak zorundadır." },
        ],
        relatedIds: ["gelir-vergisi-hesaplama", "indirim-hesaplama"],
    },
    {
        id: "gelir-vergisi-hesaplama",
        title: "Gelir Vergisi Hesaplama — Vergi Dilimi 2026",
        keyword: "gelir vergisi hesaplama",
        calcType: "gelir-vergisi",
        icon: "📋",
        subtitle: "Gelir vergisi hesaplama: güncel vergi dilimleri ile net maaşınızı ve vergi yükünüzü hesaplayın. 2026 güncel oranlar.",
        explanation: {
            heading: "Gelir Vergisi Nasıl Hesaplanır?",
            paragraphs: [
                "Gelir vergisi artan oranlı (progresif) tarife ile hesaplanır. 2026 vergi dilimleri: %15 (0-110.000 ₺), %20 (110.000-230.000 ₺), %27 (230.000-580.000 ₺), %35 (580.000-3.000.000 ₺), %40 (3.000.000 ₺ üzeri).",
                "Ücretlilerde gelir vergisi kümülatif olarak hesaplanır. Yıl başında düşük oran uygulanır, yıl sonuna doğru üst dilimlere geçilir. SGK işçi payı (%14) ve işsizlik sigortası (%1) brüt maaştan düşüldükten sonra vergi matrahı hesaplanır.",
            ],
            highlight: "Brüt maaş 50.000 ₺/ay: SGK -%7.000 ₺, İşsizlik -%500 ₺. Vergi matrahı: 42.500 ₺. İlk aylarda %15 → ≈6.375 ₺ vergi. Yıl sonuna doğru %27-35 dilimine geçilir.",
        },
        faq: [
            { question: "2026 gelir vergisi dilimleri nedir?", answer: "%15 (0-110.000 ₺), %20 (110.000-230.000 ₺), %27 (230.000-580.000 ₺), %35 (580.000-3.000.000 ₺), %40 (3.000.000 ₺ üzeri)." },
            { question: "Asgari ücret vergiden muaf mı?", answer: "Asgari ücretlilerin gelir vergisi ve damga vergisi istisnası bulunmaktadır. Asgari ücretin üzerindeki kısım için normal vergi dilimleri uygulanır." },
        ],
        relatedIds: ["maas-hesaplama", "kdv-hesaplama"],
    },
    {
        id: "maas-hesaplama",
        title: "Maaş Hesaplama — Brütten Nete",
        keyword: "maaş hesaplama brütten nete",
        calcType: "maas",
        icon: "💵",
        subtitle: "Brüt maaştan net maaş hesaplama. SGK, gelir vergisi ve damga vergisi kesintilerini otomatik hesaplayın.",
        explanation: {
            heading: "Brütten Nete Maaş Nasıl Hesaplanır?",
            paragraphs: [
                "Net maaş = Brüt maaş - SGK işçi payı (%14) - İşsizlik sigortası (%1) - Gelir vergisi (kümülatif artan oranlı) - Damga vergisi (%0,759). İşveren maliyeti ise bunlara ek olarak SGK işveren payı (%20,5) ve işsizlik işveren payı (%2) içerir.",
                "2026 asgari ücret brüt 22.104 ₺, net yaklaşık 17.002 ₺ (gelir vergisi ve damga vergisi istisnası ile). AGİ (Asgari Geçim İndirimi) kaldırılmış olup, asgari ücrete kadar olan kısım vergiden muaftır.",
            ],
            highlight: "Brüt 40.000 ₺: SGK -5.600 ₺, İşsizlik -400 ₺, Vergi matrahı 34.000 ₺, Gelir vergisi ~-5.100 ₺, Damga ~-304 ₺. Net maaş ≈ 28.596 ₺.",
        },
        faq: [
            { question: "Asgari ücret 2026 ne kadar?", answer: "2026 yılı brüt asgari ücret 22.104 ₺, net asgari ücret yaklaşık 17.002 ₺'dir (gelir vergisi ve damga vergisi istisnası ile)." },
        ],
        relatedIds: ["gelir-vergisi-hesaplama", "sgk-hesaplama", "kidem-tazminati-hesaplama"],
    },
    {
        id: "sgk-hesaplama",
        title: "SGK Prim Hesaplama — Sigorta Kesintileri",
        keyword: "SGK prim hesaplama",
        calcType: "sgk",
        icon: "🏥",
        subtitle: "SGK prim tutarlarını hesaplayın: işçi ve işveren payları, emeklilik prim gün sayısı, prime esas kazanç.",
        explanation: {
            heading: "SGK Primleri Nasıl Hesaplanır?",
            paragraphs: [
                "SGK primleri prime esas kazanç (PEK) üzerinden hesaplanır. İşçi payı: SGK %14, işsizlik %1 = toplam %15. İşveren payı: SGK %20,5, işsizlik %2 = toplam %22,5. Toplam maliyet: %37,5.",
                "PEK tabanı: brüt asgari ücret (22.104 ₺). PEK tavanı: brüt asgari ücretin 7,5 katı (165.780 ₺). Bu tavanın üzerindeki kazançlardan prim kesilmez.",
            ],
            highlight: "Brüt 50.000 ₺: İşçi SGK -7.000 ₺, İşsizlik -500 ₺. İşveren SGK -10.250 ₺, İşsizlik -1.000 ₺. Toplam SGK maliyeti: 18.750 ₺/ay.",
        },
        faq: [
            { question: "Emeklilik için kaç gün prim gerekli?", answer: "2008 sonrası sigortalılar: 7200 prim günü (20 yıl) + yaş şartı (kadın 58, erkek 60). Prim gün sayısı ve yaş koşullarının ikisi de sağlanmalıdır." },
        ],
        relatedIds: ["maas-hesaplama", "kidem-tazminati-hesaplama"],
    },
    {
        id: "kidem-tazminati-hesaplama",
        title: "Kıdem Tazminatı Hesaplama",
        keyword: "kıdem tazminatı hesaplama",
        calcType: "kidem",
        icon: "🏆",
        subtitle: "Kıdem tazminatı tutarınızı hesaplayın. Çalışma süresi ve brüt maaşınıza göre hak ettiğiniz tazminatı öğrenin.",
        explanation: {
            heading: "Kıdem Tazminatı Nasıl Hesaplanır?",
            paragraphs: [
                "Kıdem tazminatı = Çalışılan yıl × Son brüt maaş (giydirilmiş). Her tam yıl için 30 günlük brüt ücret karşılığı ödenir. Kıdem tazminatı tavanı 2026 yılında yaklaşık 35.000 ₺'dir (her 6 ayda güncellenir).",
                "Kıdem tazminatı hak edilen durumlar: işveren tarafından fesih, emeklilik, askerlik, evlilik (kadın için 1 yıl içinde), sağlık nedenleri. İstifa durumunda genel olarak hak edilmez (istisnalar hariç).",
            ],
            highlight: "10 yıl çalışma, brüt maaş 30.000 ₺ (tavan altında) → Kıdem tazminatı: 10 × 30.000 = 300.000 ₺ (brüt). Gelir vergisi kesilmez, sadece damga vergisi (%0,759) ödenir.",
        },
        faq: [
            { question: "Kıdem tazminatından vergi kesilir mi?", answer: "Gelir vergisi kesilmez. Sadece damga vergisi (%0,759) uygulanır. 300.000 ₺ tazminat → damga vergisi: 2.277 ₺." },
        ],
        relatedIds: ["maas-hesaplama", "sgk-hesaplama"],
    },
    {
        id: "kar-zarar-hesaplama",
        title: "Kâr-Zarar Hesaplama — İşletme Karlılığı",
        keyword: "kâr zarar hesaplama",
        calcType: "profit",
        icon: "💰",
        subtitle: "İşletmenizin kâr-zarar durumunu hesaplayın. Brüt kâr, net kâr ve kâr marjı analizini yapın.",
        explanation: {
            heading: "Kâr-Zarar Nasıl Hesaplanır?",
            paragraphs: [
                "Brüt kâr = Gelir - Satılan Malın Maliyeti. Net kâr = Brüt kâr - Giderler - Vergiler. Kâr marjı = (Net kâr ÷ Gelir) × 100%. Sektöre göre sağlıklı kâr marjı: perakende %3-8, gıda %8-15, hizmet %15-30.",
                "KOBİ'ler için önemli: KDV, gelir/kurumlar vergisi, SGK giderlerini hesaba katın. Nakit akış yönetimi kârlılık kadar önemlidir.",
            ],
            highlight: "Gelir 500.000 ₺, maliyet 300.000 ₺, giderler 120.000 ₺ → Brüt kâr 200.000 ₺ (%40), Net kâr 80.000 ₺ (%16).",
        },
        faq: [
            { question: "KOBİ'ler için kurumlar vergisi oranı nedir?", answer: "Kurumlar vergisi genel oranı %25. Bazı sektörlerde ve KOBİ'lere yönelik indirimli oranlar uygulanabilir." },
        ],
        relatedIds: ["kar-marji-hesaplama", "yatirim-getiri-hesaplama", "indirim-hesaplama"],
    },
    {
        id: "indirim-hesaplama",
        title: "İndirim Hesaplama — Fiyat Hesaplayıcı",
        keyword: "indirim hesaplama",
        calcType: "discount",
        icon: "🏷️",
        subtitle: "İndirim tutarını ve indirimli fiyatı hesaplayın. Tekli ve kademeli indirimleri karşılaştırın.",
        explanation: {
            heading: "İndirim Nasıl Hesaplanır?",
            paragraphs: [
                "İndirimli fiyat = Orijinal fiyat × (1 - İndirim oranı/100). Kademeli indirimler: %30 + %20 ≠ %50! 100 ₺'de %30 + %20 = 100 × 0,70 × 0,80 = 56 ₺ (toplam %44 indirim).",
                "Alışveriş tüyosu: Etiket fiyatını birden fazla mağazada karşılaştırın. İndirim öncesi fiyat artışlarına dikkat edin. Kara Cuma, 11.11, sezon sonu indirimlerinde bu hesaplayıcıyı kullanın.",
            ],
            highlight: "500 ₺ ürün, %40 indirim = 200 ₺ tasarruf, ödenen 300 ₺. Kademeli %30+%20 = 280 ₺ (350 ₺ değil!).",
        },
        faq: [
            { question: "Kademeli indirim neden daha az?", answer: "İkinci indirim, ilk indirimden sonraki fiyat üzerinden hesaplandığı için toplam indirim oranı daha düşüktür." },
        ],
        relatedIds: ["kdv-hesaplama", "yuzde-hesaplama"],
    },
    {
        id: "kar-marji-hesaplama",
        title: "Kâr Marjı Hesaplama — Markup ve Marj",
        keyword: "kâr marjı hesaplama",
        calcType: "margin",
        icon: "📊",
        subtitle: "Kâr marjı ve markup hesaplama. Satış fiyatı ve maliyet bilgisinden kârlılığınızı analiz edin.",
        explanation: {
            heading: "Kâr Marjı ve Markup Farkı",
            paragraphs: [
                "Marj = (Kâr ÷ Satış Fiyatı) × 100%. Markup = (Kâr ÷ Maliyet) × 100%. Maliyet 100 ₺, satış 150 ₺: markup %50, marj %33,3.",
                "İş dünyasında marj daha yaygın kullanılır çünkü gelirden hareketle kârlılığı gösterir. %20 marj = her 100 ₺ satıştan 20 ₺ kâr.",
            ],
            highlight: "Maliyet 80 ₺, satış 120 ₺: Kâr 40 ₺, Markup %50, Marj %33,3. Hedef marj %40 ise satış fiyatı = 80 ÷ 0,60 = 133,3 ₺.",
        },
        faq: [
            { question: "Hangisi daha önemli: marj mı markup mı?", answer: "Marj, finansal analizde daha çok tercih edilir. Markup ise fiyatlandırma yaparken pratiktir." },
        ],
        relatedIds: ["kar-zarar-hesaplama", "indirim-hesaplama"],
    },
    {
        id: "yatirim-getiri-hesaplama",
        title: "ROI Hesaplama — Yatırım Getirisi",
        keyword: "ROI hesaplama",
        calcType: "roi",
        icon: "💹",
        subtitle: "Yatırım getirisi (ROI) hesaplama. Farklı yatırım alternatiflerinin verimliliğini karşılaştırın.",
        explanation: {
            heading: "ROI Nasıl Hesaplanır?",
            paragraphs: [
                "ROI = (Net Kazanç ÷ Yatırım Maliyeti) × 100%. Pozitif ROI kârlı, negatif ROI zararlı demektir. %100 ROI → paranız ikiye katlanmış.",
                "Yıllık ROI karşılaştırması daha doğrudur. 3 yılda %60 ROI = yıllık ~%17. Bunu mevduat faizi ile karşılaştırarak yatırımın değerliliğini anlayabilirsiniz.",
            ],
            highlight: "200.000 ₺ yatırım, 50.000 ₺ net kazanç (1 yıl): ROI = %25. Yıllık mevduat %45 ise bu yatırım mevduattan daha az getiri sağlamıştır.",
        },
        faq: [
            { question: "İyi bir ROI oranı nedir?", answer: "Türkiye'de mevduat %35-50 getiri sunarken, risk alınan yatırımlardan en az %50+ ROI beklenir. Gayrimenkul: %15-30, hisse: değişken, girişim: %100+." },
        ],
        relatedIds: ["yatirim-hesaplama", "kar-zarar-hesaplama", "faiz-hesaplama"],
    },
    {
        id: "yuzde-hesaplama",
        title: "Yüzde Hesaplama — Oran Hesaplayıcı",
        keyword: "yüzde hesaplama",
        calcType: "percentage",
        icon: "📐",
        subtitle: "Yüzde hesaplama: X'in Y'si kaçtır, X'in %Y'si nedir ve yüzde artış/azalış hesaplama.",
        explanation: {
            heading: "Yüzde Nasıl Hesaplanır?",
            paragraphs: [
                "Üç tür yüzde hesabı: (1) X'in %Y'si = X × Y/100. (2) X, Y'nin yüzde kaçı? → (X/Y) × 100. (3) Artış yüzdesi: ((Yeni-Eski)/Eski) × 100%.",
                "Yüzde puan ve yüzde farkı: Faiz %5'ten %7'ye çıkınca '2 yüzde puan' arttı ama '%40 arttı' (göreli olarak).",
            ],
            highlight: "250'nin %15'i = 37,5 | 75, 300'ün %25'i | 1.000'den 1.200'e artış = %20",
        },
        faq: [
            { question: "Yüzde puan nedir?", answer: "İki yüzde arasındaki mutlak fark. %5'ten %8'e: 3 yüzde puan artış, ama %60 göreli artış." },
        ],
        relatedIds: ["indirim-hesaplama", "kdv-hesaplama"],
    },
    {
        id: "ortalama-hesaplama",
        title: "Ortalama Hesaplama — Aritmetik Ortalama",
        keyword: "ortalama hesaplama",
        calcType: "average",
        icon: "📏",
        subtitle: "Aritmetik ortalama, medyan ve mod hesaplama. Not ortalaması, istatistik ve veri analizi için.",
        explanation: {
            heading: "Ortalama Nasıl Hesaplanır?",
            paragraphs: [
                "Aritmetik ortalama = Toplam ÷ Adet. Medyan = sıralanmış verinin ortası. Mod = en çok tekrar eden değer.",
                "Üniversite not ortalaması (GPA) ağırlıklı ortalama ile hesaplanır: her dersin notu × AKTS kredisi, toplamı toplam AKTS'ye bölünür.",
            ],
            highlight: "Notlar: 70, 85, 90, 85, 60 → Ortalama: 78, Medyan: 85, Mod: 85.",
        },
        faq: [
            { question: "GPA nasıl hesaplanır?", answer: "Her ders notu × AKTS kredisi → topla → toplam AKTS'ye böl. Örnek: 3 AKTS'lik dersten AA (4.0): 3×4=12, 4 AKTS'lik dersten BA (3.5): 4×3.5=14. GPA = 26÷7 = 3.71." },
        ],
        relatedIds: ["yuzde-hesaplama"],
    },
    {
        id: "kesir-hesaplama",
        title: "Kesir Hesaplama — Toplama, Çıkarma, Çarpma",
        keyword: "kesir hesaplama",
        calcType: "fraction",
        icon: "🔢",
        subtitle: "Kesir toplama, çıkarma, çarpma ve bölme. Kesirleri sadeleştirme ve ondalığa çevirme.",
        explanation: {
            heading: "Kesirlerle İşlemler",
            paragraphs: [
                "Toplama/çıkarma: paydaları eşitle. 1/3 + 1/4 = 4/12 + 3/12 = 7/12. Çarpma: pay×pay, payda×payda. 2/3 × 3/4 = 6/12 = 1/2.",
                "Bölme: ikinci kesri ters çevir, çarp. 2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6. EBOB ile sadeleştir.",
            ],
            highlight: "1/3 + 1/4 = 7/12 | 2/3 × 3/5 = 2/5 | 3/4 ÷ 2/3 = 9/8 = 1⅛",
        },
        faq: [
            { question: "Kesir nasıl sadeleştirilir?", answer: "Pay ve paydanın EBOB'unu bul, ikisini de böl. 12/18: EBOB=6, 12/18 = 2/3." },
        ],
        relatedIds: ["yuzde-hesaplama", "us-hesaplama"],
    },
    {
        id: "us-hesaplama",
        title: "Üs ve Kök Hesaplama — Üstel İşlemler",
        keyword: "üs hesaplama",
        calcType: "power",
        icon: "✖️",
        subtitle: "Üs alma, karekök, küpkök ve logaritma hesaplama. Matematik problemlerini hızla çözün.",
        explanation: {
            heading: "Üs ve Kök İşlemleri",
            paragraphs: [
                "Üs: a^n = a × a × ... × a (n kez). Kök: √a = a^(1/2). Üs kuralları: a^m × a^n = a^(m+n), (a^m)^n = a^(m×n), a^0 = 1.",
                "Negatif üs: a^(-n) = 1/a^n. Kesirli üs: a^(m/n) = ⁿ√(aᵐ).",
            ],
            highlight: "2^10 = 1.024 | √144 = 12 | 5³ = 125 | ∛64 = 4 | 10⁶ = 1.000.000",
        },
        faq: [
            { question: "0 üzeri 0 kaçtır?", answer: "Matematik konvansiyonuna göre 0^0 = 1 kabul edilir. Programlama ve formüllerde bu değer yaygın olarak kullanılır." },
        ],
        relatedIds: ["kesir-hesaplama", "yuzde-hesaplama"],
    },
    {
        id: "vki-hesaplama",
        title: "VKİ Hesaplama — Vücut Kitle İndeksi",
        keyword: "vücut kitle indeksi hesaplama",
        calcType: "bmi",
        icon: "⚖️",
        subtitle: "VKİ (BMI) hesaplayın: boy ve kilonuza göre ideal kiloda olup olmadığınızı öğrenin. WHO standartlarına göre.",
        explanation: {
            heading: "VKİ Nasıl Hesaplanır?",
            paragraphs: [
                "VKİ = Kilo (kg) ÷ Boy² (m²). WHO kategorileri: <18,5 zayıf, 18,5-24,9 normal, 25-29,9 fazla kilolu, ≥30 obez.",
                "VKİ tek başına yeterli bir gösterge değildir — kas kütlesi ile yağ kütlesini ayırt edemez. Bel çevresi ölçümü (erkek >102 cm, kadın >88 cm risk) ek bilgi sağlar.",
            ],
            highlight: "Boy 175 cm, kilo 80 kg: VKİ = 80 ÷ (1,75)² = 26,1 → Fazla kilolu. İdeal kilo aralığı: 57-76 kg.",
        },
        faq: [
            { question: "İdeal VKİ kaç olmalı?", answer: "18,5-24,9 arası normal kabul edilir. Türkiye'de yetişkinlerin %67'si fazla kilolu veya obez kategorisindedir (TÜİK 2024)." },
        ],
        relatedIds: ["yas-hesaplama"],
    },
    {
        id: "yas-hesaplama",
        title: "Yaş Hesaplama — Doğum Tarihinden Yaş",
        keyword: "yaş hesaplama",
        calcType: "age",
        icon: "🎂",
        subtitle: "Doğum tarihinizden yaşınızı yıl, ay ve gün olarak hesaplayın. Resmi başvurular ve emeklilik hesabı için.",
        explanation: {
            heading: "Yaş Nasıl Hesaplanır?",
            paragraphs: [
                "Yaş hesaplayıcı, doğum tarihi ile bugün arasındaki farkı yıl, ay ve gün olarak verir. KPSS, emeklilik, askerlik ve resmi başvurular için kesin yaş hesabı önemlidir.",
                "Türkiye'de yasal yaş sınırları: 18 yaş ehliyet ve seçme hakkı, 18 yaş evlenme, emeklilik yaşı kademeli olarak 58-65 arası (doğum yılına göre).",
            ],
            highlight: "1 Ocak 1990 doğumlu → 2026'da 36 yaşında. 13.140+ gün = 432 ay yaşamışsınız. Emeklilik yaşınız: doğum yılınıza göre hesaplanır.",
        },
        faq: [
            { question: "KPSS yaş sınırı nedir?", answer: "Genel olarak üst yaş sınırı yoktur. Ancak bazı kurumlara atanmak için 35 veya 40 yaş üst sınırı aranabilir." },
        ],
        relatedIds: ["vki-hesaplama", "gebelik-hesaplama"],
    },
    {
        id: "gebelik-hesaplama",
        title: "Gebelik Hesaplama — Tahmini Doğum Tarihi",
        keyword: "gebelik hesaplama",
        calcType: "pregnancy",
        icon: "🤰",
        subtitle: "Tahmini doğum tarihi (TDT) ve gebelik haftası hesaplama. Son adet tarihinizi girerek öğrenin.",
        explanation: {
            heading: "Tahmini Doğum Tarihi Nasıl Hesaplanır?",
            paragraphs: [
                "Naegele kuralı: Son adet tarihine (SAT) 280 gün (40 hafta) ekleyin. Bu 28 günlük düzenli siklüs ve 14. günde ovülasyon varsayımına dayanır.",
                "Gebelik 3 trimestere ayrılır: 1. trimester (1-12 hafta), 2. trimester (13-27 hafta), 3. trimester (28-40 hafta). Bebeklerin sadece %5'i TDT'de doğar.",
            ],
            highlight: "SAT 1 Ocak 2026 → TDT 8 Ekim 2026. 1. trimester bitiş: 26 Mart. İlk trimester ultrason (11-14 hafta) en doğru gebelik yaşını verir.",
        },
        faq: [
            { question: "TDT ne kadar doğrudur?", answer: "Sadece %5 bebek TDT'de doğar. %80'i 38-42 hafta arasında doğar. İlk trimester ultrason daha doğru sonuç verir." },
        ],
        relatedIds: ["yas-hesaplama", "vki-hesaplama"],
    },
    {
        id: "doviz-hesaplama",
        title: "Döviz Hesaplama — Kur Çevirici",
        keyword: "döviz hesaplama",
        calcType: "currency",
        icon: "💱",
        subtitle: "Döviz kuru hesaplama: TL'den dolara, euroya, sterlina ve diğer dövizlere çevirin. TCMB kurlarıyla.",
        explanation: {
            heading: "Döviz Nasıl Hesaplanır?",
            paragraphs: [
                "Döviz çevirme: Tutar × Kur = Karşılık. Alış ve satış kuru arasında %1-3 fark vardır (spread). TCMB efektif kuru en güvenilir referanstır.",
                "Döviz alım/satım yerleri: bankalar (yüksek spread), döviz büroları (düşük spread), dijital bankalar (rekabetçi kurlar). Havalimanı ve otellerde en kötü kurlar uygulanır.",
            ],
            highlight: "USD 1 = 32,50 ₺ (TCMB). $1.000 almak: bankada 33.200 ₺ (satış kuru), döviz bürosunda 32.800 ₺. Fark: 400 ₺!",
        },
        faq: [
            { question: "En iyi döviz kuru nerede bulunur?", answer: "Döviz büroları genellikle en iyi kurları sunar. Dijital bankalar (Papara, Enpara) da rekabetçi kurlar verir. TCMB efektif kuru referans olarak kullanılır." },
        ],
        relatedIds: ["yuzde-hesaplama", "kdv-hesaplama"],
    },
];

export function getTrCalculatorBySlug(slug: string): TrCalculator | undefined {
    return TR_CALCULATORS.find(c => c.id === slug);
}

