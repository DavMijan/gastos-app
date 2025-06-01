<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Vite;

class ViteServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Forzar scheme https en producción
        if (app()->environment('production')) {
            Vite::useHotFile(public_path('hot'))
                ->useBuildDirectory('build')
                ->useScriptTagAttributes([
                    'type' => 'module',
                ])
                ->useAssetUrl(fn ($asset) => secure_asset("build/{$asset}"));
        }
    }
}
