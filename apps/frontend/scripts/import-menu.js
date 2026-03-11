const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const items = [
  { name: 'Трио с кунжутом', slug: 'trio-s-kunzhutom', description: 'Набор роллов', price: 1500, image: '/menu/menu-01.jpg', isPopular: true },
  { name: 'Сет 24 горячие', slug: 'set-24-goryachie', description: 'Горячий сет', price: 1300, image: '/menu/menu-02.jpg', isPopular: true },
  { name: 'Трио фирменное', slug: 'trio-firmennoe', description: 'Фирменный набор', price: 1500, image: '/menu/menu-03.jpg' },
  { name: 'Сет 72', slug: 'set-72', description: 'Филадельфия классик / унаги / сяке маки', price: 3200, image: '/menu/menu-04.jpg', isPopular: true },
  { name: 'Калифорния+', slug: 'kaliforniya-plus', description: 'Калифорния / унаги в кунжуте / каппа маки', price: 1200, image: '/menu/menu-05.jpg' },
  { name: 'Трио Калифорния', slug: 'trio-kaliforniya', description: 'Набор калифорния', price: 1600, image: '/menu/menu-06.jpg' },
  { name: 'Ассорти премиум', slug: 'assorti-premium', description: 'Филадельфия / горячий / калифорния', price: 3300, image: '/menu/menu-07.jpg', isPopular: true },
  { name: 'Сет 24 шт классик', slug: 'set-24-classic', description: 'Филадельфия классик / унаги филадельфия / сяке маки', price: 1250, image: '/menu/menu-08.jpg' },
  { name: 'Сет 40 шт', slug: 'set-40', description: 'Филадельфия классик / унаги филадельфия / филадельфия в кунжуте / калифорния / каппа маки', price: 2200, image: '/menu/menu-11.jpg', isPopular: true },
  { name: 'Трио Филадельфия', slug: 'trio-filadelfiya', description: 'Набор роллов филадельфия', price: 1600, image: '/menu/menu-12.jpg' },
  { name: 'Трио Унаги', slug: 'trio-unagi', description: 'Набор роллов унаги', price: 1600, image: '/menu/menu-13.jpg' },
  { name: 'Сет Филадельфия', slug: 'set-filadelfiya', description: 'Филадельфия классик + каппа маки', price: 1200, image: '/menu/menu-14.jpg' },
  { name: 'Сет Праздничный 104', slug: 'set-prazdnichny-104', description: 'Большой праздничный сет, 104 шт', price: 5300, image: '/menu/menu-15.jpg', isPopular: true },
  { name: 'Трио горячие 24', slug: 'trio-goryachie-24', description: 'Семга / угорь / креветка, 24 шт', price: 1600, image: '/menu/menu-16.jpg', isNew: true }
];

async function main() {
  for (const item of items) {
    await prisma.product.upsert({
      where: { slug: item.slug },
      update: item,
      create: item
    });
  }
  console.log(`Imported ${items.length} menu items`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
