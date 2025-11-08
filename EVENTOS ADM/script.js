document.addEventListener("DOMContentLoaded", function () {
    
    const containerEventos = document.querySelector('.eventos'); // Elemento pai de todos os cards

    // === Função para aplicar listeners de exclusão e modal ===
    function aplicarListeners() {
        // --- ABRIR MODAL (Necessário para cards dinâmicos) ---
        // Abrir modal
        document.querySelectorAll(".delete-botao-evento").forEach(botao => {
            // Remove o listener existente antes de adicionar um novo para evitar duplicação
            botao.removeEventListener("click", abrirModalHandler); 
            botao.addEventListener("click", abrirModalHandler);
        });

        // Fechar modal
        document.querySelectorAll(".fechar-modal").forEach(botao => {
            // Remove o listener existente antes de adicionar um novo para evitar duplicação
            botao.removeEventListener("click", fecharModalHandler); 
            botao.addEventListener("click", fecharModalHandler);
        });

        // OBS: A lógica de CONFIRMAR EXCLUSÃO (.botao-lixeira) foi movida para o containerEventos 
        // abaixo usando DELEGAÇÃO, e por isso não precisa mais estar aqui dentro.
    }

    // Handlers para ABRIR/FECHAR modal (evita múltiplos listeners)
    function abrirModalHandler() {
        const modalId = this.getAttribute("data-modal-target");
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "block";
        }
    }

    function fecharModalHandler() {
        const modal = this.closest(".modal-overlay");
        if (modal) {
            modal.style.display = "none";
        }
    }


    // === Delegação de Eventos para Exclusão (CORREÇÃO APLICADA) ===
    // Anexa o listener de clique no container pai uma única vez.
    if (containerEventos) {
        containerEventos.addEventListener('click', function(event) {
            
            // Verifica se o clique veio do botão "Sim" dentro do modal (.botao-lixeira)
            const botaoLixeira = event.target.closest(".botao-lixeira");

            if (botaoLixeira) {
                // **CORREÇÃO:** Usa .closest() para encontrar o card principal a ser removido.
                // Isso funciona para cards INICIAIS e DINÂMICOS, ignorando o problema do data-id.
                const cardParaRemover = botaoLixeira.closest(".eventos-card"); 
                
                // Encontra o modal (para fechar)
                const modal = botaoLixeira.closest(".modal-overlay"); 

                if (cardParaRemover) {
                    cardParaRemover.remove(); // Remove o card do DOM
                    alert(`Evento removido da tela.`);
                } else {
                    // Mensagem de segurança caso a estrutura HTML esteja errada
                    alert("Erro interno: Card principal não encontrado. Verifique se o elemento a ser removido tem a classe '.eventos-card'."); 
                }

                if (modal) {
                    modal.style.display = "none";
                }
            }
        });
    }

    // === Abrir/Fechar card manual (se aplicável) ===
    const abrirCard = document.getElementById("abrirCard");
    const fecharBtn = document.getElementById("fecharBtn");
    const eventoCard = document.getElementById("eventoCard");

    if (abrirCard && fecharBtn && eventoCard) {
        abrirCard.addEventListener("click", function () {
            eventoCard.style.display = "flex";
        });

        fecharBtn.addEventListener("click", function () {
            eventoCard.style.display = "none";
        });
    }

    const formNovoEvento = document.querySelector('form');
    // const containerEventos já está definido acima

    if (formNovoEvento && containerEventos) {
        formNovoEvento.addEventListener('submit', function (event) {
            event.preventDefault();

            const titulo = document.getElementById('titulo').value;
            const dataInicio = document.getElementById('data-inicio').value;
            const horarioInicio = document.getElementById('horario-inicio').value;
            const horarioFim = document.getElementById('horario-fim').value;
            const local = document.getElementById('local').value;
            const valor = document.getElementById('valor').value;
            const requisitos = document.getElementById('requisitos').value;
            const descricao = document.getElementById('descricao').value;

            const dataFormatada = new Date(dataInicio).toLocaleDateString('pt-BR');
            const horarioFormatado = `${horarioInicio}h - ${horarioFim}h`;
            const imageSrc = 'image/logofaci.png';

            const idNumerico = Date.now();
            const novoID = `eventos-card-${idNumerico}`;
            const novoModalID = `modalConfirmacao-${idNumerico}`;

            // O data-id do botão lixeira agora aponta para o ID do card, mantendo a consistência dos novos cards.
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
                                <dt>Data:</dt><dd>${dataFormatada}</dd>
                                <dt>Horário:</dt><dd>${horarioFormatado}</dd>
                                <dt>Local:</dt><dd>${local}</dd>
                                <dt>Valor:</dt><dd>${valor} Wyden Coins</dd>
                                <dt>Requisitos:</dt><dd>${requisitos}</dd>
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
                                        <button class="botao-lixeira" data-id="${novoID}">Sim</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            containerEventos.insertAdjacentHTML('beforeend', novoCardHTML);
            formNovoEvento.reset();
            // Reaplica listeners APENAS para ABRIR/FECHAR MODAL do novo card.
            aplicarListeners(); 
        });
    }

    // Aplica os eventos de ABRIR/FECHAR modal inicialmente
    aplicarListeners(); 
});