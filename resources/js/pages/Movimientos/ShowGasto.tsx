import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TipoGasto {
    id: number;
    nombre: string;
}

interface Detalle {
    id: number;
    monto: number;
    status: number;
    tipo_gasto: TipoGasto;
}

interface FondoMonetario {
    id: number;
    nombre: string;
}

interface Gasto {
    id: number;
    fecha: string;
    observaciones: string;
    nombre_comercio: string;
    tipo_documento: string;
    fondo_monetario: FondoMonetario;
    detalles: Detalle[];
    status: number;
}

export default function Show({ gasto }: { gasto: Gasto }) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Gastos', href: '/movimientos/gastos' },
            { title: `Gasto #${gasto.id}`, href: `/movimientos/gastos/${gasto.id}` },
        ]}>
            <Head title={`Gasto #${gasto.id}`} />

            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Detalle del Gasto #{gasto.id}</h1>
                    <Link href="/movimientos/gastos">
                        <Button variant="outline">Volver</Button>
                    </Link>
                </div>

                <Card>
                    <CardContent className="p-4 space-y-2 text-sm">
                        <div><strong>Fecha:</strong> {new Date(gasto.fecha).toLocaleDateString('es-ES')}</div>
                        <div><strong>Fondo Monetario:</strong> {gasto.fondo_monetario?.nombre}</div>
                        <div><strong>Tipo de Documento:</strong> {gasto.tipo_documento}</div>
                        <div><strong>Nombre del Comercio:</strong> {gasto.nombre_comercio}</div>
                        <div><strong>Observaciones:</strong> {gasto.observaciones || '—'}</div>
                        <div><strong>Status:</strong> {gasto.status === 1 ? 'Activo' : 'Anulado'}</div>
                    </CardContent>
                </Card>

                <div>
                    <h2 className="text-lg font-semibold mb-2">Detalle de Gastos</h2>
                    <table className="min-w-full border text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">Tipo de Gasto</th>
                                <th className="p-2 border">Monto</th>
                                <th className="p-2 border">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gasto.detalles.map((d) => (
                                <tr key={d.id} className="hover:bg-gray-50">
                                    <td className="p-2 border">{d.tipo_gasto?.nombre}</td>
                                    <td className="p-2 border text-right">Q {Number(d.monto).toFixed(2)}</td>
                                    <td className="p-2 border">{d.status === 1 ? 'Activo' : 'Anulado'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
