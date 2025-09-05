import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/AppError.js";

export default function authenticate(req, res, next){
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")){
        return next(new UnauthorizedError("Token não encontrado ou malformado"));
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, process.env.SECRET_JWT);

        if (!decoded.userId){
          return next(new UnauthorizedError("Usuário não encontrado"));  
        }

        req.userId = decoded.userId;
        return next();

    } catch(error){
        return next(new UnauthorizedError("Token inválido ou expirado"));
    }
}
