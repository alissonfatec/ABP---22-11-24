// Lógica de Cadastro
registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = registerForm.querySelector('input[type="text"]').value;
  const email = registerForm.querySelector('input[type="email"]').value;

  try {
    const response = await fetch("https://abp-22-11-24.onrender.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message || "Cadastro realizado com sucesso!");
      wrapper.classList.remove("active"); // Retorna para a aba de login
    } else {
      alert(data.message || "Erro ao cadastrar usuário.");
    }
  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    alert("Ocorreu um erro ao se conectar com o servidor.");
  }
});

// Lógica de Login
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = loginForm.querySelector('input[type="email"]').value;

  try {
    const response = await fetch("https://abp-22-11-24.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message || "Login realizado com sucesso!");
      localStorage.setItem("usuario", JSON.stringify({ email })); // Armazena o usuário no navegador
      window.location.href = "./template.html"; // Redireciona após o login
    } else {
      alert(data.message || "Erro ao fazer login.");
    }
  } catch (error) {
    console.error("Erro ao logar:", error);
    alert("Ocorreu um erro ao se conectar com o servidor.");
  }
});
