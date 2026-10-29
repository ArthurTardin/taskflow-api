import pool from '../config/database.js';

export async function criarTarefa(req, res) {
    try {
        const {
            nome,
            descricao,
            responsavel,
            data_tarefa,
            concluido
        } = req.body;

        if (!nome || !responsavel || !data_tarefa) {
            return res.status(400).json({
                mensagem: 'Campos obrigatórios (nome, responsável, data_tarefa) não foram informados.'
            });
        }

        const [resultado] = await pool.execute(
            `INSERT INTO tarefas
            (nome, descricao, responsavel, data_tarefa, concluido)
            VALUES (?, ?, ?, ?, ?)`,
            [
                nome,
                descricao ?? null,
                responsavel,
                data_tarefa,
                concluido ?? false
            ]
        );

        return res.status(201).json({
            id: resultado.insertId,
            nome,
            descricao: descricao ?? null,
            responsavel,
            data_tarefa,
            concluido: concluido ?? false
        });
    } catch (error) {
        console.error('Erro em criarTarefa:', error);

        return res.status(500).json({
            mensagem: 'Erro ao criar tarefa.'
        });
    }
}

export async function buscarTarefaPorId(req, res) {
    try {
        const { id } = req.params;

        const [tarefas] = await pool.execute(
            `SELECT * FROM tarefas WHERE id = ?`, [id]
        );

        if (tarefas.length === 0) {
            return res.status(404).json({
                mensagem: 'Tarefa não encontrada.'
            });
        }

        return res.status(200).json(tarefas[0]);
    } catch (error) {
        console.error('Erro em  buscarTarefaPorId:', error);

        return res.status(500).json({
            mensagem: 'Erro ao buscar tarefa.'
        });
    }
}

export async function listarTarefasPorPeriodo(req, res) {
    try {
        const { dataInicio, dataFim } = req.query;

        if (!dataInicio || !dataFim) {
            return res.status(400).json({
                mensagem: 'Informe a data inicial e a data final.'
            });
        }

        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);

        if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
            return res.status(400).json({
                mensagem: 'Formato de data inválido.'
            });
        }

        if (inicio > fim) {
            return res.status(400).json({
                mensagem: 'A data inicial não pode ser posterior à data final.'
            });
        }

        const [tarefas] = await pool.execute(`SELECT * FROM tarefas WHERE data_tarefa BETWEEN ? AND ? ORDER BY data_tarefa ASC`, [dataInicio, dataFim]);

        return res.status(200).json(tarefas);
    } catch(error) {
        console.error('Erro em listarTarefaPorPeriodo:', error);

        return res.status(500).json({
            mensagem: 'Erro ao listar tarefas por período.'
        });
    }
}

export async function atualizarTarefa(req, res) {
    try {
        const { id } = req.params;
        const {
            nome,
            descricao,
            responsavel,
            data_tarefa,
            concluido,
        } = req.body;

        if (
            nome === undefined ||
            descricao === undefined ||
            responsavel === undefined ||
            data_tarefa === undefined ||
            concluido === undefined
        ) {
            return res.status(400).json({
                mensagem: 'Informe todos os campos da tarefa.'
            });
        }

        const [resultado] = await pool.execute(
            `UPDATE tarefas
            SET nome = ?,
                descricao = ?,
                responsavel = ?,
                data_tarefa = ?,
                concluido = ?
            WHERE id = ?`,
                [nome, descricao, responsavel, data_tarefa, concluido, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Tarefa não encontrada.'
            });
        }

        return res.status(200).json({
            mensagem: 'Tarefa atualizada com sucesso.'
        });
    }catch(error) {
        console.error('Erro em atualizarTarefa:', error);

        return res.status(500).json({
            mensagem: 'Erro ao atualizar tarefa.'
        });
    }
}

export async function excluirTarefa(req, res) {
    try {
        const { id } = req.params;

        const [resultado] = await pool.execute(`DELETE FROM tarefas WHERE id = ?`, [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Tarefa não encontrada.'
            });
        }

        return res.status(200).json({
            mensagem: 'Tarefa excluída com sucesso.'
        });
    }catch(error) {
        console.error('Erro em excluirTarefa', error);
        return res.status(500).json({
            mensagem: 'Erro ao excluir a tarefa.'
        });
    }
}