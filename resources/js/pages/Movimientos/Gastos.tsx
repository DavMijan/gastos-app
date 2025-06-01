import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface TipoGasto {
    id: number;
    nombre: string;
}

interface FondoMonetario {
    id: number;
    nombre: string;
}

interface GastoEncabezado {
    id: number;
    fecha: string;
    nombre_comercio: string;
    tipo_documento: string;
    observaciones?: string;
    fondos_monetarios_id: number;
    status: number;
}

interface GastoConDetalles extends GastoEncabezado {
    detalles: {
        id: number;
        tipo_gasto: TipoGasto;
        monto: number;
        status: number;
    }[];
}

export default function Gastos({
    fondos,
    tiposGasto,
    gastos,
}: {
    fondos: FondoMonetario[];
    tiposGasto: TipoGasto[];
    gastos: GastoConDetalles[];
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmAnular, setConfirmAnular] = useState<GastoEncabezado | null>(null);

    // Form con encabezado + detalles
    const form = useForm({
        fecha: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
        fondos_monetarios_id: '',
        observaciones: '',
        nombre_comercio: '',
        tipo_documento: 'Factura',
        detalles: [
            { tipo_gasto_id: '', monto: '' },
        ],
    });

    const agregarDetalle = () => {
        form.setData('detalles', [
            ...form.data.detalles,
            { tipo_gasto_id: '', monto: '' },
        ]);
    };

    const eliminarDetalle = (index: number) => {
        const nuevosDetalles = [...form.data.detalles];
        nuevosDetalles.splice(index, 1);
        form.setData('detalles', nuevosDetalles);
    };

    const setDetalleField = (index: number, field: 'tipo_gasto_id' | 'monto', value: any) => {
        const nuevosDetalles = [...form.data.detalles];
        nuevosDetalles[index] = {
            ...nuevosDetalles[index],
            [field]: value,
        };
        form.setData('detalles', nuevosDetalles);
    };

    const submit = () => {
        // Validar mínimo un detalle con tipo_gasto y monto
        if (
            form.data.detalles.length === 0 ||
            form.data.detalles.some(d => !d.tipo_gasto_id || !d.monto || Number(d.monto) <= 0)
        ) {
            alert('Debe ingresar al menos un detalle con tipo de gasto y monto mayor a 0');
            return;
        }

        form.post(route('gastos.store'), {
            onSuccess: () => {
                setIsOpen(false);
                form.reset({
                    fecha: new Date().toISOString().slice(0, 10),
                    fondos_monetarios_id: '',
                    observaciones: '',
                    nombre_comercio: '',
                    tipo_documento: 'Factura',
                    detalles: [{ tipo_gasto_id: '', monto: '' }],
                });
            },
        });
    };

    const anularGasto = () => {
        if (!confirmAnular) return;
        form.delete(route('gastos.anular', confirmAnular.id), {
            onSuccess: () => setConfirmAnular(null),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Registro de Gastos', href: '/movimientos/gastos' }]}>
            <Head title="Registro de Gastos" />

            <div className="p-6">
                <div className="flex justify-between mb-4">
                    <h1 className="text-2xl font-bold">Registro de Gastos</h1>
                    <Button onClick={() => setIsOpen(true)}>Nuevo Gasto</Button>
                </div>

                <table className="min-w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">Fecha</th>
                            <th className="p-2 border">Fondo Monetario</th>
                            <th className="p-2 border">Comercio</th>
                            <th className="p-2 border">Tipo Documento</th>
                            <th className="p-2 border">Observaciones</th>
                            <th className="p-2 border">Estado</th>
                            <th className="p-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gastos.map((g) => (
                            <tr key={g.id} className="hover:bg-gray-50">
                                <td className="p-2 border">{new Date(g.fecha).toLocaleDateString('es-ES')}</td>
                                <td className="p-2 border">{fondos.find(f => f.id === g.fondos_monetarios_id)?.nombre}</td>
                                <td className="p-2 border">{g.nombre_comercio}</td>
                                <td className="p-2 border">{g.tipo_documento}</td>
                                <td className="p-2 border">{g.observaciones}</td>
                                <td className="p-2 border">{g.status === 1 ? 'Activo' : 'Anulado'}</td>
                                <td className="p-2 border space-x-1">
                                    <a href={`/movimientos/gastos/${g.id}`}>
                                        <Button variant="outline" size="sm">Ver</Button>
                                    </a>
                                    {g.status === 1 && (
                                        <Button variant="destructive" size="sm" onClick={() => setConfirmAnular(g)}>
                                            Anular
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal Crear Gasto */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Nuevo Registro de Gasto</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Fecha</label>
                                <input
                                    type="date"
                                    value={form.data.fecha}
                                    onChange={e => form.setData('fecha', e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                />
                                {form.errors.fecha && <p className="text-red-500 text-sm">{form.errors.fecha}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Fondo Monetario</label>
                                <select
                                    value={form.data.fondos_monetarios_id}
                                    onChange={e => form.setData('fondos_monetarios_id', e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                >
                                    <option value="">Seleccione...</option>
                                    {fondos.map(f => (
                                        <option key={f.id} value={f.id}>{f.nombre}</option>
                                    ))}
                                </select>
                                {form.errors.fondos_monetarios_id && <p className="text-red-500 text-sm">{form.errors.fondos_monetarios_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Nombre Comercio</label>
                                <input
                                    type="text"
                                    value={form.data.nombre_comercio}
                                    onChange={e => form.setData('nombre_comercio', e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                />
                                {form.errors.nombre_comercio && <p className="text-red-500 text-sm">{form.errors.nombre_comercio}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Tipo Documento</label>
                                <select
                                    value={form.data.tipo_documento}
                                    onChange={e => form.setData('tipo_documento', e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                >
                                    <option value="Factura">Factura</option>
                                    <option value="Comprobante">Comprobante</option>
                                    <option value="Otro">Otro</option>
                                </select>
                                {form.errors.tipo_documento && <p className="text-red-500 text-sm">{form.errors.tipo_documento}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Observaciones</label>
                                <textarea
                                    value={form.data.observaciones}
                                    onChange={e => form.setData('observaciones', e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                    rows={2}
                                />
                            </div>

                            {/* Detalles dinámicos */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Detalle de Gastos</label>
                                <table className="min-w-full border text-sm mb-4">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-2 border">Tipo de Gasto</th>
                                            <th className="p-2 border">Monto</th>
                                            <th className="p-2 border w-12">Eliminar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {form.data.detalles.map((detalle, idx) => (
                                            <tr key={idx}>
                                                <td className="p-2 border">
                                                    <select
                                                        value={detalle.tipo_gasto_id}
                                                        onChange={e => setDetalleField(idx, 'tipo_gasto_id', e.target.value)}
                                                        className="w-full border rounded px-2 py-1"
                                                    >
                                                        <option value="">Seleccione...</option>
                                                        {tiposGasto.map(tg => (
                                                            <option key={tg.id} value={tg.id}>{tg.nombre}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="p-2 border">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={detalle.monto}
                                                        onChange={e => setDetalleField(idx, 'monto', e.target.value)}
                                                        className="w-full border rounded px-2 py-1"
                                                    />
                                                </td>
                                                <td className="p-2 border text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => eliminarDetalle(idx)}
                                                        className="text-red-600 font-bold"
                                                        disabled={form.data.detalles.length === 1}
                                                    >
                                                        X
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <Button type="button" onClick={agregarDetalle}>Agregar detalle</Button>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="button" onClick={submit} disabled={form.processing}>
                                    Guardar
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Modal Confirmar Anular */}
                <Dialog open={!!confirmAnular} onOpenChange={() => setConfirmAnular(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirmar Anulación</DialogTitle>
                        </DialogHeader>
                        <p>¿Seguro que desea anular el gasto del {confirmAnular?.fecha && new Date(confirmAnular.fecha).toLocaleDateString('es-ES')}?</p>
                        <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="secondary" onClick={() => setConfirmAnular(null)}>Cancelar</Button>
                            <Button variant="destructive" onClick={anularGasto}>Anular</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
