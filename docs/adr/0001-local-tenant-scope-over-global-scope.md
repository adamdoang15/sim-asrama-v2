# Local Tenant Scope over Global Scope for Multi-Lembaga

We chose an explicit local scope via the `BelongsToLembaga` trait (`scopeForUser`) rather than an automatic Eloquent Global Scope. An automatic global scope would silently intercept background jobs, database seeders, and Artisan console commands where no authenticated session exists, and would complicate cross-institution queries for the `Yayasan` role and legacy records where `lembaga` is NULL.
