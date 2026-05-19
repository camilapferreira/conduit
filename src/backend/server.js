import Fastify from "fastify";
import cors from "@fastify/cors";
import db from "./db.js";
import { hashPassword, verifyPassword } from "./auth.js";
import { createToken } from "./token.js";

const fastify = Fastify({ logger: true });

const slugify = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

await fastify.register(cors, {
  origin: true, // allows your React app (e.g. http://localhost:5173)
});

fastify.post("/api/articles", async (request, reply) => {
  const { title, description, body, tagList } = request.body || {};
  const slug = slugify(title);
  const authorId = "7";
  const createdAt = new Date().toISOString();
  const updatedAt = new Date().toISOString();
  const tagListString = tagList ? JSON.stringify(tagList) : null;

  try {
    const stmt = db.prepare(
      "INSERT INTO articles (slug, title, description, body, tag_list, author_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    );
    stmt.run(
      slug,
      title,
      description,
      body,
      tagListString,
      authorId,
      createdAt,
      updatedAt,
    );
  } catch (err) {
    throw err;
  }
  return reply.code(201).send({
    article: {
      slug,
      title,
      description,
      body,
      tagListString,
      authorId,
      createdAt,
      updatedAt,
    },
  });
});

fastify.get("/api/articles", async (request, reply) => {
  const articles = db.prepare("SELECT * FROM articles").all();
  const convertedArticles = articles.map((article) => {
    const author = db
      .prepare("SELECT username FROM users WHERE id = ?")
      .get(article.author_id);
    return {
      ...article,
      tagList: article.tag_list ? JSON.parse(article.tag_list) : [],
      author: author,
    };
  });

  return reply.send({ articles: convertedArticles });
  // return reply.send({
  //   articles: [
  //     {
  //       title: "Hello World",
  //       slug: "hello-world",
  //       description: "This is a test article",
  //       body: "This is a test article body",
  //       tagList: ["test", "article"],
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //       favorited: false,
  //       favoritesCount: 0,
  //       image: "http://i.imgur.com/Qr71crq.jpg",
  //       author: {
  //         username: "test",
  //       },
  //     },
  //     {
  //       title: "Hello World 2",
  //       slug: "hello-world-2",
  //       description: "This is a test article 2",
  //       body: "This is a test article body 2",
  //       tagList: ["test", "article"],
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //       favorited: false,
  //       favoritesCount: 0,
  //       image: "http://i.imgur.com/N4VcUeJ.jpg",
  //       author: {
  //         username: "test",
  //       },
  //     },
  //   ],
  // });
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

fastify.get("/api/users", async (request, reply) => {
  const users = db.prepare("SELECT id, username, email FROM users").all();
  return reply.send({ users });
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
