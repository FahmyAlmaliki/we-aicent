import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "password123";
  const jwtSecret = process.env.JWT_SECRET || "change-this-secret";

  if (username !== adminUsername || password !== adminPassword) {
    return res.status(401).json({ message: "Username atau password salah." });
  }

  const token = jwt.sign({ username }, jwtSecret, {
    expiresIn: "12h",
  });

  return res.json({ token });
});

export default router;
