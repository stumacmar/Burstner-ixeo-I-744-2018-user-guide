/**
 * Bürstner Ixeo I 744 Interactive Manual - Main Application
 * 
 * Route-based, image-required, mobile-first knowledge app.
 * 
 * Features:
 * - Hash-based routing for dedicated feature views
 * - Image enforcement with blocking placeholders
 * - Full-screen detail views with hero images
 * - Mobile-first responsive design
 */

// UNVERIFIED – requires manual confirmation for specific technical specifications

const App = {
    systems: [],
    tasks: [],
    currentSystem: null,

    // Category icons and display order
    categoryConfig: {
        'Heating': { icon: '🔥', order: 1 },
        'Power': { icon: '⚡', order: 2 },
        'Water': { icon: '💧', order: 3 },
        'Safety': { icon: '🛡️', order: 4 },
        'Beds': { icon: '🛏️', order: 5 },
        'Media': { icon: '📺', order: 6 },
        'Comfort': { icon: '🏠', order: 7 },
        'Exterior': { icon: '🏕️', order: 8 }
    },

    /**
     * Initialize the application
     */
    async init() {
        try {
            // Load data files
            await this.loadData();
            
            // Setup router
            this.setupRouter();
            
            // Render systems grouped by category (for home view)
            this.renderSystemsByCategory();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize router (handles initial route)
            Router.init();
            
            console.log('Bürstner Ixeo I 744 Manual loaded successfully');
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError('Failed to load manual data. Please refresh the page.');
        }
    },

    /**
     * Setup route handlers
     */
    setupRouter() {
        // Home route - show system tiles
        Router.register('home', () => {
            this.showHomeView();
        });

        // Feature route - show feature detail
        Router.register('feature', async (category, id) => {
            await this.showFeatureDetail(category, id);
        });

        // Task route - show task detail
        Router.register('task', async (systemId, taskId) => {
            await this.showTaskDetail(systemId, taskId);
        });
    },

    /**
     * Show home view with system tiles
     */
    showHomeView() {
        FeatureDetail.hide();
        const homeView = document.getElementById('home-view');
        if (homeView) {
            homeView.classList.remove('hidden');
        }
    },

    /**
     * Show feature detail view
     */
    async showFeatureDetail(category, id) {
        const system = this.systems.find(s => s.id === id);
        
        if (!system) {
            console.error('System not found:', id);
            Router.navigate('/');
            return;
        }

        this.currentSystem = system;

        // Get related tasks
        const relatedTasks = this.tasks.filter(task => 
            task.system === id || 
            (task.linked_system_ids && task.linked_system_ids.includes(id))
        );

        // Render detail view
        await FeatureDetail.render(system, relatedTasks);
    },

    /**
     * Show task detail view
     */
    async showTaskDetail(systemId, taskId) {
        const system = this.systems.find(s => s.id === systemId);
        const task = this.tasks.find(t => t.id === taskId);

        if (!system || !task) {
            console.error('System or task not found:', systemId, taskId);
            Router.navigate('/');
            return;
        }

        await TaskDetail.render(task, system);
    },

    /**
     * Load systems and tasks data from JSON files
     */
    async loadData() {
        try {
            // Load both data files in parallel
            const [systemsResponse, tasksResponse] = await Promise.all([
                fetch('data/systems.json'),
                fetch('data/tasks.json')
            ]);

            if (!systemsResponse.ok || !tasksResponse.ok) {
                throw new Error('Failed to fetch data files');
            }

            const systemsData = await systemsResponse.json();
            const tasksData = await tasksResponse.json();

            this.systems = systemsData.systems;
            this.tasks = tasksData.tasks;

            // Initialize search with loaded data
            if (typeof Search !== 'undefined') {
                Search.init(this.systems, this.tasks);
            }

            // Initialize tasks module
            if (typeof Tasks !== 'undefined') {
                Tasks.init(this.tasks);
            }

        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    },

    /**
     * Render systems grouped by category
     */
    renderSystemsByCategory() {
        const container = document.getElementById('systems-by-category');
        if (!container) return;

        // Group systems by category
        const categories = {};
        this.systems.forEach(system => {
            const category = system.category || 'Other';
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(system);
        });

        // Sort categories by configured order
        const sortedCategories = Object.keys(categories).sort((a, b) => {
            const orderA = this.categoryConfig[a]?.order || 999;
            const orderB = this.categoryConfig[b]?.order || 999;
            return orderA - orderB;
        });

        // Render each category
        let html = '';
        sortedCategories.forEach(category => {
            const config = this.categoryConfig[category] || { icon: '📋', order: 999 };
            const systems = categories[category];
            
            html += `
                <div class="category-group">
                    <h3 class="category-title">
                        <span class="category-icon">${config.icon}</span>
                        ${this.escapeHtml(category)}
                    </h3>
                    <div class="system-buttons">
                        ${systems.map(system => this.createSystemButton(system)).join('')}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    /**
     * Create a system button HTML - now renders as route link
     * @param {Object} system - System object
     * @returns {string} HTML string for the button
     */
    createSystemButton(system) {
        const icon = this.getSystemIcon(system);
        const route = Router.featureRoute(system.category, system.id);
        let verificationBadge = '';
        if (system.verification_status === 'owner-confirmed') {
            verificationBadge = '<span class="verified-badge owner" title="Owner confirmed">✓</span>';
        } else if (system.verification_status === 'manual-verified') {
            verificationBadge = '<span class="verified-badge manual" title="Manual verified">📖</span>';
        }
        
        return `
            <a href="${route}" class="system-btn" data-system="${this.escapeAttr(system.id)}">
                <span class="icon">${icon}</span>
                <span class="label">${this.escapeHtml(system.name)}${verificationBadge}</span>
            </a>
        `;
    },

    /**
     * Get icon for a system based on its category or name
     * @param {Object} system - System object
     * @returns {string} Emoji icon
     */
    getSystemIcon(system) {
        // Specific system icons
        const systemIcons = {
            'alde-heating': '🔥',
            'fridge-3way': '❄️',
            'solar-system': '☀️',
            'camera-360': '📹',
            'camera-reversing': '🎥',
            'tv-front': '📺',
            'tv-rear': '📺',
            'bed-dropdown-rear': '🛏️',
            'bed-pulldown-dinette': '🛏️',
            'blinds-flyscreens': '🪟',
            'heat-shield-front': '🌡️',
            'awning': '⛱️',
            'outdoor-shower': '🚿',
            'bbq-point': '🍖',
            'outdoor-tv-point': '📺',
            'gas-storage': '🔥',
            'cassette-toilet': '🚽',
            'fresh-water-external': '💧',
            'alarm-system': '🚨',
            'vehicle-tracker': '📍',
            'internet-5g': '📶',
            'control-panel': '🎛️',
            'mains-charger': '🔌',
            'driving-safety': '🚗',
            'problems': '⚠️'
        };

        return systemIcons[system.id] || this.categoryConfig[system.category]?.icon || '📋';
    },

    /**
     * Set up event listeners for system buttons
     */
    setupEventListeners() {
        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            const searchSection = document.querySelector('.search-section');
            if (searchSection && !searchSection.contains(e.target)) {
                Search.hideResults();
            }
        });

        // Handle escape key for back navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const currentRoute = Router.getCurrentRoute();
                if (currentRoute.type !== 'home') {
                    Router.navigate('/');
                }
            }
        });
    },

    /**
     * Select and display a system - now navigates to route
     * @param {string} systemId - The ID of the system to display
     */
    selectSystem(systemId) {
        const system = this.systems.find(s => s.id === systemId);
        
        if (!system) {
            console.error('System not found:', systemId);
            return;
        }

        // Navigate to the feature route
        Router.navigate(Router.featureRoute(system.category, system.id).slice(1));
    },

    /**
     * Display system information (kept for search integration)
     * @param {Object} system - The system object to display
     */
    displaySystemInfo(system) {
        // This is now handled by FeatureDetail.render()
        // Kept for backwards compatibility with search
        this.selectSystem(system.id);
    },

    /**
     * Create an image gallery HTML
     * @param {Array} images - Array of image objects
     * @param {string} className - Additional CSS class
     * @returns {string} HTML string for the gallery
     */
    createImageGallery(images, className = '') {
        const galleryItems = images.map((img, index) => `
            <div class="gallery-item" data-gallery-index="${index}">
                <img src="${this.escapeAttr(img.src)}" 
                     alt="${this.escapeAttr(img.alt)}"
                     data-caption="${this.escapeAttr(img.caption || img.alt)}"
                     data-fallback-alt="${this.escapeAttr(img.alt)}"
                     loading="lazy">
                <div class="caption">${this.escapeHtml(img.caption || '')}</div>
            </div>
        `).join('');

        return `
            <div class="image-gallery ${className}">
                <h5>📸 Reference Photos</h5>
                <div class="gallery-grid">
                    ${galleryItems}
                </div>
            </div>
        `;
    },

    /**
     * Set up lightbox functionality for images
     */
    setupLightbox() {
        // Create lightbox if it doesn't exist
        let lightbox = document.getElementById('lightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.id = 'lightbox';
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <button class="lightbox-close" aria-label="Close">×</button>
                <img class="lightbox-content" src="" alt="">
                <div class="lightbox-caption"></div>
            `;
            document.body.appendChild(lightbox);

            // Close on click outside or close button
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                    lightbox.classList.remove('active');
                }
            });

            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                    lightbox.classList.remove('active');
                }
            });
        }

        // Add click handlers to gallery images
        document.querySelectorAll('.gallery-item img').forEach(img => {
            // Prevent duplicate lightbox click handler attachment
            if (!img.dataset.lightboxHandlerAttached) {
                img.dataset.lightboxHandlerAttached = 'true';

                img.addEventListener('click', () => {
                    const lightboxImg = lightbox.querySelector('.lightbox-content');
                    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
                    
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;
                    lightboxCaption.textContent = img.dataset.caption || img.alt;
                    
                    lightbox.classList.add('active');
                });
            }
        });
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
    },

    /**
     * Show empty state when no system is selected
     */
    showEmptyState() {
        const tasksContainer = document.getElementById('tasks-container');
        tasksContainer.innerHTML = `
            <div class="empty-state">
                <div class="icon">📖</div>
                <p>Select a system above or search for a task</p>
            </div>
        `;
    },

    /**
     * Show error message to user
     * @param {string} message - Error message to display
     */
    showError(message) {
        const tasksContainer = document.getElementById('tasks-container');
        tasksContainer.innerHTML = `
            <div class="empty-state">
                <div class="icon">⚠️</div>
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
    },

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Navigate to a specific task
     * @param {string} taskId - The ID of the task to display
     */
    /**
     * Navigate to a specific task - now uses routing
     * @param {string} taskId - The ID of the task to display
     */
    showTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        
        if (!task) {
            console.error('Task not found:', taskId);
            return;
        }

        // Navigate to the task route
        Router.navigate(`task/${task.system}/${task.id}`);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
