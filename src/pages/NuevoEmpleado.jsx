import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function NuevoEmpleado() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const [empleado, setEmpleado] = useState({
    nombre_completo: '',
    username: '',
    correo: '',
    password: '',
    rol: 'tecnico', 
    direccion: '',
    rfc: ''
  });

  const handleChange = (e) => {
    setEmpleado({ ...empleado, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const token = localStorage.getItem('token');
      // Asegúrate de que esta URL sea la que usas en tu proyecto
      const respuesta = await fetch('http://localhost:3000/api/auth/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(empleado)
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) throw new Error(datos.error || 'Error al registrar al empleado');

      // ¡NUEVA ALERTA ELEGANTE DE ÉXITO!
      await Swal.fire({
        icon: 'success',
        title: '¡Personal registrado!',
        text: 'El empleado ha sido guardado exitosamente y ya puede iniciar sesión.',
        confirmButtonColor: '#16a34a', // Verde
        confirmButtonText: 'Ir a Gestión'
      });
      
      navigate('/personal');

    } catch (err) {
      // NUEVA ALERTA ELEGANTE DE ERROR
      Swal.fire({
        icon: 'error',
        title: 'No se pudo registrar',
        text: err.message,
        confirmButtonColor: '#d33'
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        
        <div className="mb-8 border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Registrar Nuevo Personal</h1>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 mb-6 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
              <input type="text" name="nombre_completo" value={empleado.nombre_completo} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              {/* Aquí puedes ver que no hay ningún límite de longitud */}
              <input type="email" name="correo" value={empleado.correo} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <input type="text" name="username" value={empleado.username} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña temporal</label>
              <input type="text" name="password" value={empleado.password} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select name="rol" value={empleado.rol} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-white">
                <option value="tecnico">Técnico Instalador</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
          </div>

          {/* Aquí está el campo del RFC que pediste */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RFC</label>
              <input type="text" name="rfc" value={empleado.rfc} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg uppercase" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección (Opcional)</label>
              <input type="text" name="direccion" value={empleado.direccion} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={() => navigate('/personal')} className="px-6 py-2 border rounded-lg">Cancelar</button>
            <button type="submit" disabled={cargando} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NuevoEmpleado;