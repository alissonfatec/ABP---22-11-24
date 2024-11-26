function listarQuestao() {
    // Verifica se o usuário está logado
    if (usuarioLogado) {
        document.getElementById("btnLogin").style.display = "none";
    } else {
        alert("Ocorreu um erro ao se conectar com o servidor.");
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
        const response = await fetch('https://abp-22-11-24.onrender.com/verificar-progresso', {
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
    await verificarProgresso(6);

    const usuarioRespondeu = localStorage.getItem('questionario6Respondido');
    if (usuarioRespondeu === 'true') {
        alert('Você já passou neste questionário e não pode respondê-lo novamente. Hora de coletar seu certificado!');
        document.getElementById('enviarRespostas').disabled = true;
        window.location.href = 'certificado.html';
    }

    const enviarRespostasBtn = document.getElementById('enviarRespostas');
    if (enviarRespostasBtn) {
        enviarRespostasBtn.addEventListener('click', async () => {
            const form = document.getElementById('questionario');
            if (form) {
                console.log("botão encontrado");
            } else {
                console.log("botão não encontrado");
            }

            // IDs das questões do questionário atual
            const questionarioAtual = [16, 17, 18]; // IDs fictícios; substitua pelos corretos do quarto questionário
            const numeroQuestionario = 6; // Número do questionário atual

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
                const response = await fetch('https://abp-22-11-24.onrender.com/salvar-respostas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.redirect) {
                        alert('Você obteve êxito no questionário. Parabéns!');
                        document.getElementById('enviarRespostas').disabled = true;
                        localStorage.setItem('questionario6Respondido', 'true');
                        window.location.href = "/certificado.html";
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
    } else {
        console.log('Botão "Enviar Respostas" não encontrado');
    }
});
