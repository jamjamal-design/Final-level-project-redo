let visitorSet = new Set();

function saveStore() {
    const visitorArray = Array.from(visitorSet);
    localStorage.setItem('visitors', JSON.stringify(visitorArray));
}

function loadStore() {
    const raw = localStorage.getItem('visitors');
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                visitorSet = new Set(parsed);
            } else {
                visitorSet = new Set();
            }
        } catch (error) {
            console.error('Error loading visitors:', error);
            visitorSet = new Set();
        }
    }
}

function logVisit(e) {
    if (e) e.preventDefault();
    
    const id = (document.getElementById('visitorId')?.value || '').trim();
    const email = (document.getElementById('visitorEmail')?.value || '').trim().toLowerCase();
    const ip = (document.getElementById('visitorIp')?.value || '').trim();
    
    if (!id) {
        showToast('Please enter a visitor ID', 'warning');
        return;
    }
    
    if (!email) {
        showToast('Please enter a visitor email', 'warning');
        return;
    }
    
    if (!ip) {
        showToast('Please enter an IP address', 'warning');
        return;
    }
    
    const visitorData = JSON.stringify({ id, email, ip });
    
    if (visitorSet.has(visitorData)) {
        showToast(`✓ Visitor with ID "${id}" already logged in!`, 'info');
        return;
    }
    
    visitorSet.add(visitorData);
    saveStore();
    renderVisitors();
    
    document.getElementById('visitorId').value = '';
    document.getElementById('visitorEmail').value = '';
    document.getElementById('visitorIp').value = '';
    document.getElementById('visitorId').focus();
    
    showToast(`✓ Visitor "${id}" logged in successfully!`, 'success');
}

function deleteVisitor(visitorData) {
    const visitor = JSON.parse(visitorData);
    visitorSet.delete(visitorData);
    saveStore();
    renderVisitors();
    showToast(`✓ Removed visitor "${visitor.id}" from log`, 'success');
}

function renderVisitors() {
    const countEl = document.getElementById('visitorCount');
    const list = document.getElementById('visitorsList');
    
    if (countEl) countEl.textContent = visitorSet.size;
    
    if (!list) return;
    
    if (visitorSet.size === 0) {
        list.innerHTML = '<p class="text-muted text-center mb-0">No visitors logged in yet. Add one to get started!</p>';
        return;
    }
    
    const visitors = Array.from(visitorSet).map(v => JSON.parse(v));
    
    visitors.sort((a, b) => a.id.localeCompare(b.id));
    
    list.innerHTML = visitors.map(visitor => {
        const visitorData = JSON.stringify(visitor);
        
        return `
            <div class="visitor-item">
                <div class="visitor-info">
                    <p class="visitor-name mb-1"><strong>🆔 ID:</strong> ${escapeHtml(visitor.id)}</p>
                    <p class="contact-email mb-1"><strong>📧 Email:</strong> ${escapeHtml(visitor.email)}</p>
                    <p class="contact-phone mb-0"><strong>🌐 IP:</strong> ${escapeHtml(visitor.ip)}</p>
                </div>
                <button class="btn btn-sm btn-danger" onclick='deleteVisitor(\`${escapeHtml(visitorData)}\`)'>
                    Remove
                </button>
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
    renderVisitors();
    
    const form = document.getElementById('visitorForm');
    if (form) {
        form.addEventListener('submit', logVisit);
    }
});