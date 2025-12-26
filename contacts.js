class ContactManager {
    constructor() {
        this.contacts = new Map();
        this.loadFromStorage();
    }

    /**
     * Add or update a contact in the system
     * @param {string} first 
     * @param {string} last 
     * @param {string} email 
     * @param {string} phone 
     * @returns {Object} Result object with success status and message
     */
    addContact(first, last, email, phone) {
        s
        if (!first.trim() || !last.trim() || !email.trim() || !phone.trim()) {
            return { success: false, message: 'First name, last name, email, and phone are required' };
        }
        
        
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedFirst = first.trim();
        const normalizedLast = last.trim();
        const normalizedPhone = phone.trim();

        // Check if updating existing contact
        const isUpdate = this.contacts.has(normalizedEmail);

        // Store contact with email as key (Map structure)
        this.contacts.set(normalizedEmail, {
            first: normalizedFirst,
            last: normalizedLast,
            email: normalizedEmail,
            phone: normalizedPhone
        });
        this.saveToStorage();

        const fullName = `${normalizedFirst} ${normalizedLast}`.trim();
        const message = isUpdate 
            ? `Contact "${fullName}" updated successfully!`
            : `Contact "${fullName}" added successfully!`;
        
        return { success: true, message, isUpdate };
    }

    /**
     * Search for a contact by email or name
     * @param {string} term - Search term (email or name)
     * @returns {Object|null} Contact object if found, null otherwise
     */
    searchContact(term) {
        const q = term.trim().toLowerCase();
        if (!q) return null;

        // First, try exact email match (O(1) lookup)
        if (this.contacts.has(q)) {
            return this.contacts.get(q);
        }

        // If not found, search by name (O(n) search)
        for (const [, contact] of this.contacts.entries()) {
            const fullName = `${contact.first} ${contact.last}`.toLowerCase();
            if (fullName.includes(q)) return contact;
        }
        return null;
    }

    /**
     * Delete a contact by email
     * @param {string} email - Email address of contact to delete
     * @returns {Object} Result object with success status and message
     */
    deleteContact(email) {
        const key = email.trim().toLowerCase();
        
        if (this.contacts.has(key)) {
            const contact = this.contacts.get(key);
            const fullName = `${contact.first} ${contact.last}`.trim();
            this.contacts.delete(key);
            this.saveToStorage();
            return { success: true, message: `Contact "${fullName}" deleted!` };
        }
        
        return { success: false, message: `Contact not found` };
    }

    /**
     * Get all contacts as an array
     * @returns {Array} Array of all contact objects
     */
    getAllContacts() {
        return Array.from(this.contacts.values());
    }

    /**
     * Get total number of contacts
     * @returns {number} Count of contacts
     */
    getContactCount() {
        return this.contacts.size;
    }

    /**
     * Save contacts to localStorage
     * Converts Map to array of entries for JSON serialization
     */
    saveToStorage() {
        const data = Array.from(this.contacts.entries());
        localStorage.setItem('contacts', JSON.stringify(data));
    }

    /**
     * Load contacts from localStorage
     * Handles backward compatibility with old data formats
     */
    loadFromStorage() {
        const data = localStorage.getItem('contacts');
        if (data) {
            try {
                const entries = JSON.parse(data);
                entries.forEach(([key, value]) => {
                    if (typeof value === 'object' && value !== null) {
                        this.contacts.set(key, value);
                    } else {
                        // Backward compatibility: convert old format
                        this.contacts.set(key.toLowerCase(), {
                            first: key,
                            last: '',
                            email: key.toLowerCase(),
                            phone: String(value)
                        });
                    }
                });
            } catch (error) {
                console.error('Error loading contacts from storage:', error);
            }
        }
    }

    /**
     * Clear all contacts from memory and storage
     */
    clearAllContacts() {
        this.contacts.clear();
        this.saveToStorage();
    }
}


// Initialize Contact Manager and DOM Elements

const manager = new ContactManager();

// Form elements
const contactForm = document.getElementById('contactForm');
const contactFirstInput = document.getElementById('contactFirst');
const contactLastInput = document.getElementById('contactLast');
const contactEmailInput = document.getElementById('contactEmail');
const contactPhoneInput = document.getElementById('contactPhone');

// Display elements
const contactsList = document.getElementById('contactsList');
const contactCount = document.getElementById('contactCount');

// Search elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchResult = document.getElementById('searchResult');


// Helper Functions
/**
 * Get trimmed search term from input
 * @returns {string} Trimmed search term
 */
function getSearchTerm() {
    return (searchInput?.value || '').trim();
}

/**
 * Render all contacts to the DOM
 * Updates the contact list and count display
 */
function renderContacts() {
    const contacts = manager.getAllContacts();
    contactCount.textContent = contacts.length;


    if (contacts.length === 0) {
        contactsList.innerHTML = '<p class="text-muted text-center p-3 mb-0">No contacts yet. Add one to get started!</p>';
        return;
    }

    
    contactsList.innerHTML = contacts.map(contact => `
        <div class="contact-item">
            <div class="contact-info">
                <h6 class="contact-name">${escapeHtml(contact.first)} ${escapeHtml(contact.last)}</h6>
                <p class="contact-phone mb-1">${escapeHtml(contact.phone)}</p>
                <p class="contact-email text-muted mb-0">${escapeHtml(contact.email)}</p>
            </div>
            <div class="contact-actions">
                <button class="btn btn-sm btn-warning" onclick="editContact('${escapeHtml(contact.email)}')">
                    Edit
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteContactHandler('${escapeHtml(contact.email)}')">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}


// Event Handlers

/**
 * Handle contact form submission
 * Adds or updates a contact
 */
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const first = contactFirstInput.value;
    const last = contactLastInput.value;
    const email = contactEmailInput.value;
    const phone = contactPhoneInput.value;
    
    const result = manager.addContact(first, last, email, phone);
    
    if (result.success) {
        showToast(result.message, 'success');
        contactForm.reset();
        contactFirstInput.focus();
        renderContacts();
        clearSearchResult();
    } else {
        showToast(result.message, 'danger');
    }
});


searchBtn.addEventListener('click', performSearch);

// Search on Enter key press
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

/**
 * Perform contact search and display results
 */
function performSearch() {
    const searchTerm = getSearchTerm();
    
    if (!searchTerm) {
        showToast('Please enter a name to search', 'warning');
        clearSearchResult();
        return;
    }
    
    const result = manager.searchContact(searchTerm);
    
    if (result) {
        
        searchResult.innerHTML = `
            <div class="alert alert-success p-3 mb-0">
                <h6 class="mb-2">✓ Found!</h6>
                <p class="mb-1"><strong>${escapeHtml(result.first)} ${escapeHtml(result.last)}</strong></p>
                <p class="mb-0"><strong>Phone:</strong> ${escapeHtml(result.phone)}</p>
                <p class="mb-0"><strong>Email:</strong> ${escapeHtml(result.email)}</p>
            </div>
        `;
    } else {
        searchResult.innerHTML = `
            <div class="alert alert-danger p-3 mb-0">
                <h6 class="mb-0">✗ Contact "${escapeHtml(searchTerm)}" not found</h6>
            </div>
        `;
    }
}

/**
 * Clear search results and input
 */
function clearSearchResult() {
    searchResult.innerHTML = '';
    searchInput.value = '';
}

/**
 * Edit a contact by populating the form with their data
 * @param {string} email - Email of contact to edit
 */
function editContact(email) {
    const contact = manager.searchContact(email);
    if (contact) {
        contactFirstInput.value = contact.first;
        contactLastInput.value = contact.last;
        contactEmailInput.value = contact.email;
        contactPhoneInput.value = contact.phone;
        contactFirstInput.focus();
        scrollToForm();
    }
}



let pendingDeleteName = null;
const confirmDeleteModalEl = document.getElementById('confirmDeleteModal');
const confirmDeleteText = document.getElementById('confirmDeleteText');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const confirmDeleteModal = confirmDeleteModalEl ? new bootstrap.Modal(confirmDeleteModalEl) : null;

/**
 * Show delete confirmation modal
 * @param {string} email - Email of contact to delete
 */
function deleteContactHandler(email) {
    pendingDeleteName = email;
    if (confirmDeleteText) {
        confirmDeleteText.textContent = `Are you sure you want to delete "${email}"?`;
    }
    if (confirmDeleteModal) {
        confirmDeleteModal.show();
    } else {
        const result = manager.deleteContact(name);
        showToast(result.message, result.success ? 'success' : 'danger');
        renderContacts();
        clearSearchResult();
    }
}


if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
        if (!pendingDeleteName) return;
        
        const result = manager.deleteContact(pendingDeleteName);
        showToast(result.message, result.success ? 'success' : 'danger');
        renderContacts();
        clearSearchResult();
        pendingDeleteName = null;
        
        if (confirmDeleteModal) confirmDeleteModal.hide();
    });
}



/**
 * Escape HTML special characters to prevent XSS attacks
 * @param {*} text - Text to escape
 * @returns {string} Escaped text
 */
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

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Toast type (success, danger, warning, info)
 */
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

/**
 * Scroll to the contact form smoothly
 */
function scrollToForm() {
    contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
}


// Render contacts on page load
renderContacts();
