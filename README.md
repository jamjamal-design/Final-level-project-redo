# 📊 Data Structures Projects Dashboard

A comprehensive collection of four web-based projects demonstrating fundamental data structures: **Map**, **Queue**, **Set**, and **Stacks**. Built with pure vanilla JavaScript and localStorage for client-side data persistence.

![Version](https://img.shields.io/badge/version-1.0-blue)
![Bootstrap](https://img.shields.io/badge/bootstrap-5.3.2-purple)
![JavaScript](https://img.shields.io/badge/javascript-vanilla-yellow)
![Storage](https://img.shields.io/badge/storage-localStorage-green)

---

## 🚀 Quick Start

1. **Clone or Download** this repository
2. **Open** `index.html` in any modern web browser
3. **Navigate** to any of the four projects from the dashboard
4. **Start using** - no installation, setup, or server required!

```bash
# Optional: Use a local server for better development experience
cd "Final-level project redo"
python -m http.server 8000
# Open http://localhost:8000
```

---

## 📁 Project Structure

```
Final-level project redo/
├── index.html                   # Main dashboard/landing page
│
├── contacts.html                # Contact Manager UI
├── contacts.js                  # Contact Manager logic (Map)
├── contacts.css                 # Contact Manager styles
│
├── tasks.html                   # Task Scheduler UI
├── tasks.js                     # Task Scheduler logic (Queue)
├── tasks.css                    # Task Scheduler styles
│
├── tracker.html                 # Visitor Tracker UI
├── tracker.js                   # Visitor Tracker logic (Set)
├── tracker.css                  # Visitor Tracker styles
│
├── editor.html                  # Notes Editor UI
├── editor.js                    # Notes Editor logic (Stacks)
├── editor.css                   # Notes Editor styles
│
├── style.css                    # Global styles
└── README.md                    # This file
```

---

## 🎯 Projects Overview

### 1. 👥 **Contact Manager** (Map Data Structure)

A powerful contact management system using JavaScript's **Map** for efficient key-value storage.

**Features:**
- ✅ Add/edit contacts with first name, last name, email, and phone
- ✅ Search contacts by email or full name
- ✅ Update existing contacts (email acts as unique key)
- ✅ Delete contacts with confirmation modal
- ✅ Real-time contact count display
- ✅ Data persists in localStorage

**Key Concepts:**
- Map data structure for O(1) lookup
- Email normalization (lowercase, trimmed)
- Duplicate prevention by email key

**Usage:**
```javascript
// Adding a contact
manager.addContact("John", "Doe", "john@example.com", "123-456-7890");

// Searching
manager.searchContact("john@example.com");

// Deleting
manager.deleteContact("john@example.com");
```

---

### 2. 📋 **Task Scheduler** (Queue Data Structure)

A FIFO (First-In, First-Out) task management system using **Queue** principles.

**Features:**
- ✅ Add tasks with title, type, and description
- ✅ Task types: Email, File Upload, Message, Other
- ✅ Process tasks in order (FIFO queue)
- ✅ Remove specific tasks from queue
- ✅ Clear all tasks at once
- ✅ Visual task type badges with emojis

**Key Concepts:**
- Queue (FIFO) data structure
- Task prioritization by order
- Array-based queue implementation

**Usage:**
```javascript
// Adding a task
addTask({ title: "Send Email", type: "Email", desc: "Follow up" });

// Processing next task (FIFO)
popTask();

// Clearing all
clearAllTasks();
```

---

### 3. 📍 **Visitor Tracker** (Set Data Structure)

A unique visitor logging system using **Set** to prevent duplicates.

**Features:**
- ✅ Log visitors with ID, email, and IP address
- ✅ Automatic duplicate detection (unique ID and email enforcement)
- ✅ Track duplicate login attempts
- ✅ Statistics: Total visitors, unique IDs, duplicate attempts
- ✅ Remove individual visitors
- ✅ Clear all data with confirmation
- ✅ Attempt count per visitor

**Key Concepts:**
- Set data structure for uniqueness
- Composite key validation (ID + Email + IP)
- Duplicate attempt tracking with Map

**Usage:**
```javascript
// Logging a visitor
tracker.logVisit("V001", "visitor@example.com", "192.168.1.1");

// Get stats
tracker.getUniqueVisitorCount();
tracker.getDuplicateAttempts();

// Clear all
tracker.clearAllVisitors();
```

---

### 4. 📝 **Notes Editor** (Stack Data Structure)

A rich text editor with **Undo/Redo** functionality using Stack principles.

**Features:**
- ✅ Create and edit notes with titles
- ✅ Undo changes (LIFO stack)
- ✅ Redo changes (forward stack)
- ✅ Save notes to collection
- ✅ View all saved notes
- ✅ Delete notes
- ✅ Timestamp tracking

**Key Concepts:**
- Stack (LIFO) data structure
- State management for undo/redo
- History tracking with two stacks

**Usage:**
```javascript
// Undo
editor.undo();

// Redo
editor.redo();

// Save note
editor.saveNote();
```

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **HTML5** | Structure and markup |
| **CSS3** | Styling and animations |
| **Vanilla JavaScript** | Core logic and interactivity |
| **Bootstrap 5.3.2** | UI components and responsive design |
| **Toastify.js** | Toast notifications |
| **localStorage** | Client-side data persistence |

---

## 💡 Data Structures Explained

### Map (Contact Manager)
```javascript
// Key-value pairs with O(1) lookup
const contacts = new Map();
contacts.set("email@example.com", { first: "John", last: "Doe" });
```

### Queue (Task Scheduler)
```javascript
// FIFO: First In, First Out
taskQueue.push(task);  // Enqueue
taskQueue.shift();     // Dequeue
```

### Set (Visitor Tracker)
```javascript
// Unique values only
const visitors = new Set();
visitors.add("visitor1");  // Adds
visitors.add("visitor1");  // Ignored (duplicate)
```

### Stack (Notes Editor)
```javascript
// LIFO: Last In, First Out
undoStack.push(state);  // Push
undoStack.pop();        // Pop
```

---

## 📱 Features Across All Projects

- 🎨 **Beautiful UI** - Modern gradient backgrounds and smooth animations
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 💾 **Data Persistence** - All data saved to localStorage
- 🔔 **Toast Notifications** - Real-time feedback for user actions
- ✅ **Input Validation** - Comprehensive error checking
- 🎯 **User-Friendly** - Intuitive interfaces with clear labels
- ⚡ **Fast Performance** - No server required, instant operations

---

## 🎓 Learning Outcomes

This project demonstrates:

1. **Data Structure Implementation** - Practical use of Map, Queue, Set, and Stack
2. **DOM Manipulation** - Dynamic HTML rendering with vanilla JavaScript
3. **Event Handling** - Form submissions, button clicks, modal interactions
4. **State Management** - localStorage for persistent data
5. **UI/UX Design** - Bootstrap integration and custom styling
6. **Error Handling** - Input validation and user feedback
7. **Code Organization** - Modular functions and class-based architecture

---

## 🔧 Browser Compatibility

| Browser | Supported |
|---------|-----------|
| Chrome | ✅ Yes |
| Firefox | ✅ Yes |
| Safari | ✅ Yes |
| Edge | ✅ Yes |
| Opera | ✅ Yes |

**Requirements:**
- Modern browser with ES6+ support
- localStorage enabled
- JavaScript enabled

---

## 📝 Usage Examples

### Contact Manager
```javascript
// Add a contact
manager.addContact("Jane", "Smith", "jane@email.com", "555-0123");

// Search by email
const contact = manager.searchContact("jane@email.com");

// Get all contacts
const allContacts = manager.getAllContacts();
```

### Task Scheduler
```javascript
// Add a task
addTask({ title: "Code Review", type: "Other", desc: "Review PR #42" });

// Process next task
popTask();  // Removes first task in queue
```

### Visitor Tracker
```javascript
// Log a visitor
tracker.logVisit("V123", "user@site.com", "10.0.0.1");

// Get statistics
console.log(tracker.getVisitorCount());
console.log(tracker.getDuplicateAttempts());
```

### Notes Editor
```javascript
// Save a note
saveNote("My Note", "This is the content");

// Undo last change
undo();

// Redo
redo();
```

---

## 🚀 Future Enhancements

Potential improvements:
- [ ] Export data to JSON/CSV
- [ ] Import data from files
- [ ] Search and filter functionality
- [ ] Sorting options
- [ ] Dark mode toggle
- [ ] Print functionality
- [ ] Keyboard shortcuts
- [ ] Data encryption
- [ ] Backup and restore

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Akorede Jamal**
- Email: akoredegboyega1@gmail.com
- Phone: 08142315774

---

## 🙏 Acknowledgments

- Bootstrap for UI components
- Toastify.js for notifications
- Font Awesome concepts for emoji usage
- JavaScript community for best practices

---

## 📞 Support

If you encounter any issues or have questions:
1. Check browser console for errors (F12)
2. Ensure localStorage is enabled
3. Try clearing browser cache
4. Verify JavaScript is enabled

---

**Last Updated:** December 26, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
