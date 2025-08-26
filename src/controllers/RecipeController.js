import { prismaClient } from "../../database/PrismaClient.js";
import cloudinary from "../../config/cloudinary.js";
import streamifier from "streamifier";

export class RecipeController {

    async findAllRecipes (req, res){
        try {
            const recipes = await prismaClient.recipe.findMany();
            return res.status(200).json(recipes);
        } catch(error){
            return res.json(500).json({ error: "Erro interno do servidor"});
        }
    }

    async findRecipe (req, res){
        const { id } = req.params;

        try {
            const recipe = await prismaClient.recipe.findUnique({ where: { id } });

            if (!recipe) {
                return res.status(404).json({ error: "Receita não encontrada" });
            }

            return res.status(200).json(recipe);
        } catch (error) {
            return res.json(500).json({ error: "Erro interno do servidor"});
        }
    }

    async findRecipeByUser(req, res){
        try {
            const userId = req.userId

            const recipes = await prismaClient.recipe.findMany({
                where: { userId },
                orderBy: { creationDate: "desc" }
            });
            return res.status(200).json(recipes);
        } catch(error){
            return res.json(500).json({ error: "Erro interno do servidor"});
        }
    }

    async createRecipe (req, res){
        const { name, category, ingredients, steps } = req.body;
        const userId = req.userId

        // Se veio string, transforma em array separando por vírgula
        let formattedIngredients = ingredients;

        if (typeof ingredients === "string") {
        formattedIngredients = ingredients.split(",").map(i => i.trim());
        }

        try {
            let image = null;

            if (!req.file || !req.file.buffer) {
                return res.status(400).json({ erro: 'Arquivo não encontrado', mensagem: 'Nenhuma imagem foi enviada' });
            }
            
            // Faz o upload da imagem para o Cloudinary
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({
                    folder: "recipes"
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
            });
        
            image = result.secure_url;
        
            const newRecipe = await prismaClient.recipe.create({
                data: { name, category, ingredients: formattedIngredients, steps, image, userId },
            });
            return res.status(201).json(newRecipe);
        } catch (error){
            return res.json(500).json({ error: "Erro interno do servidor"});
        }
    }
    
    async updateRecipe (req, res){
        const { id } = req.params;
        const { name, category, ingredients, steps } = req.body;

        // Se veio string, transforma em array separando por vírgula
        let formattedIngredients = ingredients;

        if (typeof ingredients === "string") {
        formattedIngredients = ingredients.split(",").map(i => i.trim());
        }

        try {
            const recipe = await prismaClient.recipe.findUnique({
                where: { id }
            })

            if (!recipe) {
                return res.status(404).json({ error: "Receita não encontrada" });
            }
            
            let image = recipe.image;

            // Faz o upload da nova imagem para o Cloudinary caso exista
            if (req.file && req.file.buffer) {
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream({
                        folder: "recipes"
                        },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result);
                        }
                    );
                    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
                });
            
                image = result.secure_url;
            }

            const updatedRecipe = await prismaClient.recipe.update ({
                where: { id },
                data: { name, category, ingredients: formattedIngredients, steps, image }            
            });
            return res.status(200).json(updatedRecipe);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro interno do servidor"});
        }
    }

    async deleteRecipe(req, res){
        const { id } = req.params;

        try {
           const recipe = await prismaClient.recipe.findUnique({
                where: { id }
            })

            if (!recipe) {
                return res.status(404).json({ error: "Receita não encontrada" });
            }
            
            await prismaClient.recipe.delete({ where: { id }});
            return res.status(204).send("Receita deletada com sucesso");

        } catch (error) {
            return res.status(500).json({ error: "Erro interno do servidor"});
        }
    }

}