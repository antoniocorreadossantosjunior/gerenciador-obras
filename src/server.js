const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware para servir os arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "../public")));

// Rota simples para testar
app.get("/api", (req, res) => {
  res.json({ mensagem: "API do Gerenciador de Obras ativa!" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// Simulação do banco de dados
const obras = [
  {
    id: 1,
    nome: "Casa A",
    endereco: "Rua 1",
    etapas: [
      { id: 1, nome: "Fundação", status: "concluido" },
      { id: 2, nome: "Estrutura", status: "em andamento" },
    ],
    materiais: [
      { id: 1, nome: "Cimento", quantidade: 100 },
      { id: 2, nome: "Areia", quantidade: 200 },
    ],
  },
];

// Rota para listar todas as obras
app.get("/obras", (req, res) => {
  res.json(obras);
});

// Rota para ver obra por id
app.get("/obras/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const obra = obras.find((o) => o.id === id);
  if (!obra) return res.status(404).json({ mensagem: "Obra não encontrada" });
  res.json(obra);
});

// Rota para adicionar obra
app.post("/obras", (req, res) => {
  const { nome, endereco } = req.body;
  if (!nome || !endereco) {
    return res.status(400).json({ mensagem: "Nome e endereço são obrigatórios" });
  }

  const novaObra = {
    id: obras.length + 1,
    nome,
    endereco,
    etapas: [],
    materiais: [],
  };
  obras.push(novaObra);
  res.status(201).json({ mensagem: "Obra adicionada com sucesso!", obra: novaObra });
});

// Rota para adicionar etapa a uma obra
app.post("/obras/:id/etapas", (req, res) => {
  const id = parseInt(req.params.id);
  const obra = obras.find((o) => o.id === id);
  if (!obra) return res.status(404).json({ mensagem: "Obra não encontrada" });

  const { nome, status } = req.body;
  if (!nome || !status) {
    return res.status(400).json({ mensagem: "Nome e status da etapa são obrigatórios" });
  }

  const novaEtapa = {
    id: obra.etapas.length + 1,
    nome,
    status,
  };
  obra.etapas.push(novaEtapa);
  res.status(201).json({ mensagem: "Etapa adicionada com sucesso!", etapa: novaEtapa });
});

// Rota para listar etapas de uma obra
app.get("/obras/:id/etapas", (req, res) => {
  const id = parseInt(req.params.id);
  const obra = obras.find((o) => o.id === id);
  if (!obra) return res.status(404).json({ mensagem: "Obra não encontrada" });
  res.json(obra.etapas);
});

// Rota para adicionar material a uma obra
app.post("/obras/:id/materiais", (req, res) => {
  const id = parseInt(req.params.id);
  const obra = obras.find((o) => o.id === id);
  if (!obra) return res.status(404).json({ mensagem: "Obra não encontrada" });

  const { nome, quantidade } = req.body;
  if (!nome || !quantidade) {
    return res.status(400).json({ mensagem: "Nome e quantidade do material são obrigatórios" });
  }

  const novoMaterial = {
    id: obra.materiais.length + 1,
    nome,
    quantidade,
  };
  obra.materiais.push(novoMaterial);
  res.status(201).json({ mensagem: "Material adicionado com sucesso!", material: novoMaterial });
});

// Rota para listar materiais de uma obra
app.get("/obras/:id/materiais", (req, res) => {
  const id = parseInt(req.params.id);
  const obra = obras.find((o) => o.id === id);
  if (!obra) return res.status(404).json({ mensagem: "Obra não encontrada" });
  res.json(obra.materiais);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
