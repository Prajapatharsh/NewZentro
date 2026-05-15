import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.category.deleteMany({
    where: {
      OR: [
        { name: 'undefined' },
        { slug: 'undefined' }
      ]
    }
  });
  console.log('Deleted categories:', result.count);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
