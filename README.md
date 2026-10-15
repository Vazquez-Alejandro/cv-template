# Currículum Vitae — Plantilla web

Plantilla de CV online: moderna, responsive, con tema claro/oscuro, animaciones al
hacer scroll, efectos hover, barras de habilidades animadas y botón para descargar
en PDF (imprimir). Todo el contenido es de ejemplo (lorem ipsum) y el avatar es una
ilustración SVG, para que puedas reemplazarlo fácilmente.

## Cómo editar el contenido

Todo el texto está en `index.html`. Buscá y reemplazá:

| Qué | Dónde |
| --- | --- |
| Nombre y apellido | Hero: `<h1>Nombre <span class="gradient">Apellido</span></h1>` y `<span class="brand__text">` |
| Puesto | `.hero__role` |
| Resumen | `.hero__summary` |
| Email / teléfono / ubicación | `.hero__facts` y `#contacto` |
| Experiencia | sección `#experiencia` |
| Educación y certificaciones | sección `#educacion` |
| Habilidades | sección `#habilidades` (los porcentajes están en `data-level`) |
| Proyectos | sección `#proyectos` |
| Redes | enlaces de `#contacto` |

Para cambiar la foto: reemplazá `assets/avatar.svg` por tu imagen (por ejemplo
`assets/foto.jpg`) y actualizá el `src` en el hero. Ideal: imagen cuadrada.

Para cambiar los colores, editá las variables en `styles.css` (`--accent-1`,
`--accent-2`, etc.).

## Probar en local

Abrí `index.html` en el navegador, o levantá un servidor:

```bash
python3 -m http.server 8000
```

## Desplegar

El sitio es estático, así que se puede publicar en cualquier hosting. En Vercel:

```bash
vercel --prod
```

O conectando el repositorio de GitHub en el panel de Vercel (sin configuración
extra: detecta el `index.html` automáticamente).
