CREATE DATABASE IF NOT EXISTS clientes;
USE clientes;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 INSERT INTO usuarios (nome, email, senha) VALUES(
    'nome": "João Silva',
    'email": "joao@email.com',
    'senha": "123456'
 )