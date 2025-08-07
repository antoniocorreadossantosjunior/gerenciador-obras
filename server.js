const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // pasta dos arquivos frontend

// Simulando banco de dados
let obras = [];

// Rota inicial
app.get("/", (req, res) => {
  res.send("Bem-vindo ao Gerenciador de Obras!");
});

// ✅ Rota para obter todas as obras
app.get("/obras", (req, res) => {
  res.json(obras);
});

// ✅ Rota para cadastrar nova obra
app.post("/obras", (req, res) => {
  console.log("POST /obras recebido:", req.body);
  const { nome, localizacao, orcamento, progresso } = req.body;

  if (!nome || !localizacao || !orcamento) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
  }

  const novaObra = {
    id: Date.now(),
    nome,
    localizacao,
    orcamento: parseFloat(orcamento),
    progresso: progresso || 0,
  };

  obras.push(novaObra);
  console.log("Obra cadastrada:", novaObra);
  res.status(201).json(novaObra);
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
