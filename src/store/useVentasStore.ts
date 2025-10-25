import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Venta, Cliente, Categoria } from '@/types';
import { calcularVentaCompleta } from '@/lib/calculators';

// Categorías disponibles
const categoriasIniciales: Categoria[] = [
  { id: 'relojes', nombre: 'Relojes', descripcion: 'Relojes de lujo y accesorios', color: 'hsl(var(--primary))' },
  { id: 'joyas', nombre: 'Joyas', descripcion: 'Anillos, collares, pulseras', color: 'hsl(var(--accent))' },
  { id: 'otros', nombre: 'Otros', descripcion: 'Otros productos', color: 'hsl(var(--secondary))' },
];

// Datos de ejemplo
const clientesIniciales: Cliente[] = [
  { id: '1', nombre: 'Juan Pérez', telefono: '3001234567', documento: '1020304050', email: 'juan@email.com' },
  { id: '2', nombre: 'María González', telefono: '3109876543', documento: '1122334455' },
  { id: '3', nombre: 'Carlos Ramírez', telefono: '3201112233', email: 'carlos@email.com' },
  { id: '4', nombre: 'Ana López', telefono: '3152223344', documento: '9988776655' },
  { id: '5', nombre: 'Luis Martínez', telefono: '3003334444' },
  { id: '6', nombre: 'Diana Torres', telefono: '3114445555', email: 'diana@email.com' },
  { id: '7', nombre: 'Pedro Sánchez', telefono: '3205556666', documento: '7766554433' },
  { id: '8', nombre: 'Laura Castro', telefono: '3156667777' },
  { id: '9', nombre: 'Jorge Vargas', telefono: '3006778888', email: 'jorge@email.com' },
  { id: '10', nombre: 'Sofía Mendoza', telefono: '3117889999', documento: '5544332211' },
];

const ventasIniciales: Venta[] = [
  {
    id: '1',
    ref: 'ROL-001',
    modelo: 'Rolex Submariner',
    neto: 25000000,
    cuota1: 10000000,
    cuota2: 10000000,
    ...calcularVentaCompleta(25000000, 10000000, 10000000),
    clienteId: '1',
    fecha: '2025-01-15',
    notas: 'Cliente preferencial',
    categoriaId: 'relojes',
  },
  {
    id: '2',
    ref: 'TAG-002',
    modelo: 'TAG Heuer Carrera',
    neto: 8500000,
    cuota1: 8500000 * 1.19,
    cuota2: 0,
    ...calcularVentaCompleta(8500000, 8500000 * 1.19, 0),
    clienteId: '2',
    fecha: '2025-02-01',
    categoriaId: 'relojes',
  },
  {
    id: '3',
    ref: 'OMG-003',
    modelo: 'Omega Seamaster',
    neto: 15000000,
    cuota1: 5000000,
    cuota2: 5000000,
    ...calcularVentaCompleta(15000000, 5000000, 5000000),
    clienteId: '3',
    fecha: '2025-02-10',
    categoriaId: 'relojes',
  },
  {
    id: '4',
    ref: 'CAR-004',
    modelo: 'Cartier Santos',
    neto: 18000000,
    cuota1: 0,
    cuota2: 0,
    ...calcularVentaCompleta(18000000, 0, 0),
    clienteId: '4',
    fecha: '2025-02-15',
    categoriaId: 'relojes',
  },
  {
    id: '5',
    ref: 'PAT-005',
    modelo: 'Patek Philippe Nautilus',
    neto: 45000000,
    cuota1: 20000000,
    cuota2: 15000000,
    ...calcularVentaCompleta(45000000, 20000000, 15000000),
    clienteId: '5',
    fecha: '2025-02-18',
    categoriaId: 'relojes',
  },
  {
    id: '6',
    ref: 'BRE-006',
    modelo: 'Breitling Navitimer',
    neto: 9500000,
    cuota1: 9500000 * 1.19,
    cuota2: 0,
    ...calcularVentaCompleta(9500000, 9500000 * 1.19, 0),
    clienteId: '6',
    fecha: '2025-03-01',
    categoriaId: 'relojes',
  },
  {
    id: '7',
    ref: 'ROL-007',
    modelo: 'Rolex Daytona',
    neto: 32000000,
    cuota1: 15000000,
    cuota2: 10000000,
    ...calcularVentaCompleta(32000000, 15000000, 10000000),
    clienteId: '7',
    fecha: '2025-03-05',
    categoriaId: 'relojes',
  },
  {
    id: '8',
    ref: 'IWC-008',
    modelo: 'IWC Portugieser',
    neto: 12000000,
    cuota1: 0,
    cuota2: 0,
    ...calcularVentaCompleta(12000000, 0, 0),
    clienteId: '8',
    fecha: '2025-03-10',
    categoriaId: 'relojes',
  },
  {
    id: '9',
    ref: 'ZEN-009',
    modelo: 'Zenith El Primero',
    neto: 10500000,
    cuota1: 5000000,
    cuota2: 0,
    ...calcularVentaCompleta(10500000, 5000000, 0),
    clienteId: '9',
    fecha: '2025-03-12',
    categoriaId: 'relojes',
  },
  {
    id: '10',
    ref: 'AUD-010',
    modelo: 'Audemars Piguet Royal Oak',
    neto: 38000000,
    cuota1: 20000000,
    cuota2: 18000000,
    ...calcularVentaCompleta(38000000, 20000000, 18000000),
    clienteId: '10',
    fecha: '2025-03-15',
    categoriaId: 'relojes',
  },
  {
    id: '11',
    ref: 'TAG-011',
    modelo: 'TAG Heuer Monaco',
    neto: 7800000,
    cuota1: 4000000,
    cuota2: 0,
    ...calcularVentaCompleta(7800000, 4000000, 0),
    clienteId: '1',
    fecha: '2025-03-18',
    categoriaId: 'relojes',
  },
  {
    id: '12',
    ref: 'PAN-012',
    modelo: 'Panerai Luminor',
    neto: 11200000,
    cuota1: 11200000 * 1.19,
    cuota2: 0,
    ...calcularVentaCompleta(11200000, 11200000 * 1.19, 0),
    clienteId: '2',
    fecha: '2025-03-20',
    categoriaId: 'relojes',
  },
  {
    id: '13',
    ref: 'LON-013',
    modelo: 'Longines Master',
    neto: 4500000,
    cuota1: 2000000,
    cuota2: 2000000,
    ...calcularVentaCompleta(4500000, 2000000, 2000000),
    clienteId: '3',
    fecha: '2025-03-22',
    categoriaId: 'relojes',
  },
  {
    id: '14',
    ref: 'TIS-014',
    modelo: 'Tissot PRX',
    neto: 2200000,
    cuota1: 2200000 * 1.19,
    cuota2: 0,
    ...calcularVentaCompleta(2200000, 2200000 * 1.19, 0),
    clienteId: '4',
    fecha: '2025-04-01',
    categoriaId: 'relojes',
  },
  {
    id: '15',
    ref: 'ROL-015',
    modelo: 'Rolex GMT-Master II',
    neto: 28000000,
    cuota1: 10000000,
    cuota2: 0,
    ...calcularVentaCompleta(28000000, 10000000, 0),
    clienteId: '5',
    fecha: '2025-04-05',
    categoriaId: 'relojes',
  },
];

interface VentasState {
  ventas: Venta[];
  clientes: Cliente[];
  categorias: Categoria[];
  agregarVenta: (venta: Omit<Venta, 'id'>) => void;
  actualizarVenta: (id: string, venta: Partial<Venta>) => void;
  eliminarVenta: (id: string) => void;
  agregarCliente: (cliente: Omit<Cliente, 'id'>) => void;
  actualizarCliente: (id: string, cliente: Partial<Cliente>) => void;
  eliminarCliente: (id: string) => void;
  obtenerCliente: (id: string) => Cliente | undefined;
}

export const useVentasStore = create<VentasState>()(
  persist(
    (set, get) => ({
      ventas: ventasIniciales,
      clientes: clientesIniciales,
      categorias: categoriasIniciales,

      agregarVenta: (venta) =>
        set((state) => ({
          ventas: [
            ...state.ventas,
            { ...venta, id: `${Date.now()}` },
          ],
        })),

      actualizarVenta: (id, ventaActualizada) =>
        set((state) => ({
          ventas: state.ventas.map((v) =>
            v.id === id ? { ...v, ...ventaActualizada } : v
          ),
        })),

      eliminarVenta: (id) =>
        set((state) => ({
          ventas: state.ventas.filter((v) => v.id !== id),
        })),

      agregarCliente: (cliente) =>
        set((state) => ({
          clientes: [
            ...state.clientes,
            { ...cliente, id: `${Date.now()}` },
          ],
        })),

      actualizarCliente: (id, clienteActualizado) =>
        set((state) => ({
          clientes: state.clientes.map((c) =>
            c.id === id ? { ...c, ...clienteActualizado } : c
          ),
        })),

      eliminarCliente: (id) =>
        set((state) => ({
          clientes: state.clientes.filter((c) => c.id !== id),
        })),

      obtenerCliente: (id) => get().clientes.find((c) => c.id === id),
    }),
    {
      name: 'ventas-storage',
    }
  )
);
