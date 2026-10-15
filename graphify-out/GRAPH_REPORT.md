# Graph Report - sim-asrama  (2026-10-15)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 707 nodes · 1286 edges · 69 communities (32 shown, 37 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Illuminate\Http\Request
- package.json
- User
- web.php
- lucide-react
- NilaiAkademik.tsx
- Illuminate\Database\Eloquent\Model
- Illuminate\Database\Schema\Blueprint
- dependencies
- RekapProgram.tsx
- Gelara
- compilerOptions
- KesehatanController.php
- KalenderAkademik
- scripts
- Illuminate\Support\Facades\Schema
- NilaiAkademikTest.php
- react
- DataGelara.tsx
- AppServiceProvider.php
- require-dev
- DailyActivityController.php
- composer.json
- bootstrap/app.php
- Illuminate\Database\Migrations\Migration
- global.d.ts
- config
- require
- Pegawai
- psr-4
- 0001_01_01_000001_create_cache_table.php
- 2026_10_08_020132_update_gelaras_parent_and_year_fields.php
- 2026_10_08_023031_add_jenis_kelamin_to_gelaras_table.php
- 2026_10_08_035055_add_tahun_masuk_to_pegawais_table.php
- 2026_10_08_074428_add_is_completed_to_kegiatans_table.php
- 2026_10_09_041852_add_attachment_to_pelanggarans_table.php
- 2026_10_09_043618_add_attachment_to_prestasis_table.php
- 2026_10_10_034011_add_photo_path_to_kegiatans_table.php
- 2026_10_13_021433_add_kelas_to_gelaras_table.php
- 2026_10_13_030000_add_harian_and_uts_to_nilai_akademiks_table.php
- 2026_10_15_153525_add_lembaga_and_role_to_users_table.php
- KalenderAkademik.tsx
- Perbaikan.tsx
- 2026_10_08_080538_create_daily_activities_table.php
- 2026_10_09_035534_create_prestasis_table.php
- 2026_10_12_085521_create_kalender_akademiks_table.php
- 2026_10_13_015719_create_nilai_akademiks_table.php
- 2026_10_14_000000_create_kelas_mapels_table.php
- 2026_10_14_042717_create_rapor_pelengkaps_table.php
- 2026_10_14_042727_create_kesehatans_table.php
- 2026_10_15_000001_create_asets_table.php
- 2026_10_15_000002_create_perbaikan_asets_table.php
- Inventaris.tsx
- extra
- Controller.php

## God Nodes (most connected - your core abstractions)
1. `Gelara` - 38 edges
2. `lucide-react` - 28 edges
3. `react` - 27 edges
4. `@inertiajs/react` - 23 edges
5. `Aset` - 22 edges
6. `DashboardLayout()` - 21 edges
7. `SarprasController` - 19 edges
8. `User` - 15 edges
9. `Pegawai` - 15 edges
10. `compilerOptions` - 14 edges

## Surprising Connections (you probably didn't know these)
- `{closure#9}()` --calls--> `Gelara`  [EXTRACTED]
  tests/Feature/NilaiAkademikTest.php → app/Models/Gelara.php
- `{closure#1}()` --calls--> `Aset`  [EXTRACTED]
  tests/Feature/SarprasTest.php → app/Models/Aset.php
- `{closure#4}()` --calls--> `Aset`  [EXTRACTED]
  tests/Feature/SarprasTest.php → app/Models/Aset.php
- `{closure#5}()` --calls--> `Aset`  [EXTRACTED]
  tests/Feature/SarprasTest.php → app/Models/Aset.php
- `{closure#6}()` --calls--> `Aset`  [EXTRACTED]
  tests/Feature/SarprasTest.php → app/Models/Aset.php

## Import Cycles
- None detected.

## Communities (69 total, 37 thin omitted)

### Community 0 - "Illuminate\Http\Request"
Cohesion: 0.06
Nodes (16): AuthController, {closure#3}(), {closure#9}(), NilaiAkademikController, PegawaiController, SarprasController, HandleInertiaRequests, Aset (+8 more)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (43): devDependencies, babel-plugin-react-compiler, @laravel/vite-plugin-wayfinder, @rolldown/plugin-babel, @types/node, vite-plus, optionalDependencies, @laravel/multiplex (+35 more)

### Community 2 - "User"
Cohesion: 0.06
Nodes (10): User, PegawaiFactory, UserFactory, DatabaseSeeder, UserSeeder, {closure#5}(), {closure#6}(), {closure#7}() (+2 more)

### Community 3 - "web.php"
Cohesion: 0.08
Nodes (9): KegiatanController, PelanggaranController, PrestasiController, CheckViewOnly, Kegiatan, Pelanggaran, Prestasi, GET /kegelaraan./rekap() (+1 more)

### Community 4 - "lucide-react"
Cohesion: 0.12
Nodes (21): @inertiajs/react, lucide-react, DashboardLayout(), DashboardLayoutProps, AuthUser, Header(), HeaderProps, MENU_ITEMS (+13 more)

### Community 5 - "NilaiAkademik.tsx"
Cohesion: 0.19
Nodes (18): KelolaMapelModal(), KelolaMapelModalProps, LedgerPrintModal(), LedgerPrintModalProps, PelengkapRaporModal(), PelengkapRaporModalProps, RaporPrintModal(), RaporPrintModalProps (+10 more)

### Community 6 - "Illuminate\Database\Eloquent\Model"
Cohesion: 0.18
Nodes (5): KelasMapel, NilaiAkademik, RaporPelengkap, {closure#12}(), {closure#6}()

### Community 7 - "Illuminate\Database\Schema\Blueprint"
Cohesion: 0.15
Nodes (10): {closure#1}(), {closure#2}(), {closure#3}(), {closure#1}(), {closure#2}(), {closure#3}(), {closure#1}(), {closure#2}() (+2 more)

### Community 8 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, clsx, concurrently, @inertiajs/react, @inertiajs/vite, laravel-vite-plugin, lucide-react, react (+9 more)

### Community 9 - "RekapProgram.tsx"
Cohesion: 0.25
Nodes (10): EditLaporanModal(), EditLaporanModalProps, PaginationBar(), PaginationBarProps, RekapGridView(), RekapGridViewProps, RekapListView(), RekapListViewProps (+2 more)

### Community 10 - "Gelara"
Cohesion: 0.17
Nodes (6): GelaraController, Gelara, {closure#10}(), {closure#11}(), {closure#3}(), {closure#5}()

### Community 11 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, allowJs, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, module, moduleResolution (+7 more)

### Community 12 - "KesehatanController.php"
Cohesion: 0.17
Nodes (3): KesehatanController, Kesehatan, {closure#1}()

### Community 14 - "KalenderAkademik"
Cohesion: 0.23
Nodes (4): KalenderAkademikController, KalenderAkademik, {closure#3}(), {closure#4}()

### Community 15 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, ci:check, dev, lint, lint:check, post-autoload-dump, post-create-project-cmd, post-root-package-install (+5 more)

### Community 16 - "Illuminate\Support\Facades\Schema"
Cohesion: 0.15
Nodes (3): {closure#1}(), {closure#1}(), {closure#1}()

### Community 17 - "NilaiAkademikTest.php"
Cohesion: 0.26
Nodes (9): {closure#13}(), {closure#15}(), {closure#17}(), {closure#19}(), {closure#2}(), {closure#4}(), {closure#7}(), {closure#8}() (+1 more)

### Community 18 - "react"
Cohesion: 0.15
Nodes (9): react, DEMO_ACCOUNTS, MedicalHistoryItem, Props, RekamMedis(), StudentRecord, Pengadaan(), PengadaanItem (+1 more)

### Community 19 - "DataGelara.tsx"
Cohesion: 0.32
Nodes (9): GelaraDetailModal(), GelaraDetailModalProps, GelaraFormModal(), GelaraFormModalProps, PaginationLink, Student, StudentsPagination, DataGelara() (+1 more)

### Community 21 - "require-dev"
Cohesion: 0.17
Nodes (12): require-dev, fakerphp/faker, larastan/larastan, laravel/boost, laravel/pail, laravel/pao, laravel/pint, laravel/sail (+4 more)

### Community 22 - "DailyActivityController.php"
Cohesion: 0.24
Nodes (3): DailyActivityController, DailyActivity, {closure#1}()

### Community 23 - "composer.json"
Cohesion: 0.18
Nodes (10): autoload-dev, psr-4, description, keywords, license, minimum-stability, name, Tests\\ (+2 more)

### Community 24 - "bootstrap/app.php"
Cohesion: 0.28
Nodes (3): {closure#1}(), {closure#2}(), {closure#3}()

### Community 26 - "global.d.ts"
Cohesion: 0.28
Nodes (6): Auth, User, InertiaConfig, @inertiajs/core, InputHTMLAttributes, react

### Community 27 - "config"
Cohesion: 0.29
Nodes (7): pestphp/pest-plugin, php-http/discovery, config, allow-plugins, optimize-autoloader, preferred-install, sort-packages

### Community 28 - "require"
Cohesion: 0.29
Nodes (7): require, inertiajs/inertia-laravel, intervention/image, laravel/framework, laravel/tinker, laravel/wayfinder, php

### Community 29 - "Pegawai"
Cohesion: 0.40
Nodes (3): Pegawai, GET /dashboard(), {closure#16}()

### Community 30 - "psr-4"
Cohesion: 0.40
Nodes (5): autoload, psr-4, App\\, Database\\Factories\\, Database\\Seeders\\

### Community 43 - "KalenderAkademik.tsx"
Cohesion: 0.40
Nodes (4): CATEGORIES, DAYS, KalenderAkademik(), KalenderEvent

### Community 44 - "Perbaikan.tsx"
Cohesion: 0.40
Nodes (4): ActiveAsetItem, Perbaikan(), PerbaikanItem, Props

### Community 55 - "Inventaris.tsx"
Cohesion: 0.50
Nodes (3): AsetItem, Inventaris(), Props

### Community 57 - "extra"
Cohesion: 0.67
Nodes (3): extra, laravel, dont-discover

## Knowledge Gaps
- **13 isolated node(s):** `babel-plugin-react-compiler`, `concurrently`, `@laravel/multiplex`, `lightningcss-linux-x64-gnu`, `react-dom` (+8 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 292 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Gelara` connect `Gelara` to `Illuminate\Http\Request`, `web.php`, `Illuminate\Database\Eloquent\Model`, `KesehatanController.php`, `PegawaiController.php`, `NilaiAkademikTest.php`, `DailyActivityController.php`, `Pegawai`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `babel-plugin-react-compiler`, `concurrently`, `@laravel/multiplex` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Illuminate\Http\Request` be split into smaller, more focused modules?**
  _Cohesion score 0.05661005661005661 - nodes in this community are weakly interconnected._
- **Why does `User` connect `User` to `Illuminate\Database\Eloquent\Model`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.04902867715078631 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `package.json`, `NilaiAkademik.tsx`, `RekapProgram.tsx`, `KalenderAkademik.tsx`, `Perbaikan.tsx`, `react`, `DataGelara.tsx`, `Inventaris.tsx`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Should `User` be split into smaller, more focused modules?**
  _Cohesion score 0.06342494714587738 - nodes in this community are weakly interconnected._