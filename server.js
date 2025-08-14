const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Banco de dados em memória
let obras = [];
let proximoIdObra = 1;

// ====================== ROTAS ======================

// Listar todas as obras
app.get("/obras", (req, res) => {
  res.json(obras);
});

// Cadastrar nova obra
app.post("/obras", (req, res) => {
  const { nome, localizacao, responsavel, status, progresso } = req.body;

  if (!nome || !localizacao || !status || typeof progresso !== "number") {
    return res.status(400).json({ mensagem: "Dados inválidos." });
  }

  const novaObra = {
    id: proximoIdObra++,
    nome,
    localizacao,
    responsavel: responsavel || null,
    status,
    progresso,
    etapas: [] // cada obra terá suas etapas
  };

  obras.push(novaObra);
  res.status(201).json(novaObra);
});

// Editar obra
app.put("/obras/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const obra = obras.find(o => o.id === id);
  if (!obra) return res.status(404).json({ mensagem: "Obra não encontrada." });

  const { nome, localizacao, responsavel, status, progresso } = req.body;
  if (!nome || !localizacao || !status || typeof progresso !== "number") {
    return res.status(400).json({ mensagem: "Dados inválidos." });
  }

  obra.nome = nome;
  obra.localizacao = localizacao;
  obra.responsavel = responsavel || null;
  obra.status = status;
  obra.progresso = progresso;

  res.json(obra);
});

// Excluir obra (inclui etapas e materiais)
app.delete("/obras/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = obras.findIndex(o => o.id === id);
  if (index === -1) return res.status(404).json({ mensagem: "Obra não encontrada." });

  obras.splice(index, 1);
  res.json({ mensagem: "Obra excluída com todas as etapas e materiais." });
});

// ====================== ETAPAS ======================

// Adicionar etapa a uma obra
app.post("/obras/:id/etapas", (req, res) => {
  const id = parseInt(req.params.id);
  const obra = obras.find(o => o.id === id);
  if (!obra) return res.status(404).json({ mensagem: "Obra não encontrada." });

  const { nome, prazo, status } = req.body;
  if (!nome || !status) return res.status(400).json({ mensagem: "Dados inválidos." });

  const novaEtapa = {
    id: Date.now(),
    nome,
    prazo: prazo || null,
    status,
    materiais: []
  };

  obra.etapas.push(novaEtapa);
  res.status(201).json(novaEtapa);
});

// Editar etapa
app.put("/obras/:id/etapas/:etapaId", (req, res) => {
  const id = parseInt(req.params.id);
  const etapaId = parseInt(req.params.etapaId);
  const obra = obras.find(o => o.id === id);
  if (!obra) return res.status(404).json({ mensagem: "Obra não encontrada." });

  const etapa = obra.etapas.find(e => e.id === etapaId);
  if (!etapa) return res.status(404).json({ mensagem: "Etapa não encontrada." });

  const { nome, prazo, status } = req.body;
  if (!nome || !status) return res.status(400).json({ mensagem: "Dados inválidos." });

  etapa.nome = nome;
  etapa.prazo = prazo || null;
  etapa.status = status;

  res.json(etapa);
});

// Excluir etapa
app.delete("/obras/:id/etapas/:etapaId", (req, res) => {
  const id = parseInt(req.params.id);
  const etapaId = parseInt(req.params.etapaId);
  const obra = obras.find(o => o.id === id);
  if (!obra) return res.status(404).json({ mensagem: "Obra não encontrada." });

  const index = obra.etapas.findIndex(e => e.id === etapaId);
  if (index === -1) return res.status(404).json({ mensagem: "Etapa não encontrada." });

  obra.etapas.splice(index, 1);
  res.json({ mensagem: "Etapa excluída com todos os materiais." });
});

// ====================== MATERIAIS ======================

// Adicionar material a uma etapa
app.post("/obras/:id/etapas/:etapaId/materiais", (req, res) => {
  const id = parseInt(req.params.id);
  const etapaId = parseInt(req.params.etapaId);
  const obra = obras.find(o => o.id === id);
  if (!obra) return res.status(404).json({ mensagem: "Obra não encontrada." });

  const etapa = obra.etapas.find(e => e.id === etapaId);
  if (!etapa) return res.status(404).json({ mensagem: "Etapa não encontrada." });

  const { nome, quantidade, custoUnit } = req.body;
  if (!nome || typeof quantidade !== "number" || typeof custoUnit !== "number") {
    return res.status(400).json({ mensagem: "Dados inválidos." });
  }

  const material = { id: Date.now(), nome, quantidade, custoUnit };
  etapa.materiais.push(material);
  res.status(201).json(material);
});

// Excluir material
app.delete("/obras/:id/etapas/:etapaId/materiais/:materialId", (req, res) => {
  const id = parseInt(req.params.id);
  const etapaId = parseInt(req.params.etapaId);
  const materialId = parseInt(req.params.materialId);
  const obra = obras.find(o => o.id === id);
  if (!obra) return res.status(404).json({ mensagem: "Obra não encontrada." });

  const etapa = obra.etapas.find(e => e.id === etapaId);
  if (!etapa) return res.status(404).json({ mensagem: "Etapa não encontrada." });

  const index = etapa.materiais.findIndex(m => m.id === materialId);
  if (index === -1) return res.status(404).json({ mensagem: "Material não encontrado." });

  etapa.materiais.splice(index, 1);
  res.json({ mensagem: "Material excluído." });
});

// ====================== INICIAR SERVIDOR ======================
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
