import { Link } from "react-router";
import ItemTabla from "../services/ItemTabla";
import { LuCirclePlus } from "react-icons/lu";
import { useEffect, useState } from "react";
import { listarServicios } from "../../helpers/queries";
import Swal from "sweetalert2";
import type { Servicio, ServiciosPaginados } from "../../interfaces/servicios";
const Administrador = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);

  useEffect(() => {
    consultarAPI();
  }, []);

  const consultarAPI = async () => {
    const respuesta = await listarServicios();
    if (respuesta?.status === 200) {
      const datos: ServiciosPaginados = await respuesta.json();
      setServicios(datos.servicios);
    } else {
      Swal.fire({
        title: "Ocurrio un error",
        text: "No se pudieron obtener los datos",
        icon: "error",
      });
    }
    //usar la query listarServicios
  };

  return (
    <section className="animate-fadeIn space-y-6">
      {/* Header de la sección */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Panel de Administración
          </h1>
          <p className="text-zinc-500 text-sm">
            Gestiona el catálogo de servicios disponibles.
          </p>
        </div>
        <Link
          to={"/administrador/crear"}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center gap-2"
        >
          <LuCirclePlus />
          Crear Servicio
        </Link>
      </div>

      {/* Contenedor de la Tabla con Scroll Horizontal para móviles */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/20">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-900/60 border-b border-zinc-800">
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-500 font-bold">
                #
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-500 font-bold">
                Servicio
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-500 font-bold">
                Precio
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider text-zinc-500 font-bold text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {servicios.length > 0 ? (
              servicios.map((servicio, indice) => (
                <ItemTabla
                  key={servicio._id}
                  servicio={servicio}
                  fila={indice + 1}
                  setServicios={setServicios}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-zinc-500 italic"
                >
                  No hay servicios registrados para administrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Administrador;
