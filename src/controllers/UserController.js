import { prismaClient } from "../../database/PrismaClient.js";
import bcrypt, { hash } from "bcryptjs";
import { changePasswordSchema, createUserSchema, updateUserSchema } from "../validators/userValidator.js";

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

            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado"} );
            }

            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ error: "Erro interno do servidor"});
        }
    }

    async findUserAuthenticated (req, res){
        const userId = req.userId;

        try {
            const user = await prismaClient.user.findUnique({
                where: { id: userId },
                select: { id: true, name: true, email: true }
            });

            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado"} );
            }
            
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ error: "Erro interno do servidor"});
        }
    }

    async createUser (req, res){
        const { error } = createUserSchema.validate(req.body);
        if (error) {
        return res.status(400).json({ error: error.details[0].message });
        }

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
        const userId = req.userId;

        const { error } = updateUserSchema.validate(req.body);
        if (error) {
        return res.status(400).json({ error: error.details[0].message });
        }

        const { name, email } = req.body;

        try {
            const user = await prismaClient.user.findUnique({
                where: { id: userId }
            })

            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }

            const emailExists = await prismaClient.user.findUnique ({ where: {email} });

            if (emailExists && emailExists.id !== userId){
                return res.status(409).json({ error: "Email já está em uso"});
            }

            const updatedUser = await prismaClient.user.update ({
                where: { id: userId },
                data: { name, email },
                select: { id: true, name: true, email: true }
            });
            return res.status(200).json(updatedUser);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro interno do servidor"});
        }
    }

    async changePassword(req, res){
        const userId = req.userId;

        const { error } = changePasswordSchema.validate(req.body);
        if (error) {
        return res.status(400).json({ error: error.details[0].message });
        }

        const { currentPassword, newPassword } = req.body;

        try {
            const user = await prismaClient.user.findUnique({
                where: { id: userId }
            })

            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }

            const validPassword = await bcrypt.compare(currentPassword, user.password);

            if (!validPassword){
                return res.status(401).json({ error: "Senha atual incorreta" });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await prismaClient.user.update({
                where: { id: userId },
                data: { password: hashedPassword }
            });

            return res.status(200).json({ message: "Senha atualizada com sucesso!" });
        } catch(error){
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async deleteUser(req, res){
        const userId = req.userId;
        
        try {
            const user = await prismaClient.user.findUnique({ where: { id: userId } });

            if(!user){
                return res.status(404).json({ error: "Usuário não encontrado" })
            }
            
            await prismaClient.user.delete({ where: { id: userId }});
            return res.status(204).send();

        } catch (error) {
            return res.status(500).json({ error: "Erro interno do servidor"});
        }
    }

    

}