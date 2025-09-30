import Joi from "joi";

const parseNumber = (value, helpers) => {
  const n = parseInt(value, 10);
  if (isNaN(n)) return helpers.error("any.invalid");
  return n;
};

const parseList = (value, helpers) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value.split(",").map(i => i.trim());
  return helpers.error("any.invalid");
};

export const createRecipeSchema = Joi.object({
  name: Joi.string().max(100).required(),
  category: Joi.string().max(30).required(),
  description: Joi.string().max(150).required(),
  difficulty: Joi.string().max(20).required(),
  status: Joi.string().valid("Rascunho", "Publicada").default("Rascunho"),
  prepTime: Joi.alternatives().try(Joi.number().integer(), Joi.string().custom(parseNumber)).required(),
  portions: Joi.alternatives().try(Joi.number().integer(), Joi.string().custom(parseNumber)).required(),
  ingredients: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string().custom(parseList)).required(),
  steps: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string().custom(parseList)).required(),
}).prefs({ convert: true });

export const updateRecipeSchema = createRecipeSchema.fork(
  Object.keys(createRecipeSchema.describe().keys),
  schema => schema.optional()
);
