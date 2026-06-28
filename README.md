# StudyFlow IA 📖✨

> Tu plan. Tu ritmo. Tu éxito.

App móvil **multiplataforma (iOS y Android)** de productividad para estudiantes:
crea un cronograma de estudio personalizado según tu personalidad, gestiona tus
tareas, sigue tu progreso con gamificación y apoya el proyecto con donaciones.

Construida con **React Native + Expo** (un solo código fuente para iOS, Android y web).

---

## 🚀 Cómo ejecutar

Requisitos: **Node.js 18+** y la app **Expo Go** en tu teléfono (App Store / Play Store).

```bash
cd StudyFlowIA
npm install            # instala dependencias (solo la primera vez)
npm start              # abre el servidor de Expo + código QR
```

Luego:

- **Teléfono físico:** escanea el código QR con Expo Go (Android) o la cámara (iOS).
- **Emulador Android:** pulsa `a` en la terminal (requiere Android Studio).
- **Simulador iOS (solo macOS):** pulsa `i` (requiere Xcode).
- **Navegador:** pulsa `w` (requiere `npx expo install react-dom react-native-web`).

Atajos directos: `npm run android`, `npm run ios`, `npm run web`.

---

## 📦 Generar el APK (Android)

El APK se compila en la **nube de Expo (EAS Build)** — no necesitas instalar el SDK
de Android ni JDK en tu equipo. Solo una cuenta gratuita de Expo
(https://expo.dev/signup).

```bash
cd StudyFlowIA
npm run eas:login      # inicia sesión con tu cuenta Expo (una sola vez)
npm run build:apk      # compila el APK en la nube (perfil "preview")
```

En la primera ejecución, EAS preguntará:
- **Create EAS project?** → responde **Yes** (registra el `projectId` en `app.json`).
- **Generate a new Android Keystore?** → responde **Yes** (EAS lo gestiona por ti).

Al terminar (~10–20 min, puede haber cola en el plan gratis) verás una **URL de
descarga** y un **QR**. Descarga el `.apk`, pásalo al teléfono e instálalo
(activa *Instalar apps de origen desconocido*).

> Configuración en [eas.json](StudyFlowIA/eas.json): el perfil **preview** produce
> un **APK** instalable; **production** genera un **AAB** (`npm run build:aab`) para
> publicar en Google Play.

---

## 📱 Pantallas

| Pantalla | Descripción |
|----------|-------------|
| **Onboarding** | Bienvenida, branding y lista de características. CTAs *Comenzar* y *Donaciones*. |
| **Inicio de sesión** | Solo nombre de usuario (sin contraseña); se guarda y personaliza el saludo. |
| **Personalidad** | Elige tu arquetipo (Organizado / Creativo / Procrastinador) para personalizar el plan. |
| **Inicio** | Saludo, tarjeta de cronograma inteligente, *Resumen de hoy* (tareas, estudio, puntos) y banner de donaciones. |
| **Tareas** | El botón **+** abre un **pop-up** con nombre, descripción, duración, día de entrega (accesos rápidos o calendario) y urgencia. La lista se puede **ordenar** por urgencia, entrega o nombre. Completa (ganas puntos) o elimina con 🗑. |
| **Cronograma** | Día: **entregas del día** + plan de estudio (ordenado por urgencia). Semana: entregas de los próximos 7 días. Mes: resumen + próximas entregas. |
| **Amigos** | Tabla de clasificación: compites por puntos con tus amigos. Agrega amigos y sube en el ranking completando tareas. |
| **Donaciones** | Montos fijos (S/ 5–50) o personalizado, con confirmación de agradecimiento. |
| **Perfil** | Identidad, estadísticas de gamificación, personalidad e historial de donaciones. |

Barra de navegación inferior: **Inicio · Tareas · Cronograma · Amigos · Perfil**.

---

## 🗂️ Estructura del proyecto

```
StudyFlowIA/
├── App.js                     # Punto de entrada (providers + navegación)
├── app.json                   # Configuración de Expo (iOS/Android/web)
├── assets/                    # Íconos y splash
├── scripts/make-assets.js     # Generador de assets placeholder
└── src/
    ├── theme/                 # Colores, espaciado, radios, tipografía, sombras
    ├── data/seed.js           # Datos iniciales (tareas, personalidades, montos)
    ├── context/AppContext.js  # Estado global (tareas, puntos, donaciones)
    ├── utils/                 # Formato de tiempo + generador de cronograma
    ├── components/            # UI reutilizable (Button, Card, TaskItem, ...)
    ├── screens/               # Las 7 pantallas
    └── navigation/            # Stack raíz + tabs inferiores
```

---

## 🎨 Diseño

- Fondo blanco, acentos **púrpura**, **rosa** para donaciones y **pasteles** para
  el cronograma.
- Formas redondeadas, sombras suaves, tipografía simple e ilustraciones con emoji.
- Sistema de diseño centralizado en `src/theme/` para mantener consistencia y escalar.

## ⚙️ Lógica

- **Estado global** con React Context — todas las pantallas se mantienen sincronizadas.
- El **cronograma se genera automáticamente** desde la lista de tareas
  (`src/utils/schedule.js`), insertando descansos para reducir el estrés.
- **Gamificación:** completar una tarea otorga puntos.

> Nota: el estado vive en memoria durante la sesión. Para persistencia entre
> reinicios, añade `@react-native-async-storage/async-storage` en `AppContext`.
