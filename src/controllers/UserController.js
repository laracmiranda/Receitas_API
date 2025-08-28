import { prismaClient } from "../../database/PrismaClient.js";
import bcrypt, { hash } from "bcryptjs";

export class UserController {

    async findAllUsers (req, res){
        try{
            const users = await prismaClient.user.findMany({
                select: {id: true, name: true, email: true}
            });
            return res.status(200).json(users);
        } catch(error){
            return res.status(500).json({ error: "Erro interno do servidor"});
        }
    }

    async findUser (req, res){
        const { id } = req.params;

        try {
            const user = await prismaClient.user.findUnique({
                where: { id },
                select: { id: true, name: true, email: true }
            });
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ error: "Erro interno do servidor"});
        }
    }

    async createUser (req, res){
        const { name, email, password } = req.body;

        try {
            const emailExists = await prismaClient.user.findUnique ({ where: {email} });

            if (emailExists){
                return res.status(409).json({ error: "Email já está em uso"});
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await prismaClient.user.create({
                data: { name, email, password: hashedPassword },
                select: { id: true, name: true, email: true }
            });
            return res.status(201).json(newUser);
        } catch (error){
            return res.status(500).json({ error: "Erro interno do servidor"});
        }
    }

    async updateUser (req, res){
        const { id } = req.params;
        const { name, email, password } = req.body;

        try {
            const user = await prismaClient.user.findUnique({
                where: { id }
            })

            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }

            const emailExists = await prismaClient.user.findUnique ({ where: {email} });

            if (emailExists && emailExists.id !== id){
                return res.status(409).json({ error: "Email já está em uso"});
            }

            const dataToUpdate = { name, email};

            if (password){
                const hashedPassword = bcrypt.hashSync(password, 10);
                dataToUpdate.password = hashedPassword;
            }

            const updatedUser = await prismaClient.user.update ({
                where: { id },
                data: dataToUpdate,
                select: { id: true, name: true, email: true }
            });
            return res.status(200).json(updatedUser);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro interno do servidor"});
        }
    }

    async deleteUser(req, res){
        const { id } = req.params;

        try {
            const user = await prismaClient.user.findUnique({ where: { id } });

            if(!user){
                return res.status(404).json({ error: "Usuário não encontrado" })
            }
            
            await prismaClient.user.delete({ where: { id }});
            return res.status(204).send("Usuário deletado com sucesso");

        } catch (error) {
            return res.status(500).json({ error: "Erro interno do servidor"});
        }
    }

    

}