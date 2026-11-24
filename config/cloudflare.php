<?php

return [
    'account_id' => env('CLOUDFLARE_ACCOUNT_ID'),
    'api_token' => env('CLOUDFLARE_API_TOKEN'),
    'workers_ai_model' => env('CLOUDFLARE_WORKERS_AI_MODEL', '@cf/meta/llama-3.1-8b-instruct'),
];
