## Carga de módulos WalletDB

Tras la modularización de los métodos CRUD, ya NO es necesario incluir cada archivo (`firebase-incomes.js`, `firebase-expenses.js`, etc.) por separado en cada página. Basta con cargar el agregador después de `firebase-db.js`:

```html
<script src="/ruta/backend/firebase/firebase-db.js"></script>
<script src="/ruta/backend/firebase/firebase-modulos.js"></script>
```

El agregador detecta su propia ruta y añade dinámicamente los scripts:

```
firebase-incomes.js
firebase-expenses.js
firebase-accounts.js
firebase-savings.js
firebase-debts.js
firebase-investments.js
firebase-goals.js
```

### Eventos y sincronización
Expone `window.walletDBModulesReady` (Promise). Si necesitas esperar explícitamente a que todos los módulos estén cargados antes de ejecutar lógica que use los métodos, puedes hacer:

```js
window.walletDBModulesReady.then(() => {
	// Ya disponibles: walletDB.addIncome, walletDB.listExpenses, etc.
});
```

También dispara el evento global `walletdb-modules-ready`:

```js
window.addEventListener('walletdb-modules-ready', () => {
	console.log('Módulos WalletDB listos');
});
```

### Orden recomendado de scripts en páginas

1. SDK Firebase compat (app, auth, firestore)
2. `firebase-config.js`
3. `firebase-autenticacion.js`
4. `firebase-db.js` (clase base)
5. `firebase-modulos.js` (agregador CRUD)
6. Scripts específicos de la pantalla (`ingresos.js`, `Gastos.js`, etc.)

### Migración rápida
Si tu página ya tenía las etiquetas individuales, reemplaza el bloque:

```html
<!-- Antes -->
<script src=".../firebase-db.js"></script>
<script src=".../firebase-incomes.js"></script>
<script src=".../firebase-expenses.js"></script>
<!-- ... resto ... -->

<!-- Después -->
<script src=".../firebase-db.js"></script>
<script src=".../firebase-modulos.js"></script>
```

### Notas (nuevo módulo)
Se añadió `firebase-notes.js` al agregador. Métodos disponibles:

```js
walletDB.addNote({ titulo, contenido, categoria, prioridad, tags:["tag1"] })
walletDB.listNotes()
walletDB.updateNote(id, { titulo, contenido, prioridad })
walletDB.deleteNote(id)
```

Campos estándar almacenados: `titulo`, `contenido`, `categoria`, `prioridad`, `tags` (array), `fechaCreacion` (ISO), `fechaModificacion` (ISO), más `createdAt` / `updatedAt` (timestamps server). 
Si el usuario no está autenticado se debe usar un fallback local (por ejemplo localStorage) como se hace en `notas.js`.

### Notas
- Los métodos se añaden al prototipo de la instancia global `window.walletDB`, así que no cambia la forma de invocarlos.
- Si un usuario no está autenticado, los métodos que requieren `requireAuth()` seguirán lanzando error.
- El agregador evita duplicar carga usando `data-fbmod` en cada script generado.

# 🔐 SISTEMA DE AUTENTICACIÓN FIREBASE - WALLET FLOW

## ✅ ARCHIVOS IMPLEMENTADOS

### 📁 `/firebase/`
- `firebase-config.js` - Configuración de Firebase
- `firebase-autenticacion.js` - Servicios de autenticación completos

### 📁 `/login/inicio de sesion/`
- `inicio.html` ✅ - Actualizado con Firebase
- `inicio.js` ✅ - Completamente reescrito para Firebase

### 📁 `/login/registro/`
- `registro.html` ✅ - Actualizado con Firebase
- `registro.js` ✅ - Completamente reescrito para Firebase

### 📁 `/login/cambiar contraseña/`
- `index.html` ✅ - Actualizado con Firebase
- `script.js` ✅ - Actualizado para Firebase

## 🚀 FUNCIONALIDADES IMPLEMENTADAS

### 🔑 **INICIO DE SESIÓN**
- ✅ Autenticación con email y contraseña
- ✅ Validación de email en tiempo real
- ✅ Manejo de errores en español
- ✅ Función "recordar usuario"
- ✅ Estados de carga (spinners)
- ✅ Efectos visuales (shake en error)
- ✅ Redirección automática si ya está autenticado

### 📝 **REGISTRO**
- ✅ Formulario multi-paso (2 pasos)
- ✅ Registro con email y contraseña en Firebase
- ✅ Validación completa de campos
- ✅ Validación de contraseña segura
- ✅ Confirmación de contraseña
- ✅ Envío de email de verificación automático
- ✅ Manejo de errores (email ya registrado, etc.)

### 🔒 **RECUPERAR CONTRASEÑA**
- ✅ Envío de email de recuperación con Firebase
- ✅ Validación de email
- ✅ Interfaz clara con instrucciones
- ✅ Manejo de errores
- ✅ Redirección al login

### 🔧 **FUNCIONES GLOBALES**
- ✅ `window.logout()` - Cerrar sesión
- ✅ `window.checkAuth()` - Verificar autenticación
- ✅ Gestión automática de estado de sesión

## 📋 CÓMO USAR EL SISTEMA

### 1️⃣ **PARA NUEVOS USUARIOS:**
1. Ir a `registro.html`
2. Llenar información personal (Paso 1)
3. Crear contraseña segura (Paso 2)
4. Firebase crea la cuenta y envía email de verificación
5. Verificar email
6. Iniciar sesión en `inicio.html`

### 2️⃣ **PARA USUARIOS EXISTENTES:**
1. Ir a `inicio.html`
2. Ingresar email y contraseña
3. Sistema autentica con Firebase
4. Redirección automática a la app

### 3️⃣ **RECUPERAR CONTRASEÑA:**
1. En `inicio.html`, hacer clic en "¿Olvidaste tu contraseña?"
2. Ingresar email en el formulario
3. Firebase envía email con enlace de recuperación
4. Seguir instrucciones del email

## 🛡️ SEGURIDAD IMPLEMENTADA

- ✅ Validación de contraseñas seguras (mínimo 6 caracteres)
- ✅ Verificación de email obligatoria
- ✅ Manejo seguro de errores (no revela información sensible)
- ✅ Limpieza de contraseñas en memoria después de errores
- ✅ Protección contra usuarios ya autenticados
- ✅ Sanitización de inputs

## 🔄 PRÓXIMOS PASOS OPCIONALES

- [ ] Integrar Firestore para guardar datos de perfil
- [ ] Implementar cambio de contraseña desde dentro de la app
- [ ] Agregar autenticación con Google/Facebook
- [ ] Implementar roles de usuario
- [ ] Agregar foto de perfil

## 🐛 TROUBLESHOOTING

### Si no funciona:
1. Verificar que tienes conexión a internet
2. Revisar la consola del navegador (F12)
3. Asegurarte de que Firebase esté configurado correctamente
4. Verificar que los archivos estén en las rutas correctas

### Errores comunes:
- "Firebase no está inicializado" → Revisar rutas de scripts
- "Email ya registrado" → Usar email diferente o ir a login
- "Contraseña muy débil" → Usar mínimo 6 caracteres

¡El sistema está listo para usar! 🎉