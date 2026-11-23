# UIGenesis

UIGenesis is a Laravel 12 application converted from the original static HTML prototype.

## Requirements

- PHP 8.2+
- Composer

## Run locally

```bash
composer install
copy .env.example .env
php artisan key:generate
php artisan serve
```

Open http://localhost:8000. Demo login: `demo@uigenesis.id` / `demo123`.

The login currently uses Laravel sessions and accepts any valid email with a password of at least six characters (the demo account requires `demo123`). User accounts are not stored in a database yet; this preserves the original prototype's demo behavior.
