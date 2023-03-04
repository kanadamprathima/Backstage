import { PrismaClient } from "@prisma/client";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

//endpoint to get all users
//http :3000/users
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({ include: { todos: true } });
  res.json(users);
});

app.listen(PORT, () => console.log(`server listening on ${PORT}`));
