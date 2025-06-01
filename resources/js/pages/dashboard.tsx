import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({
    totalPresupuesto,
    totalEjecutado,
    comparativo,
    ultimosGastos,
}: {
    totalPresupuesto: number;
    totalEjecutado: number;
    comparativo: { nombre: string; presupuesto: number; ejecutado: number }[];
    ultimosGastos: { fecha: string; tipo: string; monto: number }[];
}) {
    const porcentaje = totalPresupuesto > 0 ? ((totalEjecutado / totalPresupuesto) * 100).toFixed(2) : '0';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="p-6 space-y-6">
                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white shadow rounded-xl p-4">
                        <p className="text-gray-500">Total Presupuestado</p>
                        <p className="text-2xl font-bold">Q {Number(totalPresupuesto).toFixed(2)}</p>
                    </div>
                    <div className="bg-white shadow rounded-xl p-4">
                        <p className="text-gray-500">Total Ejecutado</p>
                        <p className="text-2xl font-bold">Q {Number(totalEjecutado).toFixed(2)}</p>
                    </div>
                    <div className="bg-white shadow rounded-xl p-4">
                        <p className="text-gray-500">% Ejecución</p>
                        <p className="text-2xl font-bold">{porcentaje}%</p>
                    </div>
                </div>

                {/* Gráfico Comparativo */}
                <div className="bg-white shadow rounded-xl p-4">
                    <h2 className="text-lg font-bold mb-4">Presupuesto vs Ejecución por Tipo de Gasto</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={comparativo}>
                            <XAxis dataKey="nombre" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="presupuesto" fill="#8884d8" name="Presupuesto" />
                            <Bar dataKey="ejecutado" fill="#82ca9d" name="Ejecutado" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Últimos Gastos */}
                <div className="bg-white shadow rounded-xl p-4">
                    <h2 className="text-lg font-bold mb-4">Últimos Gastos Registrados</h2>
                    <table className="min-w-full text-sm border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">Fecha</th>
                                <th className="p-2 border">Tipo</th>
                                <th className="p-2 border">Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ultimosGastos.map((gasto, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="p-2 border">{gasto.fecha}</td>
                                    <td className="p-2 border">{gasto.tipo}</td>
                                    <td className="p-2 border text-right">${gasto.monto.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
