<p align="center">
  <span style="font-size: 4rem;">🐜</span>
</p>

<h1 align="center">FinAnt — Gestor Financiero Personal</h1>

<p align="center">
  <strong>Controla tus ingresos, egresos, cuentas y notas de forma inteligente</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white" alt="Java 21" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Deploy-Render_+_Netlify-00C7B7?logo=netlify&logoColor=white" alt="Deploy" />
</p>

---

## 📋 Descripción

**FinAnt** es una aplicación web full-stack para la gestión de finanzas personales. Permite a los usuarios registrarse, iniciar sesión, administrar tres tipos de cuentas financieras (Efectivo, Ahorros e Inversiones), registrar movimientos de ingresos y egresos con control de aplicación al saldo, y tomar notas personales.

### ✨ Funcionalidades principales

| Módulo | Descripción |
|--------|-------------|
| 🔐 **Autenticación** | Registro, login con JWT, recuperación de contraseña por email |
| 💰 **Cuentas** | 3 cuentas automáticas por usuario (Efectivo, Ahorros, Inversiones) con ajuste de saldo |
| 📊 **Movimientos** | Registro de ingresos/egresos, toggle de aplicación al saldo, eliminación |
| 📝 **Notas** | Creación y eliminación de notas personales con tarjetas de colores |
| 📧 **Emails** | Correo de bienvenida y recuperación de contraseña vía Brevo HTTP API |
| 🌐 **Despliegue** | Backend en Render, frontend en Netlify, BD en Supabase |

---

## 🏗️ Arquitectura del Sistema

```
┌──────────────────┐     HTTPS      ┌──────────────────┐     JDBC      ┌──────────────────┐
│                  │  ◄──────────►  │                  │ ◄──────────►  │                  │
│   finant-app     │                │   finant-api     │               │    Supabase      │
│   (React SPA)    │                │  (Spring Boot)   │               │   PostgreSQL     │
│                  │                │                  │               │                  │
│   Netlify CDN    │                │   Render (Docker)│               │   Cloud DB       │
└──────────────────┘                └────────┬─────────┘               └──────────────────┘
                                             │
                                             │ HTTP API
                                             ▼
                                    ┌──────────────────┐
                                    │   Brevo API      │
                                    │  (Email Service) │
                                    └──────────────────┘
```

### Servicios externos

| Servicio | Propósito |
|----------|-----------|
| **Render** | Hosting del backend (Docker container, Java 21) |
| **Netlify** | Hosting del frontend (build estático de Vite) |
| **Supabase** | Base de datos PostgreSQL en la nube |
| **Brevo** | Envío de emails transaccionales vía HTTP API |
| **Cron-job.org** | Peticiones periódicas al endpoint `/api/health` para mantener activo el servidor en Render (free tier) |

---

## 📁 Estructura del Proyecto

```
FinAnt/
├── finant-api/                          # ── Backend (Spring Boot) ──
│   ├── src/main/java/com/finant/
│   │   ├── FinantApiApplication.java    # Punto de entrada
│   │   ├── config/
│   │   │   ├── SecurityConfig.java      # Spring Security + JWT filter
│   │   │   └── CorsConfig.java          # CORS para frontend
│   │   ├── controller/
│   │   │   ├── AuthController.java      # Login / Registro
│   │   │   ├── PasswordResetController.java  # Recuperación de contraseña
│   │   │   ├── AccountController.java   # Cuentas financieras
│   │   │   ├── TransactionController.java  # Movimientos
│   │   │   ├── NoteController.java      # Notas
│   │   │   └── HealthController.java    # Health check (keep-alive)
│   │   ├── service/
│   │   │   ├── AuthService.java         # Lógica de autenticación
│   │   │   ├── AccountService.java      # Lógica de cuentas
│   │   │   ├── TransactionService.java  # Lógica financiera
│   │   │   ├── NoteService.java         # Lógica de notas
│   │   │   ├── PasswordResetService.java  # Tokens de recuperación
│   │   │   └── EmailService.java        # Envío de emails (Brevo API)
│   │   ├── entity/                      # Entidades JPA
│   │   ├── dto/
│   │   │   ├── request/                 # DTOs de entrada (validados)
│   │   │   └── response/               # DTOs de salida
│   │   ├── repository/                  # Repositorios JPA
│   │   ├── security/
│   │   │   ├── JwtUtil.java             # Generación / validación JWT
│   │   │   ├── JwtFilter.java           # Filtro de autenticación
│   │   │   └── UserDetailsServiceImpl.java
│   │   └── exception/
│   │       └── GlobalExceptionHandler.java  # Manejo centralizado de errores
│   ├── src/main/resources/
│   │   ├── application.properties       # Config local (gitignored)
│   │   ├── application-prod.properties  # Config producción (env vars)
│   │   └── application.properties.example  # Plantilla de configuración
│   ├── Dockerfile                       # Build multi-stage para Render
│   └── pom.xml                          # Dependencias Maven
│
├── finant-app/                          # ── Frontend (React + Vite) ──
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosConfig.js           # Axios + interceptores JWT
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Navegación responsive
│   │   │   ├── PrivateRoute.jsx         # Guard de rutas autenticadas
│   │   │   └── ui/                      # Componentes reutilizables
│   │   │       ├── Spinner.jsx
│   │   │       ├── EmptyState.jsx
│   │   │       └── SkeletonCard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # Estado global de autenticación
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Transactions.jsx
│   │   │   └── Notes.jsx
│   │   ├── utils/
│   │   │   ├── alerts.js                # SweetAlert2 helpers
│   │   │   └── formatCurrency.js        # Formato COP
│   │   ├── App.jsx                      # Router principal
│   │   ├── main.jsx                     # Punto de entrada
│   │   └── index.css                    # Design system global
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🛠️ Stack Tecnológico

### Backend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| Java | 21 | Lenguaje principal |
| Spring Boot | 3.5 | Framework web |
| Spring Security | 6.x | Autenticación y autorización |
| Spring Data JPA | 3.x | Persistencia ORM |
| PostgreSQL | 15+ | Base de datos relacional |
| JJWT | 0.12.3 | Generación y validación de tokens JWT |
| Lombok | latest | Reducción de boilerplate |
| Brevo HTTP API | v3 | Envío de emails transaccionales |
| Maven | 3.9+ | Gestión de dependencias y build |

### Frontend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 19 | Librería UI |
| Vite | 8 | Build tool y dev server |
| React Router DOM | 7 | Navegación SPA |
| Axios | 1.16 | Cliente HTTP |
| Lucide React | 1.14 | Iconografía |
| SweetAlert2 | 11 | Alertas y confirmaciones |
| TailwindCSS | 4 | Utilidades CSS (tema) |
| Inter (Google Fonts) | - | Tipografía |

---

## 🚀 Instalación y Ejecución Local

### Prerequisitos

- **Java 21** (JDK)
- **Maven 3.9+**
- **Node.js 18+** y **npm 9+**
- **PostgreSQL** (local o Supabase)
- Cuenta en **Brevo** (para envío de emails)

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/FinAnt.git
cd FinAnt
```

### 2. Configurar el Backend

```bash
cd finant-api
```

Crear el archivo de configuración local:

```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

Editar `application.properties` con tus credenciales:

```properties
# Base de datos
spring.datasource.url=jdbc:postgresql://localhost:5432/finant
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password

# JWT (genera una clave de al menos 32 caracteres)
jwt.secret=tu-clave-secreta-super-larga-minimo-32-caracteres

# Brevo
app.brevo.api-key=tu-api-key-de-brevo
app.mail.from=tu-email-verificado@gmail.com
```

Ejecutar el backend:

```bash
./mvnw spring-boot:run
```

El servidor se iniciará en `http://localhost:8080`

### 3. Configurar el Frontend

```bash
cd ../finant-app
npm install
```

Crear archivo de entorno (opcional, solo si el backend no está en `localhost:8080`):

```bash
echo "VITE_API_URL=http://localhost:8080/api" > .env.local
```

Ejecutar el frontend:

```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:5173`

---

## 🔌 API REST — Endpoints

### Autenticación (públicos)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/auth/register` | Registro de usuario |
| `POST` | `/api/auth/login` | Inicio de sesión |
| `POST` | `/api/auth/forgot-password` | Solicitar enlace de recuperación |
| `POST` | `/api/auth/reset-password` | Restablecer contraseña |
| `POST` | `/api/auth/check-email` | Verificar existencia de email |
| `GET`  | `/api/auth/validate-token?token=xxx` | Validar token de recuperación |
| `GET`  | `/api/health` | Health check (keep-alive) |

### Cuentas (requieren JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/accounts` | Listar cuentas del usuario |
| `PATCH` | `/api/accounts/{id}/balance` | Ajustar saldo de una cuenta |

### Movimientos (requieren JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/transactions` | Listar movimientos del usuario |
| `POST` | `/api/transactions` | Crear un movimiento |
| `PATCH` | `/api/transactions/{id}/toggle` | Alternar estado aplicado/pendiente |
| `DELETE` | `/api/transactions/{id}` | Eliminar un movimiento |

### Notas (requieren JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/notes` | Listar notas del usuario |
| `POST` | `/api/notes` | Crear una nota |
| `DELETE` | `/api/notes/{id}` | Eliminar una nota |

---

## 🌐 Despliegue en Producción

### Backend → Render

1. Crear un **Web Service** en [Render](https://render.com)
2. Conectar el repositorio y seleccionar el directorio `finant-api`
3. Render detecta el `Dockerfile` automáticamente
4. Configurar las **variables de entorno**:

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | URL JDBC de Supabase |
| `DATABASE_USERNAME` | Usuario de la BD |
| `DATABASE_PASSWORD` | Contraseña de la BD |
| `JWT_SECRET` | Clave secreta para JWT |
| `BREVO_API_KEY` | API Key de Brevo |
| `MAIL_FROM` | Email remitente verificado |
| `FRONTEND_URL` | URL del frontend en Netlify |
| `PORT` | Puerto del servidor (default: 10000) |

5. El perfil `prod` se activa automáticamente vía el `Dockerfile`

### Frontend → Netlify

1. Crear un **Site** en [Netlify](https://netlify.com)
2. Conectar el repositorio y configurar:
   - **Base directory**: `finant-app`
   - **Build command**: `npm run build`
   - **Publish directory**: `finant-app/dist`
3. Agregar variable de entorno:
   - `VITE_API_URL` = URL del backend en Render + `/api`
4. Agregar archivo `_redirects` en `public/` para SPA routing:
   ```
   /*    /index.html   200
   ```

### Keep-alive con Cron-job

Render suspende los servicios del free tier tras 15 minutos de inactividad. Para evitarlo:

1. Ir a [cron-job.org](https://cron-job.org) y crear una tarea
2. URL: `https://tu-backend.onrender.com/api/health`
3. Frecuencia: cada **14 minutos**
4. Método: `GET`

---

## 🗄️ Modelo de Datos

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────────────┐
│    users     │       │    accounts      │       │    transactions      │
├──────────────┤       ├──────────────────┤       ├──────────────────────┤
│ id (PK)      │──┐    │ id (PK)          │──┐    │ id (PK)              │
│ name         │  │    │ user_id (FK)     │  │    │ account_id (FK)      │
│ document     │  ├───►│ type             │  ├───►│ type (income/expense)│
│ phone        │  │    │ balance          │  │    │ date                 │
│ email        │  │    │ updated_at       │  │    │ description          │
│ password_hash│  │    └──────────────────┘  │    │ amount               │
│ created_at   │  │                          │    │ applied              │
└──────────────┘  │    ┌──────────────────┐  │    │ created_at           │
                  │    │     notes        │  │    └──────────────────────┘
                  │    ├──────────────────┤  │
                  ├───►│ id (PK)          │  │
                  │    │ user_id (FK)     │  │
                  │    │ title            │  │
                  │    │ content          │  │
                  │    │ created_at       │  │
                  │    └──────────────────┘  │
                  │                          │
                  │    ┌────────────────────────┐
                  │    │ password_reset_tokens   │
                  │    ├────────────────────────┤
                  └───►│ id (PK)                │
                       │ user_id (FK)           │
                       │ token                  │
                       │ expires_at             │
                       │ used                   │
                       │ created_at             │
                       └────────────────────────┘
```

---

## 🔒 Seguridad

- **Contraseñas** hasheadas con BCrypt
- **JWT** para autenticación stateless (expiración: 24h)
- **Filtro JWT** en cada request para validar tokens
- **Autorización por usuario**: cada endpoint verifica que el recurso pertenece al usuario autenticado
- **CORS** configurado solo para orígenes permitidos (localhost + Netlify)
- **Tokens de recuperación** con expiración de 30 minutos y uso único
- **Credenciales** externalizadas vía variables de entorno en producción
- **Validación** de DTOs con Jakarta Bean Validation

---

## 📦 Scripts Disponibles

### Backend (`finant-api/`)

```bash
./mvnw spring-boot:run          # Ejecutar en modo desarrollo
./mvnw clean package -DskipTests  # Compilar JAR para producción
./mvnw test                     # Ejecutar tests
```

### Frontend (`finant-app/`)

```bash
npm run dev       # Servidor de desarrollo (http://localhost:5173)
npm run build     # Build de producción
npm run preview   # Previsualizar build de producción
npm run lint      # Ejecutar ESLint
```

---

## 👤 Autor

Desarrollado por **Juan García** como proyecto de gestión financiera personal.

---

## 📄 Licencia

Este proyecto es de uso privado / académico.
