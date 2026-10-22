
import express from 'express';
import cors from 'cors';
import tarefaRoutes from './Routes/tarefaRoutes.js';

const app = express();

app.use(cors({
    origin: [
        'http://127.0.0.1:5500',
        'http://localhost:5500'
    ]
}));

app.use(express.json());

app.use('/api', tarefaRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
