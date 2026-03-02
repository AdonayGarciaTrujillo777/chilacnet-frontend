import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function RestablecerPassword() {
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  
  const navigate = useNavigate();
  // useParams atrapa el "código secreto" que viene en el enlace del correo
  const { token } = useParams(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación 1: Que las contraseñas coincidan
    if (password !== confirmarPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Las contraseñas no coinciden',
        text: 'Asegúrate de escribir exactamente la misma contraseña en ambos campos.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    // Validación 2: Que sea un poco segura
    if (password.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Contraseña muy corta',
        text: 'La nueva contraseña debe tener al menos 6 caracteres.',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    setCargando(true);
    try {
      // Mandamos la nueva contraseña y el token al backend
      const respuesta = await fetch(`https://chilacnet-backend.onrender.com/api/auth/restablecer-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevaPassword: password })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) throw new Error(datos.error || 'Error al procesar la solicitud');

      // ¡Alerta elegante de éxito!
      await Swal.fire({
        icon: 'success',
        title: '¡Contraseña actualizada!',
        text: 'Tu contraseña se ha cambiado con éxito. Ya puedes iniciar sesión.',
        confirmButtonColor: '#16a34a'
      });

      // Lo regresamos al Login
      navigate('/'); 

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Enlace inválido o caducado',
        text: error.message,
        confirmButtonColor: '#d33'
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-600">
          Chilacnet
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 font-medium">
          Crea tu nueva contraseña
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-8 shadow-sm border border-gray-100 rounded-xl">
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Nueva Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                required
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={cargando}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {cargando ? 'Guardando...' : 'Restablecer Contraseña'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="font-medium text-gray-500 hover:text-blue-600 text-sm transition-colors">
              &larr; Cancelar y volver al inicio
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default RestablecerPassword;