class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.editingId = null;
        
        this.initializeElements();
        this.bindEvents();
        this.loadTodos();
    }

    initializeElements() {
        this.todoInput = document.getElementById('todoInput');
        this.addTodoBtn = document.getElementById('addTodo');
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.clearCompletedBtn = document.getElementById('clearCompleted');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        
        // Stats elements
        this.totalTodos = document.getElementById('totalTodos');
        this.completedTodos = document.getElementById('completedTodos');
        this.pendingTodos = document.getElementById('pendingTodos');
    }

    bindEvents() {
        // Add todo
        this.addTodoBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // Clear completed
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());

        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });
    }

    async loadTodos() {
        try {
            const response = await fetch('/api/todos');
            this.todos = await response.json();
            this.renderTodos();
            this.updateStats();
        } catch (error) {
            console.error('Error loading todos:', error);
        }
    }

    async addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;

        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text })
            });

            if (response.ok) {
                const newTodo = await response.json();
                this.todos.push(newTodo);
                this.todoInput.value = '';
                this.renderTodos();
                this.updateStats();
            }
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    }

    async toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: !todo.completed })
            });

            if (response.ok) {
                todo.completed = !todo.completed;
                this.renderTodos();
                this.updateStats();
            }
        } catch (error) {
            console.error('Error toggling todo:', error);
        }
    }

    async updateTodo(id, text) {
        if (!text.trim()) return;

        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text.trim() })
            });

            if (response.ok) {
                const todo = this.todos.find(t => t.id === id);
                if (todo) {
                    todo.text = text.trim();
                    this.renderTodos();
                }
            }
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    }

    async deleteTodo(id) {
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                const todoElement = document.querySelector(`[data-id="${id}"]`);
                if (todoElement) {
                    todoElement.classList.add('removing');
                    setTimeout(() => {
                        this.todos = this.todos.filter(t => t.id !== id);
                        this.renderTodos();
                        this.updateStats();
                    }, 300);
                }
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    }

    async clearCompleted() {
        try {
            const response = await fetch('/api/todos', {
                method: 'DELETE'
            });

            if (response.ok) {
                this.todos = this.todos.filter(t => !t.completed);
                this.renderTodos();
                this.updateStats();
            }
        } catch (error) {
            console.error('Error clearing completed todos:', error);
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        this.renderTodos();
    }

    renderTodos() {
        const filteredTodos = this.getFilteredTodos();
        
        if (filteredTodos.length === 0) {
            this.todoList.innerHTML = '';
            this.emptyState.style.display = 'block';
            return;
        }

        this.emptyState.style.display = 'none';
        
        this.todoList.innerHTML = filteredTodos.map(todo => `
            <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" onclick="todoApp.toggleTodo(${todo.id})">
                    ${todo.completed ? '<i class="fas fa-check"></i>' : ''}
                </div>
                <div class="todo-text" ondblclick="todoApp.startEdit(${todo.id})">
                    ${todo.text}
                </div>
                <div class="todo-actions">
                    <button class="todo-btn edit" onclick="todoApp.startEdit(${todo.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="todo-btn delete" onclick="todoApp.deleteTodo(${todo.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            case 'pending':
                return this.todos.filter(todo => !todo.completed);
            default:
                return this.todos;
        }
    }

    startEdit(id) {
        const todoElement = document.querySelector(`[data-id="${id}"]`);
        const textElement = todoElement.querySelector('.todo-text');
        const currentText = textElement.textContent.trim();

        // Create input element
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.className = 'todo-text editing';
        input.maxLength = 100;

        // Replace text with input
        textElement.style.display = 'none';
        textElement.parentNode.insertBefore(input, textElement);
        input.focus();
        input.select();

        this.editingId = id;

        // Handle input events
        const handleEdit = () => {
            const newText = input.value.trim();
            if (newText && newText !== currentText) {
                this.updateTodo(id, newText);
            }
            this.finishEdit();
        };

        input.addEventListener('blur', handleEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleEdit();
            }
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.finishEdit();
            }
        });
    }

    finishEdit() {
        if (this.editingId) {
            const todoElement = document.querySelector(`[data-id="${this.editingId}"]`);
            const input = todoElement.querySelector('.todo-text.editing');
            const textElement = todoElement.querySelector('.todo-text');

            if (input && textElement) {
                input.remove();
                textElement.style.display = '';
            }

            this.editingId = null;
        }
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const pending = total - completed;

        this.totalTodos.textContent = total;
        this.completedTodos.textContent = completed;
        this.pendingTodos.textContent = pending;

        // Show/hide clear completed button
        this.clearCompletedBtn.style.display = completed > 0 ? 'flex' : 'none';
    }
}

// Initialize the app when DOM is loaded
let todoApp;
document.addEventListener('DOMContentLoaded', () => {
    todoApp = new TodoApp();
}); 