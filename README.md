# Otunity Labs — sitio web

Sitio estático de Otunity Labs LLC. Sin framework, sin build. Se edita y se despliega solo.

## Archivos
| Archivo | Qué es |
|---|---|
| `index.html` | Marcado completo. El inglés vive aquí; el español en atributos `data-es` |
| `s.css` | Sistema visual: tokens, componentes, responsive (3D de fondo también en móvil) |
| `app.js` | Cambio de idioma + interfaz, y el motor 3D en WebGL puro (legible, sin minificar) |
| `vercel.json` | cleanUrls + cabeceras de seguridad |
| `media/` | Vídeo de la cámara y su póster (reserva para navegadores sin WebGL) |

## La cámara de cultivo — 6 especímenes
Sistema de partículas en WebGL a mano (~5.200 puntos). Seis formas, una por servicio del catálogo; al pulsar un servicio la cámara salta a su forma.

| Id | Forma | Servicio |
|---|---|---|
| SPC-01 | Esfera geodésica | Voice Agents |
| SPC-02 | Nudo tórico | Sales Bots |
| SPC-03 | Doble hélice | n8n Workflows |
| SPC-04 | Retícula cúbica | Agent Orchestration |
| SPC-05 | Galaxia espiral | Custom AI Software |
| SPC-06 | Toroide | Data Intelligence |

Añadir una 7ª forma: una función en `pointGen[]` y otra en `lineGen[]` dentro de `app.js`, un `<button class="spec">` en `index.html`, y un nombre en los arrays `spec` (EN/ES) de `app.js`. El motor detecta el número solo.

## Idiomas
Inglés por defecto en el marcado (indexable sin JS). El español va en `data-es`, `data-es-html`, `data-es-ph`. Los navegadores en español aterrizan en español; el botón EN/ES manda después.

## Desarrollo
No hay build. Sirve la carpeta:

```bash
python3 -m http.server 8000
```

Los enlaces a `/s.css` y `/app.js` son absolutos: hace falta un servidor (no vale abrir el archivo con `file://`).

## Despliegue
Conectado a Vercel. Cada push a `main` se despliega solo en https://otunitylabs.com

## Pendiente
- [ ] Cifras reales en el bloque de estadísticas (no inventar).
- [ ] Devolver el `<video>` de `media/` al hero como reserva para navegadores sin WebGL.
- [ ] Formulario: pasar de `mailto:` a un endpoint real.
