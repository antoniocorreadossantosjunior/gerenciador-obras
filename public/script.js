document.getElementById("obra-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const localizacao = document.getElementById("localizacao").value;
  const orcamento = document.getElementById("orcamento").value;

  const li = document.createElement("li");
  li.textContent = `${nome} - ${localizacao} - R$ ${orcamento}`;
  document.getElementById("lista-obras").appendChild(li);

  // Limpar os campos
  this.reset();
});
