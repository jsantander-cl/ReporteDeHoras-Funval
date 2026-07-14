📝 # Tareas – Sistema de Gestión de Horas de Servicio
## FASE 1 – Cimientos y Autenticación (Arrancan todos en paralelo, nadie espera a nadie)
•	[Líder] Setup del repositorio y Git Flow
o	Crear repositorio, configurar ramas main (protegida) y develop.
o	Definir la convención de ramas feature/nombre-card por tarjeta de Trello.
o	Crear el archivo .env base (VITE_API_URL) y redactar el README.md con las instrucciones de instalación.
•	[Líder] Base del Layout Principal (Sidebar + Navbar)
o	Construir el cascarón o shell básico de navegación (Sidebar + Navbar) usando <Outlet />.
o	DoD: Debe ser un diseño responsivo inicial para que los desarrolladores puedan incrustar sus páginas inmediatamente.
•	[Dev A] Página de Login 🟢
o	POST /api/v1/auth/login. Diseño del formulario y manejo de errores de credenciales inválidas.
•	[Dev A] Manejo de sesión y token JWT (AuthContext) 🟢
o	Crear el context/AuthContext.jsx para almacenar el estado global: user, role e isAuthenticated.
o	Persistir el token manualmente en cookies o localStorage al iniciar sesión.
o	Implementar la hidratación automática consultando el perfil del usuario al refrescar la página.
•	[Dev A] Logout 🟢
o	POST /api/v1/auth/logout. Función para destruir la sesión del servidor, limpiar el almacenamiento local y vaciar el Context.
•	[Dev A] Protección de rutas (Route Guards) 🟢
o	Implementar los componentes de envoltura <PrivateRoute> y <RoleRoute role="ADMIN"> para restringir accesos según los permisos del JWT.
________________________________________
## FASE 2 – Componentes Compartidos y Vistas de Perfil (Preparando utilidades)
•	[Dev B] Componente: Sistema de notificaciones (Toast) 🔵
o	Crear un sistema de alertas flotantes (Toasts) reutilizable globalmente para notificar éxitos (ej: "Reporte enviado") o errores (ej: "Error de servidor").
•	[Dev B] Componente: Modal de confirmación genérico 🔵
o	Crear un modal reutilizable que acepte un título, un mensaje y una acción callback.
o	Se utilizará para advertir al usuario antes de eliminar registros o confirmar envíos críticos.
•	[Dev C] Componente de Paginación 🟡
o	Componente UI reutilizable encargado de renderizar los controles de página anteriores/siguientes y números de página.
o	Debe aceptar la cantidad total de páginas y la página actual como propiedades (props).
•	[Dev C] Badge de estado de reporte 🟡
o	Pequeño componente visual para mostrar las etiquetas de estado: Pendiente (Amarillo), Aprobado (Verde) o Rechazado (Rojo).
•	[Dev D] Página: Mi Perfil 🔴
o	Vista del usuario autenticado que consume los datos de la sesión para mostrar su información personal y el resumen general de sus horas.
•	[Dev D] Página: Cambiar contraseña 🔴
o	Formulario seguro con validación de campos (contraseña actual, nueva contraseña y confirmación) para actualizar las credenciales de acceso.
________________________________________
## FASE 3 – Construcción de Módulos Core (Student Views & Admin Views)
Nota estricta de arquitectura: Al no utilizar instancias ni interceptores de Axios, cada desarrollador es responsable de recuperar el token manualmente desde su almacenamiento en cada función de servicio (const token = localStorage.getItem('token');) e inyectarlo explícitamente en el encabezado de la petición: headers: { Authorization: \Bearer ${token}` }`.
👨‍🎓 Sub-módulo: Student Views (Vistas del Estudiante)
•	[Dev B] Dashboard del Estudiante 🔵
o	Página de bienvenida con paneles informativos que reflejan el estado del estudiante y el acumulado de sus horas de servicio.
•	[Dev B] Listado de mis reportes 🔵
o	Tabla que enumera los reportes creados por el alumno. Integra el componente de paginación (Dev C) y los badges de estado (Dev C).
•	[Dev B] Visualizar evidencia PDF 🔵
o	Ventana o contenedor embebido para previsualizar los archivos adjuntos cargados como evidencia de las horas trabajadas.
•	[Dev C] Formulario de envío de reporte (con Componente de carga de archivos PDF) 🟡
o	Formulario de entrada de datos donde el estudiante describe su actividad.
o	Incluye la lógica de carga para adjuntar el archivo PDF transformándolo a un objeto FormData para su envío por HTTP.
•	[Dev C] Editar reporte pendiente 🟡
o	Reutilización del formulario de envío cargando los datos previos de un reporte. Solo se permite el acceso si el estado del reporte se encuentra estrictamente en "Pendiente".
💼 Sub-módulo: Admin Views (Vistas de Administrador)
•	[Dev A] Dashboard de Administrador 🟢
o	Panel principal con contadores analíticos rápidos (Total de estudiantes, reportes pendientes por revisar, etc.).
•	[Dev A] Listado de Usuarios y Eliminar usuario 🟢
o	Tabla global de administración que despliega a todos los usuarios del sistema (estudiantes, profesores, personal administrativo) con la opción integrada de dar de baja o eliminar un registro.
•	[Dev A] Formulario de creación de usuario 🟢
o	Formulario detallado para dar de alta nuevas cuentas de usuario de manera individual especificando sus roles y datos base.
•	[Dev A] Estudiantes con horas pendientes (In-Debt) 🟢
o	Vista de filtro rápido que agrupa exclusivamente a aquellos estudiantes que aún no han completado el requisito obligatorio de sus horas.
•	[Dev B] Listado de Reportes con filtros 🔵 (Apoyo al módulo de administración)
o	pages/admin/AdminReportList.jsx: Tabla centralizada para los administradores donde confluyen todas las solicitudes. Debe incluir filtros interactivos por estudiante, rango de fechas y estado del reporte.
•	[Dev B] Modal de revisión de reporte 🔵 (Apoyo al módulo de administración)
o	pages/admin/ReviewReportModal.jsx: Ventana emergente de revisión. Permite al administrador examinar la descripción, abrir la evidencia PDF, asignar el número de horas definitivo a convalidar y marcar el dictamen final como "Aprobado" o "Rechazado".
•	[Dev D] Importación masiva de usuarios (CSV) 🔴
o	Componente que procesa la carga de un archivo estructurado en formato .csv, valida la información en el cliente y realiza el envío por bloques a la API para dar de alta múltiples estudiantes simultáneamente.
•	[Dev D] Gestión de Categorías (CRUD) 🔴
o	Pantalla completa para listar, crear, modificar y eliminar las categorías que clasifican los reportes de horas de servicio.
•	[Dev D] Gestión de Cursos (CRUD) 🔴
o	Pantalla para el control total sobre los cursos o niveles lectivos del instituto.
•	[Dev D] Gestión de Países (CRUD) 🔴
o	Pantalla para la administración de catálogos geográficos necesarios para el registro del alumnado.
________________________________________
## FASE 4 – QA, Code Review e Integración (El Líder toma el control total)
•	[Todos] Manejo de Excepciones y Caducidad de Sesión
o	Implementar de forma manual bloques try/catch en cada componente. Si la API retorna un error 401 Unauthorized debido a un token expirado, el sistema debe vaciar inmediatamente el AuthContext y redirigir al usuario al Login.
•	[Líder] Auditoría Técnica y Cierre de Ramas
o	Revisar de manera exhaustiva cada Pull Request enfocado en verificar que ningún desarrollador haya implementado interceptores camuflados o instancias aisladas de Axios (axios.create).
o	Conducir pruebas de integración de extremo a extremo: Importar un alumno por CSV -> Iniciar sesión con ese alumno -> Enviar reporte con PDF -> Filtrar y Aprobar el reporte desde el perfil de Admin -> Validar el balance de horas actualizado en el perfil del alumno.
