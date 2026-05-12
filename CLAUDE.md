# CLAUDE.md — SuraBank

Memoria del proyecto y guía operativa para futuras sesiones de Claude Code.

---

## 1. Contexto del proyecto

**SuraBank** es un test de evaluación técnica (challenge front + back) que debe entregarse como **Web Mobile**. Evalúa maestría técnica y capacidad de construir un producto end-to-end siguiendo un alcance y especificaciones dadas.

- **Repo:** https://github.com/horacioparisotto/SuraBank.git
- **Diseño Figma:** https://www.figma.com/design/VgRZx1RBY3N3SvrYtY1aK0/SuraChallenge-Figma?node-id=0-1
- **Entrega esperada:** repositorio + link al proyecto en vivo.
- **Scope visual:** solo mobile (tablet/desktop opcionales).

### Historias de usuario (alcance mínimo)

1. **Login** — Iniciar sesión para acceder a tarjetas y movimientos.
2. **Home — Tarjetas y balances** — Ver todas las tarjetas y sus balances.
3. **Home — Movimientos recientes** — Ver los últimos 5 movimientos.

### Credenciales de login (mock)

- email: `user@suragaming.com`
- password: `SURA2026!$`
- Devolver token ficticio (no se exige OAuth/JWT real).

### Endpoints a implementar

| Método | Ruta                          | Auth | Descripción                              |
|--------|-------------------------------|------|------------------------------------------|
| POST   | `/surabank/login`             | —    | Login, devuelve `{ name, token }`        |
| GET    | `/surabank/cards`             | Bearer-like header `Authorization: token` | Lista de tarjetas (al menos 1 Mastercard + 1 Visa) |
| GET    | `/surabank/movements/last`    | Bearer-like header `Authorization: token` | Últimos 5 movimientos                    |

### Entidades

```ts
// Card
{ id: number, issuer: string, name: string, expDate: string, lastDigits: number, balance: string, currency: string }

// Transaction
{ id: number, title: string, amount: string, transactionType: 'SUS' | 'CASH_IN' | 'CASH_OUT', date: string }
```

### Recomendaciones del enunciado

- UI: Tailwind / Shadcn / NextUI (también válido Styled Components o SCSS).
- Stack libre: Next/Remix full-stack, o Next + Node API separados.
- **Idealmente** usar DB relacional + ORM (evalúan capacidad de interactuar con DB).
- Fuentes: **Inter** y **Poppins**.

### Trofeos (extras opcionales)

- 🏆 **¡Magia!** — Animaciones y microinteracciones.
- 🏆 **¡Suena bien!** — Sonidos en interacciones.
- 🏆 **¡Con calidad!** — ESLint + Prettier configurados.
- 🏆 **¡Inbugeable!** — >70% cobertura de tests.
- 🏆 **Manija** — Features extra más allá del scope.

---

## 2. Pasos a seguir

### Fase 0 — Setup (hecho automáticamente al iniciar)

- [x] Cargar enunciado en `README.md`.
- [x] Crear `CLAUDE.md` con memoria y plan.
- [x] `git init` + commit inicial.
- [x] Conectar al remoto `https://github.com/horacioparisotto/SuraBank.git` y push.

### Fase 1 — Scaffolding

- [x] Stack confirmado (ver sección 3).
- [ ] `create-next-app` con TS + Tailwind + App Router + ESLint.
- [ ] Instalar Shadcn CLI + componentes base (button, input, card).
- [ ] Configurar Prettier + lint-staged + Husky.
- [ ] Agregar fuentes Inter y Poppins via `next/font`.
- [ ] Setup Vitest + Testing Library + MSW.
- [ ] Estructura de carpetas: `/app`, `/components`, `/lib`, `/prisma`, `/tests`.

### Fase 2 — Backend / API

- [ ] Conectar PlanetScale (crear DB `surabank`, copiar connection string a `.env`).
- [ ] Modelar DB con Prisma: `User`, `Card`, `Transaction`.
- [ ] `prisma migrate` + seed (user de prueba, 1 Mastercard + 1 Visa, 6+ transacciones).
- [ ] Helper `lib/auth.ts` para validar cookie httpOnly con token ficticio.
- [ ] Setup Upstash Redis client (`lib/redis.ts`).
- [ ] `POST /surabank/login` (validar credenciales, generar token, set cookie).
- [ ] `GET /surabank/cards` (auth check, leer de Redis, fallback a DB, cachear).
- [ ] `GET /surabank/movements/last` (auth check, limit 5, orden desc, cache).
- [ ] Schemas Zod para todas las requests/responses.

### Fase 3 — Frontend (mobile-first)

- [ ] Layout mobile-first siguiendo el Figma.
- [ ] Provider de TanStack Query.
- [ ] Página `/login` con form (RHF + Zod), manejo de errores.
- [ ] Middleware de Next para proteger `/` (verificar cookie).
- [ ] Página `/` (home): cards carousel + lista de últimos 5 movimientos.
- [ ] Componente `CardItem` (issuer logo, lastDigits, balance, currency, expDate).
- [ ] Componente `TransactionItem` (title, amount, transactionType, date).
- [ ] Estados: loading (skeletons), empty, error.
- [ ] Logout (clear cookie + redirect).

### Fase 4 — Trofeos

- [ ] Framer Motion: transición login→home, swipe cards, fade-in transactions.
- [ ] use-sound: tap, login OK, swipe.
- [ ] Tests: unit (lib/), integration (API routes con MSW), component (RTL). Meta: >70%.
- [ ] Features extra (manija): dark mode, swipe entre tarjetas, gráfico de gastos por categoría.

### Fase 5 — Entrega

- [ ] Deploy a Vercel (conectar repo, set env vars: DATABASE_URL, REDIS_URL, etc).
- [ ] PlanetScale: promote branch a production.
- [ ] README final: stack, setup local, credenciales de prueba, link en vivo, badges de cobertura.
- [ ] Tag/release final.

---

## 3. Decisiones tomadas

**Motivación:** matchear el stack del puesto al que el usuario se postula (Next.js, React Native, MySQL, Redis, AWS/Vercel, TypeScript).

| Capa | Elección |
|------|----------|
| Framework | **Next.js 15 (App Router) + TypeScript** — full-stack en un solo repo |
| DB | **MySQL en PlanetScale** (free tier, serverless, branching tipo git) |
| ORM | **Prisma** |
| Cache | **Redis en Upstash** (free tier) — cachear `/cards` y `/movements/last` por token |
| UI | **Tailwind + Shadcn** |
| Fuentes | **Inter + Poppins** via `next/font` |
| Animaciones | **Framer Motion** (trofeo ¡Magia!) |
| Sonidos | **use-sound** (trofeo ¡Suena bien!) |
| Lint/Format | **ESLint + Prettier + lint-staged + Husky** (trofeo ¡Con calidad!) |
| Tests | **Vitest + Testing Library + MSW** — objetivo >70% cobertura (trofeo ¡Inbugeable!) |
| Validación | **Zod** en request/response de API routes |
| Data fetching cliente | **TanStack Query (React Query)** |
| Auth storage | **Cookie httpOnly** (no localStorage) — más profesional |
| Deploy | **Vercel** (front + API) + PlanetScale (DB) + Upstash (Redis) |

### Trofeos a perseguir

- [x] ¡Con calidad! — ESLint + Prettier
- [x] ¡Magia! — Framer Motion
- [x] ¡Inbugeable! — Vitest >70%
- [x] ¡Suena bien! — use-sound

---

## 4. Convenciones para esta sesión

- Idioma del usuario: **español**. Responder en español.
- Mobile-first siempre — no perder tiempo en breakpoints desktop salvo que se pida.
- Commits descriptivos, conventional commits (feat:, fix:, chore:, test:, docs:).
- Mantener este `CLAUDE.md` actualizado a medida que avanzamos: marcar tareas hechas, anotar decisiones tomadas.
