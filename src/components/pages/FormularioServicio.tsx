import { useForm, type SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import type { ServicioFormData } from "../../interfaces/servicios";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { buscarServicioPorId, crearServicio, editarServicio } from "../../helpers/queries";

interface FormularioProps {
  titulo: string;
}

// Definimos el esquema del formulario para React Hook Form
const FormularioServicio = ({ titulo }: FormularioProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ServicioFormData>();
  // traigo los datos que necesito del contexto
  const { id } = useParams<{ id: string }>();
  const navegacion = useNavigate();

  useEffect(() => {
    const obtenerServicio = async () => {
      if (titulo.includes("Editar") && id) {
        const respuesta = await buscarServicioPorId(id);

        if (respuesta?.status === 200) {
          const servicioBuscado = await respuesta.json();

          setValue("nombreServicio", servicioBuscado.nombreServicio);
          setValue("precio", servicioBuscado.precio);
          setValue("categoria", servicioBuscado.categoria);
          setValue("descripcion", servicioBuscado.descripcion);
          setValue("imagen", servicioBuscado.imagen);
        } else {
          alert("Ocurrio un error al obtener el servicio buscado");
        }
      }
    };
    obtenerServicio();
  }, [id, titulo, setValue]);

  const onSubmit: SubmitHandler<ServicioFormData> = async (data, e) => {
    if (titulo.includes("Crear") && crearServicio) {
      const respuesta = await crearServicio(data);
      if (respuesta?.status === 201) {
        Swal.fire({
          title: "Servicio creado",
          text: `El servicio '${data.nombreServicio}' fue creado correctamente`,
          icon: "success",
          background: "#18181b",
          color: "#f4f4f5",
          confirmButtonColor: "#3b82f6",
        });
        if (e) {
          (e.target as HTMLFormElement).reset();
        }
      } else {
        Swal.fire({
          title: "Ocurrio un error",
          text: `El servicio '${data.nombreServicio}' no pudo ser creado. Intentalo en unos minutos`,
          icon: "error",
          background: "#18181b",
          color: "#f4f4f5",
          confirmButtonColor: "#3b82f6",
        });
      }
    } else if (id) {
      const respuesta = await editarServicio(data, id);
      if(respuesta?.status === 200){
        Swal.fire({
          title: "Servicio editado",
          text: `El servicio '${data.nombreServicio}' fue editado correctamente`,
          icon: "success",
          background: "#18181b",
          color: "#f4f4f5",
          confirmButtonColor: "#3b82f6",
        });
        navegacion("/administrador");
      }else{
         Swal.fire({
          title: "Ocurrio un error",
          text: `El servicio '${data.nombreServicio}' no pudo ser editado. Intentelo en unos minutos`,
          icon: "error",
          background: "#18181b",
          color: "#f4f4f5",
          confirmButtonColor: "#3b82f6",
        });
      }
    }
  };

  // const editarServicio = (
  //   idServicio: string,
  //   servicioEditar: ServicioFormData,
  // ) => {
  //   const serviciosEditados = servicios.map((itemServicio) => {
  //     if (itemServicio.id === idServicio) {
  //       return { ...itemServicio, ...servicioEditar };
  //     }
  //     return itemServicio;
  //   });
  //   setServicios(serviciosEditados);
  // };

  // const buscarServicio = (idServicio: string): Servicio | undefined => {
  //   return servicios.find((item) => item.id === idServicio);
  // };

  // Clase utilitaria para inputs consistentes
  const inputClass = (hasError: boolean) => `
    w-full px-4 py-2.5 bg-zinc-950 border rounded-lg text-zinc-100 
    focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all
    ${hasError ? "border-red-500" : "border-zinc-700"}
  `;

  return (
    <section className="max-w-4xl mx-auto animate-fadeIn">
      <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-8 border-b border-zinc-800 pb-4">
          {titulo}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre del Servicio */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Nombre del Servicio*
              </label>
              <input
                type="text"
                placeholder="Ej: Diseño de sitio web institucional"
                className={inputClass(!!errors.nombreServicio)}
                {...register("nombreServicio", {
                  required: "El nombre es obligatorio",
                  minLength: { value: 5, message: "Mínimo 5 caracteres" },
                  maxLength: { value: 100, message: "Máximo 100 caracteres" },
                })}
              />
              <p className="text-red-500 text-xs mt-1 italic">
                {errors.nombreServicio?.message}
              </p>
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Precio*
              </label>
              <input
                type="number"
                placeholder="Ej: 50000"
                className={inputClass(!!errors.precio)}
                {...register("precio", {
                  required: "El precio es obligatorio",
                  min: { value: 50, message: "Mínimo $50" },
                  valueAsNumber: true,
                })}
              />
              <p className="text-red-500 text-xs mt-1 italic">
                {errors.precio?.message}
              </p>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Categoría*
              </label>
              <select
                className={inputClass(!!errors.categoria)}
                {...register("categoria", {
                  required: "Seleccione una categoría",
                })}
              >
                <option value="" className="bg-zinc-900">
                  Seleccione una opción
                </option>
                <option value="Desarrollo Web" className="bg-zinc-900">
                  Desarrollo Web
                </option>
                <option value="Backend & API" className="bg-zinc-900">
                  Backend & API
                </option>
                <option value="Consultoria" className="bg-zinc-900">
                  Consultoría
                </option>
              </select>
              <p className="text-red-500 text-xs mt-1 italic">
                {errors.categoria?.message}
              </p>
            </div>

            {/* URL Imagen */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                URL de Imagen*
              </label>
              <input
                type="text"
                placeholder="https://ejemplo.com/imagen.jpg"
                className={inputClass(!!errors.imagen)}
                {...register("imagen", {
                  required: "La URL es obligatoria",
                  pattern: {
                    value: /\.(jpg|jpeg|png|webp|avif|svg)$/,
                    message:
                      "Debe ser una URL de imagen válida (jpg, png, webp, etc.)",
                  },
                })}
              />
              <p className="text-red-500 text-xs mt-1 italic">
                {errors.imagen?.message}
              </p>
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Descripción*
              </label>
              <textarea
                rows={4}
                placeholder="Describa el servicio detalladamente..."
                className={inputClass(!!errors.descripcion)}
                {...register("descripcion", {
                  required: "La descripción es obligatoria",
                  minLength: { value: 10, message: "Mínimo 10 caracteres" },
                  maxLength: { value: 500, message: "Máximo 500 caracteres" },
                })}
              />
              <p className="text-red-500 text-xs mt-1 italic">
                {errors.descripcion?.message}
              </p>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-blue-900/20"
            >
              Guardar Servicio
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default FormularioServicio;
