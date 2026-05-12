# SuraBank — Test de Evaluación Técnica

> **Implementación de Horacio Parisotto** — Web Mobile full-stack con Next.js 16 (App Router) + TypeScript + Tailwind v4 + Shadcn + Prisma + SQLite.

## Setup local

```bash
pnpm install
pnpm db:setup        # corre la migración Prisma + seed (crea user@suragaming.com / SURA2026!$)
pnpm dev             # http://localhost:3000
```

Abrí la URL en una ventana **menor a 768 px de ancho** (DevTools → device toolbar, o desde el celular).
Si la ventana es más grande, aparece un overlay estético pidiendo cambiar a vista mobile.

### Credenciales de prueba

- **Email:** `user@suragaming.com`
- **Password:** `SURA2026!$`

### Scripts

| Comando              | Qué hace                              |
| -------------------- | ------------------------------------- |
| `pnpm dev`           | Dev server (Turbopack)                |
| `pnpm build`         | Build producción                      |
| `pnpm test`          | Corre Vitest una vez                  |
| `pnpm test:coverage` | Reporte de cobertura (objetivo ≥ 70%) |
| `pnpm db:setup`      | Migra DB + ejecuta seed               |
| `pnpm prisma:reset`  | Borra y re-crea la DB local           |
| `pnpm format`        | Prettier sobre todo el repo           |
| `pnpm lint`          | ESLint                                |

### Stack

- **Framework:** Next.js 16 (App Router, Turbopack, React 19)
- **UI:** Tailwind v4 + Shadcn (base-nova preset) + Lucide icons
- **Auth:** Cookie httpOnly + middleware (`src/proxy.ts`, convención Next 16)
- **DB:** SQLite + Prisma 6
- **Data fetching:** TanStack Query
- **Validación:** Zod
- **Forms:** React Hook Form + zodResolver
- **Animaciones:** Framer Motion (🏆 ¡Magia!)
- **Sonidos:** use-sound (🏆 ¡Suena bien!)
- **Tests:** Vitest + Testing Library + happy-dom (🏆 ¡Inbugeable! — **93.85% statements / 95.20% lines** ≫ 70%)
- **Calidad:** ESLint + Prettier + lint-staged + Husky (🏆 ¡Con calidad!)

### Rutas

| Tipo | Path                           | Descripción                                                                                        |
| ---- | ------------------------------ | -------------------------------------------------------------------------------------------------- |
| Page | `/login`                       | Form de login con validación Zod                                                                   |
| Page | `/`                            | Home: header, carrusel de tarjetas, últimos 5 movimientos, tab bar                                 |
| Page | `/movements`                   | Lista completa de movimientos (accesible desde la 🔍 del home) con búsqueda y agrupación por fecha |
| API  | `POST /surabank/login`         | Valida credenciales, setea cookie httpOnly, devuelve `{ name, token }`                             |
| API  | `POST /surabank/logout`        | Invalida token y borra cookie                                                                      |
| API  | `GET /surabank/cards`          | Tarjetas del usuario (1 Mastercard + 1 Visa por seed)                                              |
| API  | `GET /surabank/movements/last` | Últimos 5 movimientos, orden desc                                                                  |
| API  | `GET /surabank/movements`      | Todos los movimientos del usuario                                                                  |

Las APIs aceptan tanto la cookie httpOnly como el header `Authorization: <token>` (cumple lo pedido en el enunciado).

### Manija extra

- **Pantalla `/movements`** con búsqueda y agrupación por fecha.
- **Tab bar** inferior (Home / Movements / Logout).
- **Swipe carousel** entre tarjetas con dots indicator y sonido en cada cambio.
- **MobileOnlyGate**: overlay estético si el viewport es > 767px.

### Notas de migración para deploy (Fase 5, opcional)

- DB: SQLite local → MySQL en PlanetScale (cambiar `provider` en `schema.prisma`).
- Cache: agregar Upstash Redis en endpoints `/cards` y `/movements/last`.
- Deploy: Vercel con env vars `DATABASE_URL` + `AUTH_COOKIE_NAME`.

---

## Descripción del Desafío

Tu objetivo es construir la plataforma **SuraBank** en forma de una **Web Mobile**, la cual debe contener las siguientes historias de usuario:

- **Login | Inicio de Sesión:**
  - Como usuario de SuraBank, quiero poder iniciar sesión en la plataforma para acceder a mis tarjetas y movimientos.
- **Home | Visualización de Tarjetas y Balances:**
  - Como usuario de SuraBank, quiero poder ver todas mis tarjetas y sus respectivos balances para estar informado de mis gastos.
- **Home | Visualización de Movimientos Recientes:**
  - Como usuario de SuraBank, quiero poder ver los últimos 5 movimientos de mis tarjetas para mantenerme al día con mis transacciones recientes.

A continuación, la especificación de la API y el diseño UI.

- [Especificación API](https://www.notion.so/Especificaci-n-API-5d8f0216ce6d828d900e012a83251fdf?pvs=21)
- [Diseño Figma](https://www.figma.com/design/VgRZx1RBY3N3SvrYtY1aK0/SuraChallenge-Figma?node-id=0-1&t=XZaJBOmdnI93xRQx-1)

### Importante

- Recomendamos usar herramientas como [Tailwind](https://tailwindcss.com/), [Shadcn](https://ui.shadcn.com/) o [NextUI](https://nextui.org/) para acelerar el desarrollo de la UIs. Si tenes mas cancha con herramientas como Styled Components o SCSS también es valido.
- Dado que el challenge es **front y back**, podes usar el patron con el que mas te sientas comodo/a. Podes hacer el Front con Next/Remix y conectarte a un API externa con Node, o interactuar con una DB directamente desde Next/Remix.
- Idealmente se debe usar una DB relacional y un ORM ya que queremos evaluar tu capacidad de interactuar con una base de datos.
- Las fuentes usadas son [Inter](https://fonts.google.com/specimen/Inter) y [Poppins](https://fonts.google.com/specimen/Poppins).
- El challenge debe ser entregado solamente como Web Mobile, no hace falta que hagas tablet o desktop (a menos que sea algo que quieras hacer).

### Trofeos Sura 🏆

- **¡Magia!** Agrega animaciones y microinteracciónes a la interfaz de usuario.
- **¡Suena bien!** Añade sonidos a las interacciones en la interfaz de usuario.
- **¡Con calidad!** Configura las reglas de eslint y prettier.
- **¡Inbugeable!** Logra más del 70% de cobertura en las pruebas.

### 🏆 Los Trofeos Manija 🏆

- ¡Agrega nuevas features al desafío!

---

**Entrega:** Se debe enviar el/los repositorio/s y un link con el proyecto en vivo.

---

## Especificación API

### POST — Login a SuraBank

Debería poder loguearme usando estas credenciales:

- **email:** `user@suragaming.com`
- **password:** `SURA2026!$`

**Nota:** No hace falta implementar nada relacionado a OAuth o JWT, se puede devolver un token ficticio.

```jsonc
POST /surabank/login

// REQUEST
{
   "email": string,
   "password": string
}

// RESPONSE
{
    "success": boolean,
    "data": {
        "name": string,
        "token": string
    }
}
```

---

### GET — Tarjetas de usuario

Debe obtener todas las tarjetas del usuario. Al menos debe tener:

- Una tarjeta Mastercard
- Una tarjeta Visa

```jsonc
// CARDS ENTITY
{
    "id": number,
    "issuer": string,
    "name": string,
    "expDate": string,
    "lastDigits": number,
    "balance": string,
    "currency": string
}
```

```jsonc
GET /surabank/cards

// RESPONSE
{
    "success": boolean,
    "data": CARDS[]
}
```

**HEADERS:**

- KEY: `Authorization`
- VALUE: `token`

---

### GET — Últimos movimientos del usuario

Debe traer los últimos 5 movimientos del usuario.

```jsonc
// TRANSACTIONS ENTITY
{
    "id": number,
    "title": string,
    "amount": string,
    "transactionType": string, // SUS | CASH_IN | CASH_OUT
    "date": string
}
```

```jsonc
GET /surabank/movements/last

// RESPONSE
{
    "success": boolean,
    "data": TRANSACTIONS[]
}
```

**HEADERS:**

- KEY: `Authorization`
- VALUE: `token`

---

## Enlaces

- **Figma:** https://www.figma.com/design/VgRZx1RBY3N3SvrYtY1aK0/SuraChallenge-Figma?node-id=0-1&p=f&t=2ZHOfpnW45hZ4Az3-0
- **Repositorio:** https://github.com/horacioparisotto/SuraBank.git
