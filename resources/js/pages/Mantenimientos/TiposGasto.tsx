import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TipoGasto {
    id: number;
    codigo: string;
    nombre: string;
    status: number;
}

export default function TiposGasto({ tipos }: PageProps<{ tipos: TipoGasto[] }>) {
    const [isOpen, setIsOpen] = useState(false);
    const [editing, setEditing] = useState<TipoGasto | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<TipoGasto | null>(null);

    const form = useForm({
        id: 0,
        codigo: '',
        nombre: '',
    });

    const openCreate = () => {
        form.reset();
        setEditing(null);
        setIsOpen(true);
    };

    const openEdit = (tipo: TipoGasto) => {
        form.setData({ id: tipo.id, codigo: tipo.codigo, nombre: tipo.nombre });
        setEditing(tipo);
        setIsOpen(true);
    };

    const submit = () => {
        if (editing) {
            form.put(route('tipos-gasto.update', editing.id), {
                onSuccess: () => setIsOpen(false),
            });
        } else {
            form.post(route('tipos-gasto.store'), {
                onSuccess: () => setIsOpen(false),
            });
        }
    };

    const inactivar = () => {
        if (confirmDelete) {
            form.put(route('tipos-gasto.inactivar', confirmDelete.id), {
                onSuccess: () => setConfirmDelete(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Tipos de Gasto', href: '/mantenimientos/tipos-gasto' }]}>
            <Head title="Tipos de Gasto" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Tipos de Gasto</h1>
                    <Button onClick={openCreate}>Nuevo</Button>
                </div>

                <table className="min-w-full border border-gray-300 text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Código</th>
                            <th className="p-2 border">Nombre</th>
                            <th className="p-2 border">Estado</th>
                            <th className="p-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tipos.map((tipo) => (
                            <tr key={tipo.id} className="hover:bg-gray-50">
                                <td className="p-2 border">{tipo.codigo}</td>
                                <td className="p-2 border">{tipo.nombre}</td>
                                <td className="p-2 border">{tipo.status === 1 ? 'Activo' : 'Inactivo'}</td>
                                <td className="p-2 border space-x-2">
                                    <Button size="sm" onClick={() => openEdit(tipo)}>
                                        Editar
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => setConfirmDelete(tipo)}>
                                        Anular
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Crear / Editar Modal */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editing ? 'Editar Tipo de Gasto' : 'Crear Tipo de Gasto'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            {editing && (
                                <div>
                                    <label className="block text-sm font-medium">Código</label>
                                    <input type="text" value={form.data.codigo} disabled className="w-full border rounded px-2 py-1 bg-gray-100" />
                                </div>
                            )}
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
                        <p>¿Está seguro que desea anular el tipo de gasto "{confirmDelete?.nombre}"?</p>
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
