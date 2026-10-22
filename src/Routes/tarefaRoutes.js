import { Router } from 'express';
import { 
    criarTarefa,
    buscarTarefaPorId,
    listarTarefasPorPeriodo,
    atualizarTarefa,
    excluirTarefa

 } from '../controllers/tarefaController.js';

const router = Router();

router.post('/tarefas', criarTarefa);
router.get('/tarefas/periodo', listarTarefasPorPeriodo);
router.get('/tarefas/:id', buscarTarefaPorId);
router.put('/tarefas/:id', atualizarTarefa);
router.delete('/tarefas/:id', excluirTarefa)

export default router;