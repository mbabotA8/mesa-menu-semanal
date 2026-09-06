# Mesa — menú semanal visual

Aplicación web para organizar comidas y cenas de forma visual. Incluye recetario personal, lista de la compra automática y sincronización segura entre dispositivos.

## Cómo probarla

Para el modo local, abre `index.html` en un navegador moderno. Para usar acceso por email y sincronización, publícala en una URL HTTPS y configura Supabase.

## Funciones incluidas

- Vista semanal adaptable a móvil con entre 2 y 5 comidas diarias configurables.
- Menú infantil opcional para todas las franjas activas, sincronizado y vinculado a la compra.
- Recetario de platos habituales con búsqueda.
- Submenú visual de platos habituales.
- Creación y edición de recetas con ingredientes, cantidades y más de 50 iconos categorizados.
- Navegación entre semanas y notas semanales.
- Hasta cinco plantillas semanales con título para guardar, cargar, reemplazar o eliminar menús completos.
- Lista de la compra agrupada por secciones.
- Cantidades necesarias editables, compra parcial, progreso proporcional, copia y persistencia local.
- Preparación de un correo con el menú semanal y la lista de la compra.
- Acceso sin contraseña mediante enlace enviado por email.
- Sincronización en tiempo real del menú, compra, notas y recetario.

## Configuración de Supabase

1. Crea un proyecto de Supabase.
2. Ejecuta `supabase/schema.sql` en el proyecto.
3. Copia la URL y la clave publicable en `config.js`.
4. Añade la URL publicada en **Auth > URL Configuration** como Site URL y Redirect URL.

La tabla usa Row Level Security: cada cuenta solo puede acceder a su propio documento. Nunca uses una clave `service_role` en `config.js`.

## Publicación

El proyecto es estático y puede publicarse directamente en GitHub Pages. Una vez desplegado, entra con el mismo correo en cada dispositivo para compartir los mismos datos.
