import { Head, Link, usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Bienvenido">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-[#0a0a0a] text-gray-800 dark:text-white px-4">
                <div className="max-w-md text-center space-y-6">
                    <h1 className="text-3xl font-bold">Bienvenido al Sistema de Control de Gastos</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Por favor inicia sesión para acceder al sistema.
                    </p>

                    <div className="flex justify-center gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                Ir al Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
