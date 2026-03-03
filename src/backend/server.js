import Fastify from "fastify";
import cors from "@fastify/cors";
import db from "./db.js";
import { hashPassword, verifyPassword } from "./auth.js";
import { createToken } from "./token.js";

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: true, // allows your React app (e.g. http://localhost:5173)
});

// ----- Register -----
fastify.post("/api/users", async (request, reply) => {
  const { username, email, password } = request.body || {};

  if (!username || !email || !password) {
    return reply.code(400).send({
      errors: { body: ["username, email and password are required"] },
    });
  }

  const hashed = hashPassword(password);

  try {
    const stmt = db.prepare(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    );
    stmt.run(username, email, hashed);
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return reply.code(422).send({
        errors: { email: ["email or username already taken"] },
      });
    }
    throw err;
  }

  const token = createToken();
  const row = db
    .prepare("SELECT id, username, email FROM users WHERE email = ?")
    .get(email);

  return reply.code(201).send({
    user: {
      id: row.id,
      username: row.username,
      email: row.email,
      token,
    },
  });
});

// ----- Login -----
fastify.post("/api/users/login", async (request, reply) => {
  const { email, password } = request.body || {};

  if (!email || !password) {
    return reply.code(400).send({
      errors: { body: ["email and password are required"] },
    });
  }

  const row = db
    .prepare("SELECT id, username, email, password FROM users WHERE email = ?")
    .get(email);

  if (!row) {
    return reply.code(401).send({
      errors: { "email or password": ["is invalid"] },
    });
  }

  if (!verifyPassword(password, row.password)) {
    return reply.code(401).send({
      errors: { "email or password": ["is invalid"] },
    });
  }

  const token = createToken();

  return reply.send({
    user: {
      id: row.id,
      username: row.username,
      email: row.email,
      token,
    },
  });
});

fastify.get("/", async (request, reply) => {
  return reply.send("Hello World");
});

fastify.post("/", async (request, reply) => {
  const { name } = request.body;
  return reply.send("Hello World " + name);
});

// Start server
const port = Number(process.env.PORT) || 3000;
await fastify.listen({ port, host: "0.0.0.0" });
console.log(`Backend running at http://localhost:${port}`);
