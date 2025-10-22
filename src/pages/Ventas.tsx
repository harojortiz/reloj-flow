import { useState } from "react";
import { useVentasStore } from "@/store/useVentasStore";
import { formatCOP, formatDate } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import VentaDialog from "@/components/VentaDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function Ventas() {
  const { ventas, clientes, eliminarVenta, obtenerCliente } = useVentasStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [ventaDialogOpen, setVentaDialogOpen] = useState(false);
  const [ventaEditando, setVentaEditando] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ventaAEliminar, setVentaAEliminar] = useState<string | null>(null);

  const ventasFiltradas = ventas.filter((v) => {
    const cliente = obtenerCliente(v.clienteId);
    const searchLower = searchTerm.toLowerCase();
    return (
      v.ref.toLowerCase().includes(searchLower) ||
      v.modelo.toLowerCase().includes(searchLower) ||
      cliente?.nombre.toLowerCase().includes(searchLower) ||
      ''
    );
  });

  const handleEditarVenta = (id: string) => {
    setVentaEditando(id);
    setVentaDialogOpen(true);
  };

  const handleNuevaVenta = () => {
    setVentaEditando(null);
    setVentaDialogOpen(true);
  };

  const handleEliminarClick = (id: string) => {
    setVentaAEliminar(id);
    setDeleteDialogOpen(true);
  };

  const handleEliminarConfirm = () => {
    if (ventaAEliminar) {
      eliminarVenta(ventaAEliminar);
      toast.success("Venta eliminada correctamente");
      setVentaAEliminar(null);
      setDeleteDialogOpen(false);
    }
  };

  const totales = ventasFiltradas.reduce(
    (acc, v) => ({
      neto: acc.neto + v.neto,
      iva: acc.iva + v.iva19,
      total: acc.total + v.total,
      cuota1: acc.cuota1 + v.cuota1,
      cuota2: acc.cuota2 + v.cuota2,
      deuda: acc.deuda + v.deuda,
      venta: acc.venta + v.venta,
      ganancias: acc.ganancias + v.ganancias,
    }),
    { neto: 0, iva: 0, total: 0, cuota1: 0, cuota2: 0, deuda: 0, venta: 0, ganancias: 0 }
  );

  const getEstadoBadge = (estado: string) => {
    const variants = {
      PAGADA: 'default',
      PARCIAL: 'secondary',
      DEUDA: 'destructive',
    };
    return (
      <Badge variant={variants[estado as keyof typeof variants] as any}>
        {estado}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Ventas</h1>
          <p className="text-muted-foreground">
            Gestión completa de ventas de relojes
          </p>
        </div>
        <Button onClick={handleNuevaVenta} className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Venta
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por REF, modelo o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">REF</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Modelo</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">NETO</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">IVA 19%</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Total</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Cuota 1</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Cuota 2</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Deuda</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Cliente</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Fecha</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Estado</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventasFiltradas.map((venta, index) => {
                const cliente = obtenerCliente(venta.clienteId);
                return (
                  <tr key={venta.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-4 py-3 text-sm text-foreground">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{venta.ref}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{venta.modelo}</td>
                    <td className="px-4 py-3 text-sm text-right text-foreground">{formatCOP(venta.neto)}</td>
                    <td className="px-4 py-3 text-sm text-right text-muted-foreground">{formatCOP(venta.iva19)}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-foreground">{formatCOP(venta.total)}</td>
                    <td className="px-4 py-3 text-sm text-right text-foreground">{formatCOP(venta.cuota1)}</td>
                    <td className="px-4 py-3 text-sm text-right text-foreground">{formatCOP(venta.cuota2)}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-warning">{formatCOP(venta.deuda)}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{cliente?.nombre || '-'}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(venta.fecha)}</td>
                    <td className="px-4 py-3">{getEstadoBadge(venta.estado)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditarVenta(venta.id)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEliminarClick(venta.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-accent/10 border-t-2 border-accent">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-sm font-bold text-foreground">TOTALES</td>
                <td className="px-4 py-3 text-sm text-right font-bold text-foreground">{formatCOP(totales.neto)}</td>
                <td className="px-4 py-3 text-sm text-right font-bold text-foreground">{formatCOP(totales.iva)}</td>
                <td className="px-4 py-3 text-sm text-right font-bold text-foreground">{formatCOP(totales.total)}</td>
                <td className="px-4 py-3 text-sm text-right font-bold text-foreground">{formatCOP(totales.cuota1)}</td>
                <td className="px-4 py-3 text-sm text-right font-bold text-foreground">{formatCOP(totales.cuota2)}</td>
                <td className="px-4 py-3 text-sm text-right font-bold text-foreground">{formatCOP(totales.deuda)}</td>
                <td colSpan={4}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      <VentaDialog
        open={ventaDialogOpen}
        onOpenChange={setVentaDialogOpen}
        ventaId={ventaEditando}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente esta venta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleEliminarConfirm}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
