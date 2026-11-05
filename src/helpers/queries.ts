import type { Servicio } from "../interfaces/servicios";

const urlServicios = import.meta.env.VITE_SERVICIOS + "/servicios";

interface ParametrosListadoServicios {
  termino?: string;
  pagina?: number;
  limite?: number;
}

export const listarServicios = async (
  parametros: ParametrosListadoServicios = {},
) => {
  try {
    const parametrosBusqueda = new URLSearchParams();

    if (parametros.termino) {
      parametrosBusqueda.append("termino", parametros.termino);
    }
    if (parametros.pagina !== undefined) {
      parametrosBusqueda.append("pagina", parametros.pagina.toString());
    }
    if (parametros.limite !== undefined) {
      parametrosBusqueda.append("limite", parametros.limite.toString());
    }

    const consulta = parametrosBusqueda.toString();
    const respuesta = await fetch(
      consulta ? `${urlServicios}?${consulta}` : urlServicios,
    );
    return respuesta;
  } catch (error) {
    console.error(error);
  }
};

export const crearServicio = async (datos: Servicio) => {
  try {
    const respuesta = await fetch(urlServicios, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });
    return respuesta;
  } catch (error) {
    console.error(error);
  }
};

export const editarServicio = async (datos: Servicio, id: string) => {
  try {
    const respuesta = await fetch(urlServicios+ `/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });
    return respuesta;
  } catch (error) {
    console.error(error);
  }
};

export const buscarServicioPorId = async (id: string) => {
  try {
    const respuesta = await fetch(urlServicios+ `/${id}`);
    return respuesta;
  } catch (error) {
    console.error(error);
  }
};

export const borrarServicio = async (id: string) => {
  try {
    const respuesta = await fetch(urlServicios+ `/${id}`, {
      method: "DELETE"
    });
    return respuesta;
  } catch (error) {
    console.error(error);
  }
};
