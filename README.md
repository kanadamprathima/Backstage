# Backstage

# Todo App

- This is a simple Todo app built with Node.js and Prisma ORM. The app allows users to create, read, update, and delete tasks.

# Technologies Used

- Node.js
- Express.ts
- Prisma ORM
- PostgreSQL

# Requirements

- Node.js v14 or higher
- PostgreSQL database

# Getting Started

1. Clone this Repository.

- git clone https://github.com/kanadamprathima/Backstage.git

2. Install dependencies:

- cd todo-app
- npm install

3. Set up your database connection in the .env file:

- DATABASE_URL="postgresql://user:password@localhost:5432/todoapp".
- you need to replace user and password with your own PostgreSQL username and password.

4. Run the database migration:

- npx prisma migrate dev

5. Seed the database with some initial data:

- npx run seed

6. Start the server.

- npm run dev
  -The server will be running at http://localhost:4000.
