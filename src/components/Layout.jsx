import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));
  
  // NUEVO: Estado para controlar el menú en celulares
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  const isActive = (paths) => {
    return paths.some(path => location.pathname.includes(path));
  };

  // Función para que el menú se cierre solito en celular al elegir una opción
  const cerrarMenuMobile = () => setMenuAbierto(false);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* NUEVO: OVERLAY OSCURO PARA MÓVILES (Fondo semitransparente al abrir el menú) */}
      {menuAbierto && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setMenuAbierto(false)}
        ></div>
      )}

      {/* SIDEBAR (Ahora es responsivo: se esconde en móvil y se fija en PC) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${menuAbierto ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* LOGO DE LA EMPRESA */}
        <div className="h-20 flex justify-between items-center px-6 border-b border-gray-100">
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">Chilacnet</h1>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Panel {usuarioGuardado?.rol}
            </span>
          </div>
          {/* Botón X para cerrar en móvil */}
          <button onClick={() => setMenuAbierto(false)} className="md:hidden text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* MENÚ DE NAVEGACIÓN */}
        <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">
          <Link
            to="/dashboard"
            onClick={cerrarMenuMobile}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              isActive(['/dashboard', '/nuevo-cliente', '/detalles-cliente', '/instalacion'])
                ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            Directorio Clientes
          </Link>

          {usuarioGuardado?.rol === 'administrador' && (
            <Link
              to="/personal"
              onClick={cerrarMenuMobile}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive(['/personal', '/nuevo-empleado'])
                  ? 'bg-purple-50 text-purple-700 shadow-sm ring-1 ring-purple-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Gestión de Personal
            </Link>
          )}
        </nav>

        {/* PERFIL DE USUARIO Y BOTÓN DE SALIR */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 px-4 py-3 mb-3 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shadow-inner shrink-0">
              {usuarioGuardado?.nombre_completo?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-800 truncate">{usuarioGuardado?.nombre_completo}</p>
              <p className="text-xs text-gray-500 truncate">@{usuarioGuardado?.username}</p>
            </div>
          </div>
          
          <button
            onClick={cerrarSesion}
            className="w-full flex items-center justify-center gap-2 bg-white border border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 font-bold px-4 py-2.5 rounded-xl transition-all duration-200 text-sm shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* COLUMNA DERECHA (Barra superior móvil + Contenido) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* NUEVO: HEADER MÓVIL (Solo aparece en celulares) */}
        <header className="md:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 shrink-0 z-30 shadow-sm">
          <h1 className="text-xl font-extrabold text-blue-600 tracking-tight">Chilacnet</h1>
          {/* Botón de Hamburguesa */}
          <button 
            onClick={() => setMenuAbierto(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </header>

        {/* ÁREA CENTRAL */}
        <main className="flex-1 overflow-y-auto relative bg-gray-50/30">
          <Outlet /> 
        </main>
      </div>

    </div>
  );
}

export default Layout;