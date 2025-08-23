import jwt from "jsonwebtoken";

export default function (request, response, next){
    const { authorization } = request.headers;

    // Verifica se o usuário está autenticado 
    if (!authorization){
        return response.status(401).json({"error:": "Token não encontrado"})
    }

    try {
        const token = authorization.replace("Bearer ", "");
        const { userId } = jwt.decode(token, process.env.SECRET_JWT);

        if (!userId){
          return response.status(401).json({"error:": "Usuário não encontrado"})  
        }

        next();

    } catch(error){
        return response.status(401).json({"error:": "Token inválido"})
    }
}