import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Jane Doe",
      email: "jdoe@example.com",
      avatarUrl: "https://github.com/luisreiskeys.png",
    },
  });

  const pool = await prisma.pool.create({
    data: {
      title: "Pool Example",
      code: "BOL123",
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-10-02T17:00:00.201Z",
      firstTeamCountryCode: "DE",
      secondTeamCountryCode: "BR",
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-10-01T18:00:00.201Z",
      firstTeamCountryCode: "BR",
      secondTeamCountryCode: "AR",

      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 1,
          participant: {
            connect: {
              userId_poolId: { userId: user.id, poolId: pool.id },
            },
          },
        },
      },
    },
  });
}

main();
