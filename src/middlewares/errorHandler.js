import { AppError } from "../errors/AppError.js";

export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  console.error("Erro inesperado:", err);

  return res.status(500).json({
    error: "Erro interno do servidor",
  });
}
