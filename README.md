# Chilacnet — Frontend

Interfaz web para la gestión de clientes, instalaciones, personal y evidencias fotográficas del servicio de internet.

## Tecnologías

- **React** 19  
- **Vite** 7  
- **React Router** 7  
- **Tailwind CSS** 4  
- **SweetAlert2** (alertas y confirmaciones)

## Requisitos

- **Node.js** 18 o superior  
- **npm** (incluido con Node)

## Instalación

```bash
npm install
```

## Configuración de la API

Las peticiones HTTP en este proyecto apuntan por defecto a la API desplegada en producción:

`https://chilacnet-backend.onrender.com`

Esa URL está definida en los archivos de las páginas (`src/pages/*.jsx`). Para desarrollo local contra un backend en `http://localhost:3000`, hay que sustituir esa base URL en esos `fetch` o centralizarla en una variable (por ejemplo `import.meta.env.VITE_API_URL`) y crear un archivo `.env` en la raíz del frontend:

```env
VITE_API_URL=http://localhost:3000
```

*(Requiere ajustar el código para usar `VITE_API_URL`; ver documentación técnica del proyecto.)*

## Scripts

| Comando        | Descripción                          |
|----------------|--------------------------------------|
| `npm run dev`  | Servidor de desarrollo (Vite)        |
| `npm run build`| Compilación para producción          |
| `npm run preview` | Vista previa del build local     |
| `npm run lint` | Análisis ESLint                      |

## Desarrollo

```bash
npm run dev
```

Por defecto la aplicación queda disponible en **http://localhost:5173** (o el puerto que indique la consola).

## Despliegue (referencia)

La interfaz puede desplegarse en **Vercel** u otro hosting estático; el build se genera con `npm run build` y la carpeta resultante es `dist/`.

## Proyecto académico

Desarrollado en el marco de prácticas profesionales — Chilacnet.
