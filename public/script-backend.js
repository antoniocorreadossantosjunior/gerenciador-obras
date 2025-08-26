// ==================== VARIÁVEIS GLOBAIS ====================
let obras = [];
const CACHE_KEY = 'obrasCacheV2';
const THEME_KEY = 'theme';
let db;

// ==================== TEMA ====================
const body = document.body;
const toggleThemeBtn = document.getElementById('toggle-theme');
const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
body.classList.add(savedTheme);
toggleThemeBtn.textContent = savedTheme === 'dark' ? '☀️ Tema' : '🌙 Tema';
toggleThemeBtn.addEventListener('click', () => {
  body.classList.toggle('dark');
  body.classList.toggle('light');
  const theme = body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem(THEME_KEY, theme);
  toggleThemeBtn.textContent = theme === 'dark' ? '☀️ Tema' : '🌙 Tema';
});

// ==================== MODAL ====================
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalFields = document.getElementById("modal-fields");
const modalForm = document.getElementById("modal-form");

function abrirModal(titulo, campos, onSubmit) {
  modalTitle.textContent = titulo;
  modalFields.innerHTML = campos;
  modal.style.display = "flex";
  modal.classList.add("show");
  modalForm.onsubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(modalForm));
    onSubmit(data);
    fecharModal();
  };
}

function fecharModal() {
  modal.classList.remove("show");
  setTimeout(() => modal.style.display = "none", 300);
}

// ==================== CACHE ====================
function salvarCache() { try { localStorage.setItem(CACHE_KEY, JSON.stringify(obras)); } catch (e) {} }
function carregarCache() { try { const raw = localStorage.getItem(CACHE_KEY); return raw ? JSON.parse(raw) : []; } catch(e){ return []; } }

// ==================== INDEXEDDB ====================
function abrirDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("GerenciadorObrasDB", 1);
    request.onerror = (event) => reject(event);
    request.onsuccess = (event) => { db = event.target.result; resolve(db); };
    request.onupgradeneeded = (event) => {
      db = event.target.result;
      if(!db.objectStoreNames.contains("obras")) db.createObjectStore("obras", { keyPath:"id" });
    };
  });
}

async function salvarTudoDB() {
  if(!db) await abrirDB();
  const tx = db.transaction("obras", "readwrite");
  const store = tx.objectStore("obras");
  await store.clear();
  obras.forEach(obra => store.put(obra));
  return tx.complete;
}

async function carregarTudoDB() {
  if(!db) await abrirDB();
  return new Promise((resolve,reject)=>{
    const tx = db.transaction("obras","readonly");
    const store = tx.objectStore("obras");
    const request = store.getAll();
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e);
  });
}

// ==================== UTIL ====================
function gerarId() { return Date.now() + Math.floor(Math.random()*1000); }
function calcularProgressoGeral(obra){
  if(!obra.etapas||!obra.etapas.length) return Number(obra.progresso||0);
  let total = 0;
  obra.etapas.forEach(e => { const status = (e.status||"").toLowerCase(); if(status==='concluída') total+=100; else if(status==='em andamento') total+=50; });
  return Math.round(total/obra.etapas.length);
}
function calcularOrcamentoAutomatico(obra){
  if(!obra.etapas||!obra.etapas.length) return obra.orcamento||0;
  let total = 0;
  obra.etapas.forEach(etapa=> (etapa.materiais||[]).forEach(mat=> total+=(mat.quantidade||0)*(mat.custoUnit||0)));
  return total;
}

// ==================== RENDER ====================
function exibirMateriais(obra, etapa){
  const div=document.getElementById(`materiais-${obra.id}-${etapa.id}`);
  if(!div) return;
  div.innerHTML="";
  (etapa.materiais||[]).forEach(mat=>{
    const mDiv=document.createElement("div");
    mDiv.className="material";
    mDiv.innerHTML=`${mat.nome||"-"} - Qtd: ${mat.quantidade||0} - Custo: ${(mat.custoUnit||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})} <button onclick="excluirMaterial(${obra.id},${etapa.id},${mat.id})">Excluir</button>`;
    div.appendChild(mDiv);
  });
}

function exibirEtapas(obra){
  const div=document.getElementById(`etapas-${obra.id}`);
  if(!div) return;
  div.innerHTML="";
  (obra.etapas||[]).forEach(etapa=>{
    const eDiv=document.createElement("div");
    eDiv.className="etapa";
    eDiv.innerHTML=`<strong>${etapa.nome||"-"}</strong> (Status: ${etapa.status||"-"}, Prazo: ${etapa.prazo||"-"}) 
    <button onclick="editarEtapa(${obra.id},${etapa.id})">Editar</button> 
    <button onclick="excluirEtapa(${obra.id},${etapa.id})">Excluir</button>
    <div id="materiais-${obra.id}-${etapa.id}"></div>
    <button onclick="abrirModalAdicionarMaterial(${obra.id},${etapa.id})">Adicionar Material</button>`;
    div.appendChild(eDiv);
    exibirMateriais(obra, etapa);
  });
}

function exibirObras(){
  const lista=document.getElementById("lista-obras");
  lista.innerHTML="";
  if(!obras.length){ lista.innerHTML="<p>Nenhuma obra cadastrada.</p>"; return;}
  obras.forEach(obra=>{
    const div=document.createElement("div");
    div.className="obra";
    const progressoSafe=calcularProgressoGeral(obra);
    const orcamentoSafe=calcularOrcamentoAutomatico(obra);
    div.innerHTML=`<h3>${obra.nome||"-"}</h3>
      <p><strong>Localização:</strong> ${obra.localizacao||"-"}</p>
      <p><strong>Responsável:</strong> ${obra.responsavel||"-"}</p>
      <p><strong>Status:</strong> ${obra.status||"-"}</p>
      <p><strong>Orçamento:</strong> ${orcamentoSafe.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</p>
      <div class="barra"><div class="progresso" style="width:${progressoSafe}%">${progressoSafe}%</div></div>
      <button class="btn-editar" onclick="editarObra(${obra.id})">Editar</button>
      <button class="btn-excluir" onclick="excluirObra(${obra.id})">Excluir</button>
      <h4>Etapas</h4><div id="etapas-${obra.id}"></div>
      <button onclick="abrirModalAdicionarEtapa(${obra.id})">Adicionar Etapa</button>`;
    lista.appendChild(div);
    exibirEtapas(obra);
  });
  salvarCache();
  salvarTudoDB();
}

// ==================== CRUD EXISTENTE ====================
document.getElementById("form-obra").addEventListener("submit", e=>{
  e.preventDefault();
  const novaObra={
    id: gerarId(),
    nome: document.getElementById("nome").value,
    localizacao: document.getElementById("localizacao").value,
    responsavel: document.getElementById("responsavel").value,
    status: document.getElementById("status").value,
    progresso: parseInt(document.getElementById("progresso").value),
    orcamento: parseFloat(document.getElementById("orcamento").value)||0,
    etapas:[]
  };
  obras.push(novaObra);
  exibirObras();
  e.target.reset();
});

// ==================== FUNÇÕES NOVAS BACKEND ====================
async function backendAdicionarObra(obra){
  await fetch("/obras", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(obra)
  });
  await carregarObras();
}

async function backendEditarObra(id, obra){
  await fetch(`/obras/${id}`,{
    method:"PUT",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(obra)
  });
  await carregarObras();
}

async function backendExcluirObra(id){
  await fetch(`/obras/${id}`,{method:"DELETE"});
  await carregarObras();
}

async function backendAdicionarEtapa(obraId, etapa){
  await fetch(`/obras/${obraId}/etapas`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(etapa)
  });
  await carregarObras();
}

async function backendEditarEtapa(obraId, etapaId, etapa){
  await fetch(`/obras/${obraId}/etapas/${etapaId}`,{
    method:"PUT",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(etapa)
  });
  await carregarObras();
}

async function backendExcluirEtapa(obraId, etapaId){
  await fetch(`/obras/${obraId}/etapas/${etapaId}`,{method:"DELETE"});
  await carregarObras();
}

async function backendAdicionarMaterial(obraId, etapaId, material){
  await fetch(`/obras/${obraId}/etapas/${etapaId}/materiais`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(material)
  });
  await carregarObras();
}

async function backendExcluirMaterial(obraId, etapaId, materialId){
  await fetch(`/obras/${obraId}/etapas/${etapaId}/materiais/${materialId}`,{method:"DELETE"});
  await carregarObras();
}

async function carregarObras(){
  try{
    const res = await fetch("/obras");
    const dados = await res.json();
    obras = dados;
    exibirObras();
  }catch(e){
    console.error("Erro ao carregar obras do backend:", e);
  }
}

// ==================== INICIALIZAÇÃO ====================
(async()=>{
  const cacheInicial = carregarCache();
  if(cacheInicial.length){ obras=cacheInicial; exibirObras(); }
  else{ const dbData=await carregarTudoDB(); if(dbData.length){ obras=dbData; exibirObras(); } }
})();
