import bcrypt from "bcryptjs";
import { prismaClient } from "../../database/PrismaClient.js";
import jwt from "jsonwebtoken";

export class LoginController {
    
    async login(req,res){
        const { email, password } = req.body;

        const user = await prismaClient.user.findUnique({
            where: { email }
        })

        if (!user){
            return res.status(401).json({ error: "Usuário não existe"})
        }

        // Compara a senha vinda do body com o hash no banco
        const userValid = bcrypt.compare(password, user.password);

        if (!userValid){
            return res.status(401).json({ error: "Credenciais inválidas"})
        }

        const payload = { userId: user.id }
        const token = jwt.sign(payload, process.env.SECRET_JWT, { expiresIn: '1h' })

        return res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name
            }
        })
    }
}