import Administrador from "./components/pages/Administrador";
import Inicio from "./components/pages/Inicio";
import DetalleServicio from "./components/pages/DetalleServicio";
import Footer from "./components/shared/Footer";
import Menu from "./components/shared/Menu";
import Error404 from "./components/pages/Error404";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./components/pages/Login";
import FormularioServicio from "./components/pages/FormularioServicio";
import ProtectorRutas from "./components/routes/ProtectorRutas";
import { useEffect, useState } from "react";
import { AppContext } from "./context/AppContext";


function App() {
  const usuarioSessionStorage = JSON.parse(
    sessionStorage.getItem("usuarioKey") || "false",
  );
  const [usuarioLogueado, setUsuarioLogueado] = useState<boolean>(
    usuarioSessionStorage,
  );
  // agregamos los servicios
  // const serviciosLocalStorage = JSON.parse(
  //   localStorage.getItem("serviciosKey") || "[]",
  // );

  useEffect(() => {
    sessionStorage.setItem("usuarioKey", JSON.stringify(usuarioLogueado));
  }, [usuarioLogueado]);

  // useEffect(() => {
  //   localStorage.setItem("serviciosKey", JSON.stringify(servicios));
  // }, [servicios]);

  return (
    <AppContext.Provider
      value={{
        usuarioLogueado,
        setUsuarioLogueado,
      }}
    >
      <BrowserRouter>
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
          <Menu></Menu>
          <main className="grow container mx-auto my-4 px-4 py-8">
            <Routes>
              <Route path="/" element={<Inicio></Inicio>}></Route>
              <Route path="/login" element={<Login></Login>}></Route>
              <Route
                path="/detalle-servicio/:id"
                element={<DetalleServicio></DetalleServicio>}
              ></Route>
              <Route path="/administrador" element={<ProtectorRutas />}>
                <Route index element={<Administrador />} />
                <Route
                  path="crear"
                  element={
                    <FormularioServicio
                      titulo={"Crear Servicio"}
                    ></FormularioServicio>
                  }
                />
                <Route
                  path="editar/:id"
                  element={
                    <FormularioServicio
                      titulo={"Editar Servicio"}
                    ></FormularioServicio>
                  }
                />
              </Route>
              <Route path="*" element={<Error404></Error404>}></Route>
            </Routes>
          </main>
          <Footer></Footer>
        </div>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
