# CiensMart - Aplicación de Comercio Electrónico 🛒

**CiensMart** es un Producto Mínimo Viable (MVP) de comercio electrónico moderno y completamente funcional desarrollado para la Facultad de Ciencias de la UCV. Ofrece una experiencia de compra fluida desde la navegación de productos hasta el pago seguro, construido con servicios backend locales simulados e integración de pagos en tiempo real.

## 🚀 Características Principales

### 🛍️ Experiencia de Compra
-   **Catálogo de Productos**: Navega por una amplia gama de productos con filtrado avanzado (Categoría, Precio, Marca, Color).
-   **Búsqueda Inteligente**: Funcionalidad de búsqueda de productos en tiempo real.
-   **Carrito de Compras**: Gestión de carrito persistente con cálculos de totales instantáneos.
-   **Lista de Deseos**: Guarda tus artículos favoritos para más tarde.

### 💳 Proceso de Pago y Facturación
-   **Checkout Simplificado**: Proceso de pago optimizado en una sola página.
-   **Integración de Pasarela de Pagos**: Procesamiento seguro de tarjetas de crédito a través de la API de **Bancobsidiana**.
-   **Diseño Resiliente**: Opción de respaldo "Comprar ahora, Pagar después" si los servicios de pago no están disponibles.
-   **Rastreo de Pedidos**: Confirmación inmediata del pedido con IDs de Transacción únicos.

### 👤 Gestión de Cuentas de Usuario
-   **Panel de Control Dinámico**: Vista general visual del perfil y actividades del usuario.
-   **Historial de Pedidos**: Lista completa de pedidos anteriores con seguimiento de estado (Pendiente/Pagado).
-   **Autenticación**: Flujo simulado de Inicio de Sesión/Registro con persistencia de sesión.

### 🛠️ Aspectos Técnicos Destacados
-   **Simulación de Backend Local**: Emulación completa de base de datos usando `localStorage` (No requiere BD externa para la demostración).
-   **Hooks Personalizados**: Hooks especializados como `useLocalQuery` para la obtención eficiente de datos.
-   **Diseño Responsivo**: Arquitectura mobile-first asegurando usabilidad en todos los dispositivos.
-   **Marca Consistente**: Uso unificado de logo y tema en todas las vistas de la aplicación.

---

## 🛠️ Stack Tecnológico

-   **Framework**: [Next.js](https://nextjs.org/) (Framework de React)
-   **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
-   **Estilos**: SCSS / Reactstrap
-   **Gestión de Estado**: React Context API
-   **Formularios**: React Hook Form
-   **Notificaciones**: React Toastify

---

## ⚙️ Comenzando

Sigue estos pasos para configurar el proyecto localmente:

### Prerrequisitos
-   Node.js (v14 o superior)
-   npm o yarn

### Instalación

1.  **Clonar el repositorio**:
    ```bash
    git clone <repository-url>
    cd CiensMart
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    # o
    yarn install
    ```

3.  **Ejecutar el servidor de desarrollo**:
    ```bash
    npm run dev
    # o
    yarn dev
    ```

4.  **Abrir la aplicación**:
    Navega a [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 💳 Detalles de Integración de Pagos

La aplicación está integrada con la **Pasarela de Pagos Bancobsidiana**.

-   **Endpoint de la API**: `https://ecommerce-bancobsidiana-team5-production.up.railway.app/api/v1/transaction/process`
-   **Método**: `POST`
-   **ID de Comerciante**: `ciens-mart`

### 🧪 Credenciales de Prueba

Usa los siguientes detalles de tarjeta de prueba para simular una transacción exitosa:

| Campo | Valor |
| :--- | :--- |
| **Número de Tarjeta** | `0572818983980488` |
| **Fecha de Expiración** | `05/27` |
| **CVV** | `881` |
| **Monto** | (Calculado automáticamente) |

> **Nota**: Si la pasarela de pagos devuelve un error, la aplicación lo maneja elegantemente, permitiendo al usuario completar el pedido con un estado de "Pago Pendiente".

---

## 📂 Estructura del Proyecto

```
src/
├── app/              # Páginas del App Router de Next.js
├── components/       # Componentes de UI reutilizables
├── views/            # Layouts y contenedores de páginas
├── services/         # Lógica de negocio y adaptadores de API
│   ├── auth.service.ts      # Autenticación de usuario
│   ├── localData.service.ts # Base de datos simulada (LocalStorage)
│   ├── order.service.ts     # Gestión de pedidos
│   └── payment.service.ts   # Integración de pasarela de pagos
├── hooks/            # Hooks de React personalizados (ej. useLocalQuery)
└── data/             # Datos simulados (Mock data)
```

---

## 👥 Colaboradores

Desarrollado por el **Equipo 5** para la Escuela de Computación, Facultad de Ciencias - UCV.

-   **Luisdavid Colina**
-   *(Añadir otros miembros del equipo aquí)*

---

© 2026 CiensMart. Todos los derechos reservados.
