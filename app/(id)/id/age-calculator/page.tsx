// /id/age-calculator — Dedicated High-Performance SEO Page
// Target URL: https://www.numerral.com/id/age-calculator
import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import AgeCalculatorClient from "./AgeCalculatorClient";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Kalkulator Umur — Hitung Usia dari Tanggal Lahir | Numerral",
    description:
        "Hitung umur Anda secara tepat dalam tahun, bulan, dan hari dari tanggal lahir. Akurat untuk CPNS, masuk sekolah, dokumen resmi, dan kebutuhan medis. Gratis, cepat, tanpa aplikasi.",
    keywords: [
        "kalkulator umur",
        "hitung umur",
        "kalkulator usia",
        "hitung usia dari tanggal lahir",
        "rumus menghitung umur",
        "kalkulator umur online",
        "cara menghitung umur",
        "tahun kabisat",
        "usia kronologis",
    ],
    alternates: {
        canonical: `${SITE_URL}/id/age-calculator`,
    },
    openGraph: {
        title: "Kalkulator Umur — Hitung Usia dari Tanggal Lahir",
        description:
            "Hitung umur Anda secara tepat dalam tahun, bulan, dan hari. Akurat untuk CPNS, sekolah, dan dokumen resmi di Indonesia.",
        url: `${SITE_URL}/id/age-calculator`,
        type: "website",
        locale: "id_ID",
        siteName: "Numerral",
    },
};

const faqData = [
    {
        question: "Bagaimana cara menghitung umur dari tanggal lahir?",
        answer:
            "Kurangi tahun sekarang dengan tahun lahir, lalu sesuaikan jika ulang tahun belum lewat di tahun ini (kurangi 1). Untuk detail bulan dan hari, hitung selisih bulan dan hari, lalu sesuaikan jika hasilnya negatif dengan meminjam dari satuan yang lebih besar. Cara termudah: gunakan kalkulator umur online Numerral — masukkan tanggal lahir dan dapatkan hasilnya dalam detik, termasuk total hari dan bulan hidup Anda.",
    },
    {
        question: "Berapa batas usia CPNS di Indonesia 2026?",
        answer:
            "Batas usia CPNS 2026 untuk formasi umum adalah 18–35 tahun, dihitung pada saat penutupan pendaftaran. Beberapa jabatan khusus seperti dokter spesialis, peneliti, dan dosen memiliki batas hingga 40 tahun. Penting: usia dihitung secara tepat hingga hari penutupan, bukan hanya tahun. Gunakan kalkulator umur untuk mengetahui apakah Anda masih memenuhi syarat — bahkan perbedaan satu hari bisa menentukan.",
    },
    {
        question: "Bagaimana cara menghitung usia bayi dalam minggu?",
        answer:
            "Usia bayi dalam minggu = total hari sejak lahir dibagi 7. Contoh: bayi lahir 1 Februari 2026, per 1 April 2026 = 59 hari = 8 minggu 3 hari. Minggu usia bayi digunakan dokter untuk memantau tumbuh kembang dan menentukan jadwal vaksinasi. Kalkulator umur Numerral menampilkan total hari secara otomatis, sehingga Anda bisa menghitung minggu dengan cepat.",
    },
    {
        question: "Apa itu tahun kabisat dan bagaimana pengaruhnya pada usia?",
        answer:
            "Tahun kabisat adalah tahun dengan 366 hari (ada 29 Februari), terjadi setiap 4 tahun: 2000, 2004, 2008, 2024, 2028. Pengecualian: tahun 1700, 1800, 1900 bukan kabisat meski habis dibagi 4. Pengaruh pada usia: seseorang lahir 29 Februari hanya punya ulang tahun resmi setiap 4 tahun. Di tahun biasa, ulang tahunnya dihitung 28 Februari. Kalkulator umur kami menangani kasus ini secara otomatis.",
    },
    {
        question: "Berapa usia minimum masuk SD di Indonesia?",
        answer:
            "Anak harus berusia minimal 7 tahun per tanggal 1 Juli di tahun ajaran baru untuk masuk SD/MI Kelas 1. Anak usia 6 tahun dapat diterima jika ada sisa kapasitas dan sekolah menilai kesiapan belajar anak. Ketentuan ini diatur dalam Permendikbud PPDB terbaru. Gunakan kalkulator umur untuk memastikan usia anak tepat memenuhi syarat.",
    },
    {
        question: "Apakah kalkulator umur ini akurat untuk semua tanggal lahir?",
        answer:
            "Ya, kalkulator umur Numerral akurat untuk semua tanggal lahir dalam kalender Masehi (Gregorian), termasuk tanggal sebelum 1970, tanggal 29 Februari di tahun kabisat, dan tanggal di berbagai zona waktu Indonesia (WIB/WITA/WIT). Algoritma kami telah diuji untuk berbagai kasus tepi termasuk tahun kabisat dan transisi bulan dengan jumlah hari berbeda.",
    },
    {
        question: "Apa perbedaan usia kronologis dan usia biologis?",
        answer:
            "Usia kronologis adalah jumlah waktu tepat sejak tanggal lahir — inilah yang dihitung kalkulator umur. Usia biologis adalah kondisi fisik dan seluler tubuh, yang bisa lebih muda atau lebih tua tergantung gaya hidup, nutrisi, genetik, dan aktivitas fisik. Misalnya, seseorang berusia 50 tahun kronologis bisa memiliki usia biologis 40 tahun jika hidup sehat. Kalkulator umur hanya mengukur usia kronologis.",
    },
    {
        question: "Bagaimana menghitung berapa lama lagi saya pensiun?",
        answer:
            "Kurangi usia pensiun target dengan usia Anda sekarang. ASN di Indonesia pensiun di usia 58–60 tahun, karyawan swasta umumnya 55–57 tahun. Gunakan kalkulator umur untuk mengetahui usia Anda sekarang secara tepat, lalu hitung selisihnya dengan usia pensiun target untuk perencanaan dana pensiun yang akurat.",
    },
    {
        question: "Bagaimana cara menghitung usia kehamilan?",
        answer:
            "Usia kehamilan dihitung dalam minggu dari Hari Pertama Haid Terakhir (HPHT), bukan dari tanggal konsepsi. Kehamilan normal berlangsung 40 minggu (280 hari) dari HPHT. Formula: Usia kehamilan = (Tanggal sekarang − HPHT) ÷ 7 hari. Untuk perhitungan lengkap termasuk Hari Perkiraan Lahir (HPL), gunakan Kalkulator Kehamilan kami yang tersedia secara gratis.",
    },
    {
        question: "Apakah zona waktu mempengaruhi hasil kalkulator umur?",
        answer:
            "Zona waktu berpengaruh minimal dalam kondisi normal, tetapi bisa relevan jika Anda mengakses kalkulator dari luar negeri atau tepat di tengah malam. Indonesia punya tiga zona: WIB (UTC+7), WITA (UTC+8), WIT (UTC+9). Kalkulator kami menggunakan waktu lokal browser Anda. Untuk keperluan dokumen resmi, pastikan perangkat Anda diatur ke zona waktu yang sesuai.",
    },
];

const schemaData = JSON.stringify([
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Kalkulator Umur",
        url: `${SITE_URL}/id/age-calculator`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "All",
        inLanguage: "id",
        description:
            "Kalkulator umur online untuk menghitung usia dari tanggal lahir dalam tahun, bulan, dan hari.",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "IDR",
        },
    },
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqData.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
    },
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Kalkulator",
                item: `${SITE_URL}/id`,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Kalkulator Umur",
                item: `${SITE_URL}/id/age-calculator`,
            },
        ],
    },
    {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "Cara Menghitung Umur dari Tanggal Lahir",
        description: "Langkah-langkah menghitung usia secara akurat menggunakan kalkulator umur online",
        step: [
            {
                "@type": "HowToStep",
                name: "Masukkan Tanggal Lahir",
                text: "Klik kolom tanggal lahir dan masukkan tanggal, bulan, dan tahun kelahiran Anda.",
            },
            {
                "@type": "HowToStep",
                name: "Periksa Tanggal Hari Ini",
                text: "Tanggal hari ini terisi otomatis. Anda bisa mengubahnya jika ingin menghitung usia di tanggal tertentu.",
            },
            {
                "@type": "HowToStep",
                name: "Klik Hitung Sekarang",
                text: "Tekan tombol Hitung Sekarang dan lihat hasilnya: usia dalam tahun, bulan, hari, total hari, dan total bulan.",
            },
        ],
    },
]);

export default function AgeCalculatorPage() {
    return (
        <main className="ar-page" lang="id">
            <Script
                id="schema-age-calculator"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            {/* ── Breadcrumb ─────────────────── */}
            <nav className="ar-breadcrumb" aria-label="Navigasi halaman">
                <Link href="/id">Kalkulator</Link>
                <span className="ar-breadcrumb__sep">/</span>
                <span>Kalkulator Umur</span>
            </nav>

            {/* ── H1 + Subtitle ──────────────── */}
            <h1 className="ar-page__title">🎂 Kalkulator Umur</h1>
            <p className="ar-page__subtitle">
                Hitung usia Anda secara tepat dalam <strong>tahun, bulan, dan hari</strong> dari tanggal lahir.
                Hasil akurat dalam hitungan detik — cocok untuk CPNS, sekolah, dan dokumen resmi.
            </p>

            {/* ── Calculator Widget ──────────── */}
            <div className="ar-page__calc-wrapper">
                <div className="ar-page__calc-main">
                    <AgeCalculatorClient />
                </div>
            </div>

            {/* ── Timeline Illustration ──────── */}
            <div style={{ textAlign: "center", margin: "2rem 0", borderRadius: "16px", overflow: "hidden" }}>
                <Image
                    src="/age-timeline.png"
                    alt="Ilustrasi timeline perhitungan umur dari tanggal lahir hingga hari ini"
                    width={900}
                    height={400}
                    style={{ maxWidth: "100%", height: "auto", borderRadius: "16px" }}
                    priority
                />
                <p style={{ fontSize: "0.8rem", color: "var(--muted, #888)", marginTop: "0.5rem" }}>
                    Kalkulator umur mengukur selisih waktu antara tanggal lahir (tanggal lahir) hingga hari ini dalam tahun, bulan, dan hari.
                </p>
            </div>

            {/* ── Apa Itu Kalkulator Umur? ───── */}
            <section className="ar-explanation" aria-labelledby="definisi-kalkulator-umur">
                <h2 className="ar-explanation__heading" id="definisi-kalkulator-umur">Apa Itu Kalkulator Umur?</h2>
                <p className="ar-explanation__text">
                    <strong>Kalkulator umur</strong> adalah alat digital yang menghitung <em>usia kronologis</em> seseorang secara presisi — mulai dari tahun, bulan, hingga hari — berdasarkan selisih antara <strong>tanggal lahir</strong> dan tanggal saat ini. Berbeda dengan perkiraan kasar "tahun sekarang dikurangi tahun lahir", kalkulator ini memperhitungkan jumlah hari yang berbeda tiap bulan dan <strong>tahun kabisat (leap year)</strong> secara otomatis.
                </p>
                <p className="ar-explanation__text">
                    Di Indonesia, mengetahui usia secara tepat sangat penting untuk berbagai keperluan: verifikasi syarat usia <strong>CPNS</strong> (batas 35 tahun), <strong>PPDB masuk sekolah</strong> (SD minimal 7 tahun per 1 Juli), pengurusan <strong>KTP</strong>, <strong>klaim asuransi</strong>, dan <strong>perencanaan pensiun</strong>. Kalkulator ini gratis, tanpa registrasi, dan bisa diakses dari HP maupun komputer.
                </p>
                <div className="ar-explanation__highlight">
                    <span className="ar-explanation__highlight-icon">💡</span>
                    <p>
                        <strong>Contoh:</strong> Lahir 17 Agustus 1990 → Per April 2026 = <strong>35 tahun 8 bulan 3 hari</strong> = 13.013 hari hidup = 1.859 minggu. Jauh lebih detail dari sekadar "35 tahun"!
                    </p>
                </div>
            </section>

            {/* ── Cara Menghitung Umur ─────── */}
            <div className="ar-rich-content">
                <section className="ar-rich-section" aria-labelledby="cara-hitung-umur">
                    <h2 className="ar-rich-section__heading" id="cara-hitung-umur">Cara Menghitung Umur Secara Akurat</h2>
                    <p className="ar-rich-section__text">
                        Menghitung umur dengan akurat bukan sekadar mengurangi tahun lahir dari tahun sekarang. Ada tiga variabel penting yang sering diabaikan: <strong>perbedaan jumlah hari antar bulan</strong>, <strong>tahun kabisat</strong>, dan <strong>kapan tepatnya ulang tahun</strong> terjadi di tahun berjalan.
                    </p>
                    <p className="ar-rich-section__text">
                        Rumus dasar: <strong>Umur = Tanggal Sekarang − Tanggal Lahir</strong>. Namun secara teknis, algoritmanya lebih kompleks:
                    </p>

                    {/* Step-by-step Visual */}
                    <div style={{ textAlign: "center", margin: "1.5rem 0" }}>
                        <Image
                            src="/age-calc-steps.png"
                            alt="Langkah-langkah menghitung umur: catat tanggal lahir, hitung selisih tahun-bulan-hari, sesuaikan tahun kabisat"
                            width={800}
                            height={360}
                            style={{ maxWidth: "100%", height: "auto", borderRadius: "12px" }}
                        />
                        <p style={{ fontSize: "0.8rem", color: "var(--muted, #888)", marginTop: "0.5rem" }}>
                            Tiga langkah utama menghitung umur secara akurat termasuk penanganan tahun kabisat.
                        </p>
                    </div>

                    <ul className="ar-rich-section__bullets">
                        <li><strong>Langkah 1:</strong> Hitung selisih tahun (Tahun sekarang − Tahun lahir). Jika ulang tahun di tahun ini belum lewat, kurangi 1</li>
                        <li><strong>Langkah 2:</strong> Hitung selisih bulan (Bulan sekarang − Bulan lahir). Jika hasilnya negatif, tambahkan 12 dan kurangi 1 dari nilai tahun</li>
                        <li><strong>Langkah 3:</strong> Hitung selisih hari (Tanggal sekarang − Tanggal lahir). Jika negatif, tambahkan jumlah hari di bulan sebelumnya dan kurangi 1 dari nilai bulan</li>
                        <li><strong>Tahun kabisat:</strong> Tahun habis dibagi 4 adalah kabisat (366 hari). Pengecualian: tahun abad (1700, 1800, 1900) bukan kabisat, kecuali 2000, 2400 yang habis dibagi 400</li>
                        <li><strong>Lahir 29 Februari?</strong> Ulang tahun Anda jatuh 28 Feb atau 1 Maret di tahun biasa sesuai konvensi internasional standar</li>
                        <li><strong>Zona waktu:</strong> Indonesia memiliki WIB (UTC+7), WITA (UTC+8), WIT (UTC+9). Kalkulator menggunakan waktu lokal browser Anda untuk konsistensi</li>
                    </ul>
                </section>

                {/* ── Mengapa Kalkulator Online? ─ */}
                <section className="ar-rich-section" aria-labelledby="kenapa-kalkulator-online">
                    <h2 className="ar-rich-section__heading" id="kenapa-kalkulator-online">Mengapa Menggunakan Kalkulator Umur Online?</h2>
                    <p className="ar-rich-section__text">
                        Perhitungan manual usia terlihat mudah, tetapi sangat rentan salah hitung — terutama saat menyangkut bulan Februari (28 atau 29 hari?), tahun kabisat, atau usia yang mendekati batas tertentu seperti 35 tahun tepat untuk CPNS.
                    </p>
                    <ul className="ar-rich-section__bullets">
                        <li>✅ <strong>Akurat 100%:</strong> Mempertimbangkan tahun kabisat, jumlah hari tiap bulan, dan urutan kalender yang benar</li>
                        <li>⚡ <strong>Instan:</strong> Hasil dalam kurang dari satu detik tanpa perlu hitung manual</li>
                        <li>📊 <strong>Output lengkap:</strong> Usia dalam tahun + bulan + hari + total hari + total bulan sekaligus</li>
                        <li>📱 <strong>Multi-perangkat:</strong> Bisa diakses dari HP, laptop, atau tablet tanpa aplikasi tambahan</li>
                        <li>🔒 <strong>Privasi terjaga:</strong> Data tanggal lahir diproses di browser Anda, tidak dikirim ke server</li>
                        <li>🆓 <strong>Sepenuhnya gratis:</strong> Tanpa iklan mengganggu, tanpa biaya tersembunyi, tanpa syarat</li>
                    </ul>
                </section>

                {/* ── Use Cases ──────────────── */}
                <section className="ar-rich-section" aria-labelledby="kegunaan-kalkulator-umur">
                    <h2 className="ar-rich-section__heading" id="kegunaan-kalkulator-umur">Kegunaan Kalkulator Umur dalam Kehidupan Sehari-hari di Indonesia</h2>
                    <p className="ar-rich-section__text">
                        Kalkulator umur bukan hanya untuk tahu berapa tahun Anda hidup — ada banyak kebutuhan praktis nyata di Indonesia di mana angka usia yang tepat sangat krusial:
                    </p>

                    {/* Use Cases Illustration */}
                    <div style={{ textAlign: "center", margin: "1.5rem 0" }}>
                        <Image
                            src="/age-use-cases.png"
                            alt="Kegunaan kalkulator umur di Indonesia: CPNS, sekolah, pernikahan, kehamilan, pensiun, dokumen resmi"
                            width={800}
                            height={400}
                            style={{ maxWidth: "100%", height: "auto", borderRadius: "12px" }}
                        />
                        <p style={{ fontSize: "0.8rem", color: "var(--muted, #888)", marginTop: "0.5rem" }}>
                            6 kegunaan utama kalkulator umur untuk warga Indonesia.
                        </p>
                    </div>

                    <ul className="ar-rich-section__bullets">
                        <li>🏛️ <strong>Pendaftaran CPNS/ASN:</strong> Batas usia 18–35 tahun (formasi umum) atau 18–40 tahun (jabatan khusus). Satu hari pun bisa menentukan lolos tidaknya syarat administratif — verifikasi usia Anda sebelum daftar</li>
                        <li>🏫 <strong>PPDB Sekolah:</strong> Anak SD minimal 7 tahun per 1 Juli, SMP 12 tahun, SMA 15 tahun. Kalkulator memastikan Anda tahu kapan anak memenuhi syarat masuk sekolah negeri</li>
                        <li>💍 <strong>Pernikahan (KUA):</strong> Usia minimum menikah 19 tahun sesuai UU No.16/2019. Verifikasi usia calon mempelai sebelum proses administrasi ke KUA</li>
                        <li>🤰 <strong>Kehamilan &amp; Obstetri:</strong> Usia ibu saat hamil sangat relevan untuk penilaian risiko. Ibu hamil usia di atas 35 tahun termasuk kategori risiko tinggi (AMA), memerlukan pemantauan lebih ketat dari dokter kandungan. Untuk perhitungan usia kehamilan, gunakan <Link href="/id/kalkulator-kehamilan">Kalkulator Kehamilan</Link> kami</li>
                        <li>💼 <strong>Perencanaan Pensiun:</strong> ASN pensiun usia 58–60 tahun sesuai jabatan, karyawan swasta umumnya 55–57 tahun. Hitung berapa tahun tersisa untuk merencanakan dana pensiun Anda secara matang</li>
                        <li>🏥 <strong>Layanan Kesehatan BPJS:</strong> Beberapa program BPJS memiliki ketentuan usia khusus. Verifikasi usia memastikan Anda mendapat manfaat yang tepat</li>
                        <li>🛫 <strong>Visa &amp; Imigrasi:</strong> Visa working holiday Australia/NZ mensyaratkan usia 18–30 tahun. Visa pelajar dan kerja di berbagai negara juga memiliki batas usia — cek dengan akurat sebelum mengajukan</li>
                        <li>📋 <strong>Dokumen Kependudukan:</strong> Koreksi akta kelahiran, KTP, atau kartu keluarga memerlukan verifikasi usia yang akurat dari tanggal lahir resmi</li>
                    </ul>
                </section>

                {/* ── Comparison Table ──────── */}
                <section className="ar-rich-section" aria-labelledby="perbandingan-manual-vs-online">
                    <h2 className="ar-rich-section__heading" id="perbandingan-manual-vs-online">Perbandingan: Perhitungan Manual vs Kalkulator Umur Online</h2>
                    <p className="ar-rich-section__text">
                        Lihat seberapa besar perbedaan antara menghitung usia secara manual versus menggunakan kalkulator digital:
                    </p>
                    <div className="ar-rich-section__table-wrap">
                        <table className="ar-rich-section__table">
                            <thead>
                                <tr>
                                    <th>Kriteria</th>
                                    <th>Perhitungan Manual</th>
                                    <th>Kalkulator Umur Online</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Akurasi</strong></td>
                                    <td>⚠️ Rentan salah di Februari &amp; tahun kabisat</td>
                                    <td>✅ Selalu akurat tanpa pengecualian</td>
                                </tr>
                                <tr>
                                    <td><strong>Kecepatan</strong></td>
                                    <td>⏱️ 3–10 menit dengan kalender</td>
                                    <td>⚡ Kurang dari 1 detik</td>
                                </tr>
                                <tr>
                                    <td><strong>Tingkat Kesalahan</strong></td>
                                    <td>❌ Rata-rata 1–2 hari salah per 5 tahun</td>
                                    <td>✅ 0% kesalahan</td>
                                </tr>
                                <tr>
                                    <td><strong>Format Output</strong></td>
                                    <td>📋 Biasanya hanya tahun bulat</td>
                                    <td>📊 Tahun + Bulan + Hari + Total Hari</td>
                                </tr>
                                <tr>
                                    <td><strong>Keandalan Dokumen</strong></td>
                                    <td>⚠️ Berisiko jika ada batas usia ketat</td>
                                    <td>✅ Aman untuk keperluan resmi</td>
                                </tr>
                                <tr>
                                    <td><strong>Alat Dibutuhkan</strong></td>
                                    <td>🗓️ Kalender + pena + waktu</td>
                                    <td>💻 Browser saja, gratis</td>
                                </tr>
                                <tr>
                                    <td><strong>Tahun Kabisat</strong></td>
                                    <td>❌ Sering diabaikan</td>
                                    <td>✅ Ditangani otomatis</td>
                                </tr>
                                <tr>
                                    <td><strong>Multi-Zona Waktu</strong></td>
                                    <td>❌ Tidak diperhitungkan</td>
                                    <td>✅ Menggunakan waktu lokal Anda</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {/* ── FAQ Section ──────────────── */}
            <section className="ar-faq" aria-labelledby="faq-kalkulator-umur">
                <h2 className="ar-faq__title" id="faq-kalkulator-umur">
                    FAQ – Kalkulator Umur
                </h2>
                <p style={{ marginBottom: "1.5rem", color: "var(--muted, #666)", fontSize: "0.95rem" }}>
                    Pertanyaan yang sering ditanyakan seputar cara menghitung umur, batas usia, dan penggunaan kalkulator ini.
                </p>
                {faqData.map((item, i) => (
                    <details key={i} className="ar-faq__item">
                        <summary className="ar-faq__question">{item.question}</summary>
                        <p className="ar-faq__answer">{item.answer}</p>
                    </details>
                ))}
            </section>

            {/* ── Internal Linking / Related ── */}
            <section className="ar-related" aria-labelledby="kalkulator-terkait">
                <h2 className="ar-related__title" id="kalkulator-terkait">🔗 Kalkulator Terkait</h2>
                <p style={{ marginBottom: "1rem", fontSize: "0.95rem", color: "var(--muted, #666)" }}>
                    Temukan kalkulator lain yang sering digunakan bersama kalkulator umur:
                </p>
                <div className="ar-related__grid">
                    <Link href="/id/kalkulator-kehamilan" className="ar-related__card">
                        <span className="ar-related__icon">🤰</span>
                        <span className="ar-related__name">Kalkulator Kehamilan</span>
                    </Link>
                    <Link href="/id/kalkulator-bmi" className="ar-related__card">
                        <span className="ar-related__icon">⚖️</span>
                        <span className="ar-related__name">Kalkulator BMI</span>
                    </Link>
                    <Link href="/id/kalkulator-usia" className="ar-related__card">
                        <span className="ar-related__icon">📅</span>
                        <span className="ar-related__name">Kalkulator Usia</span>
                    </Link>
                    <Link href="/id/kalkulator-kpr" className="ar-related__card">
                        <span className="ar-related__icon">🏠</span>
                        <span className="ar-related__name">Kalkulator KPR</span>
                    </Link>
                </div>
                <div style={{ marginTop: "1.5rem", padding: "1rem 1.25rem", background: "var(--surface-2, #f5f5f5)", borderRadius: "12px", fontSize: "0.9rem", lineHeight: "1.7" }}>
                    <strong>Kalkulator terkait lainnya:</strong> Untuk menghitung selisih antara dua tanggal tertentu, gunakan{" "}
                    <Link href="/id/kalkulator-kurs" style={{ color: "var(--accent, #6366f1)", textDecoration: "underline" }}>
                        Kalkulator Waktu
                    </Link>
                    {" "}kami. Untuk ibu hamil yang ingin tahu usia kehamilan dalam minggu dan estimasi hari lahir, cek{" "}
                    <Link href="/id/kalkulator-kehamilan" style={{ color: "var(--accent, #6366f1)", textDecoration: "underline" }}>
                        Kalkulator Kehamilan
                    </Link>
                    . Untuk memantau kesehatan bersama usia, gunakan{" "}
                    <Link href="/id/kalkulator-bmi" style={{ color: "var(--accent, #6366f1)", textDecoration: "underline" }}>
                        Kalkulator BMI
                    </Link>
                    {" "}yang menghitung indeks massa tubuh berdasarkan standar Asia.
                </div>
            </section>

            {/* ── Back Link ─────────────────── */}
            <div className="ar-page__back">
                <Link href="/id" className="ar-page__back-link">
                    ← Semua Kalkulator Indonesia
                </Link>
            </div>
        </main>
    );
}
