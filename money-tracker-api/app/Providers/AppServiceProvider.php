<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Register API routes with the "api" middleware group
        $this->app->router->group([
            'prefix' => 'api',
            'middleware' => 'api',
        ], function () {
            require base_path('routes/api.php');
        });
    }
}
