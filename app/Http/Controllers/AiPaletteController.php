<?php

namespace App\Http\Controllers;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use JsonException;
use Throwable;

class AiPaletteController
{
    public function __invoke(Request $request)
    {
        $input = $request->validate([
            'style' => ['required', 'string', 'max:40'],
            'category' => ['required', 'string', 'max:40'],
            'app_name' => ['nullable', 'string', 'max:120'],
        ]);

        $accountId = config('cloudflare.account_id');
        $apiToken = config('cloudflare.api_token');
        $model = config('cloudflare.workers_ai_model');

        if (!$accountId || !$apiToken || !$model) {
            return response()->json([
                'message' => 'Konfigurasi Workers AI belum lengkap. Periksa variabel Cloudflare di .env.',
            ], 503);
        }

        $schema = '{"palettes":[{"name":"Nama palet","colors":{"primary":"#112233","secondary":"#223344","accent":"#334455","background":"#F5F5F5","text":"#222222"}}]}';
        $prompt = sprintf(
            'Buat tepat 3 rekomendasi palet warna untuk aplikasi bernama "%s". Kategori aplikasi: "%s". Gaya desain: "%s". Balas hanya JSON valid dengan format persis %s. Warna harus hex 6 digit. Pastikan teks kontras dan palet berbeda satu sama lain.',
            $input['app_name'] ?? 'Aplikasi Baru',
            $input['category'],
            $input['style'],
            $schema,
        );

        try {
            $response = Http::withToken($apiToken)
                ->acceptJson()
                ->timeout(45)
                ->post("https://api.cloudflare.com/client/v4/accounts/{$accountId}/ai/run/{$model}", [
                    'messages' => [
                        ['role' => 'system', 'content' => 'Kamu adalah desainer UI/UX. Ikuti instruksi dan keluarkan JSON saja.'],
                        ['role' => 'user', 'content' => $prompt],
                    ],
                ]);

            if (!$response->successful()) {
                report(new \RuntimeException('Workers AI returned HTTP '.$response->status()));

                return response()->json([
                    'message' => 'Workers AI belum dapat membuat palet. Coba lagi sebentar.',
                ], 502);
            }

            $content = $response->json('result.response');
            if (!is_string($content)) {
                return response()->json(['message' => 'Respons Workers AI tidak sesuai format.'], 502);
            }

            $decoded = json_decode($content, true, 512, JSON_THROW_ON_ERROR);
            $palettes = $decoded['palettes'] ?? null;
            if (!is_array($palettes) || count($palettes) !== 3) {
                return response()->json(['message' => 'AI belum menghasilkan tiga palet yang valid. Coba lagi.'], 502);
            }

            $roles = ['primary', 'secondary', 'accent', 'background', 'text'];
            foreach ($palettes as $palette) {
                if (!is_array($palette) || !is_string($palette['name'] ?? null) || !is_array($palette['colors'] ?? null)) {
                    return response()->json(['message' => 'Respons palet AI tidak valid. Coba lagi.'], 502);
                }

                foreach ($roles as $role) {
                    if (!is_string($palette['colors'][$role] ?? null) || !preg_match('/^#[0-9A-Fa-f]{6}$/', $palette['colors'][$role])) {
                        return response()->json(['message' => 'AI menghasilkan kode warna yang tidak valid. Coba lagi.'], 502);
                    }
                }
            }

            return response()->json(['palettes' => $palettes]);
        } catch (ConnectionException|JsonException $exception) {
            report($exception);

            return response()->json(['message' => 'Tidak dapat menghubungi Workers AI saat ini. Coba lagi.'], 502);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json(['message' => 'Terjadi kesalahan saat membuat palet AI.'], 500);
        }
    }
}
