import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

interface DataItem {
  tipo_gasto_id: number;
  nombre: string;
  presupuesto: number;
  ejecutado: number;
}

interface Props {
  data: DataItem[];
  fecha_inicio: string;
  fecha_fin: string;
}

export default function PresupuestoVsEjecucion() {
  const { data, fecha_inicio, fecha_fin } = usePage().props as Props;

  const [fechas, setFechas] = useState({
    fecha_inicio: fecha_inicio || '',
    fecha_fin: fecha_fin || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFechas({
      ...fechas,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Inertia.get(route('reportes.grafico-presupuesto-ejecucion'), fechas, { preserveState: true });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Reportes', href: '/reportes' }, { title: 'Presupuesto vs Ejecución' }]}>
      <Head title="Comparativo Presupuesto vs Ejecución" />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Comparativo Presupuesto vs Ejecución</h1>

        <form onSubmit={handleSubmit} className="mb-6 flex gap-4 items-end max-w-md">
          <div>
            <label className="block mb-1 font-medium">Fecha Inicio</label>
            <input
              type="date"
              name="fecha_inicio"
              value={fechas.fecha_inicio}
              onChange={handleChange}
              className="border rounded px-2 py-1"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Fecha Fin</label>
            <input
              type="date"
              name="fecha_fin"
              value={fechas.fecha_fin}
              onChange={handleChange}
              className="border rounded px-2 py-1"
              required
            />
          </div>

          <Button type="submit" className="ml-4">
            Filtrar
          </Button>
        </form>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="presupuesto" fill="#8884d8" name="Presupuesto" />
            <Bar dataKey="ejecutado" fill="#82ca9d" name="Ejecutado" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AppLayout>
  );
}
