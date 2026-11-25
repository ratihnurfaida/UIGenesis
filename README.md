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

Configure `.env` to point to your MySQL database before using registration. Update `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD` to match the database supplied for your environment. Do not run migrations against an existing shared database until its schema has been checked.

For a new empty database only, run the account migrations:

```bash
php artisan migrate
```

New accounts must verify their email before signing in. In local mode, the verification link is written to `storage/logs/laravel.log` because the default mailer is `log`. For a deployed app, configure SMTP using `MAIL_MAILER=smtp`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, and `MAIL_FROM_ADDRESS` in `.env`.

Gmail SMTP can also be used during local development. Turn on 2-Step Verification for the sending Google account, create an App Password, and use `smtp.gmail.com` with port `587`, scheme `smtp`, and that App Password as `MAIL_PASSWORD`. Keep the credentials in the ignored `.env` file; do not commit them. The verification link will work locally when opened on the same computer running the app.

Each account can generate five mockups for free. The count is stored and enforced by the server in SQLite; palette generation does not consume a mockup. After the fifth generation, the app blocks further mockup generation and asks the user to upgrade. A payment provider is not configured in this prototype.
