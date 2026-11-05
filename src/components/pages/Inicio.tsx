import CardServicio from "../services/CardServicio";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { LuChevronLeft, LuChevronRight, LuSearch } from "react-icons/lu";
import { listarServicios } from "../../helpers/queries";
import Swal from "sweetalert2";
import type { Servicio, ServiciosPaginados } from "../../interfaces/servicios";

const LIMITE_SERVICIOS = 10;

const Inicio = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cantidadServicios, setCantidadServicios] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [termino, setTermino] = useState("");
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    let ignorar = false;

    const consultarAPI = async () => {
      const respuesta = await listarServicios({
        termino,
        pagina,
        limite: LIMITE_SERVICIOS,
      });
      if (ignorar) return;

      if (respuesta?.status === 200) {
        const datos: ServiciosPaginados = await respuesta.json();
        if (ignorar) return;

        setServicios(datos.servicios);
        setCantidadServicios(datos.cantidadServicios);
      } else {
        Swal.fire({
          title: "Ocurrio un error",
          text: "No se pudieron obtener los datos",
          icon: "error",
        });
      }
    };

    consultarAPI();

    return () => {
      ignorar = true;
    };
  }, [termino, pagina]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(cantidadServicios / LIMITE_SERVICIOS),
  );

  const buscar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setPagina(1);
    setTermino(busqueda.trim());
  };

  const limpiarBusqueda = () => {
    setBusqueda("");
    setTermino("");
    setPagina(1);
  };

  const irAPagina = (nuevaPagina: number) => {
    setPagina(nuevaPagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

        <div
          aria-live="polite"
          className="text-xs text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800 self-start md:self-center"
        >
          {termino
            ? `${cantidadServicios} resultados encontrados`
            : `${cantidadServicios} servicios disponibles`}
        </div>
      </div>

      {/* Buscador */}
      <form
        role="search"
        onSubmit={buscar}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative grow">
          <label htmlFor="busqueda" className="sr-only">
            Buscar servicio
          </label>
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-lg" />
          <input
            id="busqueda"
            type="search"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            placeholder="Buscar por nombre de servicio..."
            className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="grow sm:grow-0 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Buscar
          </button>

          {(busqueda || termino) && (
            <button
              type="button"
              onClick={limpiarBusqueda}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-6 py-3 rounded-lg font-bold transition-all border border-zinc-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Limpiar
            </button>
          )}
        </div>
      </form>

      {servicios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {servicios.map((servicio) => (
            <CardServicio key={servicio._id} servicio={servicio} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/50 rounded-xl border border-dashed border-zinc-800">
          <LuSearch className="text-4xl text-zinc-700 mb-4" />
          <p className="text-zinc-500 text-center px-4">
            {termino
              ? `No se encontraron servicios para "${termino}".`
              : "No se encontraron servicios disponibles."}
          </p>
          {termino && (
            <button
              type="button"
              onClick={limpiarBusqueda}
              className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      )}

      {/* Paginación */}
      {totalPaginas > 1 && (
        <nav
          aria-label="Paginación de servicios"
          className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800 pt-6"
        >
          <p className="text-sm text-zinc-400">
            Página <span className="text-zinc-100 font-semibold">{pagina}</span>{" "}
            de <span className="text-zinc-100 font-semibold">{totalPaginas}</span>
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => irAPagina(pagina - 1)}
              disabled={pagina === 1}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-zinc-800 text-zinc-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <LuChevronLeft />
              Anterior
            </button>

            <button
              type="button"
              onClick={() => irAPagina(pagina + 1)}
              disabled={pagina === totalPaginas}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-zinc-800 text-zinc-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Siguiente
              <LuChevronRight />
            </button>
          </div>
        </nav>
      )}
    </section>
  );
};

export default Inicio;
