
import { tarefaApi } from './api.js';

const formularioTarefa = document.getElementById('tarefa-form');
const formularioFiltro = document.getElementById('filtro-form');
const campoId = document.getElementById('tarefa-id');
const campoNome = document.getElementById('nome');
const campoResponsavel = document.getElementById('responsavel');
const campoData = document.getElementById('data_tarefa');
const campoDescricao = document.getElementById('descricao');

const tituloFormulario = document.getElementById('form-title');
const botaoNovaTarefa = document.getElementById('nova-tarefa-btn');
const botaoCancelarEdicao = document.getElementById('cancelar-edicao-btn');

const campoDataInicio = document.getElementById('data-inicio');
const campoDataFim = document.getElementById('data-fim');

const elementoMensagem = document.getElementById('mensagem');
const corpoTabela = document.getElementById('tarefas-tbody');
const contadorTarefas = document.getElementById('contador-tarefas');

const indicadorTotal = document.getElementById('total-tarefas');
const indicadorPendentes = document.getElementById('tarefas-pendentes');
const indicadorConcluidas = document.getElementById('tarefas-concluidas');

let tarefas = [];

function escaparHtml(valor) {
    return String(valor ?? '').replace(/[&<>"']/g, caractere => {
        const entidades = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };

        return entidades[caractere];
    });
}

function estaConcluida(valor) {
    return valor === true ||
        valor === 1 ||
        valor === '1' ||
        valor === 'true';
}

function normalizarData(valor) {
    if (!valor) return '';

    const texto = String(valor);
    const correspondencia = texto.match(/^(\d{4}-\d{2}-\d{2})/);

    if (correspondencia) {
        return correspondencia[1];
    }

    return '';
}

function formatarData(valor) {
    const data = normalizarData(valor);

    if (!data) return '—';

    const [ano, mes, dia] = data.split('-');

    return `${dia}/${mes}/${ano}`;
}

function obterCampo(tarefa, ...nomes) {
    for (const nome of nomes) {
        if (tarefa?.[nome] !== undefined && tarefa[nome] !== null) {
            return tarefa[nome];
        }
    }

    return '';
}

function normalizarLista(resultado) {
    if (Array.isArray(resultado)) return resultado;

    if (Array.isArray(resultado?.tarefas)) return resultado.tarefas;
    if (Array.isArray(resultado?.dados)) return resultado.dados;
    if (Array.isArray(resultado?.data)) return resultado.data;
    if (Array.isArray(resultado?.data?.tarefas)) {
        return resultado.data.tarefas;
    }

    return [];
}

function normalizarTarefa(resultado) {
    if (!resultado || typeof resultado !== 'object') return null;

    if (resultado.tarefa && typeof resultado.tarefa === 'object') {
        return resultado.tarefa;
    }

    if (resultado.data && !Array.isArray(resultado.data)) {
        if (resultado.data.tarefa) return resultado.data.tarefa;
        if (typeof resultado.data === 'object') return resultado.data;
    }

    return resultado;
}

function obterId(tarefa) {
    return obterCampo(tarefa, 'id', 'ID', 'tarefa_id');
}

function dataHoje() {
    const hoje = new Date();

    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
}

function mostrarMensagem(texto, tipo = 'info') {
    if (!elementoMensagem) return;

    elementoMensagem.textContent = texto;
    elementoMensagem.className = `message-${tipo}`;
    elementoMensagem.classList.remove('hidden');
}

function limparMensagem() {
    if (!elementoMensagem) return;

    elementoMensagem.textContent = '';
    elementoMensagem.className = 'hidden';
}

function normalizarErro(erro) {
    console.error(erro);
    return erro instanceof Error
        ? erro.message
        : 'Ocorreu um erro inesperado.';
}

function obterPayload(tarefa, concluido = estaConcluida(
    obterCampo(tarefa, 'concluido', 'concluída', 'concluida')
)) {
    return {
        nome: String(obterCampo(tarefa, 'nome')).trim(),
        descricao: String(obterCampo(tarefa, 'descricao')),
        responsavel: String(obterCampo(tarefa, 'responsavel')).trim(),
        data_tarefa: normalizarData(
            obterCampo(tarefa, 'data_tarefa', 'dataTarefa')
        ),
        concluido
    };
}

function limparFormulario() {
    formularioTarefa.reset();

    campoId.value = '';
    tituloFormulario.textContent = 'Nova tarefa';

    if (botaoCancelarEdicao) {
        botaoCancelarEdicao.classList.add('hidden');
    }
}

function prepararNovaTarefa() {
    limparFormulario();
    limparMensagem();

    const hoje = dataHoje();

    if (campoData) {
        campoData.value = hoje;
    }

    formularioTarefa.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });

    campoNome?.focus();
}

function editarTarefa(id) {
    const tarefa = tarefas.find(
        item => String(obterId(item)) === String(id)
    );

    if (!tarefa) {
        mostrarMensagem(
            'Não foi possível localizar essa tarefa. Atualize a lista.',
            'error'
        );
        return;
    }

    campoId.value = obterId(tarefa);
    campoNome.value = obterCampo(tarefa, 'nome');
    campoResponsavel.value = obterCampo(tarefa, 'responsavel');
    campoData.value = normalizarData(
        obterCampo(tarefa, 'data_tarefa', 'dataTarefa')
    );
    campoDescricao.value = obterCampo(tarefa, 'descricao');

    tituloFormulario.textContent = 'Editar tarefa';

    if (botaoCancelarEdicao) {
        botaoCancelarEdicao.classList.remove('hidden');
    }

    limparMensagem();

    formularioTarefa.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });

    campoNome.focus();
}

formularioTarefa.addEventListener('submit', async evento => {
    evento.preventDefault();
    limparMensagem();

    const id = campoId.value.trim();

    const payload = {
        nome: campoNome.value.trim(),
        responsavel: campoResponsavel.value.trim(),
        data_tarefa: campoData.value,
        descricao: campoDescricao.value.trim(),
        concluido: false
    };

    if (!payload.nome || !payload.responsavel || !payload.data_tarefa) {
        mostrarMensagem(
            'Preencha o nome, o responsável e a data da tarefa.',
            'error'
        );
        return;
    }

    if (id) {
        const tarefaOriginal = tarefas.find(
            item => String(obterId(item)) === String(id)
        );

        if (tarefaOriginal) {
            payload.concluido = estaConcluida(
                obterCampo(tarefaOriginal, 'concluido', 'concluida')
            );
        }
    }

    const botaoEnviar = formularioTarefa.querySelector(
        'button[type="submit"], button:not([type])'
    );

    if (botaoEnviar) botaoEnviar.disabled = true;

    try {
        if (id) {
            await tarefaApi.atualizar(id, payload);
            mostrarMensagem('Tarefa atualizada com sucesso!', 'success');
        } else {
            await tarefaApi.criar(payload);
            mostrarMensagem('Tarefa cadastrada com sucesso!', 'success');
        }

        limparFormulario();
        await carregarTarefas();
    } catch (erro) {
        mostrarMensagem(normalizarErro(erro), 'error');
    } finally {
        if (botaoEnviar) botaoEnviar.disabled = false;
    }
});

botaoNovaTarefa?.addEventListener('click', prepararNovaTarefa);

botaoCancelarEdicao?.addEventListener('click', () => {
    limparFormulario();
    limparMensagem();
});

async function carregarTarefas() {
    const inicio = campoDataInicio.value;
    const fim = campoDataFim.value;

    if (!inicio || !fim) {
        mostrarMensagem('Selecione a data inicial e a data final.', 'error');
        return;
    }

    if (inicio > fim) {
        mostrarMensagem(
            'A data inicial não pode ser posterior à data final.',
            'error'
        );
        return;
    }

    corpoTabela.innerHTML = `
        <tr>
            <td colspan="6">Carregando tarefas...</td>
        </tr>
    `;

    try {
        const resultado = await tarefaApi.listarPorPeriodo(inicio, fim);
        tarefas = normalizarLista(resultado);

        renderizarTabela();
        atualizarIndicadores();
    } catch (erro) {
        tarefas = [];
        renderizarTabela();
        atualizarIndicadores();

        mostrarMensagem(
            `Não foi possível carregar as tarefas: ${normalizarErro(erro)}`,
            'error'
        );
    }
}

formularioFiltro.addEventListener('submit', async evento => {
    evento.preventDefault();
    limparMensagem();
    await carregarTarefas();
});

function renderizarTabela() {
    if (!tarefas.length) {
        corpoTabela.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        Nenhuma tarefa encontrada neste período.
                    </div>
                </td>
            </tr>
        `;

        if (contadorTarefas) {
            contadorTarefas.textContent = '0 tarefas';
        }

        return;
    }

    corpoTabela.innerHTML = tarefas.map(tarefa => {
        const id = obterId(tarefa);
        const nome = escaparHtml(obterCampo(tarefa, 'nome'));
        const responsavel = escaparHtml(
            obterCampo(tarefa, 'responsavel')
        );
        const data = escaparHtml(
            formatarData(obterCampo(tarefa, 'data_tarefa', 'dataTarefa'))
        );
        const concluido = estaConcluida(
            obterCampo(tarefa, 'concluido', 'concluida')
        );

        return `
            <tr>
                <td>${nome}</td>
                <td>${responsavel}</td>
                <td>${data}</td>
                <td>
                    <span class="status ${
                        concluido ? 'status-concluida' : 'status-pendente'
                    }">
                        ${concluido ? 'Concluída' : 'Pendente'}
                    </span>
                </td>
                <td>
                    <div class="actions">
                        <button
                            type="button"
                            class="action-button"
                            data-acao="alternar"
                            data-id="${escaparHtml(id)}"
                            title="${concluido ? 'Reabrir tarefa' : 'Concluir tarefa'}"
                            aria-label="${concluido ? 'Reabrir tarefa' : 'Concluir tarefa'}"
                        >${concluido ? '↩' : '✓'}</button>

                        <button
                            type="button"
                            class="action-button"
                            data-acao="editar"
                            data-id="${escaparHtml(id)}"
                            title="Editar tarefa"
                            aria-label="Editar tarefa"
                        >✎</button>

                        <button
                            type="button"
                            class="action-button danger"
                            data-acao="excluir"
                            data-id="${escaparHtml(id)}"
                            title="Excluir tarefa"
                            aria-label="Excluir tarefa"
                        >🗑</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    if (contadorTarefas) {
        contadorTarefas.textContent =
            `${tarefas.length} ${tarefas.length === 1 ? 'tarefa' : 'tarefas'}`;
    }
}

function atualizarIndicadores() {
    const concluidas = tarefas.filter(tarefa =>
        estaConcluida(obterCampo(tarefa, 'concluido', 'concluida'))
    ).length;

    const pendentes = tarefas.length - concluidas;

    if (indicadorTotal) indicadorTotal.textContent = tarefas.length;
    if (indicadorPendentes) indicadorPendentes.textContent = pendentes;
    if (indicadorConcluidas) indicadorConcluidas.textContent = concluidas;
}

corpoTabela.addEventListener('click', async evento => {
    const botao = evento.target.closest('button[data-acao]');

    if (!botao) return;

    const id = botao.dataset.id;
    const acao = botao.dataset.acao;

    if (acao === 'editar') {
        editarTarefa(id);
        return;
    }

    const tarefa = tarefas.find(
        item => String(obterId(item)) === String(id)
    );

    if (!tarefa) {
        mostrarMensagem('Tarefa não encontrada. Atualize a lista.', 'error');
        return;
    }

    botao.disabled = true;
    limparMensagem();

    try {
        if (acao === 'excluir') {
            const confirmou = confirm(
                `Tem certeza que deseja excluir a tarefa "${obterCampo(tarefa, 'nome')}"?`
            );

            if (!confirmou) return;

            await tarefaApi.excluir(id);
            mostrarMensagem('Tarefa excluída com sucesso!', 'success');
            await carregarTarefas();
        }

        if (acao === 'alternar') {
            const payload = obterPayload(
                tarefa,
                !estaConcluida(
                    obterCampo(tarefa, 'concluido', 'concluida')
                )
            );

            await tarefaApi.atualizar(id, payload);
            mostrarMensagem('Status da tarefa atualizado!', 'success');
            await carregarTarefas();
        }
    } catch (erro) {
        mostrarMensagem(normalizarErro(erro), 'error');
    } finally {
        botao.disabled = false;
    }
});

function configurarPeriodoInicial() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();

    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);

    const formatar = data => {
        const a = data.getFullYear();
        const m = String(data.getMonth() + 1).padStart(2, '0');
        const d = String(data.getDate()).padStart(2, '0');

        return `${a}-${m}-${d}`;
    };

    campoDataInicio.value = formatar(primeiroDia);
    campoDataFim.value = formatar(ultimoDia);
}

configurarPeriodoInicial();
carregarTarefas();
