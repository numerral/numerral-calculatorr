// Indonesian Calculator definitions — /id/
export interface IdCalculator {
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

export const ID_CALCULATORS: IdCalculator[] = [
    {
        id: "kalkulator-kpr",
        title: "Kalkulator KPR — Simulasi Kredit Rumah",
        keyword: "kalkulator KPR",
        calcType: "mortgage",
        icon: "🏠",
        subtitle: "Hitung cicilan KPR bulanan berdasarkan harga rumah, uang muka, suku bunga, dan tenor. Simulasi kredit rumah dari berbagai bank Indonesia.",
        explanation: {
            heading: "Bagaimana Cara Menghitung Cicilan KPR?",
            paragraphs: [
                "KPR (Kredit Pemilikan Rumah) adalah fasilitas kredit dari bank untuk membeli rumah atau apartemen. Di Indonesia, uang muka minimal 10-20% dari harga properti. Suku bunga KPR terbagi dua: bunga fixed (tetap 1-5 tahun pertama, biasanya 4-8%) dan bunga floating (mengikuti suku bunga BI, biasanya 9-12%).",
                "Cicilan KPR dihitung dengan metode anuitas — cicilan tetap setiap bulan selama masa kredit. Rumus: Cicilan = P × r × (1+r)^n / ((1+r)^n - 1), di mana P = pokok pinjaman, r = bunga per bulan, n = jumlah bulan. Tenor KPR di Indonesia bisa sampai 20-25 tahun.",
            ],
            highlight: "Contoh: Rumah Rp 500 juta, DP 20% (Rp 100 juta), pinjaman Rp 400 juta, bunga 7% fixed, tenor 20 tahun → cicilan ≈ Rp 3,1 juta/bulan. Total yang dibayar: Rp 744 juta — bunga total Rp 344 juta!",
        },
        faq: [
            { question: "Berapa DP minimal KPR di Indonesia?", answer: "Minimal 10% untuk rumah pertama (tipe ≤70m²) dan 15-20% untuk rumah kedua atau tipe lebih besar. Beberapa bank menawarkan DP 0% untuk program khusus, tapi bunga biasanya lebih tinggi." },
            { question: "Apa bedanya bunga fixed dan floating?", answer: "Bunga fixed tetap selama periode tertentu (1-5 tahun), memberikan kepastian cicilan. Bunga floating mengikuti suku bunga pasar (BI Rate) dan bisa naik atau turun. Biasanya bunga fixed lebih rendah di awal, lalu berubah ke floating." },
            { question: "Bank mana yang punya bunga KPR terendah?", answer: "Per 2026, bunga KPR fixed terendah berkisar 4-6% dari bank BUMN (BRI, BTN, Mandiri) dan 5-8% dari bank swasta. Bandingkan minimal 3-5 bank sebelum memutuskan." },
        ],
        relatedIds: ["kalkulator-cicilan", "kalkulator-bunga", "kalkulator-investasi"],
    },
    {
        id: "kalkulator-kredit-mobil",
        title: "Kalkulator Kredit Mobil — Simulasi Cicilan Mobil",
        keyword: "kalkulator kredit mobil",
        calcType: "emi",
        icon: "🚗",
        subtitle: "Hitung cicilan kredit mobil bulanan. Masukkan harga mobil, DP, bunga, dan tenor untuk simulasi dari leasing atau bank.",
        explanation: {
            heading: "Cara Menghitung Cicilan Kredit Mobil",
            paragraphs: [
                "Kredit mobil di Indonesia bisa melalui bank atau perusahaan pembiayaan (leasing) seperti Adira, WOM, BAF, atau ACC. DP minimal 20-30% dari harga kendaraan. Tenor 1-5 tahun dengan bunga flat 3-8% per tahun.",
                "Penting: bunga flat berbeda dengan bunga efektif. Bunga flat 5% setara dengan bunga efektif sekitar 9-10%. Leasing biasanya menggunakan bunga flat, sementara bank menggunakan bunga efektif (anuitas). Pastikan Anda membandingkan dengan cara yang sama.",
            ],
            highlight: "Mobil Rp 250 juta, DP 25% (Rp 62,5 juta), pinjaman Rp 187,5 juta, bunga flat 5%, tenor 4 tahun → cicilan ≈ Rp 4,7 juta/bulan.",
        },
        faq: [
            { question: "Berapa DP minimal kredit mobil?", answer: "Minimal 20% untuk mobil baru dan 25-30% untuk mobil bekas. Beberapa leasing menawarkan DP lebih rendah dengan bunga lebih tinggi." },
            { question: "Apa bedanya kredit via bank dan leasing?", answer: "Bank: bunga efektif (lebih murah total), proses lebih ketat. Leasing: bunga flat (terlihat murah tapi total lebih mahal), proses lebih cepat dan mudah. BPKB ditahan oleh pemberi kredit sampai lunas." },
            { question: "Apakah bisa pelunasan dipercepat?", answer: "Bisa, tapi ada penalti 1-5% dari sisa pokok. Beberapa leasing membebankan penalti yang cukup besar. Cek syarat pelunasan dipercepat sebelum tanda tangan kontrak." },
        ],
        relatedIds: ["kalkulator-kredit-motor", "kalkulator-cicilan", "kalkulator-pinjaman"],
    },
    {
        id: "kalkulator-kredit-motor",
        title: "Kalkulator Kredit Motor — Simulasi Cicilan Motor",
        keyword: "kalkulator kredit motor",
        calcType: "emi",
        icon: "🏍️",
        subtitle: "Hitung cicilan kredit motor bulanan dari berbagai leasing. Masukkan harga motor, DP, dan tenor untuk simulasi.",
        explanation: {
            heading: "Cara Menghitung Cicilan Kredit Motor",
            paragraphs: [
                "Indonesia adalah pasar motor terbesar ke-3 di dunia. Kredit motor sangat populer dengan DP mulai dari Rp 500 ribu di beberapa dealer. Tenor 1-4 tahun dengan bunga flat 1.5-3% per bulan. Leasing utama: FIF (Honda), Adira (Yamaha), BAF, WOM Finance.",
                "Cicilan motor dihitung dengan bunga flat: Cicilan = (Harga - DP + Total Bunga) ÷ Tenor bulan. Total bunga = Pokok pinjaman × bunga tahunan × tenor tahun. Metode ini menghasilkan cicilan tetap setiap bulan.",
            ],
            highlight: "Motor Rp 25 juta, DP Rp 5 juta, pinjaman Rp 20 juta, bunga flat 2%/bulan (24%/tahun), tenor 3 tahun → cicilan ≈ Rp 956 ribu/bulan. Total bunga: Rp 14,4 juta!",
        },
        faq: [
            { question: "Berapa DP minimal kredit motor?", answer: "Secara regulasi OJK, minimal 20%. Tapi banyak dealer menawarkan DP mulai Rp 500 ribu - Rp 3 juta sebagai promo. DP kecil = cicilan lebih besar dan total bunga lebih mahal." },
            { question: "Apa risiko kredit motor DP kecil?", answer: "Cicilan lebih berat, total bunga lebih besar, dan risiko motor ditarik jika telat bayar. Lebih baik DP minimal 25-30% untuk cicilan yang nyaman." },
        ],
        relatedIds: ["kalkulator-kredit-mobil", "kalkulator-cicilan"],
    },
    {
        id: "kalkulator-pinjaman",
        title: "Kalkulator Pinjaman Online — Simulasi Cicilan Pinjol",
        keyword: "kalkulator pinjaman online",
        calcType: "emi",
        icon: "💳",
        subtitle: "Hitung cicilan pinjaman online (pinjol) dan pinjaman bank. Bandingkan bunga dan total pembayaran sebelum mengajukan.",
        explanation: {
            heading: "Memahami Perhitungan Pinjaman di Indonesia",
            paragraphs: [
                "Pinjaman di Indonesia tersedia dari bank (KTA/Kredit Tanpa Agunan), fintech lending (pinjol), dan koperasi. Bunga KTA bank: 0.8-2% per bulan (flat). Bunga pinjol OJK: maks 0.4% per hari. Pinjaman koperasi: 1-2% per bulan.",
                "Pastikan pinjaman dari lembaga terdaftar/berizin OJK. Cek di ojk.go.id. Pinjol ilegal bisa mengenakan bunga >1% per hari dan mengakses data pribadi Anda. Bandingkan APR (Annual Percentage Rate) untuk perbandingan yang adil.",
            ],
            highlight: "KTA Rp 50 juta, bunga 1% flat/bulan, tenor 3 tahun → cicilan Rp 1,89 juta/bulan. Total bunga Rp 18 juta (36%). Bandingkan: pinjol Rp 5 juta, bunga 0.4%/hari, 30 hari → bunga Rp 600 ribu (12%/bulan!).",
        },
        faq: [
            { question: "Apa bedanya pinjol legal dan ilegal?", answer: "Pinjol legal terdaftar di OJK, bunga maksimal 0.4%/hari, tidak mengakses kontak/galeri. Pinjol ilegal: bunga tinggi tanpa batas, intimidasi, akses data pribadi. Selalu cek status di ojk.go.id." },
            { question: "Berapa bunga KTA bank terbaik saat ini?", answer: "KTA dengan bunga terendah 2026: BRI 0.79%/bulan, Mandiri 0.89%/bulan, BCA 0.99%/bulan (flat). Syarat: gaji minimal Rp 3-5 juta, usia 21-55 tahun, masa kerja minimal 1-2 tahun." },
        ],
        relatedIds: ["kalkulator-cicilan", "kalkulator-bunga"],
    },
    {
        id: "kalkulator-cicilan",
        title: "Kalkulator Cicilan — Hitung Angsuran Bulanan",
        keyword: "kalkulator cicilan",
        calcType: "emi",
        icon: "📅",
        subtitle: "Kalkulator cicilan universal untuk kredit apapun — rumah, mobil, motor, atau pinjaman pribadi. Masukkan detail dan dapatkan angsuran bulanan.",
        explanation: {
            heading: "Memahami Cara Kerja Cicilan",
            paragraphs: [
                "Cicilan (angsuran) adalah pembayaran berkala untuk melunasi hutang. Setiap cicilan terdiri dari dua komponen: pokok pinjaman dan bunga. Pada awal kredit, porsi bunga lebih besar. Seiring waktu, porsi pokok semakin besar — ini disebut metode anuitas.",
                "Tips memilih cicilan yang sehat: total cicilan (semua hutang) jangan melebihi 30-35% dari penghasilan bersih bulanan. Contoh: gaji Rp 10 juta → total cicilan maksimal Rp 3-3,5 juta/bulan.",
            ],
            highlight: "Aturan 30%: Gaji Rp 8 juta → cicilan maks Rp 2,4 juta. Gaji Rp 15 juta → cicilan maks Rp 4,5 juta. Melebihi batas ini berisiko gagal bayar saat ada kebutuhan darurat.",
        },
        faq: [
            { question: "Berapa cicilan yang ideal dari gaji saya?", answer: "Maksimal 30-35% dari gaji bersih. Jika gaji Rp 10 juta, total cicilan semua hutang tidak boleh lebih dari Rp 3-3,5 juta." },
            { question: "Apa yang terjadi kalau telat bayar cicilan?", answer: "Denda keterlambatan (biasanya 1-5% dari cicilan), catatan negatif di BI Checking/SLIK OJK, dan risiko penyitaan aset jika ada jaminan." },
        ],
        relatedIds: ["kalkulator-kpr", "kalkulator-kredit-mobil", "kalkulator-pinjaman"],
    },
    {
        id: "kalkulator-bunga",
        title: "Kalkulator Bunga Majemuk — Compound Interest",
        keyword: "kalkulator bunga majemuk",
        calcType: "compound-interest",
        icon: "📊",
        subtitle: "Hitung pertumbuhan investasi dengan bunga majemuk (compound interest). Lihat kekuatan bunga berbunga dalam jangka panjang.",
        explanation: {
            heading: "Cara Kerja Bunga Majemuk",
            paragraphs: [
                "Bunga majemuk (compound interest) adalah bunga yang dihitung dari pokok plus bunga yang sudah terkumpul sebelumnya. Semakin lama Anda menabung atau berinvestasi, semakin kuat efek compounding-nya. Albert Einstein menyebutnya 'keajaiban dunia kedelapan'.",
                "Rumus: FV = P × (1 + r/n)^(n×t), di mana P = pokok, r = bunga tahunan, n = frekuensi compounding per tahun, t = tahun. Di Indonesia, deposito bank memberikan 3-5%, reksadana pasar uang 5-7%, dan reksadana saham 8-15% per tahun (historis).",
            ],
            highlight: "Rp 10 juta dengan bunga 10%/tahun: Setelah 10 tahun = Rp 25,9 juta. Setelah 20 tahun = Rp 67,3 juta. Setelah 30 tahun = Rp 174,5 juta. Rule of 72: bagi 72 dengan % bunga = tahun untuk menggandakan uang.",
        },
        faq: [
            { question: "Apa bedanya bunga tunggal dan bunga majemuk?", answer: "Bunga tunggal: dihitung hanya dari pokok awal. Bunga majemuk: dihitung dari pokok + bunga sebelumnya. Contoh Rp 10 juta bunga 10%, 5 tahun: tunggal = Rp 15 juta, majemuk = Rp 16,1 juta." },
            { question: "Apa itu Rule of 72?", answer: "Bagi 72 dengan persentase bunga untuk tahu berapa tahun uang Anda berlipat ganda. Bunga 6% → 72÷6 = 12 tahun. Bunga 12% → 72÷12 = 6 tahun." },
        ],
        relatedIds: ["kalkulator-investasi", "kalkulator-tabungan", "kalkulator-roi"],
    },
    {
        id: "kalkulator-investasi",
        title: "Kalkulator Investasi — Simulasi Return Investasi",
        keyword: "kalkulator investasi",
        calcType: "compound-interest",
        icon: "📈",
        subtitle: "Simulasikan pertumbuhan investasi Anda: reksadana, saham, obligasi, atau emas. Hitung return dengan investasi berkala atau lump sum.",
        explanation: {
            heading: "Cara Menghitung Return Investasi",
            paragraphs: [
                "Return investasi dihitung berdasarkan modal awal, kontribusi berkala, expected return, dan jangka waktu. Di Indonesia, pilihan investasi populer: deposito (3-5%), SBN/ORI (6-7%), reksadana (5-15%), saham (8-20%), emas (5-10%), properti (5-15%).",
                "CAGR (Compound Annual Growth Rate) adalah metrik terbaik untuk membandingkan investasi. IHSG historis memberikan CAGR ~12% dalam 10 tahun terakhir. Investasi berkala (dollar cost averaging) mengurangi risiko fluktuasi pasar.",
            ],
            highlight: "Investasi Rp 1 juta/bulan selama 20 tahun dengan return 12%/tahun = Rp 999 juta (hampir 1 miliar!). Total modal disetor hanya Rp 240 juta. Sisanya Rp 759 juta adalah keuntungan dari compounding!",
        },
        faq: [
            { question: "Investasi apa yang cocok untuk pemula?", answer: "Mulai dari reksadana pasar uang (risiko rendah, return 5-7%) atau SBN Ritel (dijamin negara, return 6-7%). Setelah paham, bisa mulai reksadana campuran atau saham. Mulai dari Rp 10 ribu di aplikasi seperti Bibit, Bareksa, atau Ajaib." },
            { question: "Berapa minimal investasi di Indonesia?", answer: "Reksadana: mulai Rp 10.000. Saham: 1 lot (100 lembar) × harga saham. SBN Ritel: Rp 1 juta. Emas: mulai 0.01 gram (~Rp 15.000). Deposito: Rp 1-10 juta tergantung bank." },
        ],
        relatedIds: ["kalkulator-bunga", "kalkulator-tabungan", "kalkulator-roi"],
    },
    {
        id: "kalkulator-tabungan",
        title: "Kalkulator Tabungan — Rencana Menabung",
        keyword: "kalkulator tabungan",
        calcType: "compound-interest",
        icon: "🐷",
        subtitle: "Rencanakan target tabungan Anda. Hitung berapa yang harus ditabung per bulan untuk mencapai tujuan keuangan.",
        explanation: {
            heading: "Cara Merencanakan Tabungan yang Efektif",
            paragraphs: [
                "Menabung efektif dimulai dengan target yang jelas: dana darurat (6× pengeluaran bulanan), DP rumah, biaya menikah, atau dana pensiun. Setelah tahu targetnya, hitung berapa yang harus disisihkan per bulan.",
                "Bunga tabungan bank di Indonesia: 0.5-3% per tahun (sangat rendah). Inflasi: 3-5%. Artinya tabungan biasa membuat uang Anda menyusut nilainya! Pertimbangkan deposito (3-5%) atau reksadana pasar uang (5-7%) untuk tabungan jangka menengah.",
            ],
            highlight: "Target dana darurat Rp 30 juta dalam 2 tahun → nabung Rp 1,25 juta/bulan. Target DP rumah Rp 100 juta dalam 5 tahun → nabung Rp 1,5 juta/bulan (dengan return 6%).",
        },
        faq: [
            { question: "Berapa persen gaji yang harus ditabung?", answer: "Minimal 20% dari gaji bersih (aturan 50/30/20). 50% kebutuhan, 30% keinginan, 20% tabungan/investasi. Idealnya tingkatkan ke 30-40% jika memungkinkan." },
            { question: "Apa itu dana darurat dan berapa jumlahnya?", answer: "Dana darurat adalah simpanan untuk keadaan tak terduga (PHK, sakit, dll). Jumlahnya: lajang 3-6× pengeluaran bulanan, menikah 6-9×, punya anak 9-12×. Simpan di tabungan atau reksadana pasar uang yang mudah dicairkan." },
        ],
        relatedIds: ["kalkulator-bunga", "kalkulator-investasi"],
    },
    {
        id: "kalkulator-pph21",
        title: "Kalkulator PPh 21 — Pajak Penghasilan Karyawan",
        keyword: "kalkulator PPh 21",
        calcType: "pph21",
        icon: "🧾",
        subtitle: "Hitung pajak penghasilan (PPh 21) karyawan berdasarkan gaji bruto, status PTKP, dan potongan. Sesuai tarif progresif terbaru.",
        explanation: {
            heading: "Cara Menghitung PPh 21 Karyawan",
            paragraphs: [
                "PPh 21 adalah pajak atas penghasilan karyawan. Perhitungan: Gaji bruto - biaya jabatan (5%, maks Rp 500rb/bulan) - iuran pensiun - PTKP = Penghasilan Kena Pajak (PKP). Tarif progresif: 5% (s.d Rp 60 juta), 15% (Rp 60-250 juta), 25% (Rp 250-500 juta), 30% (Rp 500 juta-5M), 35% (>Rp 5M).",
                "PTKP (Penghasilan Tidak Kena Pajak) 2026: TK/0 Rp 54 juta/tahun, K/0 Rp 58,5 juta, K/1 Rp 63 juta, K/2 Rp 67,5 juta, K/3 Rp 72 juta. PTKP adalah 'penghasilan bebas pajak' — sangat penting untuk perhitungan.",
            ],
            highlight: "Gaji Rp 15 juta/bulan, status K/1: PKP ≈ Rp 109,5 juta/tahun. PPh 21 ≈ Rp 8,4 juta/tahun atau Rp 700rb/bulan. Tarif efektif ~4,7%.",
        },
        faq: [
            { question: "Berapa PTKP terbaru?", answer: "PTKP 2026: TK/0 (lajang) Rp 54 juta/tahun, K/0 (menikah tanpa anak) Rp 58,5 juta, K/1 Rp 63 juta, K/2 Rp 67,5 juta, K/3 Rp 72 juta per tahun." },
            { question: "Apa itu metode Gross, Gross Up, dan Nett?", answer: "Gross: pajak ditanggung karyawan (dipotong dari gaji). Gross Up: pajak ditanggung perusahaan (diberikan tunjangan pajak). Nett: pajak ditanggung perusahaan tanpa tunjangan (tidak dilaporkan jadi penghasilan)." },
        ],
        relatedIds: ["kalkulator-gaji", "kalkulator-ppn"],
    },
    {
        id: "kalkulator-ppn",
        title: "Kalkulator PPN — Pajak Pertambahan Nilai 12%",
        keyword: "kalkulator PPN",
        calcType: "ppn",
        icon: "🏷️",
        subtitle: "Hitung PPN 12% — tambahkan PPN ke harga atau ekstrak PPN dari harga sudah termasuk pajak. Sesuai tarif PPN terbaru Indonesia.",
        explanation: {
            heading: "Cara Menghitung PPN di Indonesia",
            paragraphs: [
                "PPN (Pajak Pertambahan Nilai) di Indonesia adalah 12% sejak 2025 (naik dari 11%). PPN dikenakan pada penjualan barang dan jasa. Menambahkan PPN: Harga × 1.12. Mengekstrak PPN dari harga inklusif: Harga ÷ 1.12 × 0.12.",
                "Barang/jasa yang dikecualikan dari PPN: kebutuhan pokok (beras, daging, sayur, dll), jasa kesehatan, jasa pendidikan, jasa keuangan, dan jasa angkutan umum. PKP (Pengusaha Kena Pajak) wajib memungut PPN jika omzet >Rp 4,8 miliar/tahun.",
            ],
            highlight: "Harga tanpa PPN Rp 1.000.000 → PPN 12% = Rp 120.000 → Harga termasuk PPN = Rp 1.120.000. Sebaliknya: harga Rp 1.120.000 termasuk PPN → harga asli = Rp 1.000.000, PPN = Rp 120.000.",
        },
        faq: [
            { question: "Berapa tarif PPN terbaru di Indonesia?", answer: "12% sejak 1 Januari 2025 (naik dari 11%). Berlaku untuk sebagian besar barang dan jasa, dengan pengecualian untuk kebutuhan pokok dan jasa tertentu." },
            { question: "Barang apa saja yang bebas PPN?", answer: "Kebutuhan pokok (beras, jagung, daging, ikan, telur, susu, sayur, buah), jasa kesehatan medis, jasa pendidikan, jasa keuangan, jasa angkutan umum, dan beberapa barang/jasa strategis lainnya." },
        ],
        relatedIds: ["kalkulator-pph21", "kalkulator-diskon"],
    },
    {
        id: "kalkulator-gaji",
        title: "Kalkulator Gaji Bersih — Take Home Pay",
        keyword: "kalkulator gaji bersih",
        calcType: "gaji",
        icon: "💵",
        subtitle: "Hitung gaji bersih (take home pay) setelah potongan BPJS, PPh 21, dan iuran lainnya. Masukkan gaji bruto untuk hasil instan.",
        explanation: {
            heading: "Cara Menghitung Gaji Bersih di Indonesia",
            paragraphs: [
                "Gaji bersih = Gaji bruto - BPJS Kesehatan (1%) - BPJS Ketenagakerjaan (JHT 2% + JP 1%) - PPh 21. Total potongan karyawan sekitar 4% + PPh 21. Perusahaan membayar tambahan: BPJS Kesehatan 4%, JHT 3.7%, JKK 0.24-1.74%, JKM 0.3%, JP 2%.",
                "Komponen gaji: gaji pokok + tunjangan tetap + tunjangan tidak tetap + lembur. Hanya gaji pokok + tunjangan tetap yang jadi dasar perhitungan BPJS dan pesangon.",
            ],
            highlight: "Gaji bruto Rp 10 juta/bulan: BPJS Kesehatan -Rp 100rb, JHT -Rp 200rb, JP -Rp 100rb, PPh 21 ~-Rp 150rb. Gaji bersih ≈ Rp 9,45 juta.",
        },
        faq: [
            { question: "Apa saja potongan gaji wajib?", answer: "BPJS Kesehatan (1%), BPJS JHT (2%), BPJS JP (1%), dan PPh 21 (tarif progresif). Total potongan karyawan sekitar 4% + PPh 21." },
            { question: "Bagaimana cara menghitung PPh 21 dari gaji?", answer: "Gaji bruto - biaya jabatan (5%, maks Rp 500rb) - BPJS - PTKP = PKP. PKP × tarif progresif = PPh 21 setahun ÷ 12 = PPh 21/bulan." },
        ],
        relatedIds: ["kalkulator-pph21", "kalkulator-lembur", "kalkulator-bpjs"],
    },
    {
        id: "kalkulator-lembur",
        title: "Kalkulator Lembur — Hitung Upah Lembur",
        keyword: "kalkulator lembur",
        calcType: "lembur",
        icon: "⏰",
        subtitle: "Hitung upah lembur sesuai UU Cipta Kerja dan PP 35/2021. Masukkan gaji dan jam lembur untuk perhitungan otomatis.",
        explanation: {
            heading: "Cara Menghitung Upah Lembur Sesuai UU",
            paragraphs: [
                "Upah lembur dihitung berdasarkan upah sejam = 1/173 × gaji sebulan. Hari kerja biasa: jam pertama 1.5× upah sejam, jam selanjutnya 2× upah sejam. Hari libur/istirahat: 7 jam pertama 2× upah sejam, jam ke-8 3× upah sejam, jam ke-9+ 4× upah sejam.",
                "Maksimal lembur: 4 jam/hari dan 18 jam/seminggu (PP 35/2021). Perusahaan wajib membayar lembur jika memerintahkan kerja melebihi 7 jam/hari (6 hari kerja) atau 8 jam/hari (5 hari kerja).",
            ],
            highlight: "Gaji Rp 5 juta, lembur 3 jam hari biasa: Upah sejam = Rp 28.902. Jam 1: Rp 43.353. Jam 2-3: 2 × Rp 57.804 = Rp 115.608. Total lembur = Rp 158.961.",
        },
        faq: [
            { question: "Berapa maksimal jam lembur per hari?", answer: "Maksimal 4 jam per hari dan 18 jam per minggu sesuai PP 35/2021." },
            { question: "Bagaimana lembur di hari libur?", answer: "Hari libur: 7 jam pertama 2× upah sejam, jam ke-8 dibayar 3×, jam ke-9 dan seterusnya 4× upah sejam." },
        ],
        relatedIds: ["kalkulator-gaji", "kalkulator-pph21"],
    },
    {
        id: "kalkulator-bpjs",
        title: "Kalkulator BPJS — Iuran Kesehatan & Ketenagakerjaan",
        keyword: "kalkulator BPJS",
        calcType: "bpjs",
        icon: "🏥",
        subtitle: "Hitung iuran BPJS Kesehatan dan BPJS Ketenagakerjaan (JHT, JKK, JKM, JP). Lihat porsi karyawan dan perusahaan.",
        explanation: {
            heading: "Rincian Iuran BPJS di Indonesia",
            paragraphs: [
                "BPJS Kesehatan: total 5% dari gaji (1% karyawan + 4% perusahaan), batas atas gaji Rp 12 juta. BPJS Ketenagakerjaan terdiri dari: JHT (Jaminan Hari Tua): 5.7% (2% karyawan + 3.7% perusahaan), JKK: 0.24-1.74% (perusahaan), JKM: 0.3% (perusahaan), JP: 3% (1% karyawan + 2% perusahaan).",
                "Total potongan karyawan: ~4% dari gaji bruto. Total biaya perusahaan: ~10-12% dari gaji bruto. JHT bisa dicairkan saat berhenti bekerja atau pensiun. JP dicairkan saat usia 56 tahun.",
            ],
            highlight: "Gaji Rp 8 juta: BPJS Kes karyawan Rp 80rb, JHT karyawan Rp 160rb, JP karyawan Rp 80rb. Total potongan: Rp 320rb/bulan. Perusahaan bayar tambahan Rp 816rb.",
        },
        faq: [
            { question: "Kapan JHT bisa dicairkan?", answer: "JHT bisa dicairkan 100% saat berhenti bekerja, pensiun, cacat total, atau meninggal. Pencairan sebagian (10-30%) bisa untuk perumahan atau kebutuhan mendesak setelah 10 tahun kepesertaan." },
        ],
        relatedIds: ["kalkulator-gaji", "kalkulator-pph21"],
    },
    {
        id: "kalkulator-laba-rugi",
        title: "Kalkulator Laba Rugi — Profit & Loss",
        keyword: "kalkulator laba rugi",
        calcType: "profit",
        icon: "💰",
        subtitle: "Hitung laba kotor, laba bersih, dan margin keuntungan bisnis Anda. Masukkan pendapatan dan biaya untuk analisis profitabilitas.",
        explanation: {
            heading: "Memahami Perhitungan Laba Rugi",
            paragraphs: [
                "Laba kotor = Pendapatan - HPP (Harga Pokok Penjualan). Laba bersih = Laba kotor - Biaya operasional - Pajak. Margin laba = (Laba ÷ Pendapatan) × 100%. Margin yang sehat tergantung industri: retail 5-10%, F&B 10-20%, jasa 20-40%, tech 15-30%.",
                "Tips UMKM Indonesia: catat semua pemasukan dan pengeluaran, pisahkan uang bisnis dan pribadi, hitung HPP dengan akurat, dan pahami break-even point bisnis Anda.",
            ],
            highlight: "Pendapatan Rp 50 juta, HPP Rp 30 juta, biaya operasional Rp 12 juta → Laba kotor Rp 20 juta (margin 40%), Laba bersih Rp 8 juta (margin 16%).",
        },
        faq: [
            { question: "Berapa margin laba yang sehat untuk UMKM?", answer: "Tergantung jenis usaha. Retail: 5-15%, kuliner: 15-30%, jasa: 20-50%. Yang penting margin bersih positif dan cukup untuk menutupi biaya hidup + reinvestasi." },
        ],
        relatedIds: ["kalkulator-margin", "kalkulator-roi", "kalkulator-diskon"],
    },
    {
        id: "kalkulator-diskon",
        title: "Kalkulator Diskon — Hitung Harga Setelah Diskon",
        keyword: "kalkulator diskon",
        calcType: "discount",
        icon: "🏷️",
        subtitle: "Hitung harga setelah diskon secara instan. Masukkan harga asli dan persentase diskon untuk mengetahui harga akhir dan jumlah hemat.",
        explanation: {
            heading: "Cara Menghitung Diskon dengan Benar",
            paragraphs: [
                "Harga setelah diskon = Harga asli × (1 - diskon/100). Diskon bertingkat dihitung bertahap: diskon 20% + 10% ≠ 30%. Contoh: Rp 1 juta × 0.8 = Rp 800rb × 0.9 = Rp 720rb (hemat 28%, bukan 30%).",
                "Tips belanja: bandingkan harga asli di beberapa toko, waspadai harga yang dinaikkan sebelum diskon, dan gunakan kalkulator ini saat Harbolnas, 11.11, 12.12 untuk memastikan diskon nyata.",
            ],
            highlight: "Harga Rp 500.000, diskon 25% = hemat Rp 125.000, bayar Rp 375.000. Diskon bertingkat 20% + 10% = bayar Rp 360.000 (bukan Rp 350.000).",
        },
        faq: [
            { question: "Kenapa diskon 20% + 10% bukan 30%?", answer: "Karena diskon kedua dihitung dari harga setelah diskon pertama. 20% + 10% = Rp 1jt × 0.8 × 0.9 = Rp 720rb (diskon efektif 28%)." },
        ],
        relatedIds: ["kalkulator-ppn", "kalkulator-persentase"],
    },
    {
        id: "kalkulator-margin",
        title: "Kalkulator Margin — Hitung Margin Keuntungan",
        keyword: "kalkulator margin",
        calcType: "margin",
        icon: "📊",
        subtitle: "Hitung margin keuntungan (profit margin) dan markup. Masukkan harga jual dan harga beli untuk analisis profitabilitas produk.",
        explanation: {
            heading: "Bedanya Margin dan Markup",
            paragraphs: [
                "Margin = (Laba ÷ Harga Jual) × 100%. Markup = (Laba ÷ Harga Beli) × 100%. Keduanya berbeda! Beli Rp 100rb jual Rp 150rb: markup 50% tapi margin hanya 33.3%.",
                "Pebisnis profesional menggunakan margin karena lebih akurat menggambarkan keuntungan dari penjualan. Margin 20% artinya dari setiap Rp 100 penjualan, Rp 20 adalah keuntungan.",
            ],
            highlight: "Modal Rp 80.000, jual Rp 120.000: markup = 50%, margin = 33.3%. Target margin 40%? Jual di harga = modal ÷ (1 - 0.40) = Rp 133.333.",
        },
        faq: [
            { question: "Mana yang lebih penting, margin atau markup?", answer: "Margin lebih berguna untuk analisis keuangan karena menghitung persentase dari harga jual. Markup lebih praktis saat menentukan harga jual dari harga beli." },
        ],
        relatedIds: ["kalkulator-laba-rugi", "kalkulator-diskon"],
    },
    {
        id: "kalkulator-roi",
        title: "Kalkulator ROI — Return on Investment",
        keyword: "kalkulator ROI",
        calcType: "roi",
        icon: "💹",
        subtitle: "Hitung return on investment (ROI) untuk bisnis, properti, atau investasi. Bandingkan efisiensi berbagai peluang investasi.",
        explanation: {
            heading: "Cara Menghitung ROI",
            paragraphs: [
                "ROI = (Keuntungan Bersih ÷ Biaya Investasi) × 100%. ROI positif berarti investasi menguntungkan. ROI 100% artinya uang Anda berlipat ganda.",
                "Untuk perbandingan yang adil, gunakan ROI tahunan (annualized ROI). ROI 50% dalam 3 tahun lebih rendah dari ROI 20% dalam 1 tahun secara tahunan.",
            ],
            highlight: "Investasi Rp 100 juta, keuntungan Rp 30 juta dalam 2 tahun: ROI = 30%. ROI tahunan = ~14%. Bandingkan dengan deposito 5%/tahun — investasi 3× lebih baik.",
        },
        faq: [
            { question: "Berapa ROI yang bagus?", answer: "Tergantung risiko. Deposito: 3-5%. Properti: 5-15%. Saham: 10-20%. Bisnis UMKM: 30-100%+. Semakin tinggi risiko, semakin tinggi ROI yang diharapkan." },
        ],
        relatedIds: ["kalkulator-investasi", "kalkulator-laba-rugi", "kalkulator-bunga"],
    },
    {
        id: "kalkulator-persentase",
        title: "Kalkulator Persentase — Hitung Persen",
        keyword: "kalkulator persentase",
        calcType: "percentage",
        icon: "📐",
        subtitle: "Hitung persentase dengan mudah: berapa persen X dari Y, X% dari Y berapa, dan kenaikan/penurunan persentase.",
        explanation: {
            heading: "Cara Menghitung Persentase",
            paragraphs: [
                "Tiga jenis perhitungan persentase: (1) X% dari Y = Y × X/100. (2) X dari Y = berapa persen? → (X/Y) × 100. (3) Kenaikan dari X ke Y = ((Y-X)/X) × 100%.",
                "Persentase digunakan di mana-mana: diskon belanja, bunga bank, kenaikan gaji, pajak, dan nilai ujian. Pahami perbedaan 'persen' dan 'poin persentase'.",
            ],
            highlight: "15% dari Rp 2.000.000 = Rp 300.000 | 750 dari 3000 = 25% | Kenaikan dari 5jt ke 6jt = 20%",
        },
        faq: [
            { question: "Apa bedanya persen dan poin persentase?", answer: "Bunga naik dari 5% ke 7%: naik 2 poin persentase, tapi naik 40% (relatif). Poin persentase = selisih absolut. Persen = perubahan relatif." },
        ],
        relatedIds: ["kalkulator-diskon", "kalkulator-ppn"],
    },
    {
        id: "kalkulator-rata-rata",
        title: "Kalkulator Rata-Rata — Mean, Median, Modus",
        keyword: "kalkulator rata-rata",
        calcType: "average",
        icon: "📏",
        subtitle: "Hitung rata-rata (mean), median, dan modus dari sekumpulan angka. Berguna untuk statistik, nilai ujian, dan analisis data.",
        explanation: {
            heading: "Memahami Mean, Median, dan Modus",
            paragraphs: [
                "Mean (rata-rata) = jumlah semua nilai ÷ banyak data. Median = nilai tengah saat data diurutkan. Modus = nilai yang paling sering muncul. Ketiga ukuran ini memberikan gambaran berbeda tentang data.",
                "Kapan menggunakan masing-masing: Mean untuk data normal tanpa outlier. Median untuk data dengan outlier (seperti gaji). Modus untuk data kategorikal.",
            ],
            highlight: "Data: 5, 7, 8, 8, 10, 12, 50. Mean = 14.3, Median = 8, Modus = 8. Median lebih representatif karena angka 50 adalah outlier.",
        },
        faq: [
            { question: "Kapan pakai mean vs median?", answer: "Mean sensitif terhadap outlier. Untuk data gaji (ada yang sangat tinggi), median lebih representatif. Untuk nilai ujian yang normal, mean lebih informatif." },
        ],
        relatedIds: ["kalkulator-persentase"],
    },
    {
        id: "kalkulator-pecahan",
        title: "Kalkulator Pecahan — Operasi Bilangan Pecahan",
        keyword: "kalkulator pecahan",
        calcType: "fraction",
        icon: "🔢",
        subtitle: "Hitung penjumlahan, pengurangan, perkalian, dan pembagian pecahan. Sederhanakan pecahan dan konversi ke desimal.",
        explanation: {
            heading: "Cara Menghitung Pecahan",
            paragraphs: [
                "Penjumlahan/pengurangan: samakan penyebut dulu. 1/3 + 1/4 = 4/12 + 3/12 = 7/12. Perkalian: kalikan pembilang × pembilang, penyebut × penyebut. 2/3 × 3/4 = 6/12 = 1/2.",
                "Pembagian: balik pecahan kedua lalu kalikan. 2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6. Sederhanakan dengan membagi FPB.",
            ],
            highlight: "1/3 + 1/4 = 7/12 | 2/3 × 3/5 = 6/15 = 2/5 | 3/4 ÷ 2/3 = 9/8 = 1⅛",
        },
        faq: [
            { question: "Bagaimana menyederhanakan pecahan?", answer: "Cari FPB (Faktor Persekutuan Terbesar) pembilang dan penyebut, lalu bagi keduanya. 12/18: FPB = 6, jadi 12/18 = 2/3." },
        ],
        relatedIds: ["kalkulator-persentase", "kalkulator-pangkat"],
    },
    {
        id: "kalkulator-pangkat",
        title: "Kalkulator Pangkat dan Akar — Eksponen",
        keyword: "kalkulator pangkat",
        calcType: "power",
        icon: "✖️",
        subtitle: "Hitung pangkat (eksponen), akar kuadrat, akar pangkat tiga, dan logaritma. Solusi cepat untuk soal matematika.",
        explanation: {
            heading: "Perhitungan Pangkat dan Akar",
            paragraphs: [
                "Pangkat: a^n = a × a × ... × a (n kali). Akar: √a = a^(1/2). Sifat pangkat: a^m × a^n = a^(m+n), (a^m)^n = a^(m×n), a^0 = 1.",
                "Pangkat negatif: a^(-n) = 1/a^n. Akar pangkat: ∛27 = 3 karena 3³ = 27.",
            ],
            highlight: "2^10 = 1.024 | √144 = 12 | 5^3 = 125 | ∛64 = 4 | 10^6 = 1.000.000",
        },
        faq: [
            { question: "Berapa 0 pangkat 0?", answer: "Secara konvensi matematika, 0^0 = 1, meskipun ada perdebatan. Ini digunakan dalam banyak rumus dan pemrograman." },
        ],
        relatedIds: ["kalkulator-pecahan", "kalkulator-persentase"],
    },
    {
        id: "kalkulator-bmi",
        title: "Kalkulator BMI — Indeks Massa Tubuh",
        keyword: "kalkulator BMI",
        calcType: "bmi",
        icon: "⚖️",
        subtitle: "Hitung BMI (Body Mass Index) Anda dari tinggi dan berat badan. Ketahui apakah berat badan Anda ideal menurut standar WHO.",
        explanation: {
            heading: "Cara Menghitung BMI",
            paragraphs: [
                "BMI = Berat badan (kg) ÷ Tinggi badan² (m²). Kategori WHO: <18.5 kurus, 18.5-24.9 normal, 25-29.9 kelebihan berat, ≥30 obesitas. Untuk Asia: ≥23 sudah overweight, ≥25 obesitas.",
                "BMI tidak sempurna — tidak membedakan massa otot dan lemak. Atlet dengan otot besar bisa punya BMI tinggi tapi sehat. Tetapi untuk populasi umum, BMI tetap indikator kesehatan yang berguna.",
            ],
            highlight: "Tinggi 170 cm, berat 70 kg: BMI = 70 ÷ (1.70)² = 24.2 → Normal. Berat ideal untuk tinggi 170 cm: 53-72 kg (BMI 18.5-24.9).",
        },
        faq: [
            { question: "Berapa BMI ideal untuk orang Asia?", answer: "WHO Asia: normal 18.5-22.9, overweight 23-24.9, obesitas ≥25. Standar ini lebih ketat karena orang Asia punya risiko penyakit metabolik lebih tinggi pada BMI lebih rendah." },
        ],
        relatedIds: ["kalkulator-usia"],
    },
    {
        id: "kalkulator-usia",
        title: "Kalkulator Usia — Hitung Umur Tepat",
        keyword: "kalkulator usia",
        calcType: "age",
        icon: "🎂",
        subtitle: "Hitung usia Anda dalam tahun, bulan, dan hari. Berguna untuk dokumen resmi, CPNS, dan keperluan administrasi.",
        explanation: {
            heading: "Cara Menghitung Usia yang Tepat",
            paragraphs: [
                "Kalkulator usia menghitung selisih antara tanggal lahir dan hari ini dalam tahun, bulan, dan hari. Penting untuk pendaftaran CPNS (batas usia 35 tahun), BPJS, asuransi, dan keperluan legal lainnya.",
                "Indonesia menggunakan kalender Masehi. Usia hukum: 17 tahun untuk KTP dan registrasi pemilih, 18 tahun untuk menikah (sesuai UU), 21 tahun usia dewasa penuh.",
            ],
            highlight: "Lahir 15 Januari 1995 → usia sekitar 31 tahun. 31 tahun = 11.315 hari = 372 bulan. Batas CPNS 35 tahun = masih bisa daftar sampai 14 Januari 2030.",
        },
        faq: [
            { question: "Berapa batas usia CPNS?", answer: "Umumnya 18-35 tahun untuk formasi umum, beberapa jabatan khusus sampai 40 tahun (misalnya dokter spesialis). Cek pengumuman CPNS untuk batas usia per formasi." },
        ],
        relatedIds: ["kalkulator-bmi", "kalkulator-kehamilan"],
    },
    {
        id: "kalkulator-kehamilan",
        title: "Kalkulator Kehamilan — Hitung Hari Perkiraan Lahir",
        keyword: "kalkulator kehamilan",
        calcType: "pregnancy",
        icon: "🤰",
        subtitle: "Hitung hari perkiraan lahir (HPL) berdasarkan tanggal HPHT. Ketahui usia kehamilan dan trimester Anda saat ini.",
        explanation: {
            heading: "Cara Menghitung HPL (Hari Perkiraan Lahir)",
            paragraphs: [
                "HPL dihitung dengan Rumus Naegele: HPHT + 280 hari (40 minggu). HPHT = Hari Pertama Haid Terakhir. Ini mengasumsikan siklus 28 hari dengan ovulasi di hari ke-14.",
                "Kehamilan dibagi 3 trimester: Trimester 1 (minggu 1-12) organ terbentuk, Trimester 2 (13-27) paling nyaman, Trimester 3 (28-40) persiapan persalinan. Hanya 5% bayi lahir tepat di HPL — kebanyakan lahir 2 minggu sebelum atau sesudah.",
            ],
            highlight: "HPHT 1 Januari 2026 → HPL 8 Oktober 2026. Trimester 1 selesai 26 Maret 2026. USG trimester 1 (minggu 11-14) paling akurat untuk menentukan usia kehamilan.",
        },
        faq: [
            { question: "Seberapa akurat HPL?", answer: "HPL adalah perkiraan — hanya 5% bayi lahir di tanggal HPL. 80% lahir antara minggu 38-42. USG trimester 1 bisa memberikan perkiraan lebih akurat." },
        ],
        relatedIds: ["kalkulator-usia", "kalkulator-bmi"],
    },
    {
        id: "kalkulator-kurs",
        title: "Kalkulator Kurs — Konversi Mata Uang",
        keyword: "kalkulator kurs",
        calcType: "currency",
        icon: "💱",
        subtitle: "Konversi Rupiah ke Dollar, Euro, Yen, dan mata uang lainnya. Gunakan kurs tengah BI untuk perhitungan yang akurat.",
        explanation: {
            heading: "Cara Konversi Mata Uang",
            paragraphs: [
                "Konversi mata uang: Jumlah × Kurs = Nilai di mata uang lain. Perhatikan selisih kurs jual dan kurs beli — bank/money changer mengambil margin 1-3%. Kurs tengah BI adalah referensi paling netral.",
                "Tips: Tukar di money changer biasanya lebih murah dari bank. Hindari tukar di bandara (kurs paling buruk). Untuk transfer internasional, gunakan layanan seperti Wise/bank digital yang menawarkan kurs lebih kompetitif.",
            ],
            highlight: "USD 1 = Rp 15.500 (kurs tengah). Beli $100: bank Rp 1.580.000 (kurs jual), money changer Rp 1.560.000. Selisih Rp 20.000 — cukup signifikan untuk jumlah besar!",
        },
        faq: [
            { question: "Di mana tukar uang dengan kurs terbaik?", answer: "Money changer di area bisnis (Thamrin, Sudirman di Jakarta) biasanya punya kurs terbaik. Hindari bandara dan hotel. Aplikasi seperti Wise, Jenius, atau Permata memberikan kurs kompetitif untuk transfer." },
        ],
        relatedIds: ["kalkulator-persentase", "kalkulator-ppn"],
    },
];

export function getIdCalculatorBySlug(slug: string): IdCalculator | undefined {
    return ID_CALCULATORS.find(c => c.id === slug);
}
