const mysql = require('mysql2/promise');

async function conectar() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',      // coloque seu usuário do MySQL
        password: '',      // coloque sua senha do MySQL
        database: 'clientes',
        port: 3306
    });
    return connection;
}

async function desconectar(connection) {
   await connection.end();
}

module.exports = { conectar, desconectar };
