import { PrismaClient } from "@prisma/client";
import express, { request, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();
const PORT = 4000;

app.use(cors({ origin: "*" }));

app.use(bodyParser.json());

//endpoint for login
app.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const reqUser = await prisma.user.findUnique({ where: { email } });
    console.log(reqUser);
    if (!reqUser) {
      return res.status(400).send("User with this email not found");
    }
    if (password !== reqUser.password) {
      return res.status(400).send("Invalid password");
    } else {
      return res.status(200).send("login successfully");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});
//endpoint for signup
// http :4000/signup name='prathima' email='frontendtest@backstage.com' password='password1'
app.post("/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).send("Enter required details");
    }
    const newUser = await prisma.user.create({
      data: { name: name, email: email, password: password },
    });

    res.json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while user creation" });
  }
});

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

// end point to get todo for a specific user
// http :4000/users/1/todos/2
app.get("/users/:userId/todos/:id", async (req: Request, res: Response) => {
  const { userId, id } = req.params;

  try {
    const todo = await prisma.todo.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!todo || todo.userId !== parseInt(userId)) {
      return res.status(404).send("Todo not found");
    }

    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

//endpoint to update a todo for a specific user
// http PUT :4000/users/1/todos/2 title="Create backend task2 put" description="true"
app.put("/users/:userId/todos/:id", async (req: Request, res: Response) => {
  const { userId, id } = req.params;
  const { title, description } = req.body;

  try {
    const todo = await prisma.todo.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        description,
      },
    });

    if (!todo || todo.userId !== parseInt(userId)) {
      return res.status(404).send("Todo not found");
    }

    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});
//Deleting specific todo for specific user.
// http DELETE :4000/users/1/todos/2
app.delete("/users/:userId/todos/:id", async (req: Request, res: Response) => {
  const { userId, id } = req.params;

  try {
    const todo = await prisma.todo.delete({
      where: {
        id: parseInt(id),
      },
    });

    if (!todo || todo.userId !== parseInt(userId)) {
      return res.status(404).send("Todo not found");
    }

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

app.listen(PORT, () => console.log(`server listening on ${PORT}`));
