const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');

// Inicializa o cliente do Google com o ID do seu .env
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --- REGISTRO TRADICIONAL ---
exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (err) {
    res.status(400).json({ error: "Erro ao cadastrar. Verifique se o CPF ou Email já existem." });
  }
};

// --- LOGIN TRADICIONAL ---
exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // Busca por email OU cpf (mais profissional)
    const user = await User.findOne({ 
      where: { email: identifier } 
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.json({ 
      token, 
      user: { nome: user.nome, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

// --- LOGIN/REGISTRO COM GOOGLE ---
exports.googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    // 1. Verifica se o token enviado pelo front é válido no Google
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub, picture } = payload;

    // 2. Procura o usuário no banco
    let user = await User.findOne({ where: { email } });

    // 3. Se não existir, cria um novo (Registro automático via Google)
    if (!user) {
      user = await User.create({
        nome: name,
        email: email,
        cpf: `G-${sub.substring(0, 10)}`, // Gera um CPF fictício único baseado no ID do Google
        password: await bcrypt.hash(Math.random().toString(36), 10), // Senha aleatória segura
        role: 'user' // Por padrão, usuários do Google são 'user'
      });
    }

    // 4. Gera o nosso JWT interno
    const jwtToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token: jwtToken,
      user: { nome: user.nome, role: user.role, foto: picture }
    });

  } catch (error) {
    console.error("Erro Google Login:", error);
    res.status(400).json({ error: "Falha na autenticação com Google" });
  }
};