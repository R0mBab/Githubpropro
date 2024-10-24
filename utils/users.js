import pool from "./db";
import bcrypt from "bcrypt";

export async function registerUser(email, name, password) {
  const connection = await pool.getConnection();
  try {
    // Проверка на существующего пользователя
    const [existingUsers] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    if (existingUsers.length > 0) {
      throw new Error("User with this email already exists");
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Вставка нового пользователя
    const [result] = await connection.query(
      "INSERT INTO users (email, name, password) VALUES (?, ?, ?)",
      [email, name, hashedPassword],
    );

    return result.insertId;
  } finally {
    connection.release();
  }
}
