import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const main = async () => {
  const user1 = await prisma.user.create({
    data: {
      name: "Prathima backend",
      email: "backend@backstage.com",
      password: "password1",
      todos: {
        create: [
          {
            title: "Create Backend task1",
            description:
              "Create backstage database using postico-client in pg tables are user,todo.",
          },
          {
            title: "Create Backend task2",
            description:
              "create prisma model for user and todo tables,include relation",
          },
          {
            title: "Create Backend task3",
            description: "Create seeder file to seed data into tables",
          },
          {
            title: "Create Backend task4",
            description: "run migration",
          },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Forntend",
      email: "frontend@backstage.com",
      password: "password1",
      todos: {
        create: [
          {
            title: "create frontend task1",
            description: "install react and typescript",
          },
          {
            title: "create frontend task2",
            description: "display all to-dos for user",
          },
          {
            title: "create frontend task3",
            description: "display details of selected to-do item",
          },
          {
            title: "create frontend task4",
            description: "add to-do item form",
          },
        ],
      },
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: "tester",
      email: "tester@backstage.com",
      password: "password1",
      todos: {
        create: [
          {
            title: "create unit tests for backend apis",
            description: "create unit tests for backend apis using javasript",
          },
          {
            title: "create unit tests for front end UI",
            description: "create unit tests for front end UI",
          },
          {
            title: "Execute unit tests",
            description: "Execute unit tests",
          },
          {
            title: "publish results",
            description: "publish unit test results",
          },
        ],
      },
    },
  });

  console.table("Users and todos created successfully!");
};
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
