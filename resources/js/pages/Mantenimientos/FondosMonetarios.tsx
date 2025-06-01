import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface FondoMonetario {
    id: number;
    nombre: string;
    tipo: 'Cuenta Bancaria' | 'Caja Menuda';
    status: number;
}

export default function FondosMonetarios({ fondos }: PageProps<{ fondos: FondoMonetario[] }>) {
    const [isOpen, setIsOpen] = useState(false);
    const [editing, setEditing] = useState<FondoMonetario | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<FondoMonetario | null>(null);

    const form = useForm({
        id: 0,
        nombre: '',
        tipo: 'Cuenta Bancaria',
    });

    const openCreate = () => {
        form.reset();
        form.setData('tipo', 'Cuenta Bancaria');
        setEditing(null);
        setIsOpen(true);
    };

    const openEdit = (fondo: FondoMonetario) => {
        form.setData({
            id: fondo.id,
            nombre: fondo.nombre,
            tipo: fondo.tipo,
        });
        setEditing(fondo);
        setIsOpen(true);
    };

    const submit = () => {
        if (editing) {
            form.put(route('fondos-monetarios.update', editing.id), {
                onSuccess: () => setIsOpen(false),
            });
        } else {
            form.post(route('fondos-monetarios.store'), {
                onSuccess: () => setIsOpen(false),
            });
        }
    };

    const inactivar = () => {
        if (confirmDelete) {
            form.put(route('fondos-monetarios.inactivar', confirmDelete.id), {
                onSuccess: () => setConfirmDelete(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Fondos Monetarios', href: '/mantenimientos/fondos-monetarios' }]}>
            <Head title="Fondos Monetarios" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Fondos Monetarios</h1>
                    <Button onClick={openCreate}>Nuevo</Button>
                </div>

                <table className="min-w-full border border-gray-300 text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Nombre</th>
                            <th className="p-2 border">Tipo</th>
                            <th className="p-2 border">Estado</th>
                            <th className="p-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fondos.map((fondo) => (
                            <tr key={fondo.id} className="hover:bg-gray-50">
                                <td className="p-2 border">{fondo.nombre}</td>
                                <td className="p-2 border">{fondo.tipo}</td>
                                <td className="p-2 border">{fondo.status === 1 ? 'Activo' : 'Inactivo'}</td>
                                <td className="p-2 border space-x-2">
                                    <Button size="sm" onClick={() => openEdit(fondo)}>Editar</Button>
                                    <Button variant="destructive" size="sm" onClick={() => setConfirmDelete(fondo)}>Anular</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Crear / Editar Modal */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editing ? 'Editar Fondo Monetario' : 'Crear Fondo Monetario'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Nombre</label>
                                <input
                                    type="text"
                                    value={form.data.nombre}
                                    onChange={(e) => form.setData('nombre', e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                />
                                {form.errors.nombre && <p className="text-red-500 text-sm">{form.errors.nombre}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Tipo</label>
                                <select
                                    value={form.data.tipo}
                                    onChange={(e) => form.setData('tipo', e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                >
                                    <option value="Cuenta Bancaria">Cuenta Bancaria</option>
                                    <option value="Caja Menuda">Caja Menuda</option>
                                </select>
                                {form.errors.tipo && <p className="text-red-500 text-sm">{form.errors.tipo}</p>}
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button onClick={submit} disabled={form.processing}>
                                    {editing ? 'Actualizar' : 'Guardar'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Confirmar Anular */}
                <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirmar Anulación</DialogTitle>
                        </DialogHeader>
                        <p>¿Está seguro que desea anular el fondo monetario "{confirmDelete?.nombre}"?</p>
                        <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
                            <Button variant="destructive" onClick={inactivar} disabled={form.processing}>Anular</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
