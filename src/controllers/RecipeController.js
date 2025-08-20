import { prismaClient } from "../../database/PrismaClient.js";

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

    async createRecipe (req, res){
        const { name, category, ingredients, steps } = req.body;

        // Se veio string, transforma em array separando por vírgula
        let formattedIngredients = ingredients;

        if (typeof ingredients === "string") {
        formattedIngredients = ingredients.split(",").map(i => i.trim());
        }

        try {
            const newRecipe = await prismaClient.recipe.create({
                data: { name, category, ingredients: formattedIngredients, steps },
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

            const updatedRecipe = await prismaClient.recipe.update ({
                where: { id },
                data: { name, category, ingredients: formattedIngredients, steps }            
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