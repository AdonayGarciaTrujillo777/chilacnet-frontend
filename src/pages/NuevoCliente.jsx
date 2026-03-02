import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function NuevoCliente() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // El estado inicial del formulario
  const [cliente, setCliente] = useState({
    nombre_completo: '',
    telefono: '',
    direccion: '',
    paquete_id: '1' // Por defecto seleccionamos el primer paquete
  });

  const handleChange = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const token = localStorage.getItem('token');
      const respuesta = await fetch('https://chilacnet-backend.onrender.com/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cliente)
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) throw new Error(datos.error || 'Error al guardar el cliente');

      // ¡NUEVA ALERTA ELEGANTE DE ÉXITO!
      await Swal.fire({
        icon: 'success',
        title: '¡Cliente guardado!',
        text: 'El nuevo contrato se ha registrado exitosamente en estado "En espera".',
        confirmButtonColor: '#16a34a',
        confirmButtonText: 'Ir al Directorio'
      });
      
      navigate('/dashboard');

    } catch (err) {
      // NUEVA ALERTA ELEGANTE DE ERROR
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: err.message,
        confirmButtonColor: '#d33'
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Registrar Nuevo Cliente</h1>
          <p className="text-gray-500 text-sm mt-1">Ingresa los datos del nuevo contrato. El estado inicial será "En espera".</p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
            <input 
              type="text" name="nombre_completo" value={cliente.nombre_completo} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej. María García" required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input 
              type="text" name="telefono" value={cliente.telefono} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej. 2381234567" required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de Instalación</label>
            <textarea 
              name="direccion" value={cliente.direccion} onChange={handleChange} rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Calle, Número, Colonia, Referencias..." required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paquete Contratado</label>
            <select 
              name="paquete_id" value={cliente.paquete_id} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <optgroup label="Internet Inalámbrico">
                <option value="1">Básico - $250.00</option>
                <option value="2">Recomendado - $350.00</option>
                <option value="3">Premium - $400.00</option>
              </optgroup>
              <optgroup label="Fibra Óptica">
                <option value="4">Básico - $250.00</option>
                <option value="5">Recomendado - $300.00</option>
                <option value="6">Premium - $400.00</option>
                <option value="7">Sin Límites - $500.00</option>
              </optgroup>
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={cargando}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:bg-blue-400"
            >
              {cargando ? 'Guardando...' : 'Guardar Cliente'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default NuevoCliente;