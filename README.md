# Focal

> Una cosa a la vez.

App móvil **multiplataforma (iOS y Android)** para organizar el estudio sin agobio:
divide tus tareas en bloques de enfoque con descansos, según cómo estudias.

Construida con **React Native + Expo (SDK 56)**.

---

## 🚀 Cómo ejecutar

Requisitos: **Node.js 18+** y la app **Expo Go**.

```bash
cd StudyFlowIA
npm install
npm start
```

- **Teléfono:** escanea el QR con Expo Go (Android) o la cámara (iOS).
- **Emulador Android:** pulsa `a` · **Simulador iOS (macOS):** pulsa `i`.

> El directorio del proyecto aún se llama `StudyFlowIA` por el nombre anterior.
> Puedes renombrarlo a `Focal` sin tocar el código.

---

## 📦 Generar el APK

Se compila en la nube (**EAS Build**), sin necesidad del SDK de Android local.

```bash
npm run build:apk
```

`preview` produce un **APK** instalable; `npm run build:aab` genera el **AAB** para
Google Play. Configuración en [eas.json](eas.json).

---

## 📱 Pantallas

| Pantalla | Descripción |
|----------|-------------|
| **Onboarding** | Marca, propuesta y lista de características. |
| **Nombre** | Solo un nombre o apodo — sin contraseña, correo ni cuenta. |
| **Ritmo** | Constante / Variado / Gradual — **cambia de verdad** cómo se arma el plan. |
| **Hoy** | Saludo, cifras del día y el siguiente bloque de estudio. |
| **Tareas** | El botón **+** abre un panel con título, notas, duración, entrega y urgencia. Ordena por urgencia, entrega o A–Z. |
| **Plan** | Día (línea de tiempo + vencimientos), Semana (7 días) y Mes (actividad real + próximas entregas). |
| **Ajustes** | Progreso, nombre, **apariencia (claro / oscuro / sistema)**, ritmo, legal y borrado de datos. |

Navegación inferior: **Hoy · Tareas · Plan · Ajustes**.

### Cómo el ritmo cambia el plan

| Ritmo | Bloque | Descansos | Orden |
|---|---|---|---|
| Constante | 50 min | 10 / 20 min | Agrupa la misma materia |
| Variado | 40 min | 12 / 25 min | **Alterna** materias |
| Gradual | 25 min | 8 / 20 min | Bloques cortos y frecuentes |

Las tareas largas se parten automáticamente en bloques de ese tamaño, y las de
urgencia **Alta** se agendan primero.

---

## 🎨 Diseño

Sistema **monocromo**: blancos, negros y grises. No hay colores decorativos — la
jerarquía se construye con tipografía, peso y espacio. El «acento» es la inversa
del fondo, así que las acciones primarias son bloques sólidos de contraste.

- **Modo claro y oscuro**, con opción de seguir el sistema. Se recuerda entre sesiones.
- La **urgencia** se codifica con relleno y peso (sólido / apagado / hueco), no con
  color — también funciona para daltonismo.
- Un único color semántico (`danger`), reservado para acciones destructivas y
  entregas vencidas.
- Todos los textos superan el contraste **WCAG AA** en ambos temas.

Tokens en [`src/theme/`](src/theme). Los colores se leen con `useTheme()`, nunca
por import directo.

---

## 🗂️ Estructura

```
├── App.js                     # Providers (tema, estado, errores) + navegación
├── app.json                   # Configuración de Expo
├── PRIVACY.md                 # Política de privacidad (para alojar)
├── AUDITORIA.md               # Auditoría pre-lanzamiento y remediación
├── scripts/generate-assets.js # Genera ícono, splash y favicon
└── src/
    ├── theme/                 # Paletas claro/oscuro, ThemeContext, tokens
    ├── data/seed.js           # Contenido inicial y ritmos de estudio
    ├── context/AppContext.js  # Estado global + persistencia
    ├── utils/                 # Tiempo, urgencia, cronograma, almacenamiento
    ├── components/            # UI reutilizable
    ├── screens/               # Las 7 pantallas
    └── navigation/            # Stack raíz + pestañas
```

## 🔒 Privacidad

Todo se guarda **solo en el dispositivo** (AsyncStorage). Sin peticiones de red,
sin permisos del sistema, sin analítica ni publicidad. Ver [PRIVACY.md](PRIVACY.md).

## 🖼️ Assets

```bash
node scripts/generate-assets.js
```
