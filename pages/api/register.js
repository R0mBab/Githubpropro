// pages/api/register.js
import { registerUser } from "../../utils/users";
import { isValidEmail } from "../../utils/validation";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    try {
      const userId = await registerUser(email, name, password);
      res.status(200).json({ message: "User registered successfully", userId });
    } catch (error) {
      if (error.message === "User with this email already exists") {
        res.status(409).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Registration failed" });
      }
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
