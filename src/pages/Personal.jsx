import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // <-- NUEVA IMPORTACIÓN

function Personal() {
  const navigate = useNavigate();
  const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);

  const esAdmin = usuarioGuardado?.rol?.toLowerCase() === 'administrador';

  useEffect(() => {
    if (!esAdmin) {
      // Alerta elegante de error
      Swal.fire({
        icon: 'error',
        title: 'Acceso Denegado',
        text: 'Esta área es solo para administradores.',
        confirmButtonColor: '#3085d6'
      });
      navigate('/dashboard');
    }
  }, [navigate, esAdmin]);

  useEffect(() => {
    const obtenerPersonal = async () => {
      try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch('http://localhost:3000/api/auth/personal', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (respuesta.ok) {
          const datos = await respuesta.json();
          setEmpleados(datos);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setCargando(false);
      }
    };

    if (esAdmin) {
      obtenerPersonal();
    }
  }, [esAdmin]);

  const eliminarEmpleado = async (id, nombre) => {
    // NUEVO: Modal de Confirmación Elegante
    const resultado = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a eliminar permanentemente a ${nombre}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true // Pone el botón de cancelar a la izquierda (mejor UX)
    });

    if (!resultado.isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      const respuesta = await fetch(`http://localhost:3000/api/auth/personal/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (respuesta.ok) {
        setEmpleados(empleados.filter(emp => emp.id !== id));
        // Alerta de éxito
        Swal.fire({
          icon: 'success',
          title: '¡Eliminado!',
          text: `El acceso de ${nombre} ha sido revocado.`,
          showConfirmButton: false,
          timer: 2000 // Se cierra solita en 2 segundos
        });
      } else {
        Swal.fire('Error', 'Hubo un problema al eliminar el empleado.', 'error');
      }
    } catch (err) {
      Swal.fire('Error de conexión', 'No se pudo contactar con el servidor.', 'error');
    }
  };

  if (!esAdmin) return null;

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Personal</h1>
            <p className="text-gray-500 text-sm">Administra los accesos de técnicos y administradores.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/nuevo-empleado')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm">
              + Nuevo Empleado
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                  <th className="p-4 font-semibold">Nombre</th>
                  <th className="p-4 font-semibold">Usuario</th>
                  <th className="p-4 font-semibold">Rol</th>
                  <th className="p-4 font-semibold">Contacto</th>
                  <th className="p-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {cargando ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500">Cargando personal...</td></tr>
                ) : (
                  empleados.map(emp => (
                    <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-800">{emp.nombre_completo}</td>
                      <td className="p-4 text-gray-600">@{emp.username}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full capitalize ${
                          emp.rol?.toLowerCase() === 'administrador' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {emp.rol}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        <div>{emp.correo}</div>
                        {emp.telefono && <div className="text-xs text-gray-400 mt-1">{emp.telefono}</div>}
                      </td>
                      <td className="p-4 text-center">
                        {emp.id !== usuarioGuardado.id && (
                          <button 
                            onClick={() => eliminarEmpleado(emp.id, emp.nombre_completo)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition-colors font-medium"
                          >
                            Eliminar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Personal;