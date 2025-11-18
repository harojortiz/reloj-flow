import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
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
import { Upload, X } from "lucide-react";

const modeloSchema = z.object({
  ref: z.string().min(1, "La referencia es requerida").max(20, "Máximo 20 caracteres"),
  nombre: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  costoBase: z.coerce.number().min(0, "El costo debe ser mayor a 0"),
  precioSugerido: z.coerce.number().min(0, "El precio debe ser mayor a 0"),
  categoriaId: z.string().min(1, "Selecciona una categoría"),
  imagen: z.string().optional(),
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
  const [previewImage, setPreviewImage] = useState<string>("");

  const form = useForm<ModeloFormData>({
    resolver: zodResolver(modeloSchema),
    defaultValues: {
      ref: "",
      nombre: "",
      costoBase: 0,
      precioSugerido: 0,
      categoriaId: "relojes",
      imagen: "",
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
        imagen: modelo.imagen || "",
      });
      setPreviewImage(modelo.imagen || "");
    } else {
      form.reset({
        ref: "",
        nombre: "",
        costoBase: 0,
        precioSugerido: 0,
        categoriaId: "relojes",
        imagen: "",
      });
      setPreviewImage("");
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
      imagen: data.imagen,
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
    setPreviewImage("");
    onOpenChange(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Archivo muy grande",
          description: "La imagen no debe superar 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        form.setValue("imagen", base64String);
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    form.setValue("imagen", "");
    setPreviewImage("");
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
            <div className="space-y-4">
              <FormLabel>Imagen del Producto</FormLabel>
              <div className="flex flex-col gap-4">
                {previewImage ? (
                  <div className="relative w-full h-48 rounded-lg border-2 border-border overflow-hidden bg-muted">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click para subir</span> o arrastra
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, WEBP (MAX. 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>

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
                  setPreviewImage("");
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
