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

### Fase 1 — Definir stack y scaffolding

- [ ] Confirmar con el usuario el stack (sugerido: **Next.js 15 App Router + TypeScript + Tailwind + Prisma + SQLite/Postgres**, todo en un solo repo full-stack).
- [ ] Scaffold del proyecto (Next + TS + Tailwind).
- [ ] Configurar ESLint + Prettier (apunta al trofeo "¡Con calidad!").
- [ ] Agregar fuentes Inter y Poppins (next/font).
- [ ] Setup de testing (Vitest o Jest + Testing Library, apunta a trofeo "¡Inbugeable!").

### Fase 2 — Backend / API

- [ ] Modelar DB con Prisma: `User`, `Card`, `Transaction`.
- [ ] Seed con el usuario de prueba, 1 tarjeta Mastercard + 1 Visa, y >=5 transacciones.
- [ ] Implementar `POST /surabank/login` (route handler en `app/surabank/login/route.ts`).
- [ ] Implementar `GET /surabank/cards` con validación del header `Authorization`.
- [ ] Implementar `GET /surabank/movements/last` (limit 5, ordenado por fecha desc).
- [ ] Helper de auth para validar el token ficticio.

### Fase 3 — Frontend (mobile-first)

- [ ] Layout mobile-first siguiendo el Figma.
- [ ] Página `/login` con form (email + password), manejo de errores.
- [ ] Persistir token (localStorage o cookie httpOnly).
- [ ] Página `/` (home) protegida: lista de tarjetas + últimos 5 movimientos.
- [ ] Componente `CardItem` (issuer, lastDigits, balance, currency, expDate).
- [ ] Componente `TransactionItem` (title, amount, transactionType, date).
- [ ] Estados: loading, empty, error.
- [ ] Logout.

### Fase 4 — Trofeos

- [ ] Animaciones (Framer Motion) en transiciones de página y tarjetas.
- [ ] Sonidos sutiles en acciones clave (login OK, swipe de tarjetas).
- [ ] Tests unitarios + integración hasta >70% cobertura.
- [ ] Ideas de features extra: dark mode, swipe entre tarjetas, búsqueda de movimientos, gráfico de gastos.

### Fase 5 — Entrega

- [ ] Deploy (Vercel recomendado por ser Next).
- [ ] README final con: stack, cómo correr local, credenciales de prueba, link en vivo.
- [ ] Tag/release final.

---

## 3. Decisiones pendientes (preguntar al usuario antes de codear)

1. **Stack:** ¿Next.js full-stack con Prisma + SQLite, o front separado del back?
2. **UI library:** ¿Tailwind + Shadcn, NextUI, u otra?
3. **Auth storage:** ¿localStorage (simple) o cookie httpOnly (más seguro)?
4. **Deploy target:** ¿Vercel? ¿Otro?
5. **Trofeos prioritarios:** ¿cuáles apuntar (calidad, tests, animaciones, sonidos, features extra)?

---

## 4. Convenciones para esta sesión

- Idioma del usuario: **español**. Responder en español.
- Mobile-first siempre — no perder tiempo en breakpoints desktop salvo que se pida.
- Commits descriptivos, conventional commits (feat:, fix:, chore:, test:, docs:).
- Mantener este `CLAUDE.md` actualizado a medida que avanzamos: marcar tareas hechas, anotar decisiones tomadas.
