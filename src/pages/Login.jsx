import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <-- AÑADÍ "Link" AQUÍ

function Login() {
  const [credenciales, setCredenciales] = useState({
    username: '',
    password: ''
  });
  
  // Nuevo estado para mostrar errores en pantalla
  const [errorMensaje, setErrorMensaje] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredenciales({
      ...credenciales,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMensaje(''); // Limpiamos errores anteriores

    try {
      // 1. Hacemos la petición POST a tu Backend
      const respuesta = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credenciales) // Enviamos el usuario y contraseña
      });

      // 2. Convertimos la respuesta a JSON
      const datos = await respuesta.json();

      // 3. Verificamos si el backend nos devolvió un error (ej. credenciales incorrectas)
      if (!respuesta.ok) {
        throw new Error(datos.error || 'Error al conectar con el servidor');
      }

      // 4. ¡ÉXITO! Guardamos el gafete (Token) y los datos en la memoria del navegador
      localStorage.setItem('token', datos.token);
      localStorage.setItem('usuario', JSON.stringify(datos.usuario));

      // 5. Redirigimos al Dashboard
      navigate('/dashboard'); 

    } catch (error) {
      // Si hay error, lo mostramos en la pantalla
      setErrorMensaje(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight">
            Chilacnet
          </h1>
          <p className="text-gray-500 mt-2 text-sm uppercase tracking-wide font-semibold">
            Panel de Administración
          </p>
        </div>
        
        {/* Aquí mostramos el cuadro rojo de error si existe */}
        {errorMensaje && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p className="text-sm font-medium">{errorMensaje}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de Usuario
            </label>
            <input 
              type="text" 
              name="username"
              value={credenciales.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ej. admin o carlos_tec"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input 
              type="password" 
              name="password"
              value={credenciales.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
              required
            />
            
            {/* <-- AQUÍ CAMBIÉ LA ETIQUETA "a" POR "Link" --> */}
            <div className="text-right mt-2">
              <Link to="/olvide-password" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md"
          >
            Iniciar Sesión
          </button>
        </form>

      </div>
    </div>
  );
}

export default Login;