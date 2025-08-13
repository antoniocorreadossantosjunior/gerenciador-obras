const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// "Banco de dados" em memória
let obras = [];
let idAtual = 1;

// GET todas as obras
app.get("/obras", (req, res) => {
  res.json(obras);
});

// GET obra por ID
app.get("/obras/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const obra = obras.find(o => o.id === id);
  if (!obra) return res.status(404).json({ mensagem: "Obra não encontrada" });
  res.json(obra);
});

// POST nova obra
app.post("/obras", (req, res) => {
  const { nome, localizacao, orcamento, responsavel, status, progresso } = req.body;

  if (!nome || !localizacao || orcamento == null) {
    return res.status(400).json({ mensagem: "Campos obrigatórios ausentes" });
  }

  const novaObra = {
    id: idAtual++,
    nome,
    localizacao,
    orcamento,
    responsavel,
    status: status || "Inicial",
    progresso: progresso || 0
  };

  obras.push(novaObra);
  res.status(201).json(novaObra);
});

// PUT atualizar obra
app.put("/obras/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const obra = obras.find(o => o.id === id);
  if (!obra) return res.status(404).json({ mensagem: "Obra não encontrada" });

  const { nome, localizacao, orcamento, responsavel, status, progresso } = req.body;

  obra.nome = nome || obra.nome;
  obra.localizacao = localizacao || obra.localizacao;
  obra.orcamento = orcamento != null ? orcamento : obra.orcamento;
  obra.responsavel = responsavel || obra.responsavel;
  obra.status = status || obra.status;
  obra.progresso = progresso != null ? progresso : obra.progresso;

  res.json(obra);
});

// DELETE obra
app.delete("/obras/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = obras.findIndex(o => o.id === id);
  if (index === -1) return res.status(404).json({ mensagem: "Obra não encontrada" });

  obras.splice(index, 1);
  res.json({ mensagem: "Obra excluída com sucesso" });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
