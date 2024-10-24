// pages/api/login.js
import { authenticateUser, getUserData } from "../../utils/users";
import { isValidEmail } from "../../utils/validation";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    try {
      const userId = await authenticateUser(email, password);
      if (userId) {
        const userData = await getUserData(userId);
        const token = jwt.sign({ userId, email: userData.email }, SECRET_KEY, {
          expiresIn: "1h",
        });
        res.status(200).json({ token, user: userData });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ error: "Authentication failed" });
    }
  } else {
    res.set("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
