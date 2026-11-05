import { useParams, useNavigate, Link } from "react-router";
import { useEffect, useState } from "react";
import { formatearPrecio } from "../../utils/formateador";
import type { Servicio } from "../../interfaces/servicios";
import { buscarServicioPorId } from "../../helpers/queries";
const DetalleServicio = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [servicio, setServicio] = useState<Servicio | null>(null);

  useEffect(() => {
    const obtenerServicio = async () => {
      if (!id) {
        // Si no existe el servicio, redirigir a 404
        navigate("/404", { replace: true });
      } else {
        const respuesta = await buscarServicioPorId(id);
        if (respuesta?.status === 200) {
          const datos = await respuesta.json();
          setServicio(datos);
        }
      }
    };
    obtenerServicio();
  }, [id, navigate]);

  if (!servicio) {
    return null;
  }

  return (
    <div className="max-w-xl mx-auto bg-zinc-900 rounded-lg shadow-lg p-8 mt-8">
      <h2 className="text-3xl font-bold mb-4 text-center">
        {servicio.nombreServicio}
      </h2>
      <img
        src={servicio.imagen}
        alt={servicio.nombreServicio}
        className="w-full h-64 object-cover rounded mb-4 border border-zinc-700"
      />
      <p className="text-lg mb-2">
        <span className="font-semibold">Precio: </span>
        {formatearPrecio(servicio.precio)}
      </p>
      <p className="text-lg mb-2">
        <span className="font-semibold">Categoría:</span> {servicio.categoria}
      </p>
      <p className="mb-4">
        <span className="font-semibold">Descripción:</span>{" "}
        {servicio.descripcion}
      </p>
      <Link
        to="/"
        className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded"
      >
        Volver
      </Link>
    </div>
  );
};

export default DetalleServicio;
