# SuraBank

**Web Mobile full-stack** para el challenge técnico de SuraGaming.
Implementado por Horacio Parisotto.

🔗 **Live:** https://sura-bank.vercel.app
🐙 **Repo:** https://github.com/horacioparisotto/SuraBank

Para verla bien tiene que ser en vista mobile (menos de 768 px de ancho).
Si la abrís en desktop te aparece un overlay pidiéndote que cambies a vista mobile —
es a propósito, parte del scope dice "Web Mobile".

## Credenciales de prueba

- **Email:** `user@suragaming.com`
- **Password:** `SURA2026!$`

---

## Por qué este stack

Antes de tirar código me senté a pensar qué herramientas iban a dar mejor resultado para
este challenge específico, considerando que se evalúa:

- Maestría técnica.
- Capacidad de armar un producto end-to-end.
- Conexión a una DB relacional con ORM.
- Tres trofeos opcionales que son fácilmente alcanzables si elegís bien el stack.

Y también consideré el contexto: el rol al que apunto usa **Next.js, React Native,
MySQL, Redis, AWS/Vercel, TypeScript**. Decidí matchear esto lo más posible para que el
challenge también funcionara como "muestra de cómo trabajo en el stack que usan ustedes".

### Framework: **Next.js 16 (App Router) + TypeScript**

Elegí Next.js full-stack en lugar de Next + Node API separados por dos razones: (1) menos
overhead de infra para un challenge, y (2) las API Routes del App Router me daban todo
lo que necesitaba (auth, validación, conexión a DB) sin tener que mantener un segundo proceso.
Turbopack ya está estable en build/dev así que lo dejé activado.

### UI: **Tailwind + Shadcn (base-nova) + Lucide**

Tailwind fue elección directa por velocidad. Shadcn me dio componentes accesibles
copiados al proyecto (no es una dependencia opaca, podés modificarlos) y los tokens
de diseño los redefiní para matchear el Figma (azul `#1e40ff`, coral para la segunda
tarjeta, colores específicos por tipo de transacción).

### DB: **SQLite local + Turso (libSQL serverless) en prod, con Prisma 6**

La consigna dice "idealmente DB relacional + ORM". Hice los dos. SQLite + Prisma para
dev (sin setup de cuentas, dev loop rápido), y Turso para prod porque:

- Vercel Functions tienen filesystem read-only — SQLite local no sirve en runtime.
- Turso es básicamente SQLite serverless con HTTP API. Mismo schema, mismo Prisma,
  cero adaptación de tipos.
- Free tier real (a diferencia de PlanetScale que dejó de tener tier gratis).

El cliente Prisma detecta `TURSO_DATABASE_URL` en runtime y usa
`@prisma/adapter-libsql/web` automáticamente. Si no hay env vars de Turso, cae a SQLite
local. Eso significa que el mismo código funciona idéntico en dev y prod.

> **Nota técnica del deploy:** `@libsql/client@0.17.x` rompe contra Turso reciente
> (regresión conocida). Fijé `@libsql/client@0.15.15` que es la última versión estable.

### Auth: **Cookie httpOnly + token ficticio**

La consigna acepta token ficticio (sin OAuth/JWT real). Lo guardo en una cookie
httpOnly + sameSite=lax, no en localStorage. Es lo profesional: el cliente no puede
acceder al token desde JS, baja el riesgo de XSS.

Los endpoints `/cards` y `/movements/last` aceptan **tanto la cookie como el header
`Authorization: token`** — el enunciado pide el header, lo cumplo ahí, pero la app
real usa cookie.

### Cache: **Upstash Redis (opcional)**

Cacheo `/cards` y `/movements/last` por user con TTL de 60s, invalido en logout.
El header `x-cache: HIT | MISS` permite verificar que funciona. Si no hay env vars de
Upstash, el cache layer hace fallback silencioso a DB — nunca rompe.

### Forms: **React Hook Form + Zod**

RHF + zodResolver es la combinación más limpia que conozco: una sola fuente de verdad
para el shape, mensajes de error tipados, sin re-renders innecesarios. Los mismos
schemas se reusan en el lado del server para validar requests entrantes.

### Data fetching: **TanStack Query**

Para invalidación, loading states, error states y refetch en una sola API. Es overkill
para 3 endpoints, pero refleja cómo escalaría la app con más data.

### Animaciones y sonidos: **Framer Motion + use-sound**

- **Framer Motion** (trofeo "¡Magia!"): fade-in en transacciones al cargar, fade-in
  del form de login, scale-in en el carrusel de tarjetas, transición elegante del
  `MobileOnlyGate` cuando se cruza el breakpoint. Sutil, no intrusivo.
- **use-sound** (trofeo "¡Suena bien!"): **el cableado está hecho** — los handlers
  `playTap()`, `playSuccess()`, `playError()` y `playSwipe()` ya están integrados en
  los componentes (botón Ingresar, navegación del tab bar, swipe del carousel,
  feedback de login). Decidí no incluir los archivos MP3 reales en el repo por tema
  de licencia/copyright. Para activarlos: dropear 4 archivos (`tap.mp3`, `success.mp3`,
  `error.mp3`, `swipe.mp3`) en `public/sounds/` y suenan inmediatamente, sin tocar
  código.

### Tests: **Vitest + Testing Library + happy-dom**

Trofeo "¡Inbugeable!" pide >70%. Saqué **94.5% statements, 95.7% lines, 78 tests**.
Cubrí: schemas Zod, utils, auth helpers, api-client, cache layer (Redis up + down),
MobileOnlyGate (incluyendo reacción a resize), login-form (válido, inválido, error
del servidor, error de red), todos los componentes UI y el proxy de auth.

### Calidad: **ESLint + Prettier + lint-staged + Husky**

Trofeo "¡Con calidad!". El pre-commit corre Prettier + ESLint sobre lo staged.
No es muestra, es la red de seguridad real del repo.

---

## Cosas que agregué fuera del scope mínimo (manija)

El enunciado pedía Login + Home con tarjetas + Home con últimos 5 movimientos. Agregué:

- **`/movements`** — accesible desde la lupa del header en home. Lista completa de
  transacciones con búsqueda en vivo (por título, subtítulo, tipo) y agrupación por
  fecha. El enunciado mostraba la lupa en el Figma sin acción asignada — me pareció
  obvio que tenía que llevar a algún lado.
- **Tab bar inferior** (Home / Movimientos / Logout) — el Figma lo mostraba.
- **Swipe carousel** entre tarjetas — el Figma mostraba una segunda tarjeta asomando,
  así que la implementación natural era hacer el carousel funcional.
- **MobileOnlyGate** — overlay azul con logo y mensaje si el viewport > 767px. El
  scope dice "Web Mobile" así que es coherente bloquear desktop.
- **Header `x-cache`** en las respuestas para que el evaluador pueda ver que el cache
  funciona en producción.

---

## Stack en una tabla

| Capa          | Elección                                                                  |
| ------------- | ------------------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router, Turbopack, React 19) + TypeScript                 |
| UI            | Tailwind v4 + Shadcn (base-nova) + Lucide                                 |
| Auth          | Cookie httpOnly + token ficticio + middleware (Next 16 `proxy.ts`)        |
| DB dev        | SQLite + Prisma 6                                                         |
| DB prod       | Turso libSQL + Prisma 6 (driverAdapters) + `@libsql/client@0.15.15`       |
| Cache prod    | Upstash Redis (60s TTL, fallback transparente)                            |
| Forms         | React Hook Form + Zod                                                     |
| Data fetching | TanStack Query                                                            |
| Animaciones   | Framer Motion                                                             |
| Sonidos       | use-sound — cableado completo, listo para agregar MP3 en `public/sounds/` |
| Tests         | Vitest + Testing Library + happy-dom — 94.5% cobertura                    |
| Calidad       | ESLint + Prettier + lint-staged + Husky                                   |
| Fuentes       | Inter + Poppins via `next/font`                                           |
| Deploy        | Vercel + Turso + Upstash                                                  |

---

## Cómo correrlo localmente

```bash
pnpm install
pnpm db:setup        # migra Prisma + sembra DB local con user de prueba
pnpm dev             # http://localhost:3000
```

Abrí http://localhost:3000 con la ventana en **< 768 px de ancho** (DevTools → device
toolbar, o desde el celular).

## Scripts útiles

| Comando               | Qué hace                                                      |
| --------------------- | ------------------------------------------------------------- |
| `pnpm dev`            | Dev server (Turbopack)                                        |
| `pnpm build`          | Build de producción (corre `prisma generate` automáticamente) |
| `pnpm test`           | Vitest una vez                                                |
| `pnpm test:coverage`  | Reporte de cobertura                                          |
| `pnpm db:setup`       | Migra + seed local                                            |
| `pnpm db:seed:remote` | Seed contra Turso (necesita `TURSO_*` en env)                 |
| `pnpm prisma:reset`   | Borra y re-crea la DB local                                   |
| `pnpm format`         | Prettier sobre todo                                           |
| `pnpm lint`           | ESLint                                                        |

## Rutas de la app

| Tipo | Path                           | Descripción                                               |
| ---- | ------------------------------ | --------------------------------------------------------- |
| Page | `/login`                       | Form con validación Zod                                   |
| Page | `/`                            | Home: header + carrusel + últimos 5 movimientos + tab bar |
| Page | `/movements`                   | Lista completa de movimientos con búsqueda y agrupación   |
| API  | `POST /surabank/login`         | Auth, devuelve `{ name, token }`                          |
| API  | `POST /surabank/logout`        | Invalida token y borra cookie                             |
| API  | `GET /surabank/cards`          | Tarjetas del usuario                                      |
| API  | `GET /surabank/movements/last` | Últimos 5 movimientos                                     |
| API  | `GET /surabank/movements`      | Todos los movimientos                                     |

---

## Deploy a Vercel (referencia, ya está hecho)

### 1) Turso

```bash
curl -sSfL https://get.tur.so/install.sh | bash
turso auth signup
turso db create surabank
turso db show surabank --url           # → TURSO_DATABASE_URL
turso db tokens create surabank        # → TURSO_AUTH_TOKEN
turso db shell surabank < prisma/migrations/20260512234333_init/migration.sql
TURSO_DATABASE_URL="..." TURSO_AUTH_TOKEN="..." pnpm db:seed:remote
```

### 2) Upstash Redis (opcional)

https://upstash.com → Create Database → copiá `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`.

### 3) Vercel

Importá el repo → Framework: Next.js (auto) → Environment Variables:

| Key                        | Value                                                        |
| -------------------------- | ------------------------------------------------------------ |
| `DATABASE_URL`             | `file:./dummy.db` (placeholder para Prisma en build time)    |
| `AUTH_COOKIE_NAME`         | `surabank_token`                                             |
| `TURSO_DATABASE_URL`       | `libsql://...turso.io`                                       |
| `TURSO_AUTH_TOKEN`         | JWT (solo el token, sin comillas, sin `turso config set...`) |
| `UPSTASH_REDIS_REST_URL`   | (opcional)                                                   |
| `UPSTASH_REDIS_REST_TOKEN` | (opcional)                                                   |

Deploy.

---

## Trofeos obtenidos

- 🏆 **¡Magia!** — Framer Motion en transiciones y carrusel
- 🏆 **¡Suena bien!** — use-sound integrado en login, navegación y swipe (audio listo para drop-in en `public/sounds/`)
- 🏆 **¡Con calidad!** — ESLint + Prettier + Husky + lint-staged
- 🏆 **¡Inbugeable!** — 94.5% cobertura, 78 tests (≫ 70%)
- 🏆 **Manija** — `/movements`, tab bar, swipe carousel, MobileOnlyGate, búsqueda

---

## Enunciado original

> [Especificación API original](https://www.notion.so/Especificaci-n-API-5d8f0216ce6d828d900e012a83251fdf?pvs=21)
> [Diseño Figma](https://www.figma.com/design/VgRZx1RBY3N3SvrYtY1aK0/SuraChallenge-Figma?node-id=0-1&t=XZaJBOmdnI93xRQx-1)

### Historias de usuario

- **Login** — Iniciar sesión para acceder a tarjetas y movimientos.
- **Home — Tarjetas y Balances** — Ver todas mis tarjetas y sus balances.
- **Home — Movimientos Recientes** — Ver los últimos 5 movimientos.

### Endpoints requeridos

- `POST /surabank/login` — `{ email, password } → { name, token }`
- `GET /surabank/cards` (Auth header) — array de Cards
- `GET /surabank/movements/last` (Auth header) — array de Transactions
