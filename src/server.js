const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Banco de dados fictício (em memória)
let obras = [];

// Rota inicial
app.get("/", (req, res) => {
  res.send("Bem-vindo ao Gerenciador de Obras\nProjeto em desenvolvimento...");
});

// Rota para listar obras
app.get("/obras", (req, res) => {
  res.json(obras);
});

// Rota para adicionar nova obra
app.post("/obras", (req, res) => {
  const { nome, localizacao, orcamento } = req.body;

  // Validação simples
  if (!nome || !localizacao || !orcamento) {
    return res.status(400).json({ erro: "Preencha todos os campos!" });
  }

  const novaObra = {
    id: Date.now(),
    nome,
    localizacao,
    orcamento,
  };

  obras.push(novaObra);
  res.status(201).json(novaObra);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
