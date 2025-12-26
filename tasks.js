let taskQueue = [];

function saveStore() {
    localStorage.setItem('tasks', JSON.stringify(taskQueue));
}

function loadStore() {
    const raw = localStorage.getItem('tasks');
    if (raw) {
        try {
            taskQueue = JSON.parse(raw);
        } catch (error) {
            console.error('Error loading tasks:', error);
            taskQueue = [];
        }
    }
}



function getTypeClass(type) {
    const typeMap = {
        'Email': 'task-type-email',
        'File Upload': 'task-type-upload',
        'Message': 'task-type-message',
        'Other': 'task-type-other'
    };
    return typeMap[type] || 'task-type-other';
}



function getTypeEmoji(type) {
    const emojiMap = {
        'Email': '📧',
        'File Upload': '📁',
        'Message': '💬',
        'Other': '✓'
    };
    return emojiMap[type] || '✓';
}




function addTask(e) {
    if (e) e.preventDefault();
    
    const title = (document.getElementById('taskTitle')?.value || '').trim();
    const type = (document.getElementById('taskType')?.value || '').trim();
    const desc = (document.getElementById('taskDesc')?.value || '').trim();
    
    if (!title) {
        showToast('Please enter a task title', 'warning');
        return;
    }

    const taskData = { title, type: type || 'Other', desc };
    taskQueue.push(taskData);
    saveStore();
    renderTasks();
    
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskType').value = '';
    document.getElementById('taskDesc').value = '';
    
    showToast(`✓ Task "${title}" added!`, 'success');
}



function popTask() {
    if (taskQueue.length === 0) {
        showToast('No tasks in queue!', 'info');
        return;
    }

    const taskToProcess = taskQueue[0];
    const taskTitle = typeof taskToProcess === 'string' ? taskToProcess : taskToProcess.title;
    
    taskQueue.shift();
    saveStore();
    renderTasks();
    
    showToast(`✓ Completed: "${taskTitle}"`, 'success');
}



function clearAllTasks() {
    if (taskQueue.length === 0) {
        showToast('Queue is already empty!', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear all tasks? This cannot be undone.')) {
        const count = taskQueue.length;
        taskQueue = [];
        saveStore();
        renderTasks();
        showToast(`🗑️ Cleared ${count} task(s) from queue!`, 'success');
    }
}

function deleteTask(index) {
    const task = taskQueue[index];
    const taskTitle = typeof task === 'string' ? task : task.title;
    
    taskQueue.splice(index, 1);
    saveStore();
    renderTasks();
    showToast(`✓ Removed "${taskTitle}" from queue!`, 'success');
}






function renderTasks() {
    const list = document.getElementById('tasksList');
    const count = document.getElementById('taskCount');
    const progress = document.getElementById('taskProgress');
    
    if (count) count.textContent = taskQueue.length;
    if (progress) progress.style.width = taskQueue.length > 0 ? '100%' : '0%';
    
    if (!list) return;
    
    if (taskQueue.length === 0) {
        list.innerHTML = '<p class="text-muted text-center mb-0">No tasks in queue. Add one to get started!</p>';
        return;
    }
    
    list.innerHTML = taskQueue.map((t, i) => {
        const title = typeof t === 'string' ? t : (t.title || '');
        const type = typeof t === 'string' ? 'Other' : (t.type || 'Other');
        const desc = typeof t === 'string' ? '' : (t.desc || '');
        const emoji = getTypeEmoji(type);
        const typeClass = getTypeClass(type);
        
        return `
            <div class="task-item">
                <span class="task-type-badge ${typeClass}">${emoji} ${type}</span>
                <p class="task-title">${escapeHtml(title)}</p>
                ${desc ? `<p class="task-desc">${escapeHtml(desc)}</p>` : ''}
                <div class="mt-2">
                    <button class="btn btn-sm btn-danger" onclick="deleteTask(${i})">
                        Remove
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    text = String(text);
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function showToast(message, type = 'info') {
    const background = {
        success: 'linear-gradient(90deg, #00b09b, #96c93d)',
        danger: 'linear-gradient(90deg, #ff5858, #f09819)',
        warning: 'linear-gradient(90deg, #f7971e, #ffd200)',
        info: 'linear-gradient(90deg, #1e90ff, #6fa3ff)'
    }[type] || 'linear-gradient(90deg, #1e90ff, #6fa3ff)';

    Toastify({
        text: message,
        duration: 3500,
        gravity: 'top',
        position: 'right',
        close: true,
        style: { background }
    }).showToast();
}

document.addEventListener('DOMContentLoaded', () => {
    loadStore();
    renderTasks();
    
    const form = document.getElementById('taskForm');
    if (form) {
        form.addEventListener('submit', addTask);
    }
    
    const popBtn = document.getElementById('popBtn');
    if (popBtn) {
        popBtn.addEventListener('click', popTask);
    }
    
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllTasks);
    }
});