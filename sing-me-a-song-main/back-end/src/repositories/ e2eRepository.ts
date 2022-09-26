import { prisma } from "../database.js";

async function reset() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY;`;
}

async function insertDatabaseForTests() {
  await prisma.recommendation.createMany({
    data: [
      {
        name: "Charlie Brown Jr - Camisa preta",
        youtubeLink: "https://www.youtube.com/watch?v=qGXA66S8cu0",
      },
      {
        name: "Charlie Brown Jr - Como Tudo Deve Ser",
        youtubeLink: "https://www.youtube.com/watch?v=k7pr4VTk5cQ",
      },
      {
        name: "Charlie Brown Jr - senhor do tempo",
        youtubeLink: "https://www.youtube.com/watch?v=SytqxaFStHY",
      },
    ],
  });
}

export const e2eRepository = {
  reset,
  insertDatabaseForTests,
};