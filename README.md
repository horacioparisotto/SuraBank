# SuraBank — Test de Evaluación Técnica

**Objetivo:** Evaluar la maestría técnica y la capacidad de construir un producto en base a un alcance y ciertas especificaciones.

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
