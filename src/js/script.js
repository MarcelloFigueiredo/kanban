document.addEventListener('DOMContentLoaded', () => {
    // Referências para o formulário e elementos principais
    const form = document.getElementById('new-task-form');
    const taskNameInput = document.getElementById('task-name');
    const taskPrioritySelect = document.getElementById('task-priority');
    const saveButton = document.getElementById('save-task');
    const cancelButton = document.getElementById('cancel-task');

    // Adiciona eventos para abrir o formulário de nova tarefa
    setupFormButton();

    // Adiciona eventos para salvar a nova tarefa
    setupSaveButton();

    // Adiciona eventos para cancelar a criação de tarefa
    setupCancelButton();

    // Função para configurar o botão "+" para abrir o formulário
    function setupFormButton() {
        document.querySelectorAll('.add-card').forEach(button => {
            button.addEventListener('click', () => {
                form.style.display = 'flex'; // Exibe o formulário
            });
        });
    }

    // Função para configurar o botão de salvar a tarefa
    function setupSaveButton() {
        saveButton.addEventListener('click', () => {
            const taskName = taskNameInput.value.trim();
            const taskPriority = taskPrioritySelect.value;

            if (taskName === '') {
                alert('Por favor, insira o nome da tarefa.');
                return;
            }

            createNewCard(taskName, taskPriority);
            taskNameInput.value = ''; // Limpa o campo de nome
            form.style.display = 'none'; // Fecha o formulário
        });
    }

    // Função para configurar o botão de cancelar
    function setupCancelButton() {
        cancelButton.addEventListener('click', () => {
            taskNameInput.value = ''; // Limpa o campo de nome
            form.style.display = 'none'; // Fecha o formulário
        });
    }

    // Função para criar um novo cartão de tarefa
    function createNewCard(taskName, taskPriority) {
        const newCard = document.createElement('div');
        newCard.classList.add('kanban-card');
        newCard.draggable = true;

        // Adiciona a classe de prioridade e a tradução da prioridade
        const badgeClass = getBadgeClass(taskPriority);

        let priorityText = '';  // Para exibir a prioridade em português
        switch (taskPriority) {
            case 'high':
                priorityText = 'Alta prioridade';
                break;
            case 'medium':
                priorityText = 'Média prioridade';
                break;
            case 'low':
                priorityText = 'Baixa prioridade';
                break;
            default:
                priorityText = 'Sem prioridade'; // Esse caso pode ser omitido, mas por segurança
        }

        newCard.innerHTML = `
            <div class="${badgeClass}">
                <span>${priorityText}</span>
            </div>
            <p class="card-title">${taskName}</p>
            <div class="card-infos">
                <div class="card-icons">
                    <p><i class="fa-regular fa-comment"></i> 0</p>
                    <p><i class="fa-solid fa-paperclip"></i> 0</p>
                </div>
                <div class="user">
                    <!-- Imagem vazia inicialmente, será preenchida ao mover -->
                    <img src="src/images/new.png" alt="Avatar" class="user-avatar">
                </div>
            </div>
        `;

        // Adiciona o novo cartão na coluna de "Pendente" (ID = 1)
        const kanbanColumn = document.querySelector('.kanban-column[data-id="1"] .kanban-cards');
        kanbanColumn.appendChild(newCard);

        // Adiciona eventos de arraste ao novo cartão
        addDragEventsToTask(newCard);

        // Atualiza a imagem da pessoa, se necessário
        updateUserAvatar(newCard, kanbanColumn); // Aqui, o cartão é inicialmente colocado na coluna de Novas Tarefas
    }

    // Função para retornar a classe de badge de acordo com a prioridade
    function getBadgeClass(priority) {
        switch (priority) {
            case 'high':
                return 'badge high';
            case 'medium':
                return 'badge medium';
            case 'low':
                return 'badge low';
            default:
                return ''; // Se não houver prioridade, sem classe
        }
    }

    // Função para adicionar eventos de arraste para um cartão
    function addDragEventsToTask(card) {
        // Evento disparado quando começa a arrastar o card
        card.addEventListener('dragstart', e => {
            e.currentTarget.classList.add('dragging');
        });

        // Evento disparado quando termina de arrastar o card
        card.addEventListener('dragend', e => {
            e.currentTarget.classList.remove('dragging');
        });
    }

    // Configura eventos de "dragover", "dragleave" e "drop" para as colunas
    setupColumnEvents();

    // Adiciona os eventos de arraste para todos os cartões já existentes
    document.querySelectorAll('.kanban-card').forEach(card => {
        addDragEventsToTask(card);
    });
});

// Função para configurar eventos de arraste nas colunas
function setupColumnEvents() {
    document.querySelectorAll('.kanban-cards').forEach(column => {
        column.addEventListener('dragover', e => {
            e.preventDefault(); // Permite o "drop"
            column.classList.add('cards-hover');
        });

        column.addEventListener('dragleave', () => {
            column.classList.remove('cards-hover');
        });

        column.addEventListener('drop', e => {
            column.classList.remove('cards-hover');
            const draggedCard = document.querySelector('.kanban-card.dragging');
            if (draggedCard) {
                // Adiciona o card à nova coluna
                column.appendChild(draggedCard);

                // Atualiza a imagem da pessoa de acordo com a coluna
                updateUserAvatar(draggedCard, column);
            }
        });
    });
}

// Função para atualizar a imagem da pessoa no cartão quando movido para uma nova coluna
function updateUserAvatar(card, column) {
    const userAvatar = card.querySelector('.user img');
    const columnId = column.closest('.kanban-column').getAttribute('data-id'); // Obtém o ID da coluna

    let avatarSrc = 'src/img/new.png'; // Imagem padrão para "Novas Tarefas"

    // Define a imagem da pessoa com base na coluna
    switch (columnId) {
        case '2': // Coluna Em Front-End
            avatarSrc = 'src/img/person_n1.png'; // Imagem n1
            break;
        case '3': // Coluna Em Back-End
            avatarSrc = 'src/img/person_n2.png'; // Imagem n2
            break;
        case '4': // Coluna Em Teste
            avatarSrc = 'src/img/person_n3.png'; // Imagem n3
            break;
        case '5': // Coluna Concluído
            avatarSrc = 'src/img/finalizado.png'; // Imagem finalizado
            break;
        default:
            avatarSrc = 'src/img/new.png'; // Caso o cartão esteja na coluna "Novas Tarefas"
    }

    // Atualiza a imagem da pessoa no cartão
    userAvatar.src = avatarSrc;
}
