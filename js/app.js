/**
 * Bürstner Ixeo I 744 Interactive Manual - Main Application
 * 
 * Icon-only, mobile-first interactive user guide.
 * NO images required - uses emoji icons for all system representations.
 * 
 * Features:
 * - Responsive icon grid layout
 * - Tap-to-expand detail view
 * - Back button navigation
 * - Keyboard accessible
 */

const App = {
    currentSystem: null,

    /**
     * Initialize the application
     */
    init() {
        // Render icon grid
        this.renderSystemGrid();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Handle initial URL hash if present
        this.handleHashRoute();
        
        console.log('Bürstner Ixeo I 744 Manual loaded successfully');
    },

    /**
     * Render the system icon grid
     */
    renderSystemGrid() {
        const grid = document.getElementById('system-grid');
        if (!grid) return;

        // Group systems by category
        const categories = {};
        SYSTEMS.forEach(system => {
            const category = system.category || 'Other';
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(system);
        });

        // Sort categories by configured order
        const sortedCategories = Object.keys(categories).sort((a, b) => {
            const orderA = CATEGORIES[a]?.order || 999;
            const orderB = CATEGORIES[b]?.order || 999;
            return orderA - orderB;
        });

        // Build HTML for each category group
        let html = '';
        sortedCategories.forEach(category => {
            const categoryConfig = CATEGORIES[category] || { icon: '📋', order: 999 };
            const systems = categories[category];
            
            html += `
                <div class="category-group">
                    <h3 class="category-title">
                        <span class="category-icon">${categoryConfig.icon}</span>
                        ${this.escapeHtml(category)}
                    </h3>
                    <div class="system-buttons">
                        ${systems.map(system => this.createSystemCard(system)).join('')}
                    </div>
                </div>
            `;
        });

        grid.innerHTML = html;
    },

    /**
     * Create a system card button
     * @param {Object} system - System object from SYSTEMS array
     * @returns {string} HTML string for the card
     */
    createSystemCard(system) {
        return `
            <button class="system-card" 
                    data-system="${this.escapeAttr(system.id)}"
                    aria-label="${this.escapeAttr(system.title)}">
                <span class="card-icon" aria-hidden="true">${system.icon}</span>
                <span class="card-label">${this.escapeHtml(system.title)}</span>
            </button>
        `;
    },

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Delegate click events for system cards
        const grid = document.getElementById('system-grid');
        if (grid) {
            grid.addEventListener('click', (e) => {
                const card = e.target.closest('.system-card');
                if (card) {
                    const systemId = card.dataset.system;
                    this.showSystemDetail(systemId);
                }
            });
        }

        // Handle hash changes for back/forward navigation
        window.addEventListener('hashchange', () => {
            this.handleHashRoute();
        });

        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
            
            // Close search on escape
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    searchInput.value = '';
                    this.hideSearchResults();
                    searchInput.blur();
                }
            });
        }

        // Close search when clicking outside
        document.addEventListener('click', (e) => {
            const searchSection = document.querySelector('.search-section');
            if (searchSection && !searchSection.contains(e.target)) {
                this.hideSearchResults();
            }
        });

        // Handle escape key for back navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.showHomeView();
            }
        });
    },

    /**
     * Handle URL hash routing
     */
    handleHashRoute() {
        const hash = window.location.hash.slice(1);
        
        if (hash) {
            // Try to find matching system
            const system = SYSTEMS.find(s => s.id === hash);
            if (system) {
                this.showSystemDetail(hash, false); // false = don't update hash again
            } else {
                this.showHomeView();
            }
        } else {
            this.showHomeView();
        }
    },

    /**
     * Show system detail view
     * @param {string} systemId - System ID to display
     * @param {boolean} updateHash - Whether to update URL hash
     */
    showSystemDetail(systemId, updateHash = true) {
        const system = SYSTEMS.find(s => s.id === systemId);
        if (!system) {
            console.error('System not found:', systemId);
            return;
        }

        this.currentSystem = system;

        // Update URL hash
        if (updateHash) {
            window.location.hash = systemId;
        }

        // Hide home view
        const homeView = document.getElementById('home-view');
        if (homeView) {
            homeView.classList.add('hidden');
        }

        // Show and populate detail view
        const detailView = document.getElementById('system-detail');
        if (detailView) {
            detailView.innerHTML = this.buildDetailHTML(system);
            detailView.classList.remove('hidden');
            
            // Setup back button
            const backBtn = detailView.querySelector('.back-button');
            if (backBtn) {
                backBtn.addEventListener('click', () => {
                    this.showHomeView();
                });
            }

            // Scroll to top
            window.scrollTo(0, 0);
        }
    },

    /**
     * Build HTML for system detail view
     * @param {Object} system - System object
     * @returns {string} HTML string
     */
    buildDetailHTML(system) {
        const bulletsHtml = system.bullets && system.bullets.length > 0
            ? `<section class="detail-section info-section">
                <h3 class="section-title"><span class="section-icon">ℹ️</span> Key Information</h3>
                <ul class="bullet-list">
                    ${system.bullets.map(b => `<li>${this.escapeHtml(b)}</li>`).join('')}
                </ul>
               </section>`
            : '';

        const stepsHtml = system.steps && system.steps.length > 0
            ? `<section class="detail-section steps-section">
                <h3 class="section-title"><span class="section-icon">📝</span> How To Use</h3>
                <ol class="steps-list">
                    ${system.steps.map((step, i) => `
                        <li class="step-item">
                            <span class="step-number">${i + 1}</span>
                            <span class="step-text">${this.escapeHtml(step)}</span>
                        </li>
                    `).join('')}
                </ol>
               </section>`
            : '';

        const safetyHtml = system.safety && system.safety.length > 0
            ? `<section class="detail-section safety-section">
                <h3 class="section-title"><span class="section-icon">⚠️</span> Safety Notes</h3>
                <ul class="safety-list">
                    ${system.safety.map(s => `<li>${this.escapeHtml(s)}</li>`).join('')}
                </ul>
               </section>`
            : '';

        return `
            <header class="detail-header">
                <button class="back-button" aria-label="Back to systems">
                    <span class="back-icon">←</span>
                    <span class="back-text">Back</span>
                </button>
                <span class="detail-category">${this.escapeHtml(system.category || 'General')}</span>
            </header>

            <div class="detail-content">
                <div class="detail-hero">
                    <span class="hero-icon">${system.icon}</span>
                    <h2 class="detail-title">${this.escapeHtml(system.title)}</h2>
                </div>

                ${bulletsHtml}
                ${stepsHtml}
                ${safetyHtml}
            </div>
        `;
    },

    /**
     * Show home view (system grid)
     */
    showHomeView() {
        // Update URL hash
        history.pushState(null, '', window.location.pathname);

        // Hide detail view
        const detailView = document.getElementById('system-detail');
        if (detailView) {
            detailView.classList.add('hidden');
        }

        // Show home view
        const homeView = document.getElementById('home-view');
        if (homeView) {
            homeView.classList.remove('hidden');
        }

        this.currentSystem = null;
    },

    /**
     * Handle search input
     * @param {string} query - Search query
     */
    handleSearch(query) {
        const searchTerm = query.trim().toLowerCase();
        
        if (searchTerm.length < 2) {
            this.hideSearchResults();
            return;
        }

        const results = [];

        SYSTEMS.forEach(system => {
            let score = 0;

            // Check title
            if (system.title.toLowerCase().includes(searchTerm)) {
                score += 10;
            }

            // Check category
            if (system.category && system.category.toLowerCase().includes(searchTerm)) {
                score += 5;
            }

            // Check bullets
            if (system.bullets) {
                system.bullets.forEach(bullet => {
                    if (bullet.toLowerCase().includes(searchTerm)) {
                        score += 3;
                    }
                });
            }

            // Check steps
            if (system.steps) {
                system.steps.forEach(step => {
                    if (step.toLowerCase().includes(searchTerm)) {
                        score += 2;
                    }
                });
            }

            if (score > 0) {
                results.push({ system, score });
            }
        });

        // Sort by score
        results.sort((a, b) => b.score - a.score);

        this.displaySearchResults(results.slice(0, 8));
    },

    /**
     * Display search results
     * @param {Array} results - Array of {system, score} objects
     */
    displaySearchResults(results) {
        const container = document.getElementById('search-results');
        if (!container) return;

        if (results.length === 0) {
            container.innerHTML = `
                <div class="search-result-item no-results">
                    <span class="result-title">No results found</span>
                    <span class="result-type">Try different keywords</span>
                </div>
            `;
        } else {
            container.innerHTML = results.map(({ system }) => `
                <div class="search-result-item" 
                     data-system="${this.escapeAttr(system.id)}"
                     tabindex="0"
                     role="button">
                    <span class="result-icon">${system.icon}</span>
                    <span class="result-title">${this.escapeHtml(system.title)}</span>
                    <span class="result-type">${this.escapeHtml(system.category)}</span>
                </div>
            `).join('');

            // Add click handlers
            container.querySelectorAll('.search-result-item[data-system]').forEach(item => {
                item.addEventListener('click', () => {
                    this.showSystemDetail(item.dataset.system);
                    document.getElementById('search-input').value = '';
                    this.hideSearchResults();
                });
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.showSystemDetail(item.dataset.system);
                        document.getElementById('search-input').value = '';
                        this.hideSearchResults();
                    }
                });
            });
        }

        container.classList.remove('hidden');
    },

    /**
     * Hide search results
     */
    hideSearchResults() {
        const container = document.getElementById('search-results');
        if (container) {
            container.classList.add('hidden');
        }
    },

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        if (text === null || text === undefined) return '';
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    },

    /**
     * Escape attribute value
     * @param {string} text - Text to escape
     * @returns {string} Escaped text safe for attributes
     */
    escapeAttr(text) {
        if (text == null) return '';
        return String(text).replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[char]);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
