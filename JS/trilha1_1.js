document.getElementById("btnLogin").addEventListener("click", function() {
    window.location.href = "./login.html";
});

document.getElementById("btn trilha1_2").addEventListener("click", function(){
    window.location.href = "./trilha_1_2.html";
});

// Seleciona os elementos relevantes
const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');
const navigation = document.querySelector('.navigation');
const closeBtn = document.createElement('button'); // Cria o botão de fechar

// Configura o botão de fechar (aparece quando a sidebar está aberta)
closeBtn.textContent = 'Fechar';
closeBtn.classList.add('close-btn');
closeBtn.style.display = 'none'; // Inicialmente não visível
sidebar.appendChild(closeBtn);

// Quando o hambúrguer é clicado, abre a sidebar
hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    navigation.classList.toggle('open'); // Oculta os links de navegação
});

// Quando o botão de fechar é clicado, fecha a sidebar
closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
    navigation.classList.remove('open'); // Restaura a visibilidade dos links
    closeBtn.style.display = 'none'; // Oculta o botão de fechar
});
