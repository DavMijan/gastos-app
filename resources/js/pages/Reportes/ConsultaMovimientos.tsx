import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Movimiento {
    id: number;
    fecha: string;
    tipo: string;
    descripcion: string;
    fondo: string;
    monto: number;
    status: number;
}

export default function Movimientos({
    movimientos,
    filtros,
}: {
    movimientos: Movimiento[];
    filtros: { desde: string; hasta: string };
}) {
    const [desde, setDesde] = useState(filtros.desde);
    const [hasta, setHasta] = useState(filtros.hasta);

    const buscar = () => {
        router.post(route('movimientos.buscar'), { desde, hasta });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Consulta de Movimientos', href: '/reportes/movimientos' }]}>
            <Head title="Consulta de Movimientos" />

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Consulta de Movimientos</h1>

                <div className="flex space-x-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium">Desde</label>
                        <input
                            type="date"
                            value={desde}
                            onChange={(e) => setDesde(e.target.value)}
                            className="border rounded px-2 py-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Hasta</label>
                        <input
                            type="date"
                            value={hasta}
                            onChange={(e) => setHasta(e.target.value)}
                            className="border rounded px-2 py-1"
                        />
                    </div>
                    <div className="flex items-end">
                        <Button onClick={buscar}>Buscar</Button>
                    </div>
                </div>

                <table className="w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">Fecha</th>
                            <th className="p-2 border">Tipo</th>
                            <th className="p-2 border">Descripción</th>
                            <th className="p-2 border">Fondo</th>
                            <th className="p-2 border">Monto</th>
                            <th className="p-2 border">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movimientos.map((m, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="p-2 border">{new Date(m.fecha).toLocaleDateString()}</td>
                                <td className="p-2 border">{m.tipo}</td>
                                <td className="p-2 border">{m.descripcion}</td>
                                <td className="p-2 border">{m.fondo}</td>
                                <td className="p-2 border text-right">{Number(m.monto).toFixed(2)}</td>
                                <td className="p-2 border">{m.status === 1 ? 'Activo' : 'Anulado'}</td>
                            </tr>
                        ))}
                        {movimientos.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center p-4 text-gray-500">
                                    No hay movimientos en el rango seleccionado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
