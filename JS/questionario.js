function listarQuestao() {
    // Verifica se o usuário está logado
    if (usuarioLogado) {
        document.getElementById("btnLogin").style.display = "none";
    } else {
        alert("Ocorreu um erro ao se conectar com o servidor.");
        document.getElementById("saida").innerHTML = "<div>Usuário não logado!!! efetue o login em <a href="/login.html">Login.</a></div>"
    }
}

async function verificarProgresso(numeroQuestionario) {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
        console.error('Usuário não está logado.');
        return;
    }

    const usuarioObj = JSON.parse(usuario);
    const email = usuarioObj.email;

    try {
        const response = await fetch('http://localhost:3000/verificar-progresso', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, numeroQuestionario }),
        });

        if (response.ok) {
            const data = await response.json();
            const questionarioRespondido = data.questionarioRespondido;

            // Atualiza dinamicamente o localStorage com base no número do questionário
            const storageKey = `questionario${numeroQuestionario}Respondido`;
            localStorage.setItem(storageKey, questionarioRespondido ? 'true' : 'false');
        } else {
            console.error('Erro ao verificar progresso.');
        }
    } catch (error) {
        console.error('Erro ao conectar com o servidor:', error);
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    await verificarProgresso(1);

    const usuarioRespondeu = localStorage.getItem('questionario1Respondido');
    if (usuarioRespondeu === 'true') {
        alert('Você já passou neste questionário e não pode respondê-lo novamente.');
        document.getElementById('enviarRespostas').disabled = true;
        window.location.href = 'trilha_2_1.html';
    }
});

document.getElementById('enviarRespostas').addEventListener('click', async () => {
    const form = document.getElementById('questionario');

    // IDs das questões do questionário atual (ajuste para cada questionário)
    const questionarioAtual = [1, 2, 3];
    const numeroQuestionario = 1; // Número do questionário atual

    // Mapeia as respostas do formulário
    const respostas = questionarioAtual.map((idquestao, index) => ({
        idquestao,
        resposta_aluno: form[`q${index + 1}`].value === 'true',
    }));

    // Obtém o email do usuário
    const usuario = localStorage.getItem('usuario');
    const usuarioObj = JSON.parse(usuario);
    const mail = usuarioObj?.email;

    if (!mail) {
        alert('Usuário não está logado.');
        return;
    }

    // Adiciona o email e o número do questionário às respostas
    const data = {
        respostas: respostas.map(item => ({ ...item, mail })),
        numeroQuestionario, // Inclui o número do questionário
    };

    try {
        const response = await fetch('http://localhost:3000/salvar-respostas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            if (result.redirect) {
                alert('Você obteve êxito no questionário. Parabéns!');
                document.getElementById('enviarRespostas').disabled = true;
                localStorage.setItem('questionario1Respondido', 'true');
                window.location.href = result.redirect;
            } else {
                alert('Você não atingiu o número mínimo de acertos. Tente novamente.');
            }
        } else {
            alert('Erro ao enviar respostas.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor.');
    }
});

