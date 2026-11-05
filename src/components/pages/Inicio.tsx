import CardServicio from "../services/CardServicio";
import { useEffect, useState } from "react";
import { listarServicios } from "../../helpers/queries";
import Swal from "sweetalert2";
import type { Servicio, ServiciosPaginados } from "../../interfaces/servicios";
const Inicio = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cantidadServicios, setCantidadServicios] = useState(0);

  useEffect(() => {
    consultarAPI();
  }, []);

  const consultarAPI = async () => {
    const respuesta = await listarServicios();
    if (respuesta?.status === 200) {
      const datos: ServiciosPaginados = await respuesta.json();
      setServicios(datos.servicios);
      setCantidadServicios(datos.cantidadServicios);
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
    <section className="space-y-8 animate-fadeIn">
      {/* Encabezado con estilo moderno */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Catálogo de <span className="text-blue-500">Servicios</span>
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Explora nuestras soluciones tecnológicas personalizadas.
          </p>
        </div>

        <div className="text-xs text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800 self-start md:self-center">
          {cantidadServicios} servicios disponibles
        </div>
      </div>

      {servicios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {servicios.map((servicio) => (
            <CardServicio key={servicio._id} servicio={servicio} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/50 rounded-xl border border-dashed border-zinc-800">
          <i className="bi bi-search text-4xl text-zinc-700 mb-4"></i>
          <p className="text-zinc-500">
            No se encontraron servicios disponibles.
          </p>
        </div>
      )}
    </section>
  );
};

export default Inicio;
