import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

// Exemplo de usuários (substitua por um banco de dados real)
const users = [
  {
    username: "usuario1",
    password: "$2b$10$7yw5Ec9.OyR.oC4TjGsRAuR9JjDEZgIAmcY6YbKg8fPDTa64OKj7e", // senha "senha123" criptografada
  }
];

// Endpoint de login
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ error: "Usuário ou senha incorretos" });
  }

  // Verifica a senha com bcrypt
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: "Usuário ou senha incorretos" });
  }

  // Gera o token JWT
  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET as string, {
    expiresIn: "1h", // O token expira em 1 hora
  });

  res.json({ token });
});

export default router;
