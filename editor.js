let textStack = [""];
let redoStack = [];


function saveStore() {
    localStorage.setItem('editor', JSON.stringify(textStack));
}


function loadStore() {
    const raw = localStorage.getItem('editor');
    if (raw) {
        try {
            textStack = JSON.parse(raw);
        } catch (error) {
            console.error('Error loading editor content:', error);
            textStack = [""];
        }
    }
}

function updateStats() {
    const txt = document.getElementById('editorArea').value;
    const charCount = txt.length;
    const wordCount = txt.trim() === '' ? 0 : txt.trim().split(/\s+/).length;
    const lineCount = txt === '' ? 0 : txt.split('\n').length;
    
    const charEl = document.getElementById('charCount');
    if (charEl) charEl.textContent = `${charCount} characters | ${wordCount} words`;
    
    const wEl = document.getElementById('wordCount');
    if (wEl) wEl.textContent = wordCount;
    
    const lEl = document.getElementById('lineCount');
    if (lEl) lEl.textContent = lineCount;
}

function saveText() {
    const txt = document.getElementById('editorArea').value;
    const last = textStack[textStack.length - 1];
    
    if (last !== txt) {
        textStack.push(txt);
        redoStack = [];
        saveStore();
        updateStats();
    }
}

function undoText() {
    if (textStack.length > 1) {
        const last = textStack.pop();
        redoStack.push(last);
        const prev = textStack[textStack.length - 1];
        document.getElementById('editorArea').value = prev;
        updateStats();
        saveStore();
        showToast('↶ Undo successful', 'success');
    } else {
        showToast('Nothing to undo', 'warning');
    }
}

function redoText() {
    if (redoStack.length > 0) {
        const next = redoStack.pop();
        textStack.push(next);
        document.getElementById('editorArea').value = next;
        updateStats();
        saveStore();
        showToast('↷ Redo successful', 'success');
    } else {
        showToast('Nothing to redo', 'warning');
    }
}

function exportNotes() {
    const text = document.getElementById('editorArea').value;
    
    if (!text.trim()) {
        showToast('Cannot export empty notes', 'warning');
        return;
    }
    
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `notes_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
    
    showToast(`💾 Downloaded as notes_${new Date().toISOString().slice(0, 10)}.txt`, 'success');
}

function clearAll() {
    const text = document.getElementById('editorArea').value;
    
    if (!text.trim()) {
        showToast('Notes are already empty', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear all notes? This cannot be undone.')) {
        document.getElementById('editorArea').value = '';
        textStack = [""];
        redoStack = [];
        saveStore();
        updateStats();
        showToast('🗑️ Notes cleared', 'success');
    }
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
    const initial = textStack[textStack.length - 1] || '';
    const textarea = document.getElementById('editorArea');
    
    if (textarea) {
        textarea.value = initial;
        textarea.addEventListener('input', saveText);
    }
    
    const undoBtn = document.getElementById('undoBtn');
    if (undoBtn) undoBtn.addEventListener('click', undoText);
    
    const redoBtn = document.getElementById('redoBtn');
    if (redoBtn) redoBtn.addEventListener('click', redoText);
    
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) exportBtn.addEventListener('click', exportNotes);
    
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) clearBtn.addEventListener('click', clearAll);
    
    updateStats();
});