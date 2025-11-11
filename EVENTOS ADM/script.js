document.addEventListener('DOMContentLoaded', function() {
    
    // === 1. DECLARAÇÃO DE CONSTANTES GLOBAIS ===
    const containerEventos = document.querySelector('.eventos'); 
    const formNovoEvento = document.querySelector('#eventoCard form'); 
    const eventoCardModal = document.getElementById("eventoCard");
    const abrirCardBtn = document.getElementById("abrirCard");
    const fecharBtn = document.getElementById("fecharBtn");
    const inputImagem = document.getElementById('imagem'); 
    const previewImagem = document.getElementById('previewImagemAtual'); // Elemento <img> para o preview
    
    // Variável para armazenar a URL da imagem de forma temporária
    let finalImageSrc = 'image/logofaci.png';

    // === 2. FUNÇÃO DE ABRIR/FECHAR MODAL (ADICIONAR) ===
    if (abrirCardBtn && eventoCardModal) {
        abrirCardBtn.addEventListener('click', function() {
            formNovoEvento.reset();
            formNovoEvento.removeAttribute('data-editing-id');
            document.getElementById('salvarEventoBtn').value = "Cadastrar";
            document.getElementById('imagem').required = true;
            
            // Oculta o preview de imagem antiga e reseta
            if (previewImagem) {
                previewImagem.src = finalImageSrc;
                previewImagem.style.display = 'none';
            }

            eventoCardModal.style.display = "flex";
        });
    }

    if (fecharBtn && eventoCardModal) {
        fecharBtn.addEventListener('click', function() {
            eventoCardModal.style.display = "none";
        });
    }

    // Fecha o modal ao clicar fora
    if (eventoCardModal) {
        eventoCardModal.addEventListener('click', function(event) {
            if (event.target === eventoCardModal) {
                eventoCardModal.style.display = "none";
            }
        });
    }

    // === 3. FUNÇÃO DE PREVIEW DA IMAGEM DURANTE O UPLOAD ===
    if (inputImagem && previewImagem) {
        inputImagem.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Usa Base64 para exibir a imagem temporariamente
                    previewImagem.src = e.target.result;
                    previewImagem.style.display = 'block';
                    finalImageSrc = e.target.result; // Salva o Base64 temporário para o novo card
                };
                reader.readAsDataURL(file);
            } else {
                previewImagem.src = 'image/logofaci.png';
                previewImagem.style.display = 'none';
                finalImageSrc = 'image/logofaci.png';
            }
        });
    }

    // === 4. FUNÇÃO DE CONTROLE DE MODAIS DE CONFIRMAÇÃO (EXCLUSÃO) ===
    function aplicarListenersDeModalConfirmacao() {
        document.querySelectorAll('[data-modal-target]').forEach(botao => {
            botao.removeEventListener('click', openModal); // Remove para evitar duplicidade
            botao.addEventListener('click', openModal);
        });

        document.querySelectorAll('.fechar-modal').forEach(botao => {
            botao.removeEventListener('click', closeModal); 
            botao.addEventListener('click', closeModal);
        });

        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.removeEventListener('click', clickOutsideModal); 
            overlay.addEventListener('click', clickOutsideModal);
        });
    }

    function openModal(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('data-modal-target');
        const modal = document.getElementById(targetId);
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    function closeModal(e) {
        e.preventDefault();
        const modal = e.currentTarget.closest('.modal-overlay');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    function clickOutsideModal(e) {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.style.display = 'none';
        }
    }
    
    // Aplica os listeners iniciais
    aplicarListenersDeModalConfirmacao(); 

    // === 5. DELEGAÇÃO DE EVENTOS: Exclusão e EDIÇÃO (CORRIGIDO PARA TYPE="BUTTON") ===
    if (containerEventos) {
        containerEventos.addEventListener('click', function(event) {
            
            // LÓGICA DE EXCLUSÃO (Botão SIM/LIXEIRA)
            const botaoLixeira = event.target.closest(".botao-lixeira");
            if (botaoLixeira) {
                const cardParaRemover = botaoLixeira.closest(".eventos-card"); 
                const modal = botaoLixeira.closest(".modal-overlay"); 

                if (cardParaRemover) {
                    cardParaRemover.remove(); 
                    alert(`Evento removido da tela.`);
                }
                if (modal) {
                    modal.style.display = "none";
                }
                return; 
            }

            // LÓGICA DE EDIÇÃO (Botão EDITAR - .botao-evento)
            const botaoEditar = event.target.closest(".botao-evento");
            if (botaoEditar && botaoEditar.type === 'button') { // Verifica se é o botão de edição (agora é type="button")
                event.preventDefault(); 
                
                const card = botaoEditar.closest('.eventos-card');
                if (!card) return;
                
                // Configura o formulário para EDIÇÃO
                formNovoEvento.reset(); 
                formNovoEvento.setAttribute('data-editing-id', card.id); 
                document.getElementById('salvarEventoBtn').value = "Salvar"; 
                document.getElementById('imagem').required = false; 
                
                // 1. Extrai as Informações do Card
                const titulo = card.querySelector('[data-info="evento-titulo-editar"]').textContent.trim();
                const dataCompleta = card.querySelector('[data-info="data-editar"]').textContent.trim();
                const horarioCompleto = card.querySelector('[data-info="horario-intervalo-editar"]').textContent.trim(); 
                const local = card.querySelector('[data-info="local-editar"]').textContent.trim();
                const valorTexto = card.querySelector('[data-info="valor-editar"]').textContent.trim();
                const requisitos = card.querySelector('[data-info="requisitos-editar"]').textContent.trim();
                const descricao = card.querySelector('[data-info="descricao-completa-editar"]').textContent.trim();
                
                const imagemElement = card.querySelector('[data-info="imagem-editar"]');
                const caminhoImagemAtual = imagemElement ? imagemElement.getAttribute('src') : '';

                // 2. Transforma dados para o formato do formulário 
                const [dia, mes, ano] = dataCompleta.split('/').map(v => v.trim());
                const dataInputFormat = `${ano}-${mes}-${dia}`; 
                
                const matchHorarios = horarioCompleto.match(/(\d{2}:\d{2})h\s*-\s*(\d{2}:\d{2})h/);
                const horarioInicio = matchHorarios ? matchHorarios[1] : '';
                const horarioFim = matchHorarios ? matchHorarios[2] : '';
                
                const valor = valorTexto.replace(/\s*Wyden Coins/i, '').trim(); 

                // 3. Preenche os Campos do Formulário
                document.getElementById('titulo').value = titulo;
                document.getElementById('data-inicio').value = dataInputFormat; 
                document.getElementById('horario-inicio').value = horarioInicio;
                document.getElementById('horario-fim').value = horarioFim;
                document.getElementById('local').value = local;
                document.getElementById('valor').value = valor;
                document.getElementById('requisitos').value = requisitos;
                document.getElementById('descricao').value = descricao;
                
                // Preenche Imagem (Mostra a imagem atual do card)
                const inputCaminhoAtual = document.getElementById('imagemAtualCaminho');
                
                if (caminhoImagemAtual && inputCaminhoAtual && previewImagem) {
                    inputCaminhoAtual.value = caminhoImagemAtual;
                    previewImagem.src = caminhoImagemAtual;
                    previewImagem.style.display = 'block'; 
                }

                // Abre o modal de edição
                eventoCardModal.style.display = "flex"; 
            }
        });
    }

    // === 6. LÓGICA DE CRIAÇÃO E EDIÇÃO (ENVIO VIA FETCH + SIMULAÇÃO VISUAL) ===
    if (formNovoEvento && containerEventos) {
        formNovoEvento.addEventListener('submit', async function (event) {
            
            // 1. Previne o envio padrão e checa validação
            event.preventDefault(); 
            if (!formNovoEvento.reportValidity()) {
                 return; 
            }
            
            const isEditing = formNovoEvento.hasAttribute('data-editing-id');
            const editingId = formNovoEvento.getAttribute('data-editing-id');
            
            // 2. Prepara os Dados para o Backend (FormData)
            const formData = new FormData(formNovoEvento);
            
            formData.append('modo', isEditing ? 'editar' : 'criar');
            if (isEditing) {
                formData.append('id', editingId);
                formData.append('caminho_imagem_atual', document.getElementById('imagemAtualCaminho').value);
            }

            // 3. Define a URL de destino
            const urlBackend = 'seu_endpoint_salvar_evento.php'; // Trocargit push
            //  pela URL real do backend

            
            // Define o caminho da imagem que será exibida no card (Simulação Frontend)
            let finalImageSrcForCard = 'image/logofaci.png'; 
            if (inputImagem.files.length > 0 && previewImagem.src) {
                finalImageSrcForCard = previewImagem.src; // Usa o Base64 do preview
            } else if (isEditing && document.getElementById('imagemAtualCaminho').value) {
                finalImageSrcForCard = document.getElementById('imagemAtualCaminho').value;
            } 

            // 4. Inicia a Chamada ao Backend (Assíncrona - PREPARAÇÃO)
            try {
                document.getElementById('salvarEventoBtn').value = "Enviando...";
                
                const response = await fetch(urlBackend, {
                    method: 'POST',
                    body: formData 
                });
                
                if (response.ok) {
                    console.log(`Dados enviados com sucesso para o servidor!`);
                } else {
                    console.warn(`AVISO: Falha de comunicação com o servidor (${response.status}).`);
                }

            } catch (error) {
                console.error("Erro ao enviar dados (Rede/CORS):", error);
            } finally {
                // 5. Continua a execução VISUAL no frontend (SIMULAÇÃO)
                
                // Coleta os dados para a simulação visual
                const titulo = document.getElementById('titulo').value; 
                const dataInicio = document.getElementById('data-inicio').value;
                const horarioInicio = document.getElementById('horario-inicio').value;
                const horarioFim = document.getElementById('horario-fim').value;
                const local = document.getElementById('local').value;
                const valor = document.getElementById('valor').value;
                const requisitos = document.getElementById('requisitos').value;
                const descricao = document.getElementById('descricao').value;
                
                const dataFormatada = new Date(dataInicio + 'T00:00:00').toLocaleDateString('pt-BR', {timeZone: 'UTC'}); 
                const horarioFormatado = `${horarioInicio}h - ${horarioFim}h`;

                // --- Lógica de EDIÇÃO VISUAL ---
                if (isEditing) {
                    const cardParaEditar = document.getElementById(editingId);
                    if (cardParaEditar) {
                        cardParaEditar.querySelector('[data-info="evento-titulo-editar"]').textContent = titulo;
                        cardParaEditar.querySelector('[data-info="data-editar"]').textContent = dataFormatada;
                        cardParaEditar.querySelector('[data-info="horario-intervalo-editar"]').textContent = horarioFormatado; 
                        cardParaEditar.querySelector('[data-info="local-editar"]').textContent = local;
                        cardParaEditar.querySelector('[data-info="valor-editar"]').textContent = `${valor} Wyden Coins`;
                        cardParaEditar.querySelector('[data-info="requisitos-editar"]').textContent = requisitos;
                        cardParaEditar.querySelector('[data-info="descricao-completa-editar"]').textContent = descricao;
                        cardParaEditar.querySelector('[data-info="imagem-editar"]').src = finalImageSrcForCard;
                        
                        document.getElementById('salvarEventoBtn').value = "Salvar";
                    }
                } 
                
                // --- Lógica de CRIAÇÃO VISUAL ---
                else {
                    const idNumerico = Date.now();
                    const novoID = `eventos-card-${idNumerico}`;
                    const novoModalID = `modalConfirmacao-${idNumerico}`;

                    const novoCardHTML = `
                        <div class="eventos-card" id="${novoID}">
                            <div class="icones-card">
                                <button class="delete-botao-evento" title="Excluir evento" data-modal-target="${novoModalID}">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                            <img src="${finalImageSrcForCard}" alt="Evento ${titulo}" class="evento-image" data-info="imagem-editar">
                            <div class="caixa-texto-evento">
                                <div class="evento-card">
                                    <h1 class="evento-titulo" data-info="evento-titulo-editar">${titulo}</h1>
                                    <dl class="detalhes-lista">
                                        <dt>Data:</dt><dd data-info="data-editar">${dataFormatada}</dd>
                                        <dt>Horário:</dt><dd data-info="horario-intervalo-editar">${horarioFormatado}</dd>
                                        <dt>Local:</dt><dd data-info="local-editar">${local}</dd>
                                        <dt>Valor:</dt><dd data-info="valor-editar">${valor} Wyden Coins</dd>
                                        <dt>Requisitos:</dt><dd data-info="requisitos-editar">${requisitos}</dd>
                                    </dl>
                                    <div class="descricao-completa">
                                        <p data-info="descricao-completa-editar">${descricao}</p>
                                    </div>
                                    <button type="button" class="botao-evento">Editar</button>
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
                    document.getElementById('salvarEventoBtn').value = "Cadastrar";
                }
                
                // 6. Finalização
                formNovoEvento.reset();
                eventoCardModal.style.display = "none";
                aplicarListenersDeModalConfirmacao(); 
            }
        });
    }

}); // Fim do DOMContentLoaded