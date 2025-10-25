import { z } from "zod";

export const ventaSchema = z.object({
  ref: z.string().min(1, "REF es requerido"),
  modelo: z.string().min(1, "Modelo es requerido"),
  neto: z.number().min(0, "El neto debe ser mayor o igual a 0"),
  cuota1: z.number().min(0, "La cuota 1 debe ser mayor o igual a 0").default(0),
  cuota2: z.number().min(0, "La cuota 2 debe ser mayor o igual a 0").default(0),
  venta: z.number().optional(),
  costoBase: z.number().optional(),
  clienteId: z.string().min(1, "Cliente es requerido"),
  fecha: z.string().min(1, "Fecha es requerida"),
  notas: z.string().optional(),
  categoriaId: z.string().min(1, "Categoría es requerida"),
});

export const clienteSchema = z.object({
  nombre: z.string().min(1, "Nombre es requerido"),
  telefono: z.string().optional(),
  documento: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  direccion: z.string().optional(),
});

export type VentaFormData = z.infer<typeof ventaSchema>;
export type ClienteFormData = z.infer<typeof clienteSchema>;
