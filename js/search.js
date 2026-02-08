/**
 * Bürstner Ixeo I 744 Interactive Manual - Search Module
 * 
 * Implements offline keyword search across tasks and systems.
 * Supports synonyms for better discoverability.
 * Works without any external dependencies or API calls.
 */

const Search = {
    systems: [],
    tasks: [],
    searchInput: null,
    resultsContainer: null,
    debounceTimer: null,

    /**
     * Initialize the search module
     * @param {Array} systems - Array of system objects
     * @param {Array} tasks - Array of task objects
     */
    init(systems, tasks) {
        this.systems = systems;
        this.tasks = tasks;
        this.searchInput = document.getElementById('search-input');
        this.resultsContainer = document.getElementById('search-results');

        this.setupEventListeners();
    },

    /**
     * Set up search event listeners
     */
    setupEventListeners() {
        if (!this.searchInput) return;

        // Handle input with debounce
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 200);
        });

        // Handle focus
        this.searchInput.addEventListener('focus', (e) => {
            if (e.target.value.trim().length >= 2) {
                this.performSearch(e.target.value);
            }
        });

        // Handle Enter key
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const firstResult = this.resultsContainer.querySelector('.search-result-item');
                if (firstResult) {
                    firstResult.click();
                }
            } else if (e.key === 'Escape') {
                this.hideResults();
                this.searchInput.blur();
            }
        });
    },

    /**
     * Perform search across systems and tasks
     * @param {string} query - Search query string
     */
    performSearch(query) {
        const searchTerm = query.trim().toLowerCase();

        if (searchTerm.length < 2) {
            this.hideResults();
            return;
        }

        const results = [];

        // Search systems
        this.systems.forEach(system => {
            const score = this.calculateScore(system, searchTerm, 'system');
            if (score > 0) {
                results.push({
                    type: 'system',
                    id: system.id,
                    title: system.name,
                    description: system.description,
                    category: system.category,
                    score: score
                });
            }
        });

        // Search tasks
        this.tasks.forEach(task => {
            const score = this.calculateScore(task, searchTerm, 'task');
            if (score > 0) {
                results.push({
                    type: 'task',
                    id: task.id,
                    title: task.title,
                    system: task.system,
                    score: score
                });
            }
        });

        // Sort by score (highest first)
        results.sort((a, b) => b.score - a.score);

        // Display results (limit to top 10)
        this.displayResults(results.slice(0, 10));
    },

    /**
     * Calculate relevance score for an item
     * @param {Object} item - System or task object
     * @param {string} searchTerm - Search term
     * @param {string} type - Type of item ('system' or 'task')
     * @returns {number} Relevance score
     */
    calculateScore(item, searchTerm, type) {
        let score = 0;
        const searchWords = searchTerm.split(/\s+/);

        if (type === 'system') {
            // Check system name (highest weight)
            if (item.name.toLowerCase().includes(searchTerm)) {
                score += 10;
            }
            
            // Check individual words in name
            searchWords.forEach(word => {
                if (item.name.toLowerCase().includes(word)) {
                    score += 3;
                }
            });

            // Check description
            if (item.description.toLowerCase().includes(searchTerm)) {
                score += 5;
            }

            // Check category
            if (item.category && item.category.toLowerCase().includes(searchTerm)) {
                score += 6;
            }

            // Check synonyms (high weight for synonym matches)
            if (item.synonyms && Array.isArray(item.synonyms)) {
                item.synonyms.forEach(synonym => {
                    if (synonym.toLowerCase().includes(searchTerm)) {
                        score += 8;
                    }
                    searchWords.forEach(word => {
                        if (synonym.toLowerCase().includes(word)) {
                            score += 4;
                        }
                    });
                });
            }

            // Check safety_notes
            if (item.safety_notes && Array.isArray(item.safety_notes)) {
                item.safety_notes.forEach(note => {
                    if (note.toLowerCase().includes(searchTerm)) {
                        score += 2;
                    }
                });
            }

            // Check warnings (legacy)
            if (item.warnings && Array.isArray(item.warnings)) {
                item.warnings.forEach(warning => {
                    if (warning.toLowerCase().includes(searchTerm)) {
                        score += 2;
                    }
                });
            }

        } else if (type === 'task') {
            // Check task title (highest weight)
            if (item.title.toLowerCase().includes(searchTerm)) {
                score += 10;
            }

            // Check individual words in title
            searchWords.forEach(word => {
                if (item.title.toLowerCase().includes(word)) {
                    score += 3;
                }
            });

            // Check keywords (high weight)
            if (item.keywords && Array.isArray(item.keywords)) {
                item.keywords.forEach(keyword => {
                    if (keyword.toLowerCase().includes(searchTerm)) {
                        score += 8;
                    }
                    searchWords.forEach(word => {
                        if (keyword.toLowerCase().includes(word)) {
                            score += 4;
                        }
                    });
                });
            }

            // Check steps
            if (item.steps && Array.isArray(item.steps)) {
                item.steps.forEach(step => {
                    if (step.toLowerCase().includes(searchTerm)) {
                        score += 2;
                    }
                });
            }

            // Check safety_notes (legacy field name)
            if (item.safety_notes && Array.isArray(item.safety_notes)) {
                item.safety_notes.forEach(note => {
                    if (note.toLowerCase().includes(searchTerm)) {
                        score += 2;
                    }
                });
            }

            // Check safety_warnings (new field name)
            if (item.safety_warnings && Array.isArray(item.safety_warnings)) {
                item.safety_warnings.forEach(warning => {
                    if (warning.toLowerCase().includes(searchTerm)) {
                        score += 2;
                    }
                });
            }
        }

        return score;
    },

    /**
     * Display search results
     * @param {Array} results - Array of search results
     */
    displayResults(results) {
        if (results.length === 0) {
            this.resultsContainer.innerHTML = `
                <div class="search-result-item">
                    <span class="result-title">No results found</span>
                    <span class="result-type">Try different keywords</span>
                </div>
            `;
            this.showResults();
            return;
        }

        const html = results.map(result => {
            const typeLabel = result.type === 'system' ? 'System' : 'Task';
            const categoryInfo = result.category ? ` • ${result.category}` : '';
            const systemInfo = result.system ? ` • ${this.getSystemName(result.system)}` : '';
            
            return `
                <div class="search-result-item" 
                     data-type="${result.type}" 
                     data-id="${result.id}"
                     tabindex="0"
                     role="button"
                     aria-label="${this.escapeHtml(result.title)}">
                    <span class="result-title">${this.escapeHtml(result.title)}</span>
                    <span class="result-type">${typeLabel}${categoryInfo}${systemInfo}</span>
                </div>
            `;
        }).join('');

        this.resultsContainer.innerHTML = html;

        // Add click handlers
        this.resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                this.handleResultClick(item.dataset.type, item.dataset.id);
            });
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleResultClick(item.dataset.type, item.dataset.id);
                }
            });
        });

        this.showResults();
    },

    /**
     * Handle click on a search result
     * @param {string} type - Result type ('system' or 'task')
     * @param {string} id - Result ID
     */
    handleResultClick(type, id) {
        this.hideResults();
        this.searchInput.value = '';

        if (type === 'system') {
            App.selectSystem(id);
        } else if (type === 'task') {
            App.showTask(id);
        }
    },

    /**
     * Get system name by ID
     * @param {string} systemId - System ID
     * @returns {string} System name
     */
    getSystemName(systemId) {
        const system = this.systems.find(s => s.id === systemId);
        return system ? system.name : systemId;
    },

    /**
     * Show search results container
     */
    showResults() {
        this.resultsContainer.classList.remove('hidden');
    },

    /**
     * Hide search results container
     */
    hideResults() {
        this.resultsContainer.classList.add('hidden');
    },

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        if (text == null) return '';
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    }
};
