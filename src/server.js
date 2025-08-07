const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Array para armazenar obras
let obras = [];

// Listar todas as obras
app.get("/obras", (req, res) => {
  res.json(obras);
});

// Cadastrar nova obra
app.post("/obras", (req, res) => {
  const { nome, localizacao, orcamento, responsavel, etapa, progresso } = req.body;

  if (!nome || !localizacao || typeof orcamento !== "number" || isNaN(orcamento)) {
    return res.status(400).json({ mensagem: "Campos obrigatórios inválidos." });
  }

  const novaObra = {
    id: Date.now(),
    nome: nome.trim(),
    localizacao: localizacao.trim(),
    orcamento,
    responsavel: responsavel ? responsavel.trim() : "Não informado",
    etapa: etapa ? etapa.trim() : "Inicial",
    progresso: typeof progresso === "number" && !isNaN(progresso) ? progresso : 0,
  };

  obras.push(novaObra);
  res.status(201).json(novaObra);
});

// Atualizar obra
app.put("/obras/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ mensagem: "ID inválido." });

  const obra = obras.find(o => o.id === id);
  if (!obra) return res.status(404).json({ mensagem: "Obra não encontrada." });

  const { nome, localizacao, orcamento, responsavel, etapa, progresso } = req.body;

  if (nome && nome.trim() !== "") obra.nome = nome.trim();
  if (localizacao && localizacao.trim() !== "") obra.localizacao = localizacao.trim();

  if (typeof orcamento === "number" && !isNaN(orcamento)) obra.orcamento = orcamento;
  if (typeof progresso === "number" && !isNaN(progresso)) obra.progresso = progresso;

  if (responsavel !== undefined) obra.responsavel = responsavel.trim() !== "" ? responsavel.trim() : obra.responsavel;
  if (etapa !== undefined) obra.etapa = etapa.trim() !== "" ? etapa.trim() : obra.etapa;

  res.json(obra);
});

// Excluir obra
app.delete("/obras/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ mensagem: "ID inválido." });

  const index = obras.findIndex(o => o.id === id);
  if (index === -1) return res.status(404).json({ mensagem: "Obra não encontrada." });

  obras.splice(index, 1);
  res.json({ mensagem: "Obra excluída com sucesso." });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
