const { conectar, desconectar } = require('./db');

async function criarTabelas() {
    const conexao= await conectar();

    let query = `
        CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    await conexao.execute(query);
    await desconectar(conexao)
}

// ---------------- USUÁRIOS ----------------
async function listar_usuarios() {
    try {
        const conn = await conectar();
        const [linhas] = await conn.execute('SELECT id, nome, email FROM usuarios');
        await desconectar(conn);
        return linhas;
    } catch (err) {
        console.error('Erro ao listar usuários:', err.message);
        throw err;
    }
}

async function inserir_usuario(usuario) {
    const { nome, email, senha } = usuario;
    try {
        const conn = await conectar();
        await conn.execute(
            'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, senha]
        );
        await desconectar(conn);
    } catch (err) {
        console.error('Erro ao inserir usuário:', err.message);
        throw err;
    }
}

async function buscar_usuario_por_email(email) {
    try {
        const conn = await conectar();
        const [linhas] = await conn.execute(
            'SELECT id, nome, email, senha FROM usuarios WHERE email = ?',
            [email]
        );
        await desconectar(conn);
        return linhas.length > 0 ? linhas[0] : null;
    } catch (err) {
        console.error('Erro ao buscar usuário por email:', err.message);
        throw err;
    }
}

async function buscar_usuario_por_id(id) {
    try {
        const conn = await conectar();
        const [linhas] = await conn.execute(
            'SELECT id, nome, email FROM usuarios WHERE id = ?',
            [id]
        );
        await desconectar(conn);
        return linhas.length > 0 ? linhas[0] : null;
    } catch (err) {
        console.error('Erro ao buscar usuário por id:', err.message);
        throw err;
    }
}

module.exports = {
    listar_usuarios,
    inserir_usuario,
    buscar_usuario_por_email,
    buscar_usuario_por_id,
    criarTabelas
};
