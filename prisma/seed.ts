// Seed script — creates default data for local dev & testing
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Default club
  const club = await prisma.club.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      name: "유스 축구클럽",
      phone: "010-1234-5678",
      email: "club@youthfc.com",
      address: "서울시",
    },
  });
  console.log("Club seeded:", club.id, club.name);

  // Default group
  const grp = await prisma.group.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      clubId: "1",
      name: "U-12 A팀",
      category: "junior",
      description: "12세 이하 A팀",
      color: "#3B82F6",
    },
  });
  console.log("Group seeded:", grp.id, grp.name);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
