/**
 * Bürstner Ixeo I 744 Interactive Manual - Router Module
 * 
 * Hash-based routing for mobile-first single-page application.
 * Converts feature tiles into dedicated routes:
 *   e.g., #/heating/alde, #/media/avtex-front
 */

const Router = {
    routes: {},
    currentRoute: null,

    /**
     * Initialize the router
     */
    init() {
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // Handle initial route on page load
        this.handleRoute();
    },

    /**
     * Register a route handler
     * @param {string} pattern - Route pattern (e.g., 'home', 'feature/:category/:id')
     * @param {Function} handler - Handler function for this route
     */
    register(pattern, handler) {
        this.routes[pattern] = handler;
    },

    /**
     * Navigate to a route
     * @param {string} path - Route path to navigate to
     */
    navigate(path) {
        window.location.hash = path;
    },

    /**
     * Handle current route
     */
    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        this.currentRoute = hash;

        // Parse route
        const routeInfo = this.parseRoute(hash);

        // Find matching handler
        if (routeInfo.type === 'home' && this.routes['home']) {
            this.routes['home']();
        } else if (routeInfo.type === 'feature' && this.routes['feature']) {
            this.routes['feature'](routeInfo.category, routeInfo.id);
        } else if (routeInfo.type === 'task' && this.routes['task']) {
            this.routes['task'](routeInfo.systemId, routeInfo.taskId);
        } else {
            // Default to home
            if (this.routes['home']) {
                this.routes['home']();
            }
        }
    },

    /**
     * Parse route path into components
     * @param {string} path - Route path
     * @returns {Object} Parsed route info
     */
    parseRoute(path) {
        const parts = path.split('/').filter(p => p);

        if (parts.length === 0) {
            return { type: 'home' };
        }

        // Route: /feature/:category/:id
        if (parts.length === 2) {
            return {
                type: 'feature',
                category: parts[0],
                id: parts[1]
            };
        }

        // Route: /task/:systemId/:taskId
        if (parts.length === 3 && parts[0] === 'task') {
            return {
                type: 'task',
                systemId: parts[1],
                taskId: parts[2]
            };
        }

        return { type: 'home' };
    },

    /**
     * Generate route path for a feature
     * @param {string} category - Feature category
     * @param {string} id - Feature ID
     * @returns {string} Route path
     */
    featureRoute(category, id) {
        const categorySlug = this.slugify(category);
        return `#/${categorySlug}/${id}`;
    },

    /**
     * Generate route path for a task
     * @param {string} systemId - System ID
     * @param {string} taskId - Task ID
     * @returns {string} Route path
     */
    taskRoute(systemId, taskId) {
        return `#/task/${systemId}/${taskId}`;
    },

    /**
     * Get current route info
     * @returns {Object} Current route info
     */
    getCurrentRoute() {
        return this.parseRoute(this.currentRoute || '/');
    },

    /**
     * Convert string to URL-safe slug
     * @param {string} str - String to convert
     * @returns {string} URL-safe slug
     */
    slugify(str) {
        return String(str)
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },

    /**
     * Check if current route matches a pattern
     * @param {string} type - Route type to match
     * @returns {boolean} Whether route matches
     */
    isRoute(type) {
        const info = this.getCurrentRoute();
        return info.type === type;
    }
};
