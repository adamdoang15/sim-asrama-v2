# Graph Report - sim-asrama  (2026-10-18)

## Corpus Check
- 175 files · ~135,755 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 21 file(s) not represented in the graph (top: (none) 16, .example 1, .neon 1)

## Summary
- 938 nodes · 1886 edges · 86 communities (46 shown, 40 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `50d975d8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Illuminate\Http\RedirectResponse
- package.json
- DashboardLayout
- web.php
- DashboardLayout.tsx
- NilaiAkademik.tsx
- Aset
- Illuminate\Database\Schema\Blueprint
- dependencies
- lucide-react
- AnggaranBop
- compilerOptions
- Kegelaraan/Analytics.tsx
- react
- KalenderAkademik
- scripts
- 2026_10_08_032843_create_pegawais_table.php
- User
- Illuminate\Http\Request
- DataGelara.tsx
- AppServiceProvider.php
- require-dev
- SarprasController
- composer.json
- bootstrap/app.php
- Illuminate\Database\Migrations\Migration
- global.d.ts
- config
- require
- psr-4
- 0001_01_01_000000_create_users_table.php
- 2026_10_08_020132_update_gelaras_parent_and_year_fields.php
- 2026_10_08_023031_add_jenis_kelamin_to_gelaras_table.php
- 2026_10_08_035055_add_tahun_masuk_to_pegawais_table.php
- 2026_10_08_074428_add_is_completed_to_kegiatans_table.php
- 2026_10_09_041852_add_attachment_to_pelanggarans_table.php
- Gelara
- BelongsToLembaga
- 2026_10_13_021433_add_kelas_to_gelaras_table.php
- 2026_10_13_030000_add_harian_and_uts_to_nilai_akademiks_table.php
- 2026_10_15_153525_add_lembaga_and_role_to_users_table.php
- Kurikulum/Analytics.tsx
- Sarpras/Analytics.tsx
- Illuminate\Support\Facades\Schema
- Illuminate\Database\Seeder
- 2026_10_12_085521_create_kalender_akademiks_table.php
- HealthBiometrics
- 2026_10_14_000000_create_kelas_mapels_table.php
- Bop.tsx
- 2026_10_14_042717_create_rapor_pelengkaps_table.php
- Pengadaan.tsx
- 2026_10_15_000002_create_perbaikan_asets_table.php
- extra
- Dashboard.tsx
- 2026_10_14_042727_create_kesehatans_table.php
- 2026_10_15_000003_create_pengadaan_asets_table.php
- 2026_10_16_110930_create_anggaran_bops_table.php
- Users/Index.tsx
- AbsensiPetugas.tsx
- ArsipDokumen.tsx
- UserFactory.php
- AuthTest.php
- AnalyticsTest.php
- 2026_10_15_160000_add_lembaga_to_core_tables.php
- 2026_10_16_102530_create_transaksi_keuangans_table.php
- 0001_01_01_000001_create_cache_table.php
- 2026_10_10_034011_add_photo_path_to_kegiatans_table.php
- 2026_10_17_111758_add_kkm_to_kelas_mapels_table.php
- 2026_10_13_015719_create_nilai_akademiks_table.php
- BelongsToLembagaTest.php
- SIM Asrama Domain Model

## God Nodes (most connected - your core abstractions)
1. `DashboardLayout()` - 57 edges
2. `Gelara` - 55 edges
3. `User` - 42 edges
4. `lucide-react` - 41 edges
5. `BelongsToLembaga` - 36 edges
6. `@inertiajs/react` - 36 edges
7. `Aset` - 32 edges
8. `react` - 32 edges
9. `AssetRegistry` - 22 edges
10. `Pegawai` - 22 edges

## Surprising Connections (you probably didn't know these)
- `Local Tenant Scope over Global Scope for Multi-Lembaga` --references--> `BelongsToLembaga`  [INFERRED]
  docs/adr/0001-local-tenant-scope-over-global-scope.md → app/Models/Concerns/BelongsToLembaga.php
- `{closure#20}()` --calls--> `KelasMapel`  [EXTRACTED]
  tests/Feature/NilaiAkademikTest.php → app/Models/KelasMapel.php
- `{closure#2}()` --calls--> `Pegawai`  [EXTRACTED]
  tests/Feature/BelongsToLembagaTest.php → app/Models/Pegawai.php
- `{closure#5}()` --calls--> `User`  [EXTRACTED]
  tests/Feature/AnalyticsTest.php → app/Models/User.php
- `{closure#5}()` --calls--> `User`  [EXTRACTED]
  tests/Feature/AuthTest.php → app/Models/User.php

## Import Cycles
- None detected.

## Communities (86 total, 40 thin omitted)

### Community 0 - "Illuminate\Http\RedirectResponse"
Cohesion: 0.17
Nodes (3): AuthController, NilaiAkademikController, KelasMapel

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (43): devDependencies, babel-plugin-react-compiler, @laravel/vite-plugin-wayfinder, @rolldown/plugin-babel, @types/node, vite-plus, optionalDependencies, @laravel/multiplex (+35 more)

### Community 2 - "DashboardLayout"
Cohesion: 0.13
Nodes (16): @inertiajs/react, DashboardLayout(), AdministrasiIndex(), SuratItem, SuratMenyurat(), DailyActivity(), Kalender(), TrackRecord() (+8 more)

### Community 3 - "web.php"
Cohesion: 0.06
Nodes (8): KegiatanController, PegawaiController, Kegiatan, Pegawai, GET /administrasi./role:administrasi/absensi(), GET /dashboard(), GET /kegelaraan./role:kegelaraan/rekap(), {closure#16}()

### Community 4 - "DashboardLayout.tsx"
Cohesion: 0.15
Nodes (11): DashboardLayoutProps, AuthUser, Header(), HeaderProps, MENU_ITEMS, Sidebar(), SidebarProps, MedicalHistoryItem (+3 more)

### Community 5 - "NilaiAkademik.tsx"
Cohesion: 0.21
Nodes (17): KelolaMapelModal(), LedgerPrintModal(), LedgerPrintModalProps, PelengkapRaporModal(), PelengkapRaporModalProps, RaporPrintModal(), RaporPrintModalProps, NilaiAkademik() (+9 more)

### Community 6 - "Aset"
Cohesion: 0.11
Nodes (15): AssetRegistry, Aset, PengadaanAset, {closure#1}(), {closure#3}(), {closure#4}(), {closure#5}(), {closure#6}() (+7 more)

### Community 7 - "Illuminate\Database\Schema\Blueprint"
Cohesion: 0.16
Nodes (9): {closure#1}(), {closure#2}(), {closure#3}(), {closure#1}(), {closure#2}(), {closure#1}(), {closure#2}(), {closure#3}() (+1 more)

### Community 8 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, clsx, concurrently, @inertiajs/react, @inertiajs/vite, laravel-vite-plugin, lucide-react, react (+10 more)

### Community 9 - "lucide-react"
Cohesion: 0.25
Nodes (11): lucide-react, EditLaporanModal(), EditLaporanModalProps, PaginationBar(), PaginationBarProps, RekapGridView(), RekapGridViewProps, RekapListView() (+3 more)

### Community 10 - "AnggaranBop"
Cohesion: 0.31
Nodes (3): KeuanganController, AnggaranBop, {closure#1}()

### Community 11 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, allowJs, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, module, moduleResolution (+7 more)

### Community 12 - "Kegelaraan/Analytics.tsx"
Cohesion: 0.11
Nodes (15): recharts, DISCIPLINE_COLORS, KATEGORI_COLORS, KegelaraanAnalytics(), PageProps, IMT_COLORS, KesehatanAnalytics(), PageProps (+7 more)

### Community 13 - "react"
Cohesion: 0.12
Nodes (11): react, DEMO_ACCOUNTS, KelolaMapelModalProps, CATEGORIES, DAYS, KalenderAkademik(), KalenderEvent, ActiveAsetItem (+3 more)

### Community 14 - "KalenderAkademik"
Cohesion: 0.26
Nodes (4): KalenderAkademikController, KalenderAkademik, {closure#3}(), {closure#4}()

### Community 15 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, ci:check, dev, lint, lint:check, post-autoload-dump, post-create-project-cmd, post-root-package-install (+5 more)

### Community 17 - "User"
Cohesion: 0.21
Nodes (11): User, {closure#1}(), {closure#2}(), {closure#3}(), {closure#4}(), {closure#5}(), {closure#6}(), {closure#7}() (+3 more)

### Community 18 - "Illuminate\Http\Request"
Cohesion: 0.12
Nodes (5): AnalyticsController, Controller, DailyActivityController, KesehatanController, UserController

### Community 19 - "DataGelara.tsx"
Cohesion: 0.32
Nodes (9): GelaraDetailModal(), GelaraDetailModalProps, GelaraFormModal(), GelaraFormModalProps, PaginationLink, Student, StudentsPagination, DataGelara() (+1 more)

### Community 21 - "require-dev"
Cohesion: 0.17
Nodes (12): require-dev, fakerphp/faker, larastan/larastan, laravel/boost, laravel/pail, laravel/pao, laravel/pint, laravel/sail (+4 more)

### Community 22 - "SarprasController"
Cohesion: 0.33
Nodes (3): SarprasController, PerbaikanAset, {closure#2}()

### Community 23 - "composer.json"
Cohesion: 0.18
Nodes (10): autoload-dev, psr-4, description, keywords, license, minimum-stability, name, Tests\\ (+2 more)

### Community 24 - "bootstrap/app.php"
Cohesion: 0.13
Nodes (6): CheckRole, CheckViewOnly, HandleInertiaRequests, {closure#1}(), {closure#2}(), {closure#3}()

### Community 25 - "Illuminate\Database\Migrations\Migration"
Cohesion: 0.15
Nodes (3): {closure#1}(), {closure#1}(), {closure#1}()

### Community 26 - "global.d.ts"
Cohesion: 0.28
Nodes (6): Auth, User, InertiaConfig, @inertiajs/core, InputHTMLAttributes, react

### Community 27 - "config"
Cohesion: 0.29
Nodes (7): pestphp/pest-plugin, php-http/discovery, config, allow-plugins, optimize-autoloader, preferred-install, sort-packages

### Community 28 - "require"
Cohesion: 0.29
Nodes (7): require, inertiajs/inertia-laravel, intervention/image, laravel/framework, laravel/tinker, laravel/wayfinder, php

### Community 30 - "psr-4"
Cohesion: 0.40
Nodes (5): autoload, psr-4, App\\, Database\\Factories\\, Database\\Seeders\\

### Community 32 - "0001_01_01_000000_create_users_table.php"
Cohesion: 0.33
Nodes (3): {closure#1}(), {closure#2}(), {closure#3}()

### Community 38 - "Gelara"
Cohesion: 0.07
Nodes (29): ActivityTracking, GelaraController, DailyActivity, Gelara, {closure#1}(), {closure#10}(), {closure#11}(), {closure#12}() (+21 more)

### Community 39 - "BelongsToLembaga"
Cohesion: 0.07
Nodes (13): {closure#2}(), PelanggaranController, PrestasiController, BelongsToLembaga, {closure#1}(), {closure#2}(), Kesehatan, NilaiAkademik (+5 more)

### Community 43 - "Kurikulum/Analytics.tsx"
Cohesion: 0.50
Nodes (3): KurikulumAnalytics(), PageProps, TUNTAS_COLORS

### Community 44 - "Sarpras/Analytics.tsx"
Cohesion: 0.50
Nodes (3): KONDISI_COLORS, PageProps, SarprasAnalytics()

### Community 45 - "Illuminate\Support\Facades\Schema"
Cohesion: 0.15
Nodes (3): {closure#1}(), {closure#1}(), {closure#1}()

### Community 46 - "Illuminate\Database\Seeder"
Cohesion: 0.23
Nodes (3): DatabaseSeeder, TransaksiKeuanganSeeder, UserSeeder

### Community 48 - "HealthBiometrics"
Cohesion: 0.06
Nodes (18): AcademicEvaluation, BudgetLedger, HealthBiometrics, {closure#1}(), TestCase, {closure#1}(), {closure#2}(), {closure#3}() (+10 more)

### Community 50 - "Bop.tsx"
Cohesion: 0.29
Nodes (6): BopItem, BopPage(), KATEGORI_OPTIONS, MonthlyRekapData, Props, SisaBopRow

### Community 52 - "Pengadaan.tsx"
Cohesion: 0.50
Nodes (3): Pengadaan(), PengadaanItem, Props

### Community 57 - "extra"
Cohesion: 0.67
Nodes (3): extra, laravel, dont-discover

### Community 58 - "Dashboard.tsx"
Cohesion: 0.40
Nodes (4): AGENDA, ANNOUNCEMENTS, Dashboard(), STATS

### Community 73 - "Users/Index.tsx"
Cohesion: 0.50
Nodes (3): PageProps, UserData, UsersIndex()

### Community 74 - "AbsensiPetugas.tsx"
Cohesion: 0.29
Nodes (6): AbsensiPetugas(), DEFAULT_FALLBACK_PETUGAS, PetugasData, PresensiRecord, Props, StatusPresensi

### Community 76 - "ArsipDokumen.tsx"
Cohesion: 0.40
Nodes (4): ArsipDokumen(), ArsipItem, KATEGORI_OPTIONS, KategoriArsip

### Community 79 - "AuthTest.php"
Cohesion: 0.25
Nodes (3): {closure#5}(), {closure#6}(), {closure#7}()

### Community 80 - "AnalyticsTest.php"
Cohesion: 0.29
Nodes (3): {closure#1}(), {closure#3}(), {closure#5}()

### Community 95 - "BelongsToLembagaTest.php"
Cohesion: 0.50
Nodes (3): {closure#1}(), {closure#2}(), {closure#3}()

## Knowledge Gaps
- **13 isolated node(s):** `@types/react`, `@types/react-dom`, `concurrently`, `react-dom`, `tailwindcss` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 355 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **40 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Gelara` connect `Gelara` to `Illuminate\Http\RedirectResponse`, `web.php`, `BelongsToLembaga`, `HealthBiometrics`, `AnalyticsTest.php`, `Illuminate\Http\Request`, `User`, `BelongsToLembagaTest.php`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **What connects `@types/react`, `@types/react-dom`, `concurrently` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.04902867715078631 - nodes in this community are weakly interconnected._
- **Why does `User` connect `User` to `BelongsToLembaga`, `UserFactory.php`, `Illuminate\Database\Seeder`, `AuthTest.php`, `AnalyticsTest.php`, `HealthBiometrics`, `Illuminate\Http\Request`, `User.php`, `BelongsToLembagaTest.php`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `DashboardLayout` be split into smaller, more focused modules?**
  _Cohesion score 0.12923076923076923 - nodes in this community are weakly interconnected._
- **Why does `BelongsToLembaga` connect `BelongsToLembaga` to `Illuminate\Http\RedirectResponse`, `web.php`, `Gelara`, `Aset`, `AnggaranBop`, `KalenderAkademik`, `User`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Should `web.php` be split into smaller, more focused modules?**
  _Cohesion score 0.05893719806763285 - nodes in this community are weakly interconnected._