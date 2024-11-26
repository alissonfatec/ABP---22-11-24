const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg'); // Biblioteca para integração com PostgreSQL

// Configuração do pool de conexão com PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,  // Usando a URL de conexão que o Render fornece
    ssl: {
        rejectUnauthorized: false  // Necessário para conexões seguras
    }
});

const app = express();
const PORT = 3000;

// Exemplo de consulta
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Erro na consulta:', err);
    } else {
        console.log('Consulta realizada com sucesso:', res.rows);
    }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rota raiz
app.get('/', (req, res) => {
    res.send('Servidor está funcionando! Acesse as rotas /register e /login.');
});

// Rota de cadastro
app.post('/register', async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Nome e email são obrigatórios.' });
    }

    try {
        // Remover espaços extras e garantir que o email seja minúsculo
        const cleanEmail = email.trim().toLowerCase();

        const userExists = await pool.query('SELECT * FROM tbusuario WHERE LOWER(email) = $1', [cleanEmail]);

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Usuário já cadastrado com esse email.' });
        }

        await pool.query('INSERT INTO tbusuario (nome, email) VALUES ($1, $2)', [name, cleanEmail]);
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
    }
});

// Rota de login
app.post('/login', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email é obrigatório.' });
    }

    try {
        // Remover espaços extras e garantir que o email seja minúsculo
        const cleanEmail = email.trim().toLowerCase();

        const user = await pool.query('SELECT * FROM tbusuario WHERE LOWER(email) = $1', [cleanEmail]);

        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json({ message: 'Login bem-sucedido.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao fazer login.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
