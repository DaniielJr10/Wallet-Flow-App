# Wallet Flow App

Aplicación web multipágina (HTML, CSS, JS + Bootstrap) para la gestión financiera personal: ingresos, gastos, ahorros, deudas, cuentas, inversiones, objetivos y herramientas auxiliares.

## Base de datos (Firebase Firestore)

Se añadió un servicio reutilizable para persistir datos por usuario en Firestore, usando el SDK v9 compat.

- Archivo: `backend/firebase/firebase-db.js`
- Expone `window.walletDB` con métodos CRUD por módulo:
	- `addIncome|listIncomes|updateIncome|deleteIncome`
	- `addExpense|listExpenses|updateExpense|deleteExpense`
	- `addAccount|listAccounts|updateAccount|deleteAccount`
	- `addSaving|listSavings|updateSaving|deleteSaving`
	- `addDebt|listDebts|updateDebt|deleteDebt`
	- `addInvestment|listInvestments|updateInvestment|deleteInvestment`
	- `addGoal|listGoals|updateGoal|deleteGoal`

Los datos se guardan en la ruta `users/{uid}/{coleccion}` por usuario autenticado.

### Requisitos

- Configuración válida en `backend/firebase/firebase-config.js`.
- Cargar los SDKs en cada pantalla que use la DB:
	- `firebase-compat.js`, `firebase-compat-auth.js`, `firebase-compat-firestore.js`
	- `firebase-config.js`, `firebase-autenticacion.js`, `firebase-db.js`

### Ejemplo de integración (Ingresos)

En `frontend/pantallas/pantallaingresos/ingresos.html` se añadieron los scripts anteriores y, en `ingresos.js`, se migró a Firestore para:

- Listar ingresos desde `walletDB.listIncomes()`
- Crear ingresos con `walletDB.addIncome(datos)`
- Editar y eliminar usando el `id` del documento

Si Firestore no está disponible, se usa `localStorage` como fallback.

### Seguridad

Configura las reglas de Firestore para aislar datos por usuario:

```
rules_version = '2';
service cloud.firestore {
	match /databases/{database}/documents {
		match /users/{userId}/{document=**} {
			allow read, write: if request.auth != null && request.auth.uid == userId;
		}
	}
}
```

### Estado de Integración de Firestore

Todas las pantallas principales (Ingresos, Gastos, Deudas, Ahorros, Inversiones, Cuentas, Objetivos) usan ya el servicio `window.walletDB` para CRUD. Las pantallas Herramientas y Configuración no requieren Firestore para sus funciones actuales (utilizan `localStorage`), pero pueden integrarse posteriormente para sincronizar perfil y ajustes multi-dispositivo.

## Arquitectura Modular Global

Cada pantalla funcional ha sido migrada de un script monolítico a una carpeta `modules/` más un `index.modular.js` que actúa como boot. Patrón aplicado:

```
pantallas/<pantalla>/
	modules/
		state.js            // Estado en memoria
		service.js          // Capa de datos (Firestore / localStorage)
		filters.js          // (Si aplica) lógica de filtrado / búsqueda
		table.js | grid.js  // Renderizado principal de registros (tabla o tarjetas)
		summary.js          // Cálculo de métricas y totales
		form.js             // Modal / formulario creación
		edit.js             // Modal / formulario edición
		actions.js          // Botones, exportaciones, disparadores generales
		messages.js         // Adaptador a utilidades comunes de notificación
		auth-init.js        // Espera de sesión Firebase antes de iniciar (si aplica)
	index.modular.js      // Orquestación y orden de arranque
```

Utilidades compartidas (ubicación unificada):
`frontend/common/utils/format.js`, `frontend/common/utils/messages.js`, `frontend/common/utils/csv.js`.

Pantallas con variaciones:
- Cuentas: usa `grid.js` en vez de `table.js` (representación tipo tarjetas).
- Objetivos: normaliza estados y calcula progreso derivado.
- Herramientas: mínima (logout) → `state.js`, `actions.js`, `index.modular.js`.
- Configuración: subdividida en módulos específicos:
	- `state.js`, `service.js`, `messages.js`
	- `profile.js` (perfil y foto)
	- `notifications.js` (preferencias + historial)
	- `personalization.js` (tema, fuente, preview, reset)
	- `security.js` (contraseña, eliminación de cuenta)
	- `modals.js` (apertura/cierre de modales estilo herramientas)
	- `actions.js` (listeners globales + deep-link hash)
	- `index.modular.js` (secuencia de arranque)

Rollback rápido: en cada HTML se dejó el `<script src="<pantalla>.js">` original comentado; basta comentar la cadena modular y descomentar el monolítico.

### Limpieza de `configuracion.html`
Se eliminaron atributos `onclick` inline y se reemplazaron por `data-tool-target`, `data-close` e IDs semánticos. Los listeners ahora viven en `modules/actions.js`, reduciendo acoplamiento entre marcado y lógica y facilitando pruebas/estilos.

### Beneficios Obtenidos
- Separación clara de responsabilidades → mantenimiento y pruebas más simples.
- Reutilización real de notificaciones, formato y CSV.
- Reducción de riesgo: cada migración conserva el archivo antiguo hasta validación.
- Preparado para futura migración a ES Modules sin reescritura extensa.
## Estructura Actual

```
login/
	introduction/
	registro/
	inicio de sesion/
	cambiar contraseña/
pantallas/
	pantallaprincipal/
	pantallaingresos/
	PantallaGastos/
	pantallaahorros/
	pantalladeudas/
	pantallainversiones/
	pantallacuentas/
	PantallaObjetivos/
	pantallaherramientas/
		calculadora/
		calendario/
		conversor/
		notas/
	pantallaconfiguracion/
formularios/
	formulario ingresos/
	FormularioGastos/
	formulario ahorros/
	formulario-deudas/
	formulario cuentas/
	formulario-inversiones/
	FormularioObjetivo/
```

## Convenciones de Rutas

- Todas las vistas principales están bajo `pantallas/`.
- Formulario de inicio de sesión redirige a: `../../pantallas/pantallaprincipal/principal.html`.
- Menú lateral estándar (ejemplo dentro de una pantalla):
	- Inicio: `../pantallaprincipal/principal.html`
	- Ingresos: `../pantallaingresos/ingresos.html`
	- Gastos: `../PantallaGastos/Gastos.html`
	- Ahorros: `../pantallaahorros/ahorros.html`
	- Deudas: `../pantalladeudas/deudas.html`
	- Inversiones: `../pantallainversiones/inversiones.html`
	- Cuentas: `../pantallacuentas/cuentas.html`
	- Objetivos: `../PantallaObjetivos/PantallaObjetivo.html`
	- Herramientas: `../pantallaherramientas/herramientas.html`
	- Configuración: `../pantallaconfiguracion/configuracion.html`

## Estado de Limpieza

- Rutas antiguas a `pantallaobjetivos/objetivos.html` y `configuracion/configuracion.html` reemplazadas.
- Se eliminaron duplicados de `principal.html` fuera de `pantallas/pantallaprincipal/`.
- Eliminados enlaces a pantallas no implementadas (Consejos, Ayuda) donde correspondía.

## Próximos Mejoras Sugeridas

- Unificar el menú lateral mediante `fetch()` e inyección HTML para evitar duplicación.
- Normalizar nombres de carpetas (evitar espacios y mezclar mayúsculas/minúsculas).
- Agregar un servidor estático (por ejemplo `live-server` / `http-server`) para facilitar rutas absolutas.
- Implementar un módulo central de manejo de sesión y cierre de sesión.

## Uso

Abrir `login/inicio de sesion/inicio.html` en el navegador para autenticarse y navegar luego por las pantallas.

---
Documentación generada automáticamente tras reorganización de estructura.

## Refactor Piloto (Ingresos)

Se inició un piloto de modularización para reducir el tamaño y complejidad de `ingresos.js` sin alterar todavía el comportamiento en producción. El archivo original permanece intacto y la nueva estructura vive en `frontend/pantallas/pantallaingresos/modules/` más `index.modular.js`.

### Objetivo
Separar responsabilidades: estado, servicios (Firestore), filtros, renderizado de tabla, resúmenes, edición, formulario y mensajes/formatos.

### Módulos creados
- `state.js`: estado y setters.
- `service.js`: carga desde Firestore y sincronización con la tabla/resúmenes.
- `filters.js`: filtros y búsqueda.
- `table.js`: renderizado, paginación y eventos de la tabla.
- `summary.js`: cálculo de totales y categoría principal.
- `edit.js`: modal de edición.
- `form.js`: lógica del formulario multi–paso.
- `messages.js`: mensajes y formateo.
- `index.modular.js`: orquestación principal de la pantalla.
- Utilidades compartidas (nuevas): `frontend/common/utils/format.js`, `messages.js`, `csv.js`.

### Cómo probar sin riesgo
La pantalla `ingresos.html` ya apunta a la versión modular y conserva el script monolítico comentado al final por si se necesita revertir rápido.

Pasos de rollback:
1. Descomentar `<script src="ingresos.js"></script>`.
2. Comentar todos los `<script src="modules/...">` y `index.modular.js`.
3. Recargar.

### Próximos pasos sugeridos
1. Replicar estructura modular en otras pantallas (gastos, ahorros...).
2. Migrar a ES Modules (`type="module"`) gradualmente (ya listo para cambiar rutas de scripts a módulos).
3. Añadir pruebas de humo automáticas.
4. Unificar menú lateral mediante carga dinámica.
5. Centralizar estilos y eliminar duplicaciones entre pantallas.

Esta sección documenta el experimento sin afectar la implementación actual.