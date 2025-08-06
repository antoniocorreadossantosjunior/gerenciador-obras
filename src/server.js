const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Simulando banco de dados
let obras = [];

// Rota inicial
app.get("/", (req, res) => {
  res.send("Bem-vindo ao Gerenciador de Obras\nProjeto em desenvolvimento...");
});

// Rota para cadastrar nova obra
app.post("/obras", (req, res) => {
  const { nome, localizacao, orcamento } = req.body;

  if (!nome || !localizacao || !orcamento) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
  }

  const novaObra = {
    id: Date.now(),
    nome,
    localizacao,
    orcamento: parseFloat(orcamento)
  };

  obras.push(novaObra);
  res.status(201).json(novaObra);
});

// Rota para listar todas as obras
app.get("/obras", (req, res) => {
  res.json(obras);
});

// Rota para atualizar obra pelo id (PUT)
app.put("/obras/:id", (req, res) => {
  const id = Number(req.params.id);
  const { nome, localizacao, orcamento } = req.body;

  const obra = obras.find((o) => o.id === id);
  if (!obra) {
    return res.status(404).json({ mensagem: "Obra não encontrada." });
  }

  if (nome) obra.nome = nome;
  if (localizacao) obra.localizacao = localizacao;
  if (orcamento) obra.orcamento = parseFloat(orcamento);

  res.json({ mensagem: "Obra atualizada com sucesso.", obra });
});

// Rota para excluir obra pelo id (DELETE)
app.delete("/obras/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = obras.findIndex((obra) => obra.id === id);

  if (index === -1) {
    return res.status(404).json({ mensagem: "Obra não encontrada." });
  }

  obras.splice(index, 1);
  res.json({ mensagem: "Obra removida com sucesso." });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
