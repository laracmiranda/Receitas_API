import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import router from "./routes/index.js"
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

const allowedOrigins = [
    'http://localhost:8080',
    'https://receitas-api-6a7p.onrender.com'
];

app.use(cors({
    origin: function (origin, callback){
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn("Origem bloqueada pelo CORS:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials:true,
}));

app.use(express.json());

const swaggerDocument = YAML.load("./swagger.yaml");
app.use('/api/v1', router);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.send('API funcionando! 🤟');
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
    console.log(`Documentação disponível em http://localhost:${PORT}/docs`);
});
