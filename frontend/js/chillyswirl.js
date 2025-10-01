// ------------------ Funções visuais gerais ------------------

function abrir_lightbox(imgElement) {
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");

  lightboxImg.src = imgElement.src;
  lightbox.style.display = "flex";
}

function fechar_lightbox() {
  document.getElementById("lightbox").style.display = "none";
}

// Smooth scrolling
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// Filtro de sabores
function filterFlavors(category) {
  const cards = document.querySelectorAll(".flavor-card");
  const buttons = document.querySelectorAll(".btn-group .btn");

  buttons.forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");

  cards.forEach((card) => {
    if (category === "todos" || card.dataset.category === category) {
      card.classList.remove("hidden");
      setTimeout(() => {
        card.style.display = "block";
      }, 50);
    } else {
      card.classList.add("hidden");
      setTimeout(() => {
        if (card.classList.contains("hidden")) {
          card.style.display = "none";
        }
      }, 500);
    }
  });
}

// Efeito navbar ao rolar
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.backgroundColor = "rgba(255, 255, 255, 0.98)";
    navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
  } else {
    navbar.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
    navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.05)";
  }
});

// Alert personalizado
function showAlert(message, type = "info") {
  const existingAlert = document.querySelector(".custom-alert");
  if (existingAlert) {
    existingAlert.remove();
  }

  const alert = document.createElement("div");
  alert.className = `alert alert-${type} custom-alert position-fixed`;
  alert.style.cssText = `
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        border-radius: 10px;
    `;
  alert.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-${type === "success" ? "check-circle" : type === "warning" ? "exclamation-triangle" : "info-circle"} me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;

  document.body.appendChild(alert);

  setTimeout(() => {
    if (alert.parentElement) {
      alert.remove();
    }
  }, 5000);
}

// ------------------ Animações e efeitos ------------------

function animateOnScroll() {
  const elements = document.querySelectorAll(".card, .hero-content, .location-info");
  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    if (elementTop < window.innerHeight - elementVisible) {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".card, .location-info");
  elements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition = "all 0.6s ease";
  });
  window.addEventListener("scroll", animateOnScroll);
  animateOnScroll();
});

// Auto close do menu mobile
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navbarCollapse.classList.contains("show")) {
        const bsCollapse = window.bootstrap.Collapse;
        new bsCollapse(navbarCollapse).hide();
      }
    });
  });
});

// Ripple effect nos botões
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn")) {
    const ripple = document.createElement("span");
    const rect = e.target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

    e.target.style.position = "relative";
    e.target.style.overflow = "hidden";
    e.target.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
});

const style = document.createElement("style");
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ------------------ Interface de Login/Cadastro ------------------

function showRegisterForm() {
  const loginModal = window.bootstrap.Modal.getInstance(document.getElementById("loginModal"));
  const registerModal = new window.bootstrap.Modal(document.getElementById("registerModal"));
  loginModal.hide();
  setTimeout(() => {
    registerModal.show();
  }, 300);
}

function showLoginForm() {
  const registerModal = window.bootstrap.Modal.getInstance(document.getElementById("registerModal"));
  const loginModal = new window.bootstrap.Modal(document.getElementById("loginModal"));
  registerModal.hide();
  setTimeout(() => {
    loginModal.show();
  }, 300);
}

function updateNavbarForLoggedUser(email) {
  const authContainer = document.getElementById("auth-container");
  if (authContainer) {
    const userName = email.split("@")[0];
    authContainer.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-outline-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
          <i class="bi bi-person-check me-1"></i>${userName}
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="#"><i class="bi bi-person me-2"></i>Meu Perfil</a></li>
          <li><a class="dropdown-item" href="#"><i class="bi bi-bag me-2"></i>Meus Pedidos</a></li>
          <li><a class="dropdown-item" href="#"><i class="bi bi-heart me-2"></i>Favoritos</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#" onclick="logout()"><i class="bi bi-box-arrow-right me-2"></i>Sair</a></li>
        </ul>
      </div>
    `;
  }
}

function showLoginButton() {
  const authContainer = document.getElementById("auth-container");
  if (authContainer) {
    authContainer.innerHTML = `
      <button class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#loginModal">
        <i class="bi bi-person-circle me-1"></i>Login
      </button>
    `;
  }
}

function logout() {
  showAlert("Você foi desconectado com sucesso!", "info");
  showLoginButton();
}

function showLoginModal() {
  const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
  loginModal.show();
}

function showRegisterModal() {
  const registerModal = new bootstrap.Modal(document.getElementById("registerModal"));
  registerModal.show();
}

function closeLoginModal() {
  const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
  loginModal.hide();
}

function closeRegisterModal() {
  const registerModal = new bootstrap.Modal(document.getElementById("registerModal"));
  registerModal.hide();
}
