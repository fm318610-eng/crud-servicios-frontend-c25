import { Link } from "react-router";
import ItemTabla from "../services/ItemTabla";
import {
  LuChevronLeft,
  LuChevronRight,
  LuCirclePlus,
} from "react-icons/lu";
import { useEffect, useState } from "react";
import { listarServicios } from "../../helpers/queries";
import Swal from "sweetalert2";
import type { Servicio, ServiciosPaginados } from "../../interfaces/servicios";

const LIMITE_SERVICIOS = 5;

type ElementoPaginacion = number | "elipsis";

const generarPaginas = (
  paginaActual: number,
  totalPaginas: number,
): ElementoPaginacion[] => {
  if (totalPaginas <= 7) {
    return Array.from({ length: totalPaginas }, (_, indice) => indice + 1);
  }

  const paginas: ElementoPaginacion[] = [1];
  const inicio = Math.max(2, paginaActual - 1);
  const fin = Math.min(totalPaginas - 1, paginaActual + 1);

  if (inicio > 2) {
    paginas.push("elipsis");
  }

  for (let numero = inicio; numero <= fin; numero++) {
    paginas.push(numero);
  }

  if (fin < totalPaginas - 1) {
    paginas.push("elipsis");
  }

  paginas.push(totalPaginas);

  return paginas;
};

const Administrador = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cantidadServicios, setCantidadServicios] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [versionListado, setVersionListado] = useState(0);

  useEffect(() => {
    let ignorar = false;

    const consultarAPI = async () => {
      const respuesta = await listarServicios({
        pagina,
        limite: LIMITE_SERVICIOS,
      });
      if (ignorar) return;

      if (respuesta?.status === 200) {
        const datos: ServiciosPaginados = await respuesta.json();
        if (ignorar) return;

        const totalPaginas = Math.max(
          1,
          Math.ceil(datos.cantidadServicios / LIMITE_SERVICIOS),
        );

        setCantidadServicios(datos.cantidadServicios);
        setServicios(datos.servicios);

        if (pagina > totalPaginas) {
          setPagina(totalPaginas);
        }
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
  }, [pagina, versionListado]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(cantidadServicios / LIMITE_SERVICIOS),
  );

  const paginas = generarPaginas(pagina, totalPaginas);

  const primerServicio =
    cantidadServicios === 0 ? 0 : (pagina - 1) * LIMITE_SERVICIOS + 1;
  const ultimoServicio = Math.min(
    pagina * LIMITE_SERVICIOS,
    cantidadServicios,
  );

  const recargarListado = () => {
    setVersionListado((version) => version + 1);
  };

  const irAPagina = (nuevaPagina: number) => {
    if (
      nuevaPagina === pagina ||
      nuevaPagina < 1 ||
      nuevaPagina > totalPaginas
    ) {
      return;
    }

    setPagina(nuevaPagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                  fila={(pagina - 1) * LIMITE_SERVICIOS + indice + 1}
                  setServicios={setServicios}
                  alEliminar={recargarListado}
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

      {/* Paginación */}
      {totalPaginas > 1 && (
        <nav
          aria-label="Paginación de servicios"
          className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800 pt-6"
        >
          <p
            aria-live="polite"
            className="text-sm text-zinc-400 text-center sm:text-left"
          >
            Mostrando{" "}
            <span className="text-zinc-100 font-semibold">
              {primerServicio}–{ultimoServicio}
            </span>{" "}
            de{" "}
            <span className="text-zinc-100 font-semibold">
              {cantidadServicios}
            </span>
            <span className="hidden sm:inline">
              {" "}
              · Página{" "}
              <span className="text-zinc-100 font-semibold">{pagina}</span> de{" "}
              <span className="text-zinc-100 font-semibold">
                {totalPaginas}
              </span>
            </span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <button
              type="button"
              onClick={() => irAPagina(pagina - 1)}
              disabled={pagina === 1}
              aria-label="Página anterior"
              className="flex h-9 items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800 px-2 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-3"
            >
              <LuChevronLeft />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            <div className="flex flex-wrap items-center justify-center gap-1">
              {paginas.map((elemento, indice) =>
                elemento === "elipsis" ? (
                  <span
                    key={`elipsis-${indice}`}
                    aria-hidden="true"
                    className="px-1 text-sm text-zinc-500"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={elemento}
                    type="button"
                    onClick={() => irAPagina(elemento)}
                    aria-label={`Ir a la página ${elemento}`}
                    aria-current={elemento === pagina ? "page" : undefined}
                    className={`h-9 min-w-9 rounded-lg border px-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      elemento === pagina
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    {elemento}
                  </button>
                ),
              )}
            </div>

            <button
              type="button"
              onClick={() => irAPagina(pagina + 1)}
              disabled={pagina === totalPaginas}
              aria-label="Página siguiente"
              className="flex h-9 items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800 px-2 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-3"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <LuChevronRight />
            </button>
          </div>
        </nav>
      )}
    </section>
  );
};

export default Administrador;
