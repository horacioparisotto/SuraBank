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

| Método | Ruta                       | Auth                                      | Descripción                                        |
| ------ | -------------------------- | ----------------------------------------- | -------------------------------------------------- |
| POST   | `/surabank/login`          | —                                         | Login, devuelve `{ name, token }`                  |
| GET    | `/surabank/cards`          | Bearer-like header `Authorization: token` | Lista de tarjetas (al menos 1 Mastercard + 1 Visa) |
| GET    | `/surabank/movements/last` | Bearer-like header `Authorization: token` | Últimos 5 movimientos                              |

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

- [ ] **Local: SQLite + Prisma** (decisión 2026-05-12 — no bloquearse en setup de cuentas; migración a MySQL/PlanetScale queda para deploy).
- [ ] Modelar DB con Prisma: `User`, `Card`, `Transaction`.
- [ ] `prisma migrate` + seed (user `user@suragaming.com` / `SURA2026!$` con name "Carlos", 1 Mastercard + 1 Visa, 6+ transacciones mezclando SUS/CASH_IN/CASH_OUT).
- [ ] Helper `lib/auth.ts` para validar cookie httpOnly con token ficticio.
- [ ] ~~Setup Upstash Redis client~~ → **pospuesto a Fase 5** (deploy).
- [ ] `POST /surabank/login` (validar credenciales, generar token, set cookie, devolver `{ name, token }`).
- [ ] `GET /surabank/cards` (auth check, devolver todas las tarjetas del user).
- [ ] `GET /surabank/movements/last` (auth check, limit 5, orden desc).
- [ ] `GET /surabank/movements` (auth check, todas las transacciones — usado por pantalla /movements).
- [ ] Schemas Zod para todas las requests/responses.

### Fase 3 — Frontend (mobile-first)

- [ ] Layout mobile-first siguiendo el Figma.
- [ ] Provider de TanStack Query.
- [ ] **`MobileOnlyGate`**: componente client que detecta viewport con `matchMedia('(max-width: 767px)')`. Si el viewport es mayor que mobile, renderiza un overlay full-screen estético (logo SuraBank + mensaje "Esta experiencia está diseñada para vista mobile. Achicá la ventana o abrí desde el celular.") en vez del contenido. Sin botón de resize (los browsers bloquean `window.resizeTo` en tabs normales — decisión tomada para evitar UX rota).
- [ ] Página `/login` con form (RHF + Zod), manejo de errores.
- [ ] Middleware de Next para proteger `/` (verificar cookie).
- [ ] Página `/` (home): header "Hola {name}" + lupa + campana (decorativa), cards carousel con swipe, lista de últimos 5 movimientos, tab bar inferior.
- [ ] Página `/movements`: lista completa de transacciones (accesible desde lupa del header en home).
- [ ] Componente `CardItem` (issuer logo, lastDigits, balance, currency, expDate, fondo azul/coral según index).
- [ ] Componente `TransactionItem` (title, subtitle según transactionType, amount coloreado, ícono con fondo de color según tipo: SUS violeta / CASH_IN verde / CASH_OUT naranja).
- [ ] Componente `TabBar` (Home / Movements / Logout).
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

| Capa                  | Elección                                                                           |
| --------------------- | ---------------------------------------------------------------------------------- |
| Framework             | **Next.js 15 (App Router) + TypeScript** — full-stack en un solo repo              |
| DB (local)            | **SQLite + Prisma** — sin setup de cuentas, dev loop rápido                        |
| DB (deploy)           | **MySQL en PlanetScale** (Fase 5, opcional)                                        |
| ORM                   | **Prisma**                                                                         |
| Cache                 | **Redis en Upstash** — pospuesto a Fase 5 (deploy)                                 |
| UI                    | **Tailwind + Shadcn**                                                              |
| Fuentes               | **Inter + Poppins** via `next/font`                                                |
| Animaciones           | **Framer Motion** (trofeo ¡Magia!)                                                 |
| Sonidos               | **use-sound** (trofeo ¡Suena bien!)                                                |
| Lint/Format           | **ESLint + Prettier + lint-staged + Husky** (trofeo ¡Con calidad!)                 |
| Tests                 | **Vitest + Testing Library + MSW** — objetivo >70% cobertura (trofeo ¡Inbugeable!) |
| Validación            | **Zod** en request/response de API routes                                          |
| Data fetching cliente | **TanStack Query (React Query)**                                                   |
| Auth storage          | **Cookie httpOnly** (no localStorage) — más profesional                            |
| Deploy                | **Vercel** (front + API) + PlanetScale (DB) + Upstash (Redis)                      |

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
