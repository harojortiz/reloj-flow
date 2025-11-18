import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVentasStore } from "@/store/useVentasStore";
import { Modelo } from "@/types";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const modeloSchema = z.object({
  ref: z.string().min(1, "La referencia es requerida").max(20, "Máximo 20 caracteres"),
  nombre: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  costoBase: z.coerce.number().min(0, "El costo debe ser mayor a 0"),
  precioSugerido: z.coerce.number().min(0, "El precio debe ser mayor a 0"),
  categoriaId: z.string().min(1, "Selecciona una categoría"),
});

type ModeloFormData = z.infer<typeof modeloSchema>;

interface ModeloDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modelo?: Modelo | null;
}

export default function ModeloDialog({
  open,
  onOpenChange,
  modelo,
}: ModeloDialogProps) {
  const { agregarModelo, actualizarModelo, categorias } = useVentasStore();
  const { toast } = useToast();

  const form = useForm<ModeloFormData>({
    resolver: zodResolver(modeloSchema),
    defaultValues: {
      ref: "",
      nombre: "",
      costoBase: 0,
      precioSugerido: 0,
      categoriaId: "relojes",
    },
  });

  useEffect(() => {
    if (modelo) {
      form.reset({
        ref: modelo.ref,
        nombre: modelo.nombre,
        costoBase: modelo.costoBase,
        precioSugerido: modelo.precioSugerido,
        categoriaId: modelo.categoriaId,
      });
    } else {
      form.reset({
        ref: "",
        nombre: "",
        costoBase: 0,
        precioSugerido: 0,
        categoriaId: "relojes",
      });
    }
  }, [modelo, form]);

  const onSubmit = (data: ModeloFormData) => {
    if (data.costoBase >= data.precioSugerido) {
      toast({
        title: "Error de validación",
        description: "El precio sugerido debe ser mayor al costo base",
        variant: "destructive",
      });
      return;
    }

    const modeloData = {
      ref: data.ref,
      nombre: data.nombre,
      costoBase: data.costoBase,
      precioSugerido: data.precioSugerido,
      categoriaId: data.categoriaId,
    };

    if (modelo) {
      actualizarModelo(modelo.id, modeloData);
      toast({
        title: "Producto actualizado",
        description: `${data.nombre} ha sido actualizado correctamente`,
      });
    } else {
      agregarModelo(modeloData);
      toast({
        title: "Producto creado",
        description: `${data.nombre} ha sido agregado al catálogo`,
      });
    }

    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {modelo ? "Editar Producto" : "Nuevo Producto"}
          </DialogTitle>
          <DialogDescription>
            {modelo
              ? "Actualiza la información del producto"
              : "Agrega un nuevo producto al catálogo"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="ref"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referencia</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ROL-001"
                      {...field}
                      className="font-mono"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Producto</FormLabel>
                  <FormControl>
                    <Input placeholder="Rolex Submariner" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoriaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.id}>
                          {categoria.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="costoBase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Costo Base</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        className="font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="precioSugerido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio Sugerido</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        className="font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {modelo ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
