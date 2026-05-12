import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.transaction.deleteMany();
  await prisma.card.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      email: "user@suragaming.com",
      password: "SURA2026!$",
      name: "Carlos",
      cards: {
        create: [
          {
            issuer: "Mastercard",
            name: "Carlos Sura",
            expDate: "02/30",
            lastDigits: 1234,
            balance: "978.85",
            currency: "USD",
          },
          {
            issuer: "Visa",
            name: "Carlos Sura",
            expDate: "11/28",
            lastDigits: 5678,
            balance: "2450.10",
            currency: "USD",
          },
        ],
      },
      transactions: {
        create: [
          {
            title: "Adobe",
            subtitle: "Pago de suscripción",
            amount: "125.00",
            transactionType: "SUS",
            date: new Date("2026-05-10T10:30:00Z"),
          },
          {
            title: "Camila Montenegro",
            subtitle: "Pago recibido",
            amount: "95.00",
            transactionType: "CASH_IN",
            date: new Date("2026-05-09T14:12:00Z"),
          },
          {
            title: "Figma",
            subtitle: "Pago de suscripción",
            amount: "125.00",
            transactionType: "SUS",
            date: new Date("2026-05-08T09:00:00Z"),
          },
          {
            title: "Leonardo Echazu",
            subtitle: "Pago enviado",
            amount: "95.00",
            transactionType: "CASH_OUT",
            date: new Date("2026-05-07T18:45:00Z"),
          },
          {
            title: "Spotify",
            subtitle: "Pago de suscripción",
            amount: "9.99",
            transactionType: "SUS",
            date: new Date("2026-05-06T08:00:00Z"),
          },
          {
            title: "Juan David",
            subtitle: "Pago recibido",
            amount: "300.00",
            transactionType: "CASH_IN",
            date: new Date("2026-05-05T11:30:00Z"),
          },
          {
            title: "Jorge Cruz",
            subtitle: "Pago enviado",
            amount: "45.50",
            transactionType: "CASH_OUT",
            date: new Date("2026-05-04T16:20:00Z"),
          },
          {
            title: "Netflix",
            subtitle: "Pago de suscripción",
            amount: "15.99",
            transactionType: "SUS",
            date: new Date("2026-05-03T07:00:00Z"),
          },
        ],
      },
    },
  });

  console.log(`Seeded user ${user.email} (id=${user.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
