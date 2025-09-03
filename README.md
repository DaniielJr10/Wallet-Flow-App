# Wallet Flow App

Aplicación web multipágina (HTML, CSS, JS + Bootstrap) para la gestión financiera personal: ingresos, gastos, ahorros, deudas, cuentas, inversiones, objetivos y herramientas auxiliares.

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