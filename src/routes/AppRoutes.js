import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Empresas from "../pages/Empresas/Empresas";
import Projetos from "../pages/Projetos/Projetos";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/empresas" element={<Empresas />} />
      <Route path="/projetos" element={<Projetos />} />
    </Routes>
  );
}

export default AppRoutes;