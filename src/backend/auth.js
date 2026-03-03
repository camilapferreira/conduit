import crypto from "crypto";

const SALT = "conduit-salt-change-in-production";

export function hashPassword(password) {
  return crypto
    .createHash("sha256")
    .update(SALT + password)
    .digest("hex");
}

export function verifyPassword(password, hashedPassword) {
  console.log("password", password);
  console.log("hashedPassword", hashedPassword);
  console.log("hash", hashPassword(password));
  const hash = hashPassword(password);
  return hash === hashedPassword;
}
