
// API base URL
const AUTH_API = 'http://localhost:5000';
 
// Funções para comunicação com a API
async function registerUser(userData) {
    try {
        const response = await fetch(`${AUTH_API}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            credentials: 'include'
        });
 
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Erro no registro');
        }
 
        return data;
    } catch (error) {
        throw error;
    }
}
 
async function loginUser(credentials) {
    try {
        const response = await fetch(`${AUTH_API}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
            credentials: 'include'
        });
 
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Erro no login');
        }
 
        return data;
    } catch (error) {
        throw error;
    }
}
 
async function logoutUser() {
    try {
        const response = await fetch(`${AUTH_API}/logout`, {
            method: 'POST',
            credentials: 'include'
        });
 
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro no logout:', error);
    }
}
 
async function getCurrentUser() {
    try {
        const response = await fetch(`${AUTH_API}/user`, {
            credentials: 'include'
        });
 
        if (response.status === 401) {
            return null;
        }
 
        const data = await response.json();
        return data.user;
    } catch (error) {
        console.error('Erro ao obter usuário:', error);
        return null;
    }
}
 
// Integração com o frontend existente
document.addEventListener("DOMContentLoaded", function() {
    // Substituir as funções existentes no chillyswirl.js
    if (typeof updateNavbarForLoggedUser === 'function') {
        checkAuthStatus();
    }
 
    // Login form
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();
 
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;
 
            try {
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
 
                submitBtn.innerHTML = '<span class="loading"></span> Entrando...';
                submitBtn.disabled = true;
 
                const result = await loginUser({ email, senha: password });
                
                if (typeof showAlert === 'function') {
                    showAlert("Login realizado com sucesso! Bem-vindo(a)!", "success");
                }
                
                if (typeof updateNavbarForLoggedUser === 'function') {
                    updateNavbarForLoggedUser(result.user);
                }
 
                const loginModal = bootstrap.Modal.getInstance(document.getElementById("loginModal"));
                loginModal.hide();
 
                this.reset();
 
            } catch (error) {
                if (typeof showAlert === 'function') {
                    showAlert(error.message, "warning");
                }
            } finally {
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i>Entrar';
                submitBtn.disabled = false;
            }
        });
    }
 
    // Register form
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async function (e) {
            e.preventDefault();
 
            const name = document.getElementById("registerName").value;
            const email = document.getElementById("registerEmail").value;
            const password = document.getElementById("registerPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
 
            if (password !== confirmPassword) {
                if (typeof showAlert === 'function') {
                    showAlert("As senhas não coincidem.", "warning");
                }
                return;
            }
 
            try {
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
 
                submitBtn.innerHTML = '<span class="loading"></span> Criando conta...';
                submitBtn.disabled = true;
 
                const result = await registerUser({ 
                    nome: name, 
                    email, 
                    senha: password 
                });
                
                if (typeof showAlert === 'function') {
                    showAlert("Conta criada com sucesso! Faça login para continuar.", "success");
                }
                
                if (typeof showLoginForm === 'function') {
                    showLoginForm();
                }
 
                this.reset();
 
            } catch (error) {
                if (typeof showAlert === 'function') {
                    showAlert(error.message, "warning");
                }
            } finally {
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="bi bi-person-check me-2"></i>Criar Conta';
                submitBtn.disabled = false;
            }
        });
    }
});
 
// Verificar status de autenticação
async function checkAuthStatus() {
    const user = await getCurrentUser();
    if (user && typeof updateNavbarForLoggedUser === 'function') {
        updateNavbarForLoggedUser(user);
        return true;
    }
    return false;
}
 
// Atualizar a função de logout
async function logout() {
    try {
        await logoutUser();
        if (typeof showAlert === 'function') {
            showAlert("Você foi desconectado com sucesso!", "info");
        }
        if (typeof showLoginButton === 'function') {
            showLoginButton();
        }
    } catch (error) {
        console.error('Erro no logout:', error);
    }
}
 