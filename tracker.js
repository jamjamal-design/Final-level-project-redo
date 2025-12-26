class VisitorTracker {
    constructor() {
        this.visitors = new Set();
        this.attempts = new Map(); // Track duplicate attempt counts
        this.loadFromStorage();
    }

    logVisit(id, email, ip) {
        id = (id || '').trim();
        email = (email || '').trim().toLowerCase();
        ip = (ip || '').trim();

        if (!id) {
            return { success: false, message: 'Please enter a visitor ID' };
        }

        if (!email) {
            return { success: false, message: 'Please enter a visitor email' };
        }

        if (!ip) {
            return { success: false, message: 'Please enter an IP address' };
        }

        // Check if visitor ID already exists
        const existingVisitors = Array.from(this.visitors).map(v => JSON.parse(v));
        const idExists = existingVisitors.find(v => v.id === id);
        if (idExists) {
            const key = `${id}-duplicate`;
            const count = (this.attempts.get(key) || 0) + 1;
            this.attempts.set(key, count);
            this.saveToStorage();
            return { success: false, message: `⚠ Visitor ID "${id}" already exists! Attempt #${count}` };
        }

        // Check if email already exists
        const emailExists = existingVisitors.find(v => v.email === email);
        if (emailExists) {
            const key = `${email}-duplicate`;
            const count = (this.attempts.get(key) || 0) + 1;
            this.attempts.set(key, count);
            this.saveToStorage();
            return { success: false, message: `⚠ Email "${email}" already registered! Attempt #${count}` };
        }

        const visitorData = JSON.stringify({ id, email, ip });
        this.visitors.add(visitorData);
        const key = `${id}-${email}-${ip}`;
        this.attempts.set(key, 1);
        this.saveToStorage();

        return { success: true, message: `✓ Visitor "${id}" logged in successfully!` };
    }

    deleteVisitor(visitorData) {
        if (this.visitors.has(visitorData)) {
            const visitor = JSON.parse(visitorData);
            const key = `${visitor.id}-${visitor.email}-${visitor.ip}`;
            this.visitors.delete(visitorData);
            this.attempts.delete(key);
            this.saveToStorage();
            return { success: true, message: `✓ Removed visitor "${visitor.id}" from log` };
        }
        return { success: false, message: 'Visitor not found' };
    }

    getAllVisitors() {
        return Array.from(this.visitors).map(v => JSON.parse(v)).sort((a, b) => a.id.localeCompare(b.id));
    }

    getVisitorCount() {
        return this.visitors.size;
    }

    getUniqueVisitorCount() {
        const uniqueIds = new Set();
        Array.from(this.visitors).forEach(v => {
            const visitor = JSON.parse(v);
            uniqueIds.add(visitor.id);
        });
        return uniqueIds.size;
    }

    getTotalAttempts() {
        return this.attempts.size;
    }

    getDuplicateAttempts() {
        let duplicates = 0;
        this.attempts.forEach(count => {
            if (count > 1) duplicates += count - 1;
        });
        return duplicates;
    }

    getAttemptCount(visitorData) {
        const visitor = JSON.parse(visitorData);
        const key = `${visitor.id}-${visitor.email}-${visitor.ip}`;
        return this.attempts.get(key) || 0;
    }

    saveToStorage() {
        const visitorArray = Array.from(this.visitors);
        const attemptsObj = Object.fromEntries(this.attempts);
        localStorage.setItem('visitors', JSON.stringify(visitorArray));
        localStorage.setItem('visitorAttempts', JSON.stringify(attemptsObj));
    }

    loadFromStorage() {
        const raw = localStorage.getItem('visitors');
        const attemptsRaw = localStorage.getItem('visitorAttempts');
        
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    this.visitors = new Set(parsed);
                } else {
                    this.visitors = new Set();
                }
            } catch (error) {
                console.error('Error loading visitors:', error);
                this.visitors = new Set();
            }
        }

        if (attemptsRaw) {
            try {
                const parsed = JSON.parse(attemptsRaw);
                this.attempts = new Map(Object.entries(parsed));
            } catch (error) {
                console.error('Error loading attempts:', error);
                this.attempts = new Map();
            }
        }
    }

    clearAllVisitors() {
        this.visitors.clear();
        this.attempts.clear();
        this.saveToStorage();
    }
}

const tracker = new VisitorTracker();

function renderVisitors() {
    const countEl = document.getElementById('visitorCount');
    const uniqueEl = document.getElementById('uniqueVisitors');
    const duplicateEl = document.getElementById('duplicateAttempts');
    const list = document.getElementById('visitorsList');
    
    if (countEl) countEl.textContent = tracker.getVisitorCount();
    if (uniqueEl) uniqueEl.textContent = tracker.getUniqueVisitorCount();
    if (duplicateEl) duplicateEl.textContent = tracker.getDuplicateAttempts();
    
    if (!list) return;
    
    if (tracker.getVisitorCount() === 0) {
        list.innerHTML = '<p class="text-muted text-center mb-0">No visitors logged in yet. Add one to get started!</p>';
        return;
    }

    const visitors = tracker.getAllVisitors();
    
    list.innerHTML = visitors.map(visitor => {
        const visitorData = JSON.stringify(visitor);
        const attemptCount = tracker.getAttemptCount(visitorData);
        
        return `
            <div class="visitor-item">
                <div class="visitor-info">
                    <p class="visitor-name mb-1"><strong>🆔 ID:</strong> ${escapeHtml(visitor.id)}</p>
                    <p class="contact-email mb-1"><strong>📧 Email:</strong> ${escapeHtml(visitor.email)}</p>
                    <p class="contact-phone mb-0"><strong>🌐 IP:</strong> ${escapeHtml(visitor.ip)}</p>
                    <p class="contact-phone mb-0"><strong>🔁 Attempts:</strong> ${attemptCount}</p>
                </div>
                <button class="btn btn-sm btn-danger" onclick='handleDelete(\`${escapeHtml(visitorData)}\`)'>
                    Remove
                </button>
            </div>
        `;
    }).join('');
}

function handleDelete(visitorData) {
    const result = tracker.deleteVisitor(visitorData);
    showToast(result.message, result.success ? 'success' : 'danger');
    renderVisitors();
}

function handleClearAll() {
    if (tracker.getVisitorCount() === 0) {
        showToast('No visitors to clear', 'info');
        return;
    }

    const confirmClear = confirm('Are you sure you want to clear ALL visitor data? This cannot be undone.');
    if (confirmClear) {
        tracker.clearAllVisitors();
        renderVisitors();
        showToast('✓ All visitor data has been cleared!', 'success');
    }
}

function handleLogVisit(e) {
    if (e) e.preventDefault();
    
    const id = (document.getElementById('visitorId')?.value || '').trim();
    const email = (document.getElementById('visitorEmail')?.value || '').trim();
    const ip = (document.getElementById('visitorIp')?.value || '').trim();
    
    const result = tracker.logVisit(id, email, ip);
    
    if (result.success) {
        document.getElementById('visitorId').value = '';
        document.getElementById('visitorEmail').value = '';
        document.getElementById('visitorIp').value = '';
        document.getElementById('visitorId').focus();
        renderVisitors();
    }
    
    showToast(result.message, result.success ? 'success' : 'warning');
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
    renderVisitors();
    
    const form = document.getElementById('visitorForm');
    if (form) {
        form.addEventListener('submit', handleLogVisit);
    }

    const clearAllBtn = document.getElementById('clearAllBtn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', handleClearAll);
    }
});
