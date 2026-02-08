/**
 * Bürstner Ixeo I 744 Interactive Manual - Main Application
 * 
 * This is the main application controller that handles:
 * - Loading data from JSON files
 * - Managing system selection
 * - Grouping systems by category
 * - Coordinating between search and tasks modules
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
            
            // Render systems grouped by category
            this.renderSystemsByCategory();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Show initial empty state
            this.showEmptyState();
            
            console.log('Bürstner Ixeo I 744 Manual loaded successfully');
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError('Failed to load manual data. Please refresh the page.');
        }
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
     * Create a system button HTML
     * @param {Object} system - System object
     * @returns {string} HTML string for the button
     */
    createSystemButton(system) {
        const icon = this.getSystemIcon(system);
        const verificationBadge = system.verification_status === 'owner-confirmed' 
            ? '<span class="verified-badge" title="Owner confirmed">✓</span>' 
            : '';
        
        return `
            <button class="system-btn" data-system="${this.escapeAttr(system.id)}">
                <span class="icon">${icon}</span>
                <span class="label">${this.escapeHtml(system.name)}${verificationBadge}</span>
            </button>
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
        // Use event delegation for dynamically created buttons
        document.getElementById('systems-by-category')?.addEventListener('click', (e) => {
            const button = e.target.closest('.system-btn');
            if (button) {
                const systemId = button.dataset.system;
                this.selectSystem(systemId);
            }
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            const searchSection = document.querySelector('.search-section');
            if (searchSection && !searchSection.contains(e.target)) {
                Search.hideResults();
            }
        });
    },

    /**
     * Select and display a system
     * @param {string} systemId - The ID of the system to display
     */
    selectSystem(systemId) {
        // Update active button state
        const buttons = document.querySelectorAll('.system-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.system === systemId);
        });

        // Find the system data
        const system = this.systems.find(s => s.id === systemId);
        
        if (!system) {
            console.error('System not found:', systemId);
            return;
        }

        this.currentSystem = system;

        // Display system info
        this.displaySystemInfo(system);

        // Filter and display tasks for this system (check both system and linked_system_ids)
        const systemTasks = this.tasks.filter(task => 
            task.system === systemId || 
            (task.linked_system_ids && task.linked_system_ids.includes(systemId))
        );
        Tasks.render(systemTasks);

        // Clear search input
        document.getElementById('search-input').value = '';
        Search.hideResults();
    },

    /**
     * Display system information
     * @param {Object} system - The system object to display
     */
    displaySystemInfo(system) {
        const infoContainer = document.getElementById('system-info');
        
        // Build verification status badge
        let verificationHtml = '';
        if (system.verification_status) {
            const isOwnerConfirmed = system.verification_status === 'owner-confirmed';
            const badgeClass = isOwnerConfirmed ? 'verified-owner' : 'verified-manual';
            const badgeText = isOwnerConfirmed ? '✓ Owner Confirmed' : '📖 Manual Verified';
            verificationHtml = `<span class="verification-badge ${badgeClass}">${badgeText}</span>`;
        }

        let safetyNotesHtml = '';
        if (system.safety_notes && system.safety_notes.length > 0) {
            safetyNotesHtml = `
                <div class="system-warnings">
                    <h4>⚠️ Safety Notes</h4>
                    <ul>
                        ${system.safety_notes.map(note => `<li>${this.escapeHtml(note)}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        // Legacy support for 'warnings' field
        let warningsHtml = '';
        if (system.warnings && system.warnings.length > 0 && !system.safety_notes) {
            warningsHtml = `
                <div class="system-warnings">
                    <h4>⚠️ Warnings</h4>
                    <ul>
                        ${system.warnings.map(warning => `<li>${this.escapeHtml(warning)}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        let imagesHtml = '';
        if (system.images && system.images.length > 0) {
            imagesHtml = this.createImageGallery(system.images, 'system-images');
        }

        infoContainer.innerHTML = `
            <div class="system-header">
                <h3>${this.escapeHtml(system.name)}</h3>
                ${verificationHtml}
            </div>
            <p class="system-category"><strong>Category:</strong> ${this.escapeHtml(system.category || 'General')}</p>
            <p>${this.escapeHtml(system.description)}</p>
            ${imagesHtml}
            ${safetyNotesHtml}
            ${warningsHtml}
        `;

        infoContainer.classList.remove('hidden');

        // Set up lightbox for images
        this.setupLightbox();
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
                <p class="image-note">Images are placeholders. Replace with your own photos in /assets/images/</p>
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

        // Add click handlers and error handlers to gallery images
        document.querySelectorAll('.gallery-item img').forEach(img => {
            // Handle image load errors safely - only once
            if (!img.dataset.errorHandled) {
                img.dataset.errorHandled = 'true';
                img.addEventListener('error', function() {
                    // Check if parent still exists and image hasn't been replaced
                    if (this.parentElement && this.parentElement.contains(this)) {
                        const fallbackAlt = this.dataset.fallbackAlt || 'Image not found';
                        const placeholder = document.createElement('div');
                        placeholder.className = 'image-placeholder';
                        placeholder.innerHTML = '<span class="placeholder-icon">📷</span>';
                        const textSpan = document.createElement('span');
                        textSpan.className = 'placeholder-text';
                        textSpan.textContent = fallbackAlt;
                        placeholder.appendChild(textSpan);
                        this.parentElement.replaceChild(placeholder, this);
                    }
                });

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
    showTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        
        if (!task) {
            console.error('Task not found:', taskId);
            return;
        }

        // Select the system this task belongs to
        this.selectSystem(task.system);

        // Expand the specific task after a short delay to allow render
        setTimeout(() => {
            Tasks.expandTask(taskId);
        }, 100);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
