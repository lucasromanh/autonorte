# AutoNorte

Plataforma de compra y venta de autos enfocada en el norte argentino (Salta, Jujuy, Tucumán).

## Características

- **Registro y autenticación**: Login/registro básico con usuario, email y contraseña.
- **Publicación de vehículos**: Los usuarios pueden publicar autos con fotos, descripción y precio.
- **Aprobación de contenido**: Los administradores aprueban o rechazan publicaciones.
- **Ofertas y reseñas**: Sistema de ofertas entre compradores y vendedores, con reseñas.
- **PWA**: Aplicación web progresiva con service worker para funcionamiento offline.
- **Responsive**: Diseño adaptativo con modo oscuro.

## Tecnologías

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: PHP + MySQL
- **PWA**: Service Worker + Manifest

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/autonorte.git
   cd autonorte
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura el backend:

   - Crea un archivo `.env` en la raíz del proyecto
   - Agrega tu dominio de Hostinger:
     ```
     VITE_API_BASE_URL=https://tu-dominio-hostinger.com/api
     ```
   - Asegúrate de que tu backend PHP esté configurado en Hostinger

4. Configura la base de datos MySQL en Hostinger con las tablas necesarias.

5. Ejecuta el proyecto:
   ```bash
   npm run dev
   ```

## Estructura del Proyecto

```
src/
├── components/
│   ├── auth/          # Componentes de autenticación
│   ├── cars/          # Componentes relacionados con autos
│   ├── admin/         # Componentes de administración
│   ├── ui/            # Componentes reutilizables
│   └── layout/        # Layout y navegación
├── pages/             # Páginas de la aplicación
├── context/           # Contextos de React
├── hooks/             # Hooks personalizados
├── services/          # Servicios para API
├── utils/             # Utilidades y helpers
└── assets/            # Imágenes y recursos
api/                   # Backend PHP
```

## Futuras Integraciones

- Integración de pagos (MercadoPago, PayPal)
- Chat directo entre comprador y vendedor
- Filtros avanzados
- Soporte multilenguaje
- Notificaciones push

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
