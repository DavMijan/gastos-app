import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Usuario {
    id: number;
    name: string;
    email: string;
    rol: 'usuario' | 'admin';
    status: number;
}

export default function Usuarios({ usuarios }: { usuarios: Usuario[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [editing, setEditing] = useState<Usuario | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<Usuario | null>(null);

    const form = useForm({
        id: 0,
        name: '',
        email: '',
        password: '',
        rol: 'usuario',
    });

    const openCreate = () => {
        form.reset();
        setEditing(null);
        setIsOpen(true);
    };

    const openEdit = (user: Usuario) => {
        form.setData({
            id: user.id,
            name: user.name,
            email: user.email,
            password: '',
            rol: user.rol,
        });
        setEditing(user);
        setIsOpen(true);
    };

    const submit = () => {
        if (editing) {
            form.put(route('usuarios.update', editing.id), {
                onSuccess: () => setIsOpen(false),
            });
        } else {
            form.post(route('usuarios.store'), {
                onSuccess: () => setIsOpen(false),
            });
        }
    };

    const inactivar = () => {
        if (confirmDelete) {
            form.put(route('usuarios.inactivar', confirmDelete.id), {
                onSuccess: () => setConfirmDelete(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Usuarios', href: '/usuarios' }]}>
            <div className="p-6">
                <div className="flex justify-between mb-4">
                    <h1 className="text-2xl font-bold">Usuarios</h1>
                    <Button onClick={openCreate}>Nuevo</Button>
                </div>

                <table className="min-w-full border text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Nombre</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Rol</th>
                            <th className="p-2 border">Estado</th>
                            <th className="p-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(user => (
                            <tr key={user.id}>
                                <td className="p-2 border">{user.name}</td>
                                <td className="p-2 border">{user.email}</td>
                                <td className="p-2 border">{user.rol}</td>
                                <td className="p-2 border">{user.status === 1 ? 'Activo' : 'Inactivo'}</td>
                                <td className="p-2 border space-x-2">
                                    <Button size="sm" onClick={() => openEdit(user)}>Editar</Button>
                                    <Button variant="destructive" size="sm" onClick={() => setConfirmDelete(user)}>Anular</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal Crear / Editar */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editing ? 'Editar Usuario' : 'Crear Usuario'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Nombre</label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-2 py-1"
                                    value={form.data.name}
                                    onChange={e => form.setData('name', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    className="w-full border rounded px-2 py-1"
                                    value={form.data.email}
                                    onChange={e => form.setData('email', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Contraseña {editing && <span className="text-xs">(dejar vacío si no desea cambiarla)</span>}</label>
                                <input
                                    type="password"
                                    className="w-full border rounded px-2 py-1"
                                    value={form.data.password}
                                    onChange={e => form.setData('password', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Rol</label>
                                <select
                                    className="w-full border rounded px-2 py-1"
                                    value={form.data.rol}
                                    onChange={e => form.setData('rol', e.target.value)}
                                >
                                    <option value="usuario">Usuario</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={submit} disabled={form.processing}>
                                    {editing ? 'Actualizar' : 'Guardar'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Confirmar Anulación */}
                <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirmar Anulación</DialogTitle>
                        </DialogHeader>
                        <p>¿Está seguro que desea anular el usuario "{confirmDelete?.name}"?</p>
                        <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
                            <Button variant="destructive" onClick={inactivar}>Anular</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
