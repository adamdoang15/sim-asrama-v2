# Graph Report - sim-asrama  (2026-10-12)

## Corpus Check
- 98 files · ~76,635 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 21 file(s) not represented in the graph (top: (none) 16, .example 1, .neon 1)

## Summary
- 431 nodes · 653 edges · 50 communities (19 shown, 31 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Frontend React & Inertia UI
- Frontend Build & DevDependencies
- User Authentication & Models
- Frontend Runtime Dependencies
- TypeScript Configuration
- Inertia Middleware & App Bootstrap
- Pegawai & Daily Activity Management
- NPM Package Scripts & Linting
- Database Migration Core Users
- Laravel App Service Providers
- PHP Composer Dev Dependencies
- Gelara Module & Controller
- Gelara & Prestasi Database Schemas
- Pegawai & Pelanggaran Schemas
- Frontend TypeScript Auth Types
- Daily Activity Controller & Base
- Kegiatan Controller & Actions
- Composer Project Metadata
- Prestasi Controller & Actions
- Composer Plugins & Autoload Optimization
- PHP Core Dependencies
- Pest Testing Configuration
- Pelanggaran Controller & Actions
- PSR-4 Autoloading App Classes
- Cache Database Migration
- Gelara Parent & Year Migration
- Gelara Gender Field Migration
- Pegawai Admission Year Migration
- Kegiatan Status Field Migration
- Pelanggaran Attachment Migration
- Prestasi Attachment Migration
- Kegiatan Photo Path Migration
- Kegiatan Database Migration
- Daily Activity Migration
- PSR-4 Test Autoloading
- Laravel Package Discovery Settings

## God Nodes (most connected - your core abstractions)
1. `DashboardLayout()` - 17 edges
2. `lucide-react` - 16 edges
3. `react` - 15 edges
4. `compilerOptions` - 14 edges
5. `scripts` - 13 edges
6. `require-dev` - 12 edges
7. `@inertiajs/react` - 12 edges
8. `Gelara` - 11 edges
9. `Pegawai` - 11 edges
10. `User` - 9 edges

## Surprising Connections (you probably didn't know these)
- `GET /dashboard()` --calls--> `Pegawai`  [EXTRACTED]
  routes/web.php → app/Models/Pegawai.php
- `GET /dashboard()` --calls--> `Gelara`  [EXTRACTED]
  routes/web.php → app/Models/Gelara.php
- `GelaraController` --inherits--> `Controller`  [EXTRACTED]
  app/Http/Controllers/GelaraController.php → app/Http/Controllers/Controller.php
- `KegiatanController` --inherits--> `Controller`  [EXTRACTED]
  app/Http/Controllers/KegiatanController.php → app/Http/Controllers/Controller.php
- `PegawaiController` --inherits--> `Controller`  [EXTRACTED]
  app/Http/Controllers/PegawaiController.php → app/Http/Controllers/Controller.php

## Import Cycles
- None detected.

## Communities (50 total, 31 thin omitted)

### Community 0 - "Frontend React & Inertia UI"
Cohesion: 0.09
Nodes (37): @inertiajs/react, lucide-react, react, GelaraDetailModal(), GelaraDetailModalProps, GelaraFormModal(), GelaraFormModalProps, PaginationLink (+29 more)

### Community 1 - "Frontend Build & DevDependencies"
Cohesion: 0.05
Nodes (43): devDependencies, babel-plugin-react-compiler, @laravel/vite-plugin-wayfinder, @rolldown/plugin-babel, @types/node, vite-plus, optionalDependencies, @laravel/multiplex (+35 more)

### Community 2 - "User Authentication & Models"
Cohesion: 0.11
Nodes (4): User, PegawaiFactory, UserFactory, DatabaseSeeder

### Community 3 - "Frontend Runtime Dependencies"
Cohesion: 0.12
Nodes (17): dependencies, clsx, concurrently, @inertiajs/react, @inertiajs/vite, laravel-vite-plugin, lucide-react, react (+9 more)

### Community 4 - "TypeScript Configuration"
Cohesion: 0.12
Nodes (15): compilerOptions, allowJs, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, module, moduleResolution (+7 more)

### Community 5 - "Inertia Middleware & App Bootstrap"
Cohesion: 0.21
Nodes (4): HandleInertiaRequests, {closure#1}(), {closure#2}(), {closure#3}()

### Community 6 - "Pegawai & Daily Activity Management"
Cohesion: 0.23
Nodes (3): PegawaiController, Pegawai, Pelanggaran

### Community 7 - "NPM Package Scripts & Linting"
Cohesion: 0.15
Nodes (13): scripts, ci:check, dev, lint, lint:check, post-autoload-dump, post-create-project-cmd, post-root-package-install (+5 more)

### Community 8 - "Database Migration Core Users"
Cohesion: 0.23
Nodes (6): {closure#1}(), {closure#2}(), {closure#3}(), {closure#1}(), {closure#2}(), {closure#3}()

### Community 11 - "PHP Composer Dev Dependencies"
Cohesion: 0.17
Nodes (12): require-dev, fakerphp/faker, larastan/larastan, laravel/boost, laravel/pail, laravel/pao, laravel/pint, laravel/sail (+4 more)

### Community 12 - "Gelara Module & Controller"
Cohesion: 0.24
Nodes (3): GelaraController, Gelara, GET /dashboard()

### Community 15 - "Frontend TypeScript Auth Types"
Cohesion: 0.28
Nodes (6): Auth, User, InertiaConfig, @inertiajs/core, InputHTMLAttributes, react

### Community 16 - "Daily Activity Controller & Base"
Cohesion: 0.32
Nodes (3): Controller, DailyActivityController, DailyActivity

### Community 18 - "Composer Project Metadata"
Cohesion: 0.25
Nodes (7): description, keywords, license, minimum-stability, name, $schema, type

### Community 20 - "Composer Plugins & Autoload Optimization"
Cohesion: 0.29
Nodes (7): pestphp/pest-plugin, php-http/discovery, config, allow-plugins, optimize-autoloader, preferred-install, sort-packages

### Community 21 - "PHP Core Dependencies"
Cohesion: 0.29
Nodes (7): require, inertiajs/inertia-laravel, intervention/image, laravel/framework, laravel/tinker, laravel/wayfinder, php

### Community 24 - "PSR-4 Autoloading App Classes"
Cohesion: 0.40
Nodes (5): autoload, psr-4, App\\, Database\\Factories\\, Database\\Seeders\\

### Community 38 - "PSR-4 Test Autoloading"
Cohesion: 0.67
Nodes (3): autoload-dev, psr-4, Tests\\

### Community 39 - "Laravel Package Discovery Settings"
Cohesion: 0.67
Nodes (3): extra, laravel, dont-discover

## Knowledge Gaps
- **13 isolated node(s):** `@types/react`, `@types/react-dom`, `concurrently`, `react-dom`, `tailwindcss` (+8 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 209 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Frontend Runtime Dependencies` to `Frontend Build & DevDependencies`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `@types/react`, `@types/react-dom`, `concurrently` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend React & Inertia UI` be split into smaller, more focused modules?**
  _Cohesion score 0.08834586466165413 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Frontend React & Inertia UI` to `Frontend Build & DevDependencies`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Should `Frontend Build & DevDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.04902867715078631 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Frontend React & Inertia UI` to `Frontend Build & DevDependencies`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Should `User Authentication & Models` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._