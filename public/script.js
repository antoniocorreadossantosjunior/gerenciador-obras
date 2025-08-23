
// ======== VARIÁVEIS GLOBAIS ========
let obras = [];
const form = document.getElementById("formObra");
const listaObras = document.getElementById("listaObras");

// Modal
const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close-btn");
const formEditar = document.getElementById("formEditar");

// Toast
const toast = document.getElementById("toast");

// ======== LOCALSTORAGE ========
function salvarObras() {
  localStorage.setItem("obras", JSON.stringify(obras));
}

function carregarObras() {
  const obrasSalvas = localStorage.getItem("obras");
  if (obrasSalvas) {
    obras = JSON.parse(obrasSalvas);
    obras.forEach(obra => mostrarObra(obra));
  }
}

// ======== TOAST ========
function mostrarToast(mensagem) {
  toast.textContent = mensagem;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// ======== CRIAR OBRA ========
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const obra = {
    id: Date.now(),
    nome: document.getElementById("nome").value,
    local: document.getElementById("local").value,
    responsavel: document.getElementById("responsavel").value,
    status: document.getElementById("status").value,
    progresso: document.getElementById("progresso").value,
    orcamento: document.getElementById("orcamento").value
  };

  obras.push(obra);
  mostrarObra(obra);
  salvarObras();
  mostrarToast("✅ Obra cadastrada com sucesso!");
  form.reset();
});

// ======== MOSTRAR OBRA ========
function mostrarObra(obra) {
  const div = document.createElement("div");
  div.classList.add("obra");
  div.setAttribute("data-id", obra.id);

  div.innerHTML = `
    <h3>${obra.nome}</h3>
    <p><strong>Local:</strong> ${obra.local}</p>
    <p><strong>Responsável:</strong> ${obra.responsavel}</p>
    <p><strong>Status:</strong> ${obra.status}</p>
    <p><strong>Orçamento:</strong> R$ ${obra.orcamento}</p>
    <div class="barra">
      <div class="progresso" style="width:${obra.progresso}%">${obra.progresso}%</div>
    </div>
    <button class="btn-editar">Editar</button>
    <button class="btn-excluir">Excluir</button>
  `;

  // Eventos dos botões
  div.querySelector(".btn-excluir").addEventListener("click", () => excluirObra(obra.id));
  div.querySelector(".btn-editar").addEventListener("click", () => abrirModal(obra.id));

  listaObras.appendChild(div);
}

// ======== EXCLUIR OBRA ========
function excluirObra(id) {
  obras = obras.filter(obra => obra.id !== id);
  document.querySelector(`[data-id='${id}']`).remove();
  salvarObras();
  mostrarToast("❌ Obra excluída!");
}

// ======== MODAL EDITAR ========
let obraEditandoId = null;

function abrirModal(id) {
  obraEditandoId = id;
  const obra = obras.find(o => o.id === id);

  // Preencher formulário do modal
  document.getElementById("editarNome").value = obra.nome;
  document.getElementById("editarLocal").value = obra.local;
  document.getElementById("editarResponsavel").value = obra.responsavel;
  document.getElementById("editarStatus").value = obra.status;
  document.getElementById("editarProgresso").value = obra.progresso;
  document.getElementById("editarOrcamento").value = obra.orcamento;

  modal.classList.add("show");
}

closeBtn.addEventListener("click", () => modal.classList.remove("show"));

// Salvar edição
formEditar.addEventListener("submit", function (e) {
  e.preventDefault();

  const obra = obras.find(o => o.id === obraEditandoId);
  obra.nome = document.getElementById("editarNome").value;
  obra.local = document.getElementById("editarLocal").value;
  obra.responsavel = document.getElementById("editarResponsavel").value;
  obra.status = document.getElementById("editarStatus").value;
  obra.progresso = document.getElementById("editarProgresso").value;
  obra.orcamento = document.getElementById("editarOrcamento").value;

  // Atualizar na tela
  listaObras.innerHTML = "";
  obras.forEach(o => mostrarObra(o));

  salvarObras();
  mostrarToast("✏️ Obra editada com sucesso!");
  modal.classList.remove("show");
});

// ======== CARREGAR OBRAS AO INICIAR ========
carregarObras();
