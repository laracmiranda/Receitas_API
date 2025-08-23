import jwt from "jsonwebtoken";

export default function authenticate(req, res, next){
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")){
        return response.status(401).json({"error:": "Token não encontrado ou malformado"})
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, process.env.SECRET_JWT);

        if (!decoded.userId){
          return response.status(401).json({"error:": "Usuário não encontrado"})  
        }

        req.userId = decoded.userId;
        return next();

    } catch(error){
        return response.status(401).json({"error:": "Token inválido ou expirado"})
    }
}