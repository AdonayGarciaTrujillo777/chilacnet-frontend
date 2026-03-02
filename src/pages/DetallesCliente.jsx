import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

function DetallesCliente() {
  const navigate = useNavigate();
  const location = useLocation();
  const clienteSeleccionado = location.state?.cliente;

  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cliente, setCliente] = useState(clienteSeleccionado || {});
  
  // Estados para manejar las fotos
  const [fotoArchivo, setFotoArchivo] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState(null);
  const [quitarFoto, setQuitarFoto] = useState(false); // NUEVO: Para saber si el usuario quiere borrar la foto actual

  useEffect(() => {
    if (!clienteSeleccionado) {
      navigate('/dashboard');
    }
  }, [clienteSeleccionado, navigate]);

  if (!clienteSeleccionado) return null;

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoArchivo(file);
      setVistaPrevia(URL.createObjectURL(file));
      setQuitarFoto(false); // Si elige una foto nueva, cancelamos la orden de "quitar foto"
    }
  };

  // NUEVO: Función para ver la foto en grande usando SweetAlert2
  const verFotoEnGrande = (url) => {
    if (!url) return;
    Swal.fire({
      imageUrl: url,
      imageAlt: 'Evidencia de Instalación',
      showCloseButton: true,
      showConfirmButton: false,
      width: 'auto',
      padding: '1em',
      background: '#fff',
      backdrop: `rgba(0,0,0,0.8)` // Fondo oscuro elegante
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const token = localStorage.getItem('token');
      let urlFotoFinal = cliente.foto_domicilio_url;

      // Si el usuario le dio al botón de "Quitar foto", la vaciamos
      if (quitarFoto) {
        urlFotoFinal = null; 
      }

      // Si eligieron un archivo nuevo, lo subimos
      if (fotoArchivo) {
        const formData = new FormData();
        formData.append('foto', fotoArchivo);

        const uploadRes = await fetch('http://localhost:3000/api/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || 'Error al subir la imagen');
        
        urlFotoFinal = uploadData.url;
      }

      const datosParaGuardar = {
        ...cliente,
        foto_domicilio_url: urlFotoFinal
      };

      const respuesta = await fetch(`http://localhost:3000/api/clientes/${cliente.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosParaGuardar)
      });

      if (!respuesta.ok) throw new Error('Error al actualizar el cliente');

      // Actualizamos todo a la normalidad
      setCliente(datosParaGuardar);
      setModoEdicion(false);
      setFotoArchivo(null);
      setVistaPrevia(null);
      setQuitarFoto(false);

      Swal.fire({
        icon: 'success',
        title: '¡Datos Actualizados!',
        text: 'La información del cliente se guardó correctamente.',
        confirmButtonColor: '#16a34a',
        timer: 2000
      });

    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: err.message,
        confirmButtonColor: '#d33'
      });
    } finally {
      setCargando(false);
    }
  };

  // Validar URL
  const esUrlValida = (url) => {
    return url && typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'));
  };

  // Lógica para saber qué foto mostrar en el recuadro
  const urlAMostrar = vistaPrevia || (!quitarFoto && esUrlValida(cliente.foto_domicilio_url) ? cliente.foto_domicilio_url : null);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Detalles del Cliente</h1>
            <p className="text-gray-500 text-sm">Contrato: {cliente.id}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/dashboard')} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Volver</button>
            <button 
              onClick={() => {
                setModoEdicion(!modoEdicion);
                setFotoArchivo(null);
                setVistaPrevia(null);
                setQuitarFoto(false); // Reseteamos por si cancela la edición
              }} 
              className={`px-4 py-2 text-white rounded-lg transition-colors shadow-sm ${modoEdicion ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {modoEdicion ? 'Cancelar Edición' : 'Editar Datos'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold border-b pb-2 mb-4">Información General</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                  <input type="text" name="nombre_completo" value={cliente.nombre_completo} onChange={handleChange} disabled={!modoEdicion} className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input type="text" name="telefono" value={cliente.telefono} onChange={handleChange} disabled={!modoEdicion} className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <textarea name="direccion" value={cliente.direccion} onChange={handleChange} disabled={!modoEdicion} className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50" rows="2"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select name="estado" value={cliente.estado} onChange={handleChange} disabled={!modoEdicion} className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50">
                    <option value="en espera">En Espera</option>
                    <option value="activo">Activo</option>
                    <option value="suspendido">Suspendido</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paquete de Internet</label>
                  <select 
                    name="paquete_id" 
                    value={cliente.paquete_id || ''} 
                    onChange={handleChange} 
                    disabled={!modoEdicion} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Selecciona un paquete...</option>
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
              </div>

              <h2 className="text-lg font-bold border-b pb-2 mt-6 mb-4">Datos del Módem / Instalación</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección MAC</label>
                  <input type="text" name="mac_modem" value={cliente.mac_modem || ''} onChange={handleChange} disabled={!modoEdicion} className="w-full px-3 py-2 border rounded-lg font-mono disabled:bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Instalación</label>
                  <input type="date" name="fecha_instalacion" value={cliente.fecha_instalacion ? new Date(cliente.fecha_instalacion).toISOString().split('T')[0] : ''} onChange={handleChange} disabled={!modoEdicion} className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Red WiFi (SSID)</label>
                  <input type="text" name="nombre_red_modem" value={cliente.nombre_red_modem || ''} onChange={handleChange} disabled={!modoEdicion} className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña WiFi</label>
                  <input type={modoEdicion ? "text" : "password"} name="password_modem" value={cliente.password_modem || ''} onChange={handleChange} disabled={!modoEdicion} className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50 font-mono" />
                </div>
              </div>

              {modoEdicion && (
                <div className="pt-4 flex justify-end">
                  <button type="submit" disabled={cargando} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm transition-all">
                    {cargando ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              )}
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <h2 className="text-lg font-bold border-b pb-2 mb-4">Evidencia Fotográfica</h2>
            
            {/* Contenedor de la Imagen */}
            <div className="flex-1 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center bg-gray-50 overflow-hidden min-h-[250px] relative group">
              
              {urlAMostrar ? (
                <>
                  <img 
                    src={urlAMostrar} 
                    alt="Evidencia" 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" 
                    onClick={() => verFotoEnGrande(urlAMostrar)}
                    title="Clic para ver en grande"
                  />
                  {/* Botón flotante para ver en grande (aparece al pasar el ratón) */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">🔍 Ver en grande</span>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-400 p-4">
                  <span className="text-4xl block mb-2">📷</span>
                  <p className="text-sm">Sin foto registrada</p>
                </div>
              )}

            </div>

            {/* Controles de Edición de Foto */}
            {modoEdicion && (
              <div className="mt-4 space-y-3">
                
                {/* Botón rojo para eliminar la foto actual */}
                {urlAMostrar && (
                  <button 
                    type="button"
                    onClick={() => {
                      setQuitarFoto(true);
                      setFotoArchivo(null);
                      setVistaPrevia(null);
                    }}
                    className="w-full px-3 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    🗑️ Eliminar foto actual
                  </button>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Subir Nueva Fotografía</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-xs file:font-bold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100 cursor-pointer" 
                  />
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default DetallesCliente;