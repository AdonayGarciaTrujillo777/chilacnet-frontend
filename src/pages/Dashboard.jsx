import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  
  // NUEVO: Estado para saber qué filtro está activo (por defecto mostramos 'todos')
  const [filtroEstado, setFiltroEstado] = useState('todos');

  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const respuesta = await fetch('http://localhost:3000/api/clientes', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!respuesta.ok) throw new Error('Error al obtener los clientes');

        const datos = await respuesta.json();
        setClientes(datos);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerClientes();
  }, [navigate]);

  // 1. Le damos una calificación/prioridad a cada estado
  const prioridadEstados = {
    'en espera': 1, // Prioridad Máxima (Aparecen primero)
    'activo': 2,
    'suspendido': 3,
    'cancelado': 4  // Prioridad Mínima (Aparecen al final)
  };

  // 2. Filtramos combinando el Buscador de texto + Los botones de estado
  const clientesFiltrados = clientes
    .filter(cliente => {
      // Condición 1: ¿Coincide con el texto escrito?
      const termino = busqueda.toLowerCase();
      const coincideNombre = cliente.nombre_completo.toLowerCase().includes(termino);
      const fecha = new Date(cliente.fecha_creacion).toISOString().split('T')[0];
      const coincideFecha = fecha.includes(termino);
      const pasaBusqueda = coincideNombre || coincideFecha;

      // Condición 2: ¿Coincide con el botón de filtro seleccionado?
      const pasaEstado = filtroEstado === 'todos' || cliente.estado?.toLowerCase() === filtroEstado;

      return pasaBusqueda && pasaEstado;
    })
    .sort((a, b) => {
      // Ordenamos por prioridad
      const pesoA = prioridadEstados[a.estado?.toLowerCase()] || 5;
      const pesoB = prioridadEstados[b.estado?.toLowerCase()] || 5;
      return pesoA - pesoB;
    });

  // Función para darle color al botón activo dependiendo de qué estado sea
  const obtenerClaseBotonFiltro = (estado) => {
    const claseBase = "px-4 py-1.5 text-xs font-bold rounded-full capitalize border transition-all duration-200 shadow-sm whitespace-nowrap ";
    
    if (filtroEstado !== estado) {
      return claseBase + "bg-white text-gray-500 border-gray-200 hover:bg-gray-100";
    }

    switch(estado) {
      case 'todos': return claseBase + "bg-gray-800 text-white border-gray-800 ring-2 ring-gray-200";
      case 'en espera': return claseBase + "bg-yellow-50 text-yellow-700 border-yellow-200 ring-2 ring-yellow-100";
      case 'activo': return claseBase + "bg-green-50 text-green-700 border-green-200 ring-2 ring-green-100";
      case 'suspendido': return claseBase + "bg-red-50 text-red-700 border-red-200 ring-2 ring-red-100";
      case 'cancelado': return claseBase + "bg-gray-100 text-gray-700 border-gray-300 ring-2 ring-gray-200";
      default: return claseBase;
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* ENCABEZADO PRINCIPAL */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Directorio de Clientes</h1>
            <p className="text-gray-500 text-sm mt-1">Gestiona los contratos, estados e instalaciones.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-4">
            <div className="relative w-full sm:w-72 md:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input 
                type="text" 
                placeholder="Buscar nombre o fecha..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
              />
            </div>

            <button onClick={() => navigate('/nuevo-cliente')} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm whitespace-nowrap">
              + Nuevo Cliente
            </button>
          </div>
        </div>

        {/* NUEVO: BOTONES DE FILTROS RÁPIDOS */}
        <div className="flex flex-wrap gap-2 mb-8 items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-sm font-semibold text-gray-500 mr-2 ml-1">Filtros:</span>
          {['todos', 'en espera', 'activo', 'suspendido', 'cancelado'].map((estado) => (
            <button
              key={estado}
              onClick={() => setFiltroEstado(estado)}
              className={obtenerClaseBotonFiltro(estado)}
            >
              {estado}
            </button>
          ))}
        </div>

        {/* ÁREA DE TARJETAS */}
        <div className="bg-transparent">
          {cargando && <p className="text-gray-500 text-center py-4">Cargando clientes...</p>}
          {error && <p className="text-red-500 text-center py-4">{error}</p>}
          
          {!cargando && clientesFiltrados.length === 0 && !error && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <p className="text-gray-500 text-lg">
                {busqueda || filtroEstado !== 'todos' 
                  ? 'No se encontraron clientes que coincidan con estos filtros.' 
                  : 'Aún no hay clientes registrados en el sistema.'}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientesFiltrados.map((cliente) => (
              <div key={cliente.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 bg-white relative overflow-hidden flex flex-col justify-between group">
                
                <div>
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 ${
                    cliente.estado === 'activo' ? 'bg-green-500' :
                    cliente.estado === 'en espera' ? 'bg-yellow-400' :
                    cliente.estado === 'suspendido' ? 'bg-red-500' : 'bg-gray-400'
                  }`}></div>

                  <div className="flex justify-between items-start mb-4 pl-3">
                    <h3 className="font-extrabold text-gray-800 text-lg truncate pr-2" title={cliente.nombre_completo}>
                      {cliente.nombre_completo}
                    </h3>
                    <span className={`px-2.5 py-1 text-[10px] uppercase font-black tracking-wider rounded-lg shrink-0 ${
                      cliente.estado === 'activo' ? 'bg-green-50 text-green-700 border border-green-200' :
                      cliente.estado === 'en espera' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                      cliente.estado === 'suspendido' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-gray-50 text-gray-700 border border-gray-200'
                    }`}>
                      {cliente.estado}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-500 pl-3">
                    <p className="flex items-center gap-2">📞 {cliente.telefono}</p>
                    <p className="flex items-center gap-2 truncate" title={cliente.direccion}>📍 {cliente.direccion}</p>
                    <p className="text-xs text-gray-400 mt-2 font-medium">📅 Registro: {new Date(cliente.fecha_creacion).toLocaleDateString()}</p>
                    
                    {cliente.estado === 'activo' && cliente.mac_modem && (
                      <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-600 bg-gray-50/50 p-3 rounded-lg">
                        <p className="font-mono font-semibold">MAC: {cliente.mac_modem}</p>
                        <p className="mt-1">Red: <span className="font-semibold">{cliente.nombre_red_modem}</span></p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pl-3 space-y-2">
                  {cliente.estado === 'en espera' && (
                    <button 
                      onClick={() => navigate('/instalacion', { state: { cliente } })}
                      className="w-full bg-green-50 border border-green-200 text-green-700 hover:bg-green-600 hover:text-white font-bold py-2.5 rounded-xl transition-all text-sm shadow-sm"
                    >
                      🔧 Reportar Instalación
                    </button>
                  )}
                  
                  <button 
                    onClick={() => navigate('/detalles-cliente', { state: { cliente } })}
                    className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 font-bold py-2.5 rounded-xl transition-all text-sm shadow-sm"
                  >
                    👁️ Ver Detalles / Editar
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;