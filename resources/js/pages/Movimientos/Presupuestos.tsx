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

interface Presupuesto {
  id: number;
  mes: string;
  monto: number;
  tipo_gasto: TipoGasto;
}

export default function Presupuestos({ presupuestos, tipos }: { presupuestos: Presupuesto[]; tipos: TipoGasto[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Presupuesto | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Presupuesto | null>(null);

  const form = useForm({
    id: 0,
    tipo_gasto_id: '',
    anio: new Date().getFullYear().toString(),
    mes: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    monto: '',
  });

  const openCreate = () => {
    form.reset();
    setEditing(null);
    setIsOpen(true);
  };

  const openEdit = (presupuesto: Presupuesto) => {
    const date = new Date(presupuesto.mes);
    form.setData({
      id: presupuesto.id,
      tipo_gasto_id: presupuesto.tipo_gasto.id.toString(),
      anio: date.getFullYear().toString(),
      mes: (date.getMonth() + 1).toString().padStart(2, '0'),
      monto: presupuesto.monto.toString(),
    });
    setEditing(presupuesto);
    setIsOpen(true);
  };

  const submit = () => {
    const fechaMes = `${form.data.anio}-${form.data.mes}-01`;
    const data = {
      tipo_gasto_id: form.data.tipo_gasto_id,
      mes: fechaMes,
      monto: form.data.monto,
    };

    if (editing) {
      form.put(route('presupuestos.update', form.data.id), {
        data,
        onSuccess: () => {
          setIsOpen(false);
          setEditing(null);
        },
      });
    } else {
      form.post(route('presupuestos.store'), {
        data,
        onSuccess: () => {
          setIsOpen(false);
          form.reset();
        },
      });
    }
  };

  const eliminar = () => {
    if (confirmDelete) {
      form.delete(route('presupuestos.destroy', confirmDelete.id), {
        onSuccess: () => setConfirmDelete(null),
      });
    }
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Presupuestos', href: '/movimientos/presupuestos' }]}>
      <Head title="Presupuestos" />

      <div className="p-6">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Presupuestos</h1>
          <Button onClick={openCreate}>Nuevo</Button>
        </div>

        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Mes</th>
              <th className="p-2 border">Tipo de Gasto</th>
              <th className="p-2 border">Monto</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {presupuestos.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-2 border">
                  {new Date(p.mes + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}
                </td>
                <td className="p-2 border">{p.tipo_gasto?.nombre}</td>
                <td className="p-2 border text-right">Q {Number(p.monto).toFixed(2)}</td>
                <td className="p-2 border space-x-2">
                  <Button size="sm" onClick={() => openEdit(p)}>Editar</Button>
                  <Button size="sm" variant="destructive" onClick={() => setConfirmDelete(p)}>Anular</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal Crear / Editar */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {Object.values(form.errors).length > 0 && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
                  {Object.values(form.errors)[0]}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium">Año</label>
                <select value={form.data.anio} onChange={e => form.setData('anio', e.target.value)} className="w-full border rounded px-2 py-1">
                  {[...Array(5)].map((_, i) => {
                    const y = new Date().getFullYear() - 2 + i;
                    return <option key={y} value={y}>{y}</option>;
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Mes</label>
                <select value={form.data.mes} onChange={e => form.setData('mes', e.target.value)} className="w-full border rounded px-2 py-1">
                  {Array.from({ length: 12 }, (_, i) => {
                    const m = (i + 1).toString().padStart(2, '0');
                    return <option key={m} value={m}>{m}</option>;
                  })}
                </select>
                {form.errors.mes && <p className="text-red-500 text-sm">{form.errors.mes}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Tipo de Gasto</label>
                <select value={form.data.tipo_gasto_id} onChange={e => form.setData('tipo_gasto_id', e.target.value)} className="w-full border rounded px-2 py-1">
                  <option value="">Seleccione...</option>
                  {tipos.map(tipo => (
                    <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                  ))}
                </select>
                {form.errors.tipo_gasto_id && <p className="text-red-500 text-sm">{form.errors.tipo_gasto_id}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Monto</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.data.monto}
                  onChange={e => form.setData('monto', e.target.value)}
                  className="w-full border rounded px-2 py-1"
                />
                {form.errors.monto && <p className="text-red-500 text-sm">{form.errors.monto}</p>}
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
            <p>¿Está seguro que desea anular el presupuesto de "{new Date(confirmDelete?.mes ?? '').toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}"?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
              <Button variant="destructive" onClick={eliminar} disabled={form.processing}>Anular</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
