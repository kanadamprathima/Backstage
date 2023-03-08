import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const app = express();
const PORT = 4000;
const jwtSecret =
  process.env.JWT_SECRET || "e9rp^&^*&@9sejg)DSUA)jpfds8394jdsfn,m";

app.use(cors({ origin: "*" }));

app.use(bodyParser.json());

function toJWT(data: any) {
  return jwt.sign(data, jwtSecret, { expiresIn: "2h" });
}

//endpoint for login
app.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Please provide both email and password" });
    }
    const reqUser = await prisma.user.findUnique({ where: { email } });

    console.log("this is the user", reqUser);
    if (!reqUser || !bcrypt.compareSync(password, reqUser.password)) {
      return res.status(400).send({
        message: "User with that email not found or password incorrect",
      });
    }
    const token = toJWT({ userId: reqUser.id });

    return res.status(200).send({ token, reqUser });
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
export interface Todo {
  id: number;
  title: string;
  description: string;
}
//endpoint to get all users
//http :4000/users
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({ include: { todos: true } });
  res.json(users);
});
//get all todos
app.get("/todos", async (req: Request, res: Response) => {
  const alltodos = await prisma.todo.findMany();
  res.json(alltodos);
});
//endpoint for posting new todo for a default user 1

app.post("/todos", async (req: Request, res: Response) => {
  const { title, description } = req.body;

  const newtodo = await prisma.todo.create({
    data: {
      title,
      description,
      userId: 1,
    },
  });
  res.json(newtodo);
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
    // res.sendStatus(201).send(todo);
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
