import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface FondoMonetario {
    id: number;
    nombre: string;
}

interface Deposito {
    id: number;
    fecha: string;
    monto: number;
    fondos_monetarios_id: number;
    status: number;
}

export default function Depositos({
    fondos,
    depositos,
}: {
    fondos: FondoMonetario[];
    depositos: Deposito[];
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmAnular, setConfirmAnular] = useState<Deposito | null>(null);

    const form = useForm({
        fecha: new Date().toISOString().slice(0, 10),
        fondos_monetarios_id: '',
        monto: '',
    });

    const submit = () => {
        if (!form.data.fondos_monetarios_id || !form.data.monto || Number(form.data.monto) <= 0) {
            alert('Todos los campos son obligatorios y el monto debe ser mayor a 0');
            return;
        }

        form.post(route('depositos.store'), {
            onSuccess: () => {
                setIsOpen(false);
                form.reset({
                    fecha: new Date().toISOString().slice(0, 10),
                    fondos_monetarios_id: '',
                    monto: '',
                });
            },
        });
    };

    const anularDeposito = () => {
        if (!confirmAnular) return;
        form.delete(route('depositos.anular', confirmAnular.id), {
            onSuccess: () => setConfirmAnular(null),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Registro de Depósitos', href: '/movimientos/depositos' }]}>
            <Head title="Registro de Depósitos" />

            <div className="p-6">
                <div className="flex justify-between mb-4">
                    <h1 className="text-2xl font-bold">Registro de Depósitos</h1>
                    <Button onClick={() => setIsOpen(true)}>Nuevo Depósito</Button>
                </div>

                <table className="min-w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">Fecha</th>
                            <th className="p-2 border">Fondo Monetario</th>
                            <th className="p-2 border">Monto</th>
                            <th className="p-2 border">Estado</th>
                            <th className="p-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {depositos.map(dep => (
                            <tr key={dep.id}>
                                <td className="p-2 border">{new Date(dep.fecha).toLocaleDateString('es-ES')}</td>
                                <td className="p-2 border">{fondos.find(f => f.id === dep.fondos_monetarios_id)?.nombre}</td>
                                <td className="p-2 border text-right">{Number(dep.monto).toFixed(2)}</td>
                                <td className="p-2 border">{dep.status === 1 ? 'Activo' : 'Anulado'}</td>
                                <td className="p-2 border">
                                    {dep.status === 1 && (
                                        <Button variant="destructive" size="sm" onClick={() => setConfirmAnular(dep)}>
                                            Anular
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal Crear */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Nuevo Depósito</DialogTitle>
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
                                <label className="block text-sm font-medium">Monto</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.data.monto}
                                    onChange={e => form.setData('monto', e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                />
                                {form.errors.monto && <p className="text-red-500 text-sm">{form.errors.monto}</p>}
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancelar</Button>
                                <Button onClick={submit} disabled={form.processing}>Guardar</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Modal Anular */}
                <Dialog open={!!confirmAnular} onOpenChange={() => setConfirmAnular(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirmar Anulación</DialogTitle>
                        </DialogHeader>
                        <p>¿Seguro que desea anular el depósito del {confirmAnular?.fecha}?</p>
                        <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="secondary" onClick={() => setConfirmAnular(null)}>Cancelar</Button>
                            <Button variant="destructive" onClick={anularDeposito}>Anular</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
