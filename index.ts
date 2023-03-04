import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

//endpoint to get all users
//http :4000/users
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({ include: { todos: true } });
  res.json(users);
});
//endpoint for specific user details
//http :4000/users/1
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    include: { todos: true },
  });
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  res.json(user);
});
// Get all todos for a user
// http :4000/users/1/todos
app.get("/users/:userId/todos", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const todos = await prisma.todo.findMany({
      where: {
        userId: parseInt(userId),
      },
    });

    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});
// Create a new todo for a user
// http :4000/users/1/todos title='testing endpoint' description='worked'
app.post("/users/:userId/todos", async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { title, description } = req.body;

  try {
    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        user: {
          connect: {
            id: parseInt(userId),
          },
        },
      },
    });

    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

app.listen(PORT, () => console.log(`server listening on ${PORT}`));
