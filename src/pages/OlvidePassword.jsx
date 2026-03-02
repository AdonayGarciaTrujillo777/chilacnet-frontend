import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function OlvidePassword() {
  const [correo, setCorreo] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!correo) return;

    setCargando(true);
    try {
      const respuesta = await fetch('http://localhost:3000/api/auth/olvide-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) throw new Error(datos.error || 'Error al procesar la solicitud');

      // ¡Alerta elegante de éxito!
      await Swal.fire({
        icon: 'success',
        title: '¡Correo enviado!',
        text: 'Si el correo está registrado, recibirás un enlace para cambiar tu contraseña en los próximos minutos.',
        confirmButtonColor: '#16a34a',
        confirmButtonText: 'Entendido'
      });

      // Lo regresamos al login para que espere su correo
      navigate('/'); 

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo enviar',
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
          Recuperación de contraseña
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-8 shadow-sm border border-gray-100 rounded-xl">
          
          <div className="mb-6 text-sm text-gray-600 text-center bg-blue-50 p-4 rounded-lg border border-blue-100">
            Ingresa tu correo electrónico registrado y te enviaremos instrucciones para restablecer tu acceso.
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="correo" className="block text-sm font-bold text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                id="correo"
                name="correo"
                type="email"
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="ej. tecnico@chilacnet.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={cargando}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {cargando ? 'Enviando correo...' : 'Enviar enlace de recuperación'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="font-medium text-gray-500 hover:text-blue-600 text-sm transition-colors">
              &larr; Volver al inicio de sesión
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default OlvidePassword;