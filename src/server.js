import express from "express";
import cors from "cors";
import { router } from "./routes/index.js"
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const allowedOrigins = [
    'http://localhost:8082',
];

app.use(express.json());
app.use(router);
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
})

app.get('/', (req, res) => {
    res.send('API funcionando! 🤟');
});

