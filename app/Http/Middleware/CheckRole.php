<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Maneja la solicitud entrante.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|array  $roles  Rol o roles permitidos separados por coma
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $roles)
    {
        $user = Auth::user();

        if (!$user) {
            // No autenticado
            return redirect()->route('login');
        }

        $rolesArray = is_array($roles) ? $roles : explode(',', $roles);

        if (!in_array($user->rol, $rolesArray)) {
            // Si el rol no está permitido, puedes retornar 403 o redirigir
            abort(403, 'No tienes permiso para acceder a esta página.');
        }

        return $next($request);
    }
}
