
const API_BASE_URL = 'http://localhost:3000/api';

async function requisicao(endpoint, opcoes = {}) {
    let resposta;

    try {
        resposta = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...opcoes,
            headers: {
                'Content-Type': 'application/json',
                ...opcoes.headers
            }
        });
    } catch {
        throw new Error(
            'Não foi possível conectar à API. Verifique se o servidor está em execução.'
        );
    }

    const texto = await resposta.text();
    let dados = null;

    if (texto) {
        try {
            dados = JSON.parse(texto);
        } catch {
            dados = texto;
        }
    }

    if (!resposta.ok) {
        const mensagem =
            typeof dados === 'object' && dados !== null
                ? dados.mensagem || dados.message || dados.erro
                : null;

        throw new Error(
            mensagem || `Erro na requisição: HTTP ${resposta.status}.`
        );
    }

    return dados;
}

export const tarefaApi = {
    async listarPorPeriodo(dataInicio, dataFim) {
        const parametros = new URLSearchParams({
            dataInicio,
            dataFim
        });

        return requisicao(`/tarefas/periodo?${parametros}`);
    },

    async buscarPorId(id) {
        return requisicao(`/tarefas/${id}`);
    },

    async criar(tarefa) {
        return requisicao('/tarefas', {
            method: 'POST',
            body: JSON.stringify(tarefa)
        });
    },

    async atualizar(id, tarefa) {
        return requisicao(`/tarefas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(tarefa)
        });
    },

    async excluir(id) {
        return requisicao(`/tarefas/${id}`, {
            method: 'DELETE'
        });
    }
};
