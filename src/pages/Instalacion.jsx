import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

function Instalacion() {
  const navigate = useNavigate();
  const location = useLocation();
  const clienteSeleccionado = location.state?.cliente;

  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  
  // NUEVO: Estados para manejar el archivo físico y su vista previa
  const [fotoArchivo, setFotoArchivo] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState(null);

  const [datosInstalacion, setDatosInstalacion] = useState(
    clienteSeleccionado ? {
      ...clienteSeleccionado,
      mac_modem: '',
      nombre_red_modem: '',
      password_modem: '',
      fecha_instalacion: new Date().toISOString().split('T')[0],
      estado: 'activo'
    } : {}
  );

  useEffect(() => {
    if (!clienteSeleccionado) {
      navigate('/dashboard');
    }
  }, [clienteSeleccionado, navigate]);

  if (!clienteSeleccionado) return null;

  const handleChange = (e) => {
    setDatosInstalacion({ ...datosInstalacion, [e.target.name]: e.target.value });
  };

  // NUEVO: Función para manejar cuando el usuario selecciona una imagen
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoArchivo(file);
      // Creamos una URL temporal para que el usuario vea la foto que eligió
      setVistaPrevia(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación: Obligar a subir la foto
    if (!fotoArchivo && !datosInstalacion.foto_domicilio_url) {
      Swal.fire({
        icon: 'warning',
        title: 'Foto requerida',
        text: 'Por favor, selecciona una fotografía del domicilio antes de continuar.',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    setError('');
    setCargando(true);

    try {
      const token = localStorage.getItem('token');
      let urlFotoFinal = datosInstalacion.foto_domicilio_url;

      // PASO 1: Si hay un archivo seleccionado, lo subimos primero al servidor
      if (fotoArchivo) {
        const formData = new FormData();
        formData.append('foto', fotoArchivo); // 'foto' es el nombre que espera multer en el backend

        const uploadRes = await fetch('https://chilacnet-backend.onrender.com/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
            // OJO: No se pone 'Content-Type' cuando usamos FormData, el navegador lo hace solo
          },
          body: formData
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) throw new Error(uploadData.error || 'Error al subir la imagen');
        
        // Guardamos la URL real que nos devolvió el servidor
        urlFotoFinal = uploadData.url;
      }

      // PASO 2: Guardamos los datos de la instalación con la URL de la foto ya incluida
      const datosParaGuardar = {
        ...datosInstalacion,
        foto_domicilio_url: urlFotoFinal
      };

      const respuesta = await fetch(`https://chilacnet-backend.onrender.com/api/clientes/${clienteSeleccionado.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosParaGuardar)
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) throw new Error(datos.error || 'Error al guardar la instalación');

      await Swal.fire({
        icon: 'success',
        title: '¡Instalación Completada!',
        text: `El servicio de ${clienteSeleccionado.nombre_completo} ahora está Activo.`,
        confirmButtonColor: '#16a34a',
        confirmButtonText: 'Volver al Directorio'
      });
      
      navigate('/dashboard'); 

    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Ocurrió un error',
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
        
        <div className="mb-8 border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Reporte de Instalación</h1>
          <p className="text-gray-500 text-sm mt-1">
            Completando servicio para: <span className="font-bold text-blue-600">{clienteSeleccionado.nombre_completo}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección MAC del Módem</label>
              <input type="text" name="mac_modem" value={datosInstalacion.mac_modem} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg font-mono uppercase" placeholder="Ej. A1:B2:C3:D4:E5:F6" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Instalación</label>
              <input type="date" name="fecha_instalacion" value={datosInstalacion.fecha_instalacion} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Red (SSID)</label>
              <input type="text" name="nombre_red_modem" value={datosInstalacion.nombre_red_modem} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="Ej. Chilacnet_Familia" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña del WiFi</label>
              <input type="text" name="password_modem" value={datosInstalacion.password_modem} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="Contraseña asignada..." required />
            </div>
          </div>

          {/* NUEVO: Zona de subida de imagen con vista previa */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
            <label className="block text-sm font-bold text-gray-700 mb-4">Evidencia Fotográfica (Fachada / Instalación)</label>
            
            {vistaPrevia && (
              <div className="mb-4 flex justify-center">
                <img src={vistaPrevia} alt="Vista previa" className="h-48 rounded-lg object-cover shadow-sm border border-gray-200" />
              </div>
            )}

            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100 cursor-pointer" 
            />
          </div>

          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm flex items-center gap-3">
            <span>ℹ️</span>
            <p>Al guardar este formulario, el estado del cliente cambiará automáticamente a <b>Activo</b>.</p>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={cargando} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors">
              {cargando ? 'Subiendo datos y foto...' : 'Completar Instalación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Instalacion;