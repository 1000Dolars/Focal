# Auditoría pre-lanzamiento — Focal v1.0.0

> **Nota (28 jul 2026):** la app se auditó como *StudyFlow IA*. Después se rehízo
> por completo y pasó a llamarse **Focal**. Los hallazgos siguen siendo válidos —
> el rediseño resolvió varios de los pendientes; ver «Cambios del rediseño» abajo.


**Fecha:** 27 de julio de 2026
**Alcance:** auditoría estática del código fuente (Expo SDK 56 / React Native 0.85.3)
**Veredicto inicial:** ❌ **NO apto para publicar.** 5 bloqueadores críticos.

---

## ✅ Estado de remediación (27 jul 2026)

Los **5 críticos** y los **8 altos** están corregidos en el código. Verificación:
bundle limpio, `expo-doctor` 21/21, 34 pruebas de lógica OK, sin imports rotos.

| # | Problema | Estado |
|---|---|---|
| C1 | Donaciones simuladas | ✅ Apartado eliminado por completo |
| C2 | Sin persistencia | ✅ AsyncStorage + hidratación versionada |
| C3 | Texto falso en login | ✅ Corregido (y ahora es cierto) |
| C4 | Iconos placeholder | ✅ Ícono real dibujado; zona segura Android verificada (radio 320/338) |
| C5 | Sin política de privacidad | ✅ `PRIVACY.md` + pantallas in-app de Privacidad y Términos |
| A1 | Efecto secundario en updater | ✅ Puntos derivados con `useMemo` |
| A2 | Exploit de puntos | ✅ Imposible por diseño (probado) |
| A3 | Amigos ficticios | ✅ Etiquetados «ejemplo» + aviso de tabla local |
| A4 | Accesibilidad nula | ✅ Roles, etiquetas y estados en todos los controles |
| A5 | Sin manejo de errores | ✅ `ErrorBoundary` + `try/catch` en almacenamiento |
| A6 | Estadísticas inventadas | ✅ Historial real de 30 días |
| A7 | Botones muertos | ✅ Eliminados |
| A8 | Reclamo de IA sin IA | ✅ Textos ajustados + la personalidad **sí** modula el plan |
| M4 | Contraste 2.83:1 | ✅ `textMuted` ahora 5.1:1 (pasa AA) |
| M6 | iPad no adaptado | ✅ `supportsTablet: false` |
| M7 | Sin control de datos | ✅ Ajustes con «Borrar todos mis datos» |
| M9 | Parseo de fechas duplicado | ✅ Usa `parseDateKey()` |
| M10 | Sin límites de texto | ✅ `maxLength` 80 / 500 |
| B2 | Script de placeholders | ✅ Reemplazado por `generate-assets.js` |
| B5 | Colisión de IDs | ✅ `createId()` único entre reinicios |

### Hallazgos adicionales en la re-auditoría

Al revisar la propia remediación aparecieron tres defectos nuevos, ya corregidos:

| # | Problema | Severidad | Estado |
|---|---|---|---|
| R1 | `initialRouteName` era siempre `Onboarding`: el usuario que ya había iniciado sesión repetía Onboarding → Login → Personalidad **en cada arranque**, dejando la persistencia sin efecto práctico. | 🟠 Alto | ✅ Arranca en `Main` si hay sesión guardada |
| R2 | Tras «Borrar todos mis datos» el usuario quedaba dentro de la app sin nombre de usuario. | 🟡 Medio | ✅ Vuelve a Onboarding con `navigation.reset` |
| R3 | 1 de 23 controles (botón «Listo» del calendario en iOS) seguía sin accesibilidad. | 🟡 Medio | ✅ 23/23 verificado por script |

### Cambios del rediseño (28 jul 2026) — de StudyFlow IA a Focal

| # | Pendiente anterior | Estado tras el rediseño |
|---|---|---|
| M3 | Sin modo oscuro | ✅ **Resuelto.** Temas claro/oscuro/sistema, persistidos, con `ThemeProvider` |
| B4 | Emojis como iconografía | ✅ **Resuelto.** Eliminados de la UI; el logo y los iconos son formas/Ionicons |
| A8 | Nombre y reclamo de «IA» | ✅ **Resuelto de raíz.** La app ya no se llama IA ni lo insinúa |
| A3 | Amigos ficticios | ✅ **Resuelto de raíz.** El apartado se eliminó por completo |
| M4 | Contraste | ✅ Re-verificado en ambos temas (mín. 4.8:1 claro, 5.7:1 oscuro) |
| — | Urgencia por color | ✅ Ahora se codifica con relleno y peso: también funciona para daltonismo |

También cambió el identificador Android (`com.studyflow.ia` → `com.focal.studyapp`),
por lo que Android lo trata como una app nueva, con **keystore propio**.

**Pendiente (requiere decisión o dispositivo):** M1 i18n · B3 crash reporting ·
B6 tests en el repo · B8 metadata de tienda · **Fase 4 completa** (pruebas en
dispositivo real) · alojar `PRIVACY.md` en una URL pública.

---

---

## ⚠️ Alcance real de esta auditoría

**No existe ningún APK.** La compilación en EAS nunca se ejecutó (sin sesión iniciada),
y no hay carpetas `android/` ni `ios/`. Lo auditado es el **código fuente**, que es lo
que genera el APK.

**Verificado** (leyendo el código): lógica, flujos, cumplimiento, textos, assets,
accesibilidad declarada, manejo de errores, configuración de build.

**NO verificable sin dispositivo/APK** — pendiente antes de publicar:

| Área | Por qué no se pudo verificar |
|---|---|
| Rendimiento real, memoria, batería | Requiere profiling en dispositivo |
| Crashes por versión de Android/iOS | Requiere matriz de dispositivos |
| Lectores de pantalla (TalkBack/VoiceOver) | Requiere prueba manual |
| Comportamiento con red lenta/inestable | La app es 100% offline (sin red) — riesgo bajo |
| Metadata de tienda | Aún no existe |
| APIs externas | **No hay ninguna** — la app no hace peticiones de red |

---

## Resumen por severidad

| Severidad | Nº | Significado |
|---|---|---|
| 🔴 Crítico | 5 | Bloquean aprobación o rompen en producción |
| 🟠 Alto | 8 | Defectos graves de UX, corrección o cumplimiento |
| 🟡 Medio | 10 | Pulido, consistencia, robustez |
| 🔵 Bajo | 8 | Optimizaciones y detalles |

---

# 🔴 CRÍTICO

## C1. El flujo de donaciones simula un pago que nunca ocurre

**Ubicación:** `src/screens/DonationsScreen.js:23-31` y `:90`

El botón "Donar ahora" **no cobra nada**. Solo muestra una alerta de agradecimiento y
registra una donación ficticia. Debajo se muestra el texto **"Pago 100% seguro"** junto a
un ícono de candado, sin que exista ninguna pasarela de pago.

```js
const handleDonate = () => {
  addDonation(amount);                    // registra una donación que no existió
  Alert.alert('¡Gracias por tu apoyo! 💜', `Tu donación de ${currencySymbol} ${amount}...`);
};
```

**Impacto:** Es el bloqueador más grave. Incumple simultáneamente:
- **App Store 2.1** — funcionalidad placeholder / incompleta.
- **App Store 3.2.1(vi)** — las donaciones solo pueden recaudarse fuera de IAP si eres una
  ONG registrada y verificada; si no, es obligatorio IAP.
- **Google Play — Deceptive Behavior** y **Payments Policy**.
- Afirmar "Pago 100% seguro" sin procesar pagos es **publicidad engañosa** (riesgo legal,
  no solo de tienda).

**Solución recomendada (para v1.0):** **eliminar por completo el apartado de Donaciones** —
pantalla, banner de Inicio, botón de Onboarding, sección de Perfil y el estado `donations`.
Es la vía más rápida y segura a producción.

Si quieres conservarlo, la única ruta conforme es: constituir/verificar la entidad sin
ánimo de lucro e integrar un proveedor real (Apple Pay / Google Pay / Stripe según
plataforma) — y **eliminar el texto "Pago 100% seguro"** hasta que sea cierto.

**Prioridad:** máxima. Sin esto, rechazo garantizado.

---

## C2. Cero persistencia: la app olvida absolutamente todo al cerrarse

**Ubicación:** `src/context/AppContext.js` (todo el estado en `useState`)

No hay `AsyncStorage` ni almacenamiento de ningún tipo (verificado: 0 coincidencias en
todo `src/`). Al cerrar la app se pierden **tareas, descripciones, fechas de entrega,
nombre de usuario, puntos, personalidad y amigos**. Cada arranque vuelve a los datos de
demostración.

**Impacto:** Una app de productividad que borra las tareas del usuario es **inutilizable**.
Garantiza reseñas de 1★ y encaja en "funcionalidad mínima" (App Store 4.2). Además hace
falsa la promesa del login (ver C3) y vacía de sentido la gamificación.

**Solución recomendada:**
```bash
npx expo install @react-native-async-storage/async-storage
```
Hidratar el estado al montar `AppProvider` y persistir en cada cambio (con `useEffect` +
debounce). Mostrar un splash/loader mientras hidrata para evitar el parpadeo de datos demo.
Versionar el esquema guardado (`{ v: 1, ... }`) para migraciones futuras.

**Prioridad:** máxima.

---

## C3. Texto falso al usuario: "Tu progreso se guarda en este dispositivo"

**Ubicación:** `src/screens/LoginScreen.js:70`

La pantalla de inicio de sesión afirma literalmente que el progreso se guarda. Dado C2,
**es falso**: no se guarda nada.

**Impacto:** Declaración engañosa mostrada en el primer flujo de la app. Combinado con C1,
establece un patrón de afirmaciones no veraces que un revisor detectará.

**Solución:** al resolver C2 la frase se vuelve cierta. Si decides publicar sin
persistencia (no recomendado), **elimina la frase**.

**Prioridad:** máxima (se resuelve junto con C2).

---

## C4. El ícono y el splash son placeholders: cuadrados morados lisos

**Ubicación:** `assets/icon.png`, `assets/adaptive-icon.png`, `assets/splash.png`

Verificado: `icon.png` y `adaptive-icon.png` son **1024×1024 de 5.704 bytes** — un PNG de
color sólido sin ningún dibujo (los generó `scripts/make-assets.js`, que sigue en el repo).

**Impacto:** Rechazo prácticamente seguro (**App Store 2.3.8** — iconos precisos y
profesionales). Un ícono en blanco destruye la conversión en la ficha de tienda.

**Solución recomendada:** diseñar el ícono real reutilizando la identidad ya definida en
`src/components/Logo.js` (tile morado `#7C5CFF` + libro + destello). Requisitos:
- `icon.png` 1024×1024, sin transparencia, sin esquinas redondeadas (iOS las aplica).
- `adaptive-icon.png` 1024×1024 con el motivo dentro del **círculo seguro central de 66%**
  (Android recorta los bordes).
- Splash con el logo centrado sobre `#7C5CFF`.
- Eliminar `scripts/make-assets.js` del repo de producción.

**Prioridad:** máxima.

---

## C5. Sin política de privacidad, términos, ni declaración de datos

**Ubicación:** ausente en todo el proyecto

**Impacto:** Ambas tiendas exigen **URL de política de privacidad siempre**, incluso si la
app no recoge datos:
- **Google Play:** sección *Data Safety* obligatoria; sin ella no se puede publicar.
- **Apple:** *Privacy Nutrition Labels* + URL obligatoria (**5.1.1**).
- **GDPR/CCPA:** aunque los datos sean locales, hay que informar qué se almacena, dónde y
  cómo se borra.

**Solución recomendada:**
1. Publicar una política simple (basta una página en GitHub Pages) que declare con
   honestidad: *"StudyFlow IA almacena tus tareas y tu nombre de usuario únicamente en tu
   dispositivo. No recopilamos, transmitimos ni compartimos datos personales. No usamos
   analítica ni publicidad. Para borrar tus datos, desinstala la app."*
2. Añadir en Perfil enlaces a **Política de privacidad** y **Términos de uso**.
3. En Play Console declarar *"No data collected"* (será cierto una vez todo sea local).

**Prioridad:** máxima.

---

# 🟠 ALTO

## A1. Bug de React: efecto secundario dentro de un actualizador de estado

**Ubicación:** `src/context/AppContext.js:52-62`

```js
setTasks((prev) => prev.map((t) => {
  ...
  setPoints((p) => ...);   // ❌ side effect dentro del updater de setTasks
  return { ...t, done };
}));
```

Los actualizadores de `useState` **deben ser funciones puras**. React puede invocarlos dos
veces (StrictMode en desarrollo con React 19, y en render concurrente), lo que **duplica
los puntos otorgados**.

**Solución:** sacar el cálculo de puntos fuera del updater, o mejor: **derivar los puntos**
de las tareas completadas en lugar de mantenerlos como estado paralelo.
```js
const points = useMemo(
  () => BASE_POINTS + tasks.filter(t => t.done).length * POINTS_PER_TASK,
  [tasks]
);
```
Esto además resuelve A2 de raíz.

**Prioridad:** alta.

---

## A2. Exploit de puntos: farming infinito

**Ubicación:** `src/context/AppContext.js:52-66`

Secuencia: crear tarea → completarla (**+40 pts**) → **eliminarla** (los puntos se quedan)
→ repetir. Los puntos son ilimitados y la clasificación pierde todo sentido.

**Solución:** derivar los puntos de las tareas existentes (ver A1), o descontar los puntos
al eliminar una tarea completada.

**Prioridad:** alta.

---

## A3. La sección "Amigos" es ficticia y lo aparenta como real

**Ubicación:** `src/context/AppContext.js:69-78`, `src/data/seed.js`

Los amigos son datos precargados y **los puntos de cada amigo nuevo se inventan al azar**:
```js
const startPoints = 40 + Math.floor(Math.random() * 180);
```
No hay backend, cuentas, invitaciones ni sincronización. "Compites" contra números
aleatorios.

**Impacto:** Funcionalidad social simulada → **App Store 2.1** (placeholder). Además
frustra al usuario que invite a un amigo real y vea puntos inventados.

**Solución (elige una):**
- **(a) Recomendada para v1:** re-encuadrar como **"Reto personal"** o *"Tabla de ejemplo"*
  con una etiqueta visible **"Datos de demostración"**, y permitir metas propias. Honesto y
  sin backend.
- **(b) Completa:** backend real (Supabase/Firebase) con cuentas e invitaciones — implica
  además login real, política de privacidad ampliada y declaración de datos.

**Prioridad:** alta.

---

## A4. Accesibilidad inexistente

**Verificado:** **0** `accessibilityLabel`, `accessibilityRole`, `accessibilityHint` o
`accessible` en todo `src/` — sobre ~25 controles interactivos en 12 archivos.

Los controles **solo con icono** son completamente invisibles para lectores de pantalla:
menú y campana (Inicio), papelera y checkbox (tareas), `+` (cabecera), `✕` (modal),
flechas de fecha (cronograma), `＋` de amigos.

**Impacto:** Inutilizable para estudiantes con discapacidad visual. Apple rechaza cada vez
más por esto, y en la UE el **European Accessibility Act** es exigible desde junio de 2025.

**Solución:**
```jsx
<TouchableOpacity
  accessibilityRole="button"
  accessibilityLabel="Eliminar tarea"
  accessibilityHint="Elimina esta tarea de tu lista"
  onPress={onDelete}
>
```
Añadir a **todos** los controles. En `TaskItem`, etiquetar el estado:
`accessibilityRole="checkbox"` + `accessibilityState={{ checked: task.done }}`.

**Prioridad:** alta.

---

## A5. Sin manejo de errores ni Error Boundary

**Verificado:** **0** bloques `try/catch` y ningún `ErrorBoundary` en todo el proyecto.

**Impacto:** Cualquier excepción no controlada tumba la app a pantalla blanca sin
recuperación. Con persistencia (C2) el riesgo crece: un JSON corrupto en AsyncStorage
provocaría un crash en bucle al arrancar.

**Solución:**
1. `ErrorBoundary` en la raíz (`App.js`) con pantalla de recuperación amigable.
2. `try/catch` obligatorio alrededor de toda lectura/escritura de AsyncStorage, con
   *fallback* a los datos por defecto.
3. Validar entradas: `parseFloat(custom)` en donaciones acepta `NaN`/negativos/notación
   científica sin sanear.

**Prioridad:** alta.

---

## A6. Estadísticas inventadas en la vista "Mes"

**Ubicación:** `src/screens/ScheduleScreen.js:165`

```js
const monthlyMinutes = summary.studyMinutes * 22; // ~22 study days
```
Se multiplica el plan de un día por 22 y se presenta como **"Resumen del mes"**, como si
fuera historial real. El usuario ve horas de estudio que nunca hizo.

**Impacto:** Métricas falsas en una app de seguimiento de progreso — rompe la confianza y
contradice el propósito del producto.

**Solución:** registrar el historial real de tareas completadas (con fecha) y calcular el
resumen a partir de él. Mientras tanto, mostrar solo datos reales (entregas próximas, que
ya funcionan) y etiquetar cualquier proyección como **"estimado"**.

**Prioridad:** alta.

---

## A7. Botones muertos en la pantalla de Inicio

**Ubicación:** `src/screens/HomeScreen.js:20` y `:23`

El icono de **menú** (☰) y el de **notificaciones** (🔔, con punto rojo de "no leídas") son
`TouchableOpacity` **sin `onPress`**. El punto rojo sugiere notificaciones pendientes que no
existen.

**Impacto:** Controles inertes → App Store 2.1. El badge falso es especialmente engañoso.

**Solución:** implementarlos o **eliminarlos**. Para v1, quitarlos es lo más limpio (no hay
sistema de notificaciones). Nota: si más adelante añades notificaciones push, necesitarás
`expo-notifications`, permiso `POST_NOTIFICATIONS` (Android 13+) y declararlo en privacidad.

**Prioridad:** alta.

---

## A8. La app se llama "IA" y anuncia "IA personalizada" — pero no hay IA

**Ubicación:** nombre del producto, `src/screens/OnboardingScreen.js` (lista de
características), `HomeScreen` ("Crea tu cronograma inteligente ✨")

El "algoritmo" real es una ordenación por urgencia con descansos fijos de 15 min
(`src/utils/schedule.js`). No hay modelo, inferencia ni aprendizaje. Además, la
**personalidad elegida no afecta absolutamente nada** al plan generado — se guarda y solo se
muestra en el Perfil.

**Impacto:** Metadata engañosa (**App Store 2.3.1**), reguladores cada vez más estrictos con
las afirmaciones de IA (FTC), y decepción del usuario al ver que su elección de personalidad
no cambia nada.

**Solución (elige una):**
- **(a) Honesta y rápida:** re-encuadrar como *"planificación inteligente"* / *"cronogramas
  automáticos"*, sin afirmar IA. Mantener el nombre solo si no se publicita capacidad de IA.
- **(b) Cumplir la promesa:** hacer que la personalidad **sí** module el plan (p. ej.
  Procrastinador → bloques más cortos de 25 min con más descansos; Organizado → bloques
  largos; Creativo → alternancia de materias). Es poco código y **vuelve verdadera** la
  propuesta de valor.

Recomiendo **(b) + (a)**: implementar la modulación real y aun así no llamarlo "IA".

**Prioridad:** alta.

---

# 🟡 MEDIO

| # | Problema | Impacto | Solución |
|---|---|---|---|
| **M1** | **Sin internacionalización.** Todo el texto está hardcodeado en español, pero el público objetivo declarado es "estudiantes globales". | Limita el mercado a hispanohablantes. | `expo-localization` + `i18n-js`. Extraer strings a `src/i18n/es.json` / `en.json`. Añadir `locales` en `app.json`. |
| **M2** | **Moneda fija en soles peruanos** (`currencySymbol = 'S/'`, `src/data/seed.js:56`) para audiencia multi-región. | Confuso fuera de Perú. | Desaparece si se elimina Donaciones (C1). Si no, detectar región. |
| **M3** | **Sin modo oscuro** (`userInterfaceStyle: "light"`). | Esperado por defecto en 2026; fatiga visual al estudiar de noche — justo el caso de uso. | Paleta oscura + `useColorScheme()`. El sistema de theming ya está centralizado, así que es viable. |
| **M4** | **Contraste insuficiente.** `textMuted #9A97AE` sobre blanco = **2.83:1**; WCAG AA exige 4.5:1. Se usa en textos de 11–13 px. | Ilegible bajo sol o con baja visión. Incumple WCAG AA. | Oscurecer a ≥ `#6B6880` (~4.6:1). |
| **M5** | **Texto truncado con fuentes grandes.** `numberOfLines={1}` en títulos/descripciones sin límite de escalado. | Con "texto grande" del sistema, los títulos se cortan. | `maxFontSizeMultiplier={1.4}` y permitir 2 líneas en títulos. |
| **M6** | **iPad declarado pero no adaptado** (`supportsTablet: true` + `orientation: "portrait"`). | Apple prueba en iPad; el diseño de una columna se ve estirado. | Poner `supportsTablet: false` en v1, o adaptar con `maxWidth` centrado. |
| **M7** | **Sin pantalla de Ajustes.** No se puede cambiar el nombre de usuario, borrar datos ni cerrar sesión. | GDPR/CCPA esperan control sobre los datos ("derecho al borrado"). | Añadir Ajustes con *Editar nombre*, *Borrar todos mis datos*, enlaces legales. |
| **M8** | **Sin estado de carga inicial.** Al añadir persistencia, se verá un parpadeo de datos demo antes de hidratar. | Percepción de bug. | Mantener el splash hasta que el estado esté hidratado (`expo-splash-screen` ya está instalado). |
| **M9** | **Parseo de fechas duplicado.** `new Date(\`${task.dueDate}T00:00:00\`)` repetido en `ScheduleScreen` en lugar de usar `parseDateKey()` de `utils/time.js`. | Inconsistencia; riesgo de divergencia. | Usar siempre el helper. |
| **M10** | **Sin límites en entradas de texto.** La descripción no tiene `maxLength`; el nombre de tarea acepta 10.000 caracteres. | Rompe el layout; infla el almacenamiento. | `maxLength={80}` en título, `{500}` en descripción. |

---

# 🔵 BAJO

| # | Problema | Solución |
|---|---|---|
| **B1** | `scheme: "studyflowia"` declarado pero sin deep links implementados. | Implementarlos o quitar el `scheme`. |
| **B2** | `scripts/make-assets.js` (generador de placeholders) sigue en el repo. | Eliminar tras crear los assets reales (C4). |
| **B3** | Sin crash reporting ni analítica. | `sentry-expo` — sin visibilidad, los crashes en producción son invisibles. Declararlo en privacidad. |
| **B4** | **Emojis como iconografía** en logo, materias y avatares. | Renderizan distinto en cada OS/versión y algunos no existen en Android antiguo. Migrar a SVG (`react-native-svg`). |
| **B5** | `idCounter` es un contador en memoria que reinicia a 100 en cada arranque. | **Al añadir persistencia (C2) provocará colisión de IDs.** Usar `expo-crypto` `randomUUID()`. |
| **B6** | Cero tests. | Al menos tests unitarios de `utils/` (`schedule`, `time`, `urgency`) — es lógica pura y fácil de cubrir. |
| **B7** | 11 vulnerabilidades *moderate* en `npm audit`. | Transitivas del tooling de Expo, no afectan al runtime del APK. Revisar antes de cada release. |
| **B8** | Metadata de tienda inexistente. | Ver checklist abajo. |

---

## 📋 Checklist de metadata de tienda (pendiente de crear)

- **Nombre:** máx. 30 caracteres. ⚠️ Si mantienes "IA" en el nombre, no publicites
  capacidades de IA (ver A8).
- **Subtítulo/descripción corta:** 30 / 80 caracteres.
- **Descripción larga:** enfocada al beneficio ("reduce la ansiedad académica"), sin
  afirmar funciones inexistentes (IA, social real, donaciones).
- **Capturas:** mínimo 2 (Apple exige 6.7" y 6.5"; Google, teléfono + 7"/10" si declaras
  tablet). Usar contenido real de la app, sin mockups engañosos.
- **Categoría:** Educación (primaria) / Productividad (secundaria).
- **Clasificación por edad:** completar cuestionarios de ambas tiendas.
- **URL de política de privacidad:** obligatoria (C5).
- **Data Safety (Play) / Privacy Labels (Apple):** declarar "sin recopilación de datos".

---

## 🗺️ Plan de acción recomendado

### Fase 1 — Desbloquear el lanzamiento (obligatorio)
1. **Eliminar el apartado de Donaciones** completo *(C1)*.
2. **Implementar persistencia** con AsyncStorage + hidratación *(C2, C3)*.
3. **Diseñar ícono y splash reales** *(C4)*.
4. **Publicar política de privacidad** y enlazarla en la app *(C5)*.

### Fase 2 — Corrección y honestidad (antes de enviar)
5. Derivar puntos de las tareas → arregla el bug de React y el exploit *(A1, A2)*.
6. Eliminar los botones muertos del Inicio *(A7)*.
7. Etiquetar Amigos como demo, o construirlo de verdad *(A3)*.
8. Hacer que la personalidad **sí** module el plan + ajustar los textos de IA *(A8)*.
9. Sustituir las estadísticas inventadas del mes por datos reales *(A6)*.
10. Añadir `ErrorBoundary` y `try/catch` en almacenamiento *(A5)*.
11. Añadir props de accesibilidad a todos los controles *(A4)*.

### Fase 3 — Pulido (recomendado antes de v1.0)
12. Corregir contraste *(M4)*, escalado de texto *(M5)*, pantalla de Ajustes con borrado de
    datos *(M7)*.
13. Decidir sobre iPad *(M6)* y modo oscuro *(M3)*.
14. Internacionalización si el objetivo es realmente global *(M1)*.

### Fase 4 — Verificación en dispositivo (imprescindible, no cubierto aquí)
15. Compilar el APK y probar en dispositivos reales (Android 8 → 15).
16. Probar con **TalkBack** y **VoiceOver** activados.
17. Probar con el tamaño de fuente del sistema al máximo.
18. Perfilar arranque en frío, memoria y batería.

---

## ✅ Lo que ya está bien

Para no perder de vista lo sólido del proyecto:

- **Arquitectura limpia y escalable:** separación clara `theme / utils / components /
  screens / navigation / context`. Sistema de diseño centralizado.
- **Superficie de riesgo mínima:** **cero peticiones de red, cero APIs externas, cero SDKs
  de terceros, cero permisos solicitados** — esto simplifica enormemente el cumplimiento de
  privacidad y elimina de raíz los problemas de red lenta/inestable.
- **Sin credenciales ni secretos** en el código (verificado).
- **Dependencias alineadas** con Expo SDK 56 (`expo-doctor`: 21/21 ✅).
- **El bundle compila limpio** sin errores.
- **Coherencia visual** fiel al diseño original.
- **`eas.json` correctamente configurado** para generar APK (`preview`) y AAB
  (`production`).
