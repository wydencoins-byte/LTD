// script.js

/**
 * Atualiza visualmente a barra e o texto de progresso de um item.
 * @param {HTMLElement} taskItem O elemento div.task-item.
 */
function updateProgressBar(taskItem) {
    let completed = parseInt(taskItem.getAttribute('data-completed'));
    let total = parseInt(taskItem.getAttribute('data-total'));

    // Cálculo da porcentagem
    let percentage = (total > 0) ? (completed / total) * 100 : 0;
    if (percentage > 100) percentage = 100;

    const progressBarFill = taskItem.querySelector('.progress-bar-fill');
    const progressText = taskItem.querySelector('.progress-text');
    const uploadLabel = taskItem.querySelector('.upload-btn');
    const fileInput = taskItem.querySelector('.file-upload-input');

    // ATUALIZAÇÃO DA LARGURA (aciona a transição no CSS)
    progressBarFill.style.width = percentage + '%'; 

    progressText.textContent = `${completed}/${total}`;

    // Lógica de "Completo"
    if (completed >= total) {
        uploadLabel.textContent = 'Completo 🎉';
        uploadLabel.style.backgroundColor = '#4CAF50'; // Cor de sucesso
        uploadLabel.style.cursor = 'default';
        uploadLabel.removeAttribute('for'); // Desabilita o upload
    } else {
        uploadLabel.textContent = 'Enviar Arquivo';
        uploadLabel.style.backgroundColor = '#8a006b'; // Cor original
        uploadLabel.style.cursor = 'pointer';
        uploadLabel.setAttribute('for', fileInput.id); // Garante que o upload esteja ativo
    }
}

/**
 * Inicializa o sistema: configura progresso inicial e listeners de upload.
 */
function initializeProgressSystem() {
    const taskItems = document.querySelectorAll('.task-item');
    const fileInputs = document.querySelectorAll('.file-upload-input');

    // 1. Inicializa o progresso visual de todas as tarefas ao carregar a página
    taskItems.forEach(updateProgressBar);

    // 2. Configura o listener para o "envio" de arquivo
    fileInputs.forEach(input => {
        input.addEventListener('change', (event) => {
            // Se um arquivo foi selecionado (simula o envio)
            if (event.target.files.length > 0) {
                const taskItem = event.target.closest('.task-item');
                let completed = parseInt(taskItem.getAttribute('data-completed'));
                let total = parseInt(taskItem.getAttribute('data-total'));
                
                if (completed < total) {
                    completed += 1; // Incrementa a contagem
                    taskItem.setAttribute('data-completed', completed); // Atualiza o dado
                    
                    // Atualiza a barra e a faz se mover
                    updateProgressBar(taskItem);
                }
                
                // Reseta o input para permitir o próximo "envio"
                event.target.value = '';
            }
        });
    });
}

// Inicia todo o sistema quando o HTML estiver carregado
document.addEventListener('DOMContentLoaded', initializeProgressSystem);