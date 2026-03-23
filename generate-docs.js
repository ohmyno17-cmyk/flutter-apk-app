const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType, 
        ShadingType, VerticalAlign, PageNumber, ExternalHyperlink, LevelFormat,
        TableOfContents, PageBreak } = require('docx');
const fs = require('fs');

// Color scheme - "Midnight Code" for tech documentation
const colors = {
  primary: "020617",      // Midnight Black
  body: "1E293B",         // Deep Slate Blue
  secondary: "64748B",    // Cool Blue-Gray
  accent: "94A3B8",       // Steady Silver
  tableBg: "F8FAFC"       // Glacial Blue-White
};

// Table borders
const tableBorder = { style: BorderStyle.SINGLE, size: 12, color: colors.primary };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } };

const doc = new Document({
  styles: {
    default: { document: { run: { font: "SimSun", size: 24 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 56, bold: true, color: colors.primary, font: "SimHei" },
        paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, color: colors.primary, font: "SimHei" },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: colors.body, font: "SimHei" },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, color: colors.secondary, font: "SimHei" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } }
    ]
  },
  numbering: {
    config: [
      { reference: "bullet-list",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-setup",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-secrets",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-build",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-release",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    headers: {
      default: new Header({ children: [new Paragraph({ 
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "Panduan Flutter GitHub Actions", color: colors.secondary, size: 20 })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ 
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "\u2014 ", color: colors.secondary }), 
          new TextRun({ children: [PageNumber.CURRENT], color: colors.secondary }), 
          new TextRun({ text: " \u2014", color: colors.secondary })
        ]
      })] })
    },
    children: [
      // Title
      new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("Panduan Lengkap Setup Flutter APK Release dengan GitHub Actions")] }),
      new Paragraph({ 
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({ text: "Dokumentasi Teknis untuk Automated Build dan Release", color: colors.secondary, size: 22 })]
      }),
      
      // TOC
      new TableOfContents("Daftar Isi", { hyperlink: true, headingStyleRange: "1-3" }),
      new Paragraph({ 
        alignment: AlignmentType.CENTER, 
        spacing: { before: 200, after: 400 },
        children: [new TextRun({ text: "Catatan: Klik kanan pada Daftar Isi dan pilih \"Update Field\" untuk memperbarui nomor halaman.", color: "999999", size: 18 })]
      }),
      
      new Paragraph({ children: [new PageBreak()] }),
      
      // Section 1: Introduction
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. Pendahuluan")] }),
      new Paragraph({ 
        indent: { firstLine: 480 },
        spacing: { after: 200 },
        children: [new TextRun("Dokumen ini menjelaskan cara menyiapkan project Flutter dengan GitHub Actions untuk otomatisasi build dan release APK ke Android. Dengan setup ini, setiap kali Anda push kode dengan tag versi baru, APK akan otomatis dibuild dan dirilis ke GitHub Releases. Hal ini sangat berguna untuk mempercepat proses deployment dan memastikan konsistensi build across development team.")]
      }),
      new Paragraph({ 
        indent: { firstLine: 480 },
        spacing: { after: 200 },
        children: [new TextRun("GitHub Actions menyediakan lingkungan CI/CD yang terintegrasi langsung dengan repository GitHub Anda. Dengan konfigurasi yang tepat, proses build yang sebelumnya memakan waktu dan rentan kesalahan manual kini dapat dilakukan secara otomatis dengan hasil yang konsisten. Setup ini mencakup penanganan keystore untuk signing APK, caching dependencies untuk mempercepat build time, serta automatic release creation.")]
      }),
      
      // Section 2: Project Structure
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("2. Struktur Project")] }),
      new Paragraph({ 
        indent: { firstLine: 480 },
        spacing: { after: 200 },
        children: [new TextRun("Project Flutter yang telah disetup memiliki struktur direktori sebagai berikut. Struktur ini mengikuti standar Flutter project dengan penambahan folder .github/workflows untuk menyimpan konfigurasi CI/CD. File-file kunci yang perlu diperhatikan adalah workflow YAML untuk GitHub Actions, konfigurasi Gradle untuk build Android, dan keystore untuk signing release APK.")]
      }),
      
      // Project structure table
      new Table({
        columnWidths: [3500, 5860],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({ 
                borders: cellBorders, 
                shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "File/Folder", bold: true })] })] 
              }),
              new TableCell({ 
                borders: cellBorders, 
                shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Deskripsi", bold: true })] })] 
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: ".github/workflows/", font: "Consolas" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Folder untuk menyimpan workflow GitHub Actions")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "flutter-apk-release.yml", font: "Consolas" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Konfigurasi workflow untuk build APK")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "android/app/build.gradle", font: "Consolas" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Konfigurasi build Android dengan signing")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "android/key.properties", font: "Consolas" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Properties keystore untuk signing (jangan commit!)")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "android/app/keystore.jks", font: "Consolas" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("File keystore untuk signing APK (jangan commit!)")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "keystore_base64.txt", font: "Consolas" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Base64 encoded keystore untuk GitHub Secrets")] })] })
            ]
          })
        ]
      }),
      new Paragraph({ 
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 400 },
        children: [new TextRun({ text: "Tabel 1: Struktur File Project Flutter", color: colors.secondary, size: 20 })]
      }),
      
      // Section 3: Setup Requirements
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("3. Persyaratan Setup")] }),
      new Paragraph({ 
        indent: { firstLine: 480 },
        spacing: { after: 200 },
        children: [new TextRun("Sebelum memulai proses setup, pastikan sistem Anda memenuhi persyaratan minimum berikut. Persyaratan ini diperlukan baik untuk development lokal maupun untuk memahami environment yang digunakan oleh GitHub Actions. GitHub Actions akan menyediakan environment Ubuntu dengan Flutter dan Java yang sudah dikonfigurasi, namun pemahaman tentang versi yang digunakan penting untuk troubleshooting jika terjadi masalah compatibility.")]
      }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.1 Versi Software")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Flutter SDK: ", bold: true }), new TextRun("3.24.0 (stable channel)")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Java JDK: ", bold: true }), new TextRun("17 (LTS) atau 21")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Android SDK: ", bold: true }), new TextRun("API Level 34 (Android 14)")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Gradle: ", bold: true }), new TextRun("8.5 atau lebih baru")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Git: ", bold: true }), new TextRun("versi terbaru")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.2 Akun dan Akses")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Repository GitHub dengan akses admin untuk mengonfigurasi Secrets")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 300 }, children: [new TextRun("Git CLI terkonfigurasi dengan SSH key atau personal access token")] }),
      
      // Section 4: Setup Steps
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("4. Langkah-Langkah Setup")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 Clone atau Buat Project Flutter")] }),
      new Paragraph({ 
        indent: { firstLine: 480 },
        spacing: { after: 200 },
        children: [new TextRun("Jika Anda sudah memiliki project Flutter, clone repository ke lokal machine. Jika belum, buat project baru menggunakan Flutter CLI. Pastikan project dapat di-build secara lokal sebelum melanjutkan ke setup GitHub Actions. Hal ini penting untuk memastikan tidak ada masalah pada kode yang akan mengganggu proses CI/CD.")]
      }),
      new Paragraph({ numbering: { reference: "numbered-setup", level: 0 }, children: [new TextRun("Buka terminal dan navigasi ke direktori yang diinginkan")] }),
      new Paragraph({ numbering: { reference: "numbered-setup", level: 0 }, children: [new TextRun("Clone repository: git clone <repository-url>")] }),
      new Paragraph({ numbering: { reference: "numbered-setup", level: 0 }, children: [new TextRun("Masuk ke folder project: cd <project-name>")] }),
      new Paragraph({ numbering: { reference: "numbered-setup", level: 0 }, spacing: { after: 200 }, children: [new TextRun("Install dependencies: flutter pub get")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.2 Generate Keystore untuk Signing")] }),
      new Paragraph({ 
        indent: { firstLine: 480 },
        spacing: { after: 200 },
        children: [new TextRun("Keystore diperlukan untuk menandatangani APK release. APK yang ditandatangani memastikan integritas aplikasi dan memungkinkan update tanpa uninstall. Tanpa signing yang benar, pengguna harus uninstall versi lama sebelum menginstall versi baru. Keystore harus disimpan dengan aman dan TIDAK BOLEH di-commit ke repository. Kehilangan keystore berarti pengguna tidak bisa update aplikasi tanpa uninstall.")]
      }),
      new Paragraph({ numbering: { reference: "numbered-secrets", level: 0 }, children: [new TextRun("Generate keystore baru dengan command keytool")] }),
      new Paragraph({ numbering: { reference: "numbered-secrets", level: 0 }, children: [new TextRun("Simpan password dan alias dengan aman")] }),
      new Paragraph({ numbering: { reference: "numbered-secrets", level: 0 }, children: [new TextRun("Convert keystore ke format base64 untuk GitHub Secrets")] }),
      new Paragraph({ numbering: { reference: "numbered-secrets", level: 0 }, spacing: { after: 200 }, children: [new TextRun("Backup keystore di lokasi aman (cloud storage terenkripsi)")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Command Generate Keystore:")] }),
      new Paragraph({ 
        shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
        spacing: { after: 200 },
        children: [new TextRun({ text: "keytool -genkey -v -keystore keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key", font: "Consolas", size: 20 })]
      }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Convert ke Base64:")] }),
      new Paragraph({ 
        shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
        spacing: { after: 300 },
        children: [new TextRun({ text: "base64 -w 0 keystore.jks > keystore_base64.txt", font: "Consolas", size: 20 })]
      }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.3 Konfigurasi GitHub Secrets")] }),
      new Paragraph({ 
        indent: { firstLine: 480 },
        spacing: { after: 200 },
        children: [new TextRun("GitHub Secrets menyimpan informasi sensitif seperti keystore dan password secara aman. Secrets dienkripsi dan hanya dapat diakses oleh GitHub Actions during runtime. Tidak ada yang dapat melihat nilai secrets setelah disimpan, termasuk admin repository. Pastikan Anda menyimpan backup password di tempat aman karena tidak bisa di-retrieve dari GitHub.")]
      }),
      
      new Table({
        columnWidths: [2800, 6560],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({ 
                borders: cellBorders, 
                shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Secret Name", bold: true })] })] 
              }),
              new TableCell({ 
                borders: cellBorders, 
                shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Nilai", bold: true })] })] 
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "KEYSTORE_BASE64", font: "Consolas" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Output base64 dari file keystore.jks")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "KEYSTORE_PASSWORD", font: "Consolas" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Password keystore yang dibuat saat generate")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "KEY_ALIAS", font: "Consolas" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Alias key (contoh: my-key)")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "KEY_PASSWORD", font: "Consolas" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun("Password key (biasanya sama dengan keystore password)")] })] })
            ]
          })
        ]
      }),
      new Paragraph({ 
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 400 },
        children: [new TextRun({ text: "Tabel 2: Daftar GitHub Secrets yang Diperlukan", color: colors.secondary, size: 20 })]
      }),
      
      // Section 5: Build and Release
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("5. Menjalankan Build dan Release")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.1 Build Manual via GitHub Actions")] }),
      new Paragraph({ 
        indent: { firstLine: 480 },
        spacing: { after: 200 },
        children: [new TextRun("GitHub Actions mendukung trigger manual melalui workflow_dispatch. Fitur ini berguna untuk testing atau build tanpa perlu membuat tag baru. Anda bisa memilih tipe build (release, debug, atau profile) sesuai kebutuhan. Build release akan menghasilkan APK yang signed dan siap untuk distribusi, sedangkan debug berguna untuk testing dengan debugging symbols yang lengkap.")]
      }),
      new Paragraph({ numbering: { reference: "numbered-build", level: 0 }, children: [new TextRun("Buka repository di GitHub.com")] }),
      new Paragraph({ numbering: { reference: "numbered-build", level: 0 }, children: [new TextRun("Klik tab \"Actions\" di menu atas")] }),
      new Paragraph({ numbering: { reference: "numbered-build", level: 0 }, children: [new TextRun("Pilih workflow \"Flutter APK Release\" dari daftar")] }),
      new Paragraph({ numbering: { reference: "numbered-build", level: 0 }, children: [new TextRun("Klik \"Run workflow\" dan pilih build_type yang diinginkan")] }),
      new Paragraph({ numbering: { reference: "numbered-build", level: 0 }, spacing: { after: 200 }, children: [new TextRun("Tunggu proses build selesai dan download APK dari Artifacts")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.2 Automatic Release dengan Git Tag")] }),
      new Paragraph({ 
        indent: { firstLine: 480 },
        spacing: { after: 200 },
        children: [new TextRun("Untuk release resmi, gunakan git tag. Setiap tag dengan format v* (misalnya v1.0.0) akan otomatis trigger build dan membuat GitHub Release. APK dan AAB yang dihasilkan akan di-attach ke release tersebut. Metode ini ideal untuk versioning resmi dan memungkinkan pengguna download versi spesifik dari halaman Releases.")]
      }),
      new Paragraph({ numbering: { reference: "numbered-release", level: 0 }, children: [new TextRun("Update version di pubspec.yaml")] }),
      new Paragraph({ numbering: { reference: "numbered-release", level: 0 }, children: [new TextRun("Commit perubahan: git add . && git commit -m \"Bump version\"")] }),
      new Paragraph({ numbering: { reference: "numbered-release", level: 0 }, children: [new TextRun("Buat tag: git tag v1.0.0")] }),
      new Paragraph({ numbering: { reference: "numbered-release", level: 0 }, children: [new TextRun("Push tag: git push origin v1.0.0")] }),
      new Paragraph({ numbering: { reference: "numbered-release", level: 0 }, spacing: { after: 300 }, children: [new TextRun("Monitor build di tab Actions dan download APK dari Releases")] }),
      
      // Section 6: Troubleshooting
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("6. Troubleshooting")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.1 Error: Keystore Tampered")] }),
      new Paragraph({ 
        indent: { firstLine: 480 },
        spacing: { after: 200 },
        children: [new TextRun("Error ini muncul ketika keystore corrupt atau password salah. Pastikan KEYSTORE_BASE64 di-copy dengan benar tanpa karakter tersembunyi. Coba regenerate base64 string dan pastikan tidak ada newline atau spasi di awal/akhir string. Verifikasi password dengan mencoba membuka keystore secara lokal menggunakan keytool.")]
      }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.2 Error: Gradle Build Failed")] }),
      new Paragraph({ 
        indent: { firstLine: 480 },
        spacing: { after: 200 },
        children: [new TextRun("Periksa compatibility antara Java version dan Gradle version. Java 21 memerlukan Gradle 8.5 atau lebih baru. Jika menggunakan Java 17, Gradle 7.6+ sudah cukup. Periksa juga konfigurasi Kotlin version di android/settings.gradle. Kotlin 1.8+ diperlukan untuk compatibility dengan library Android terbaru.")]
      }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.3 APK Tidak Bisa Diinstall")] }),
      new Paragraph({ 
        indent: { firstLine: 480 },
        spacing: { after: 300 },
        children: [new TextRun("Jika APK tidak bisa diinstall atau harus uninstall versi lama terlebih dahulu, kemungkinan signing certificate berbeda. Pastikan menggunakan keystore yang sama untuk semua build. Jika keystore hilang, generate baru dan informasikan ke pengguna bahwa mereka perlu uninstall versi lama. Untuk menghindari ini, selalu backup keystore di multiple locations.")]
      }),
      
      // Section 7: Best Practices
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("7. Best Practices")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7.1 Keystore Management")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Simpan keystore di multiple secure locations (cloud storage terenkripsi, physical backup)")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Dokumentasikan password dan alias di password manager")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Gunakan keystore berbeda untuk development dan production")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 200 }, children: [new TextRun("Jangan pernah commit keystore atau key.properties ke repository")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7.2 Version Management")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Update version di pubspec.yaml sebelum membuat release")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Gunakan semantic versioning (major.minor.patch)")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Buat changelog untuk setiap release")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 200 }, children: [new TextRun("Tag commit dengan versi yang sesuai")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7.3 Build Optimization")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("GitHub Actions sudah dikonfigurasi dengan caching untuk mempercepat build")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Gunakan --split-per-abi untuk menghasilkan APK lebih kecil per architecture")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Enable ProGuard/R8 untuk code shrinking dan obfuscation")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 300 }, children: [new TextRun("Review dan hapus dependencies yang tidak digunakan")] }),
      
      // Section 8: Summary
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("8. Ringkasan")] }),
      new Paragraph({ 
        indent: { firstLine: 480 },
        spacing: { after: 200 },
        children: [new TextRun("Setup GitHub Actions untuk Flutter APK release memberikan banyak keuntungan: build otomatis yang konsisten, release tracking yang baik, dan mengurangi human error dalam proses deployment. Dengan mengikuti panduan ini, Anda dapat mengotomatisasi seluruh proses dari kode hingga APK yang siap didistribusikan. Pastikan untuk selalu backup keystore dan menjaga keamanan GitHub Secrets.")]
      }),
      new Paragraph({ 
        indent: { firstLine: 480 },
        spacing: { after: 200 },
        children: [new TextRun("Project sudah disetup lengkap dengan workflow file, konfigurasi signing, dan keystore. Untuk mulai menggunakan, cukup push ke repository GitHub, tambahkan secrets yang diperlukan, dan trigger build baik secara manual atau melalui git tag. Dokumentasi ini dapat dijadikan referensi untuk maintenance dan troubleshooting di masa mendatang.")]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/z/my-project/download/Panduan-Flutter-GitHub-Actions.docx", buffer);
  console.log("Document created successfully!");
});
