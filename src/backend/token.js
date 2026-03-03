import crypto from "crypto";

export function createToken() {
  return crypto.randomBytes(32).toString("hex");
}

// In a real app you'd store token -> userId in a table or Redis and check it per request
