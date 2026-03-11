import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const exists = await prisma.settings.findFirst();
  if (!exists) {
    await prisma.settings.create({
      data: {
        restaurantName: 'Oishi',
        phone: '+79245961740',
        openingTime: '10:00',
        closingTime: '23:00',
        pickupTimeMinutes: 25
      }
    });
  }
}

main().finally(() => prisma.$disconnect());
