# Graph Report - sim-asrama  (2026-10-16)

## Corpus Check
- 152 files · ~126,757 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 21 file(s) not represented in the graph (top: (none) 16, .example 1, .neon 1)

## Summary
- 824 nodes · 1530 edges · 75 communities (35 shown, 40 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8f3ca256`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Illuminate\Http\Request
- package.json
- lucide-react
- web.php
- DashboardLayout
- react
- Gelara
- Illuminate\Database\Schema\Blueprint
- dependencies
- RekapProgram.tsx
- Users/Index.tsx
- compilerOptions
- KalenderAkademik
- scripts
- Illuminate\Support\Facades\Schema
- User
- RekamMedis.tsx
- DataGelara.tsx
- AppServiceProvider.php
- require-dev
- scripts
- composer.json
- bootstrap/app.php
- 2026_10_08_044408_create_kegiatans_table.php
- global.d.ts
- config
- require
- devDependencies
- psr-4
- 0001_01_01_000000_create_users_table.php
- 2026_10_08_020132_update_gelaras_parent_and_year_fields.php
- 2026_10_08_023031_add_jenis_kelamin_to_gelaras_table.php
- 2026_10_08_035055_add_tahun_masuk_to_pegawais_table.php
- 2026_10_08_074428_add_is_completed_to_kegiatans_table.php
- 2026_10_09_041852_add_attachment_to_pelanggarans_table.php
- 2026_10_09_043618_add_attachment_to_prestasis_table.php
- Illuminate\Database\Eloquent\Model
- 2026_10_13_021433_add_kelas_to_gelaras_table.php
- 2026_10_13_030000_add_harian_and_uts_to_nilai_akademiks_table.php
- 2026_10_15_153525_add_lembaga_and_role_to_users_table.php
- optionalDependencies
- KalenderAkademik.tsx
- 2026_10_08_080538_create_daily_activities_table.php
- 2026_10_09_035534_create_prestasis_table.php
- 2026_10_12_085521_create_kalender_akademiks_table.php
- 2026_10_14_000000_create_kelas_mapels_table.php
- Bop.tsx
- Illuminate\Database\Migrations\Migration
- 2026_10_15_000001_create_asets_table.php
- 2026_10_15_000002_create_perbaikan_asets_table.php
- extra
- 2026_10_14_042727_create_kesehatans_table.php
- 2026_10_15_000003_create_pengadaan_asets_table.php
- 2026_10_16_110930_create_anggaran_bops_table.php
- utils.ts
- AbsensiPetugas.tsx
- Issue: Standarisasi Header Banner Berwarna pada Seluruh Halaman Modul
- ArsipDokumen.tsx
- 2026_10_15_160000_add_lembaga_to_core_tables.php
- 2026_10_09_031801_create_pelanggarans_table.php
- 2026_10_16_102530_create_transaksi_keuangans_table.php

## God Nodes (most connected - your core abstractions)
1. `DashboardLayout()` - 45 edges
2. `Gelara` - 40 edges
3. `lucide-react` - 35 edges
4. `User` - 32 edges
5. `react` - 32 edges
6. `@inertiajs/react` - 30 edges
7. `Aset` - 22 edges
8. `SarprasController` - 19 edges
9. `Pegawai` - 16 edges
10. `Controller` - 14 edges

## Surprising Connections (you probably didn't know these)
- `{closure#1}()` --calls--> `Aset`  [EXTRACTED]
  tests/Feature/SarprasTest.php → app/Models/Aset.php
- `{closure#2}()` --calls--> `Aset`  [EXTRACTED]
  tests/Feature/SarprasTest.php → app/Models/Aset.php
- `{closure#4}()` --calls--> `Aset`  [EXTRACTED]
  tests/Feature/SarprasTest.php → app/Models/Aset.php
- `{closure#5}()` --calls--> `Aset`  [EXTRACTED]
  tests/Feature/SarprasTest.php → app/Models/Aset.php
- `{closure#6}()` --calls--> `Aset`  [EXTRACTED]
  tests/Feature/SarprasTest.php → app/Models/Aset.php

## Import Cycles
- None detected.

## Communities (75 total, 40 thin omitted)

### Community 0 - "Illuminate\Http\Request"
Cohesion: 0.05
Nodes (15): AuthController, Controller, KesehatanController, KeuanganController, SarprasController, UserController, AnggaranBop, Aset (+7 more)

### Community 1 - "package.json"
Cohesion: 0.10
Nodes (23): private, $schema, type, babel-plugin-react-compiler, concurrently, @inertiajs/vite, @laravel/multiplex, laravel-vite-plugin (+15 more)

### Community 2 - "lucide-react"
Cohesion: 0.17
Nodes (8): lucide-react, MENU_ITEMS, Sidebar(), SidebarProps, DEMO_ACCOUNTS, Pemeriksaan(), Props, StudentHealth

### Community 3 - "web.php"
Cohesion: 0.06
Nodes (12): KegiatanController, PegawaiController, PelanggaranController, PrestasiController, Kegiatan, Pegawai, Pelanggaran, Prestasi (+4 more)

### Community 4 - "DashboardLayout"
Cohesion: 0.10
Nodes (24): @inertiajs/react, DashboardLayout(), DashboardLayoutProps, AuthUser, Header(), HeaderProps, AdministrasiIndex(), SuratItem (+16 more)

### Community 5 - "react"
Cohesion: 0.19
Nodes (19): react, KelolaMapelModal(), KelolaMapelModalProps, LedgerPrintModal(), LedgerPrintModalProps, PelengkapRaporModal(), PelengkapRaporModalProps, RaporPrintModal() (+11 more)

### Community 6 - "Gelara"
Cohesion: 0.07
Nodes (22): DailyActivityController, GelaraController, DailyActivity, Gelara, {closure#1}(), {closure#10}(), {closure#11}(), {closure#12}() (+14 more)

### Community 7 - "Illuminate\Database\Schema\Blueprint"
Cohesion: 0.12
Nodes (11): {closure#1}(), {closure#2}(), {closure#1}(), {closure#2}(), {closure#3}(), {closure#1}(), {closure#2}(), {closure#1}() (+3 more)

### Community 8 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, clsx, concurrently, @inertiajs/react, @inertiajs/vite, laravel-vite-plugin, lucide-react, react (+9 more)

### Community 9 - "RekapProgram.tsx"
Cohesion: 0.25
Nodes (10): EditLaporanModal(), EditLaporanModalProps, PaginationBar(), PaginationBarProps, RekapGridView(), RekapGridViewProps, RekapListView(), RekapListViewProps (+2 more)

### Community 10 - "Users/Index.tsx"
Cohesion: 0.50
Nodes (3): PageProps, UserData, UsersIndex()

### Community 11 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, allowJs, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, module, moduleResolution (+7 more)

### Community 14 - "KalenderAkademik"
Cohesion: 0.21
Nodes (4): KalenderAkademikController, KalenderAkademik, {closure#3}(), {closure#4}()

### Community 15 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, ci:check, dev, lint, lint:check, post-autoload-dump, post-create-project-cmd, post-root-package-install (+5 more)

### Community 17 - "User"
Cohesion: 0.05
Nodes (20): User, PegawaiFactory, UserFactory, DatabaseSeeder, UserSeeder, {closure#1}(), {closure#2}(), {closure#3}() (+12 more)

### Community 18 - "RekamMedis.tsx"
Cohesion: 0.40
Nodes (4): MedicalHistoryItem, Props, RekamMedis(), StudentRecord

### Community 19 - "DataGelara.tsx"
Cohesion: 0.32
Nodes (9): GelaraDetailModal(), GelaraDetailModalProps, GelaraFormModal(), GelaraFormModalProps, PaginationLink, Student, StudentsPagination, DataGelara() (+1 more)

### Community 21 - "require-dev"
Cohesion: 0.17
Nodes (12): require-dev, fakerphp/faker, larastan/larastan, laravel/boost, laravel/pail, laravel/pao, laravel/pint, laravel/sail (+4 more)

### Community 22 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, build:ssr, check, check:fix, dev, types:check

### Community 23 - "composer.json"
Cohesion: 0.18
Nodes (10): autoload-dev, psr-4, description, keywords, license, minimum-stability, name, Tests\\ (+2 more)

### Community 24 - "bootstrap/app.php"
Cohesion: 0.13
Nodes (6): CheckRole, CheckViewOnly, HandleInertiaRequests, {closure#1}(), {closure#2}(), {closure#3}()

### Community 26 - "global.d.ts"
Cohesion: 0.28
Nodes (6): Auth, User, InertiaConfig, @inertiajs/core, InputHTMLAttributes, react

### Community 27 - "config"
Cohesion: 0.29
Nodes (7): pestphp/pest-plugin, php-http/discovery, config, allow-plugins, optimize-autoloader, preferred-install, sort-packages

### Community 28 - "require"
Cohesion: 0.29
Nodes (7): require, inertiajs/inertia-laravel, intervention/image, laravel/framework, laravel/tinker, laravel/wayfinder, php

### Community 29 - "devDependencies"
Cohesion: 0.33
Nodes (6): devDependencies, babel-plugin-react-compiler, @laravel/vite-plugin-wayfinder, @rolldown/plugin-babel, @types/node, vite-plus

### Community 30 - "psr-4"
Cohesion: 0.40
Nodes (5): autoload, psr-4, App\\, Database\\Factories\\, Database\\Seeders\\

### Community 32 - "0001_01_01_000000_create_users_table.php"
Cohesion: 0.33
Nodes (3): {closure#1}(), {closure#2}(), {closure#3}()

### Community 39 - "Illuminate\Database\Eloquent\Model"
Cohesion: 0.07
Nodes (10): {closure#11}(), {closure#5}(), NilaiAkademikController, KelasMapel, NilaiAkademik, PerbaikanAset, RaporPelengkap, TransaksiKeuangan (+2 more)

### Community 43 - "optionalDependencies"
Cohesion: 0.40
Nodes (5): optionalDependencies, @laravel/multiplex, lightningcss-linux-x64-gnu, @rollup/rollup-linux-x64-gnu, @tailwindcss/oxide-linux-x64-gnu

### Community 44 - "KalenderAkademik.tsx"
Cohesion: 0.18
Nodes (8): CATEGORIES, DAYS, KalenderAkademik(), KalenderEvent, ActiveAsetItem, Perbaikan(), PerbaikanItem, Props

### Community 50 - "Bop.tsx"
Cohesion: 0.29
Nodes (6): BopItem, BopPage(), KATEGORI_OPTIONS, MonthlyRekapData, Props, SisaBopRow

### Community 57 - "extra"
Cohesion: 0.67
Nodes (3): extra, laravel, dont-discover

### Community 74 - "AbsensiPetugas.tsx"
Cohesion: 0.29
Nodes (6): AbsensiPetugas(), DEFAULT_FALLBACK_PETUGAS, PetugasData, PresensiRecord, Props, StatusPresensi

### Community 75 - "Issue: Standarisasi Header Banner Berwarna pada Seluruh Halaman Modul"
Cohesion: 0.25
Nodes (7): 📌 Informasi Tugas, Issue: Standarisasi Header Banner Berwarna pada Seluruh Halaman Modul, ✅ Kriteria Selesai (Acceptance Criteria), 🔍 Latar Belakang & Masalah, Panduan Penyesuaian Elemen Sisi Kanan Banner:, 🎯 Template Acuan Header Banner (Design Reference), 🚫 Yang TIDAK Perlu Dilakukan (Anti Over-engineering)

### Community 76 - "ArsipDokumen.tsx"
Cohesion: 0.40
Nodes (4): ArsipDokumen(), ArsipItem, KATEGORI_OPTIONS, KategoriArsip

## Knowledge Gaps
- **13 isolated node(s):** `@types/react`, `@types/react-dom`, `concurrently`, `react-dom`, `tailwindcss` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 350 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **40 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `Illuminate\Http\Request`, `Illuminate\Database\Eloquent\Model`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `@types/react`, `@types/react-dom`, `concurrently` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Illuminate\Http\Request` be split into smaller, more focused modules?**
  _Cohesion score 0.05421686746987952 - nodes in this community are weakly interconnected._
- **Why does `Gelara` connect `Gelara` to `Illuminate\Http\Request`, `web.php`, `Illuminate\Database\Eloquent\Model`, `PegawaiController.php`, `User`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `package.json`, `DashboardLayout`, `react`, `RekapProgram.tsx`, `Users/Index.tsx`, `AbsensiPetugas.tsx`, `ArsipDokumen.tsx`, `KalenderAkademik.tsx`, `RekamMedis.tsx`, `DataGelara.tsx`, `Bop.tsx`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Should `web.php` be split into smaller, more focused modules?**
  _Cohesion score 0.05587808417997097 - nodes in this community are weakly interconnected._