import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importación del Layout
import Layout from './components/Layout';

// Importación de Páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NuevoCliente from './pages/NuevoCliente';
import Personal from './pages/Personal';
import NuevoEmpleado from './pages/NuevoEmpleado';
import Instalacion from './pages/Instalacion';
import DetallesCliente from './pages/DetallesCliente';
import OlvidePassword from './pages/OlvidePassword';  
import RestablecerPassword from './pages/RestablecerPassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública sin menú: Login */}
        <Route path="/" element={<Login />} />
        <Route path="/olvide-password" element={<OlvidePassword />} />
        <Route path="/restablecer-password/:token" element={<RestablecerPassword />} />
        
        {/* RUTAS PROTEGIDAS ADENTRO DEL MENÚ LATERAL */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/nuevo-cliente" element={<NuevoCliente />} />
          <Route path="/detalles-cliente" element={<DetallesCliente />} />
          <Route path="/instalacion" element={<Instalacion />} />
          <Route path="/personal" element={<Personal />} />
          <Route path="/nuevo-empleado" element={<NuevoEmpleado />} />
          
        </Route>
        
        {/* Ruta comodín */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;