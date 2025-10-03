const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { listar_usuarios, inserir_usuario, buscar_usuario_por_email, criarTabelas } = require("./controller");

const app = express();

app.use(cors({ 
  origin: ["https://cucosus.github.io", "http://localhost:5000", "http://127.0.0.1:5000"], 
  credentials: true 
}));

app.use(express.json());

criarTabelas();

// Configuração da sessão
app.use(
  session({
    secret: "chave-secreta-jornal",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  }),
);

// ---------------- ROTAS ----------------

// Registro
app.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
      return res.status(400).send({ erro: "Preencha todos os campos" })
    }

    const usuarioExistente = await buscar_usuario_por_email(email)
    if (usuarioExistente) {
      return res.status(400).send({ erro: "Email já cadastrado" })
    }

    const hash = await bcrypt.hash(senha, 10)
    await inserir_usuario({ nome, email, senha: hash })

    res.status(201).send({ mensagem: "Usuário cadastrado com sucesso!" })
  } catch (err) {
    console.error(err)
    res.status(500).send({ erro: "Erro no servidor" })
  }
})

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body

    const usuario = await buscar_usuario_por_email(email)
    if (!usuario) {
      return res.status(401).send({ erro: "Credenciais inválidas" })
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha)
    if (!senhaValida) {
      return res.status(401).send({ erro: "Credenciais inválidas" })
    }

    req.session.user = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    }

    res.send({ mensagem: "Login realizado com sucesso", user: req.session.user })
  } catch (err) {
    console.error(err)
    res.status(500).send({ erro: "Erro no servidor" })
  }
})

// Usuário atual
app.get("/user", (req, res) => {
  if (req.session.user) {
    res.send({ user: req.session.user })
  } else {
    res.status(401).send({ erro: "Não autenticado" })
  }
})

// Logout
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send({ erro: "Erro ao encerrar sessão" })
    res.clearCookie("connect.sid")
    res.send({ mensagem: "Logout realizado com sucesso" })
  })
})

// Listar usuários (somente teste/admin)
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await listar_usuarios()
    res.send(usuarios)
  } catch (err) {
    res.status(500).send({ erro: err.message })
  }
})

app.listen(5000, () => {
  console.log("Servidor rodando em http://localhost:5000")
})
