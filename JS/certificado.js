document.addEventListener("DOMContentLoaded", async () => {
  // Espera o carregamento completo do DOM antes de executar o código
  const nomeUsuarioElement = document.getElementById("nome-usuario");

  if (!nomeUsuarioElement) {
    console.error("Elemento com id 'nome-usuario' não encontrado.");
    return;
  }

  // Obtém o email do usuário armazenado no localStorage
  const usuario = localStorage.getItem("usuario");
  if (!usuario) {
    alert("Usuário não encontrado. Por favor, faça login.");
    return;
  }

  const usuarioObj = JSON.parse(usuario);
  const email = usuarioObj.email;

  try {
    // Faz a requisição para obter o nome do usuário
    const response = await fetch("http://localhost:3000/get-nome-usuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      const data = await response.json();
      const nomeUsuario = data.nome;

      // Atualiza o conteúdo do h2 com o id "nome-usuario"
      nomeUsuarioElement.innerText = nomeUsuario;

      // Agora, podemos passar o nome do usuário para a função que vai desenhá-lo na imagem
      desenharCertificado(nomeUsuario);
    } else {
      console.error("Erro ao buscar nome do usuário:", response.statusText);
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
});

// Função para desenhar no certificado (canvas)
function desenharCertificado(nomeUsuario) {
  const canvas = document.getElementById("certificadoCanvas");
  const ctx = canvas.getContext("2d");

  // Carregar a imagem do certificado original
  const imagemCertificado = new Image();
  imagemCertificado.src = "/Assets/Certificado.png"; // Caminho para a imagem do certificado base

  // Quando a imagem for carregada, desenha no canvas
  imagemCertificado.onload = () => {
    // Desenha a imagem no canvas
    ctx.drawImage(imagemCertificado, 0, 0, canvas.width, canvas.height);

    if (nomeUsuario) {
      // Adiciona o nome do usuário na imagem
      ctx.font = "40px Arial"; // Tamanho da fonte
      ctx.fillStyle = "Black"; // Cor do texto
      ctx.textAlign = "center"; // Alinha o texto ao centro

      // Adiciona o nome na posição especificada (ajuste conforme necessário)
      ctx.fillText(nomeUsuario, canvas.width / 2, 300); // Ajuste a posição conforme necessário
    } else {
      console.warn("Nome do usuário não encontrado.");
      // Caso o nome não seja encontrado, use o nome padrão
      ctx.fillText("Nome do Usuário", canvas.width / 2, 300);
    }
  };

  // Função para gerar o PDF na orientação horizontal (landscape)
  const downloadBtn = document.getElementById("downloadBtn");
  downloadBtn.addEventListener("click", () => {
    // Converte o canvas para uma imagem
    const dataUrl = canvas.toDataURL("image/png");

    // Cria uma instância do jsPDF com orientação horizontal (landscape)
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("landscape", "mm", "a4"); // A4 em paisagem (297x210mm)

    // Adiciona a imagem do canvas ao PDF
    doc.addImage(dataUrl, "PNG", 10, 10, 277, 197); // A imagem ocupa quase toda a página A4 em paisagem

    // Gera o PDF com o nome de arquivo
    doc.save("certificado-personalizado.pdf");
  });
}

// Função para verificar se todos os questionários estão concluídos
function verificarConclusaoQuestionarios() {
    const questionarios = [
      "questionario1Respondido",
      "questionario2Respondido",
      "questionario3Respondido",
      "questionario4Respondido",
      "questionario5Respondido",
      "questionario6Respondido"
    ];
  
    const todosConcluidos = questionarios.every(
      (questao) => localStorage.getItem(questao) === "true"
    );
  
    // Se todos os questionários estiverem concluídos, libera o acesso ao certificado
    if (todosConcluidos) {
      document.getElementById("certificado-container").style.display = "block"; // Exibe o conteúdo do certificado
      document.getElementById("mensagemIncompleta").style.display = "none"; // Esconde a mensagem de erro
    } else {
      document.getElementById("certificado-container").style.display = "none"; // Esconde o conteúdo do certificado
      document.getElementById("mensagemIncompleta").style.display = "block"; // Exibe a mensagem de erro
    }
  }