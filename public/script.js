// Enviar obra para o backend
document.getElementById("obra-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const localizacao = document.getElementById("localizacao").value;
  const orcamento = document.getElementById("orcamento").value;
  const responsavel = document.getElementById("responsavel").value || "Não informado";
  const etapa = document.getElementById("etapa").value || "Inicial";
  const progresso = parseInt(document.getElementById("progresso").value) || 0;

  const obra = {
    id: Date.now(),
    nome,
    localizacao,
    orcamento,
    responsavel,
    etapa,
    progresso
  };

  fetch("http://localhost:3000/obras", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obra),
  })
    .then((res) => res.json())
    .then(() => {
      this.reset();
      exibirObras();
    });
});

// Exibir todas as obras do backend
function exibirObras() {
  fetch("http://localhost:3000/obras")
    .then((res) => res.json())
    .then((dados) => {
      const container = document.getElementById("lista-obras");
      container.innerHTML = "";

      dados.forEach((obra) => {
        const div = document.createElement("div");
        div.classList.add("obra");

        div.innerHTML = `
          <h3>${obra.nome}</h3>
          <p><strong>Localização:</strong> ${obra.localizacao}</p>
          <p><strong>Orçamento:</strong> R$ ${obra.orcamento}</p>
          <p><strong>Responsável:</strong> ${obra.responsavel}</p>
          <p><strong>Etapa:</strong> ${obra.etapa}</p>
          <p><strong>Progresso:</strong> ${obra.progresso}%</p>
          <div class="barra">
            <div class="progresso" style="width: ${obra.progresso}%;"></div>
          </div>
          <button onclick="editarObra(${obra.id})">Editar</button>
          <button onclick="excluirObra(${obra.id})">Excluir</button>
        `;

        container.appendChild(div);
      });
    });
}

// Excluir uma obra
function excluirObra(id) {
  fetch(`http://localhost:3000/obras/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then(() => {
      alert("Obra excluída com sucesso!");
      exibirObras();
    });
}

// Editar uma obra
function editarObra(id) {
  const novoNome = prompt("Novo nome da obra:");
  const novaLocalizacao = prompt("Nova localização:");
  const novoOrcamento = prompt("Novo orçamento:");
  const novoResponsavel = prompt("Novo responsável:");
  const novaEtapa = prompt("Nova etapa da obra:");
  const novoProgresso = prompt("Novo progresso (0-100):");

  fetch(`http://localhost:3000/obras/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: novoNome,
      localizacao: novaLocalizacao,
      orcamento: novoOrcamento,
      responsavel: novoResponsavel,
      etapa: novaEtapa,
      progresso: parseInt(novoProgresso),
    }),
  })
    .then((res) => res.json())
    .then(() => {
      alert("Obra editada com sucesso!");
      exibirObras();
    });
}

// Chamar ao carregar a página
exibirObras();
