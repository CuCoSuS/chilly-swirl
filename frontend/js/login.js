// Função para cadastrar usuário
async function inserir_usuario() {
    const usuario = {
        nome: document.getElementById("registerName").value.trim(),
        email: document.getElementById("registerEmail").value.trim(),
        senha: document.getElementById("registerPassword").value.trim()
    };

    if (!usuario.nome || !usuario.email || !usuario.senha) {
        document.getElementById("registerMsg").innerText = "Preencha todos os campos!";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/register", { // troque o IP se necessário
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
        });

        const data = await response.json();
        document.getElementById("registerMsg").innerText = data.message || "Cadastro realizado!";

        if (response.ok) {
            // Atualiza navbar
            updateNavbarForLoggedUser(usuario.email);

            // Fecha modal corretamente
            const modalElement = document.getElementById("registerModal");
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.hide();

            showAlert("Conta criada com sucesso!", "success");
        }
    } catch (error) {
        document.getElementById("registerMsg").innerText = "Erro no cadastro!";
        console.error("Erro:", error);
    }
}
// Função para login do usuário
async function buscar_usuario_por_email() {
    const usuario = {
        email: document.getElementById("loginEmail").value.trim(),
        senha: document.getElementById("loginPassword").value.trim()
    };

    if (!usuario.email || !usuario.senha) {
        document.getElementById("loginMsg").innerText = "Preencha todos os campos!";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/login", { // ajuste o IP se necessário
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
        });

        const data = await response.json();
        document.getElementById("loginMsg").innerText = data.mensagem || "Login realizado!";

        if (response.ok) {
            // Atualiza navbar
            updateNavbarForLoggedUser(usuario.email);

            // Fecha modal corretamente
            const modalElement = document.getElementById("loginModal");
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.hide();

            showAlert("Login realizado com sucesso!", "success");
        } else {
            showAlert(data.mensagem || "Credenciais inválidas!", "warning");
        }
    } catch (error) {
        document.getElementById("loginMsg").innerText = "Erro no login!";
        console.error("Erro:", error);
    }
}
