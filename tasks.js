let taskQueue = [];
const API_BASE_URL = 'http://localhost:5000/api';
let useMongoDb = true;

async function checkMongoDbConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`, { timeout: 3000 });
        if (response.ok) {
            useMongoDb = true;
            console.log('✅ MongoDB backend connected');
            return true;
        }
    } catch (error) {
        console.warn('⚠️ MongoDB backend not available, using localStorage fallback');
        useMongoDb = false;
    }
    return false;
}

async function saveStore() {
    if (!useMongoDb) {
        localStorage.setItem('tasks', JSON.stringify(taskQueue));
        console.log('💾 Tasks saved to localStorage');
    } else {
        localStorage.setItem('tasks', JSON.stringify(taskQueue));
    }
}






async function loadStore() {
    await checkMongoDbConnection();
    
    if (useMongoDb) {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks`, { timeout: 3000 });
            
            if (!response.ok) {
                throw new Error(`Failed to load tasks: ${response.statusText}`);
            }
            
            const data = await response.json();
            taskQueue = Array.isArray(data) ? data : (data.tasks || []);
            console.log('✅ Tasks loaded from MongoDB:', taskQueue);
            renderTasks();
        } catch (error) {
            console.error('❌ Error loading from MongoDB, falling back to localStorage:', error);
            const raw = localStorage.getItem('tasks');
            if (raw) {
                try {
                    taskQueue = JSON.parse(raw);
                    console.log('📂 Tasks loaded from localStorage (backup)');
                } catch (parseError) {
                    console.error('Error parsing localStorage:', parseError);
                    taskQueue = [];
                }
            }
            renderTasks();
        }
    } else {
        const raw = localStorage.getItem('tasks');
        if (raw) {
            try {
                taskQueue = JSON.parse(raw);
                console.log('📂 Tasks loaded from localStorage');
            } catch (error) {
                console.error('Error loading tasks:', error);
                taskQueue = [];
            }
        }
        renderTasks();
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




async function addTask(e) {
    if (e) e.preventDefault();
    
    const title = (document.getElementById('taskTitle')?.value || '').trim();
    const type = (document.getElementById('taskType')?.value || '').trim();
    const desc = (document.getElementById('taskDesc')?.value || '').trim();
    
    if (!title) {
        showToast('Please enter a task title', 'warning');
        return;
    }

    const taskData = { title, type: type || 'Other', desc };

    try {
        if (useMongoDb) {
            const response = await fetch('http://localhost:5000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });

            if (!response.ok) {
                throw new Error('Failed to save to MongoDB');
            }

            const newTask = await response.json();
            taskQueue.push(newTask);
            showToast(`✓ Task "${title}" saved to MongoDB!`, 'success');
        } else {
            taskQueue.push(taskData);
            showToast(`✓ Task "${title}" added!`, 'success');
        }
        
        await saveStore();
        renderTasks();
        
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskType').value = '';
        document.getElementById('taskDesc').value = '';

    } catch (error) {
        console.error('Error adding task:', error);
        showToast('Failed to add task', 'danger');
    }
}




async function popTask() {
    if (taskQueue.length === 0) {
        showToast('No tasks in queue!', 'info');
        return;
    }

    const taskToProcess = taskQueue[0];
    const taskTitle = typeof taskToProcess === 'string' ? taskToProcess : taskToProcess.title;

    try {
        if (useMongoDb && taskToProcess._id) {
            const response = await fetch(`http://localhost:5000/api/tasks/${taskToProcess._id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete task from MongoDB');
            }
        }

        taskQueue.shift();
        await saveStore();
        renderTasks();
        
        showToast(`✓ Completed: "${taskTitle}"`, 'success');
    } catch (error) {
        console.error('Error processing task:', error);
        showToast('Failed to process task', 'danger');
    }
}
    





async function clearAllTasks() {
    if (taskQueue.length === 0) {
        showToast('Queue is already empty!', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear all tasks? This cannot be undone.')) {
        const count = taskQueue.length;
        
        try {
            if (useMongoDb) {
                const deletePromises = taskQueue
                    .filter(task => task._id)
                    .map(task => 
                        fetch(`http://localhost:5000/api/tasks/${task._id}`, {
                            method: 'DELETE'
                        })
                    );
                await Promise.all(deletePromises);
            }
            
            // Clear local array
            taskQueue = [];
            await saveStore();
            renderTasks();
            showToast(`🗑️ Cleared ${count} task(s) from queue!`, 'success');
        } catch (error) {
            console.error('Error clearing tasks:', error);
            showToast('Failed to clear all tasks', 'danger');
        }
    }
}





async function deleteTask(index) {
    const task = taskQueue[index];
    const taskTitle = typeof task === 'string' ? task : task.title;
    
    try {
        
        if (useMongoDb && task._id) {
            const response = await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete from MongoDB');
            }
        }
        
       
        taskQueue.splice(index, 1);
        await saveStore();
        renderTasks();
        showToast(`✓ Removed "${taskTitle}" from queue!`, 'success');
    } catch (error) {
        console.error('Error deleting task:', error);
        showToast('Failed to delete task', 'danger');
    }
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
                <span class="task-type-badge ${typeClass}${' '}${emoji} ${type}</span>
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