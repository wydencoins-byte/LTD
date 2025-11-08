document.addEventListener("DOMContentLoaded", function () {
  const abrirCard = document.getElementById("abrirCard");
  const fecharBtn = document.getElementById("fecharBtn");
  const eventoCard = document.getElementById("eventoCard");

  abrirCard.addEventListener("click", function () {
    eventoCard.style.display = "flex"; // mostra o card
  });

  fecharBtn.addEventListener("click", function () {
    eventoCard.style.display = "none"; // esconde o card
  });
});

document.addEventListener("DOMContentLoaded", function () {
    // === Seleção dos Elementos ===
    const formNovoEvento = document.querySelector('form');
    // **Assumindo que o contêiner de todos os cards tem a classe "eventos"**
    const containerEventos = document.querySelector('.eventos'); 

    // === Função Principal de Envio do Formulário ===
    if (formNovoEvento && containerEventos) {
        formNovoEvento.addEventListener('submit', function(event) {
            event.preventDefault(); // 🛑 IMPEDE o envio padrão do formulário e o recarregamento da página

            // 1. COLETAR OS DADOS DO FORMULÁRIO
            const titulo = document.getElementById('titulo').value;
            const dataInicio = document.getElementById('data-inicio').value;
            const horarioInicio = document.getElementById('horario-inicio').value;
            const horarioFim = document.getElementById('horario-fim').value;
            const local = document.getElementById('local').value;
            const valor = document.getElementById('valor').value;
            const requisitos = document.getElementById('requisitos').value;
            const descricao = document.getElementById('descricao').value;
            
            // Lógica simples para formatar a data e hora
            const dataFormatada = new Date(dataInicio).toLocaleDateString('pt-BR');
            const horarioFormatado = `${horarioInicio}h - ${horarioFim}h`;
            
            // Nota sobre a Imagem: No front-end (JavaScript puro), não podemos ler
            // o caminho completo do arquivo por segurança. Usaremos um placeholder.
            const imageSrc = 'image/logofaci.png'; // Manteremos o logo padrão como placeholder
            
            // Gerar um ID único para o novo card e seu modal
            const novoID = 'card-' + Date.now(); 
            const novoModalID = `modalConfirmacao-${novoID}`;

            const novoCardHTML = `
                <div class="eventos-card" id="${novoID}">
                    <div class="icones-card">
                        <button class="delete-botao-evento" title="Excluir evento" data-modal-target="${novoModalID}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    <img src="${imageSrc}" alt="Evento ${titulo}" class="evento-image">
                    <div class="caixa-texto-evento">
                        <div class="evento-card">
                            <h1 class="evento-titulo">${titulo}</h1>
                            <dl class="detalhes-lista">
                                <dt>Data:</dt>
                                <dd>${dataFormatada}</dd>
                                <dt>Horário:</dt>
                                <dd>${horarioFormatado}</dd>
                                <dt>Local:</dt>
                                <dd>${local}</dd>
                                <dt>Valor:</dt>
                                <dd>${valor} Wyden Coins</dd>
                                <dt>Requisitos:</dt>
                                <dd>${requisitos}</dd>
                            </dl>
                            <div class="descricao-completa">
                                <p>${descricao}</p>
                            </div>
                            <button type="submit" class="botao-evento">Editar</button>
                            
                            <div class="modal-overlay" id="${novoModalID}" style="display: none;">
                                <div class="modal-content">
                                    <button class="fechar-modal" aria-label="Fechar Modal">&times;</button>
                                    <h3>Tem certeza que deseja excluir este evento?</h3>
                                    <div class="modal-actions">
                                        <button class="botao-perigo" id="confirmarExclusao-${novoID}">Sim</button>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            `;
            
            // 3. INSERIR O CARD NA PÁGINA
            containerEventos.insertAdjacentHTML('beforeend', novoCardHTML);
            
            // 4. FINALIZAÇÃO E LIMPEZA
            formNovoEvento.reset(); // Limpa todos os campos do formulário
            // [Aqui você colocaria a lógica para fechar o modal do formulário, se ele estiver aberto]
            
            console.log(`Novo evento "${titulo}" adicionado ao DOM.`);

            // IMPORTANTE: REAPLICAR LISTENERS
            // Se você usa o código de deleção dinâmica, chame a função que
            // anexa os ouvintes de evento aos botões de lixeira e fechar (fechar-modal)
            // para que o novo card também funcione corretamente.
            // Por exemplo: initializeDeleteListeners(); 

        });
    } else {
        console.error('ERRO: Não foi possível encontrar o <form> ou o contêiner de cards (.eventos).');
    }
});
