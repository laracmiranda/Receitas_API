export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Erros específicos
export class NotFoundError extends AppError {
  constructor(message = "Recurso não encontrado") {
    super(message, 404);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Acesso negado") {
    super(message, 403);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Dados inválidos") {
    super(message, 400);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflito: recurso já existe") {
    super(message, 409);
  }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Não autorizado") {
        super(message, 401);
    }
}

export class BadRequestError extends AppError {
    constructor(message = "Requisição Inválida") {
        super(message, 400);
    }
}
