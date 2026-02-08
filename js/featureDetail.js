/**
 * Bürstner Ixeo I 744 Interactive Manual - Feature Detail View Module
 * 
 * Renders full-screen detail views for each feature route.
 * Includes hero image slot, title, purpose, and structured sections.
 */

const FeatureDetail = {
    container: null,

    /**
     * Initialize the feature detail module
     */
    init() {
        this.container = document.getElementById('feature-detail');
    },

    /**
     * Render a feature's full-screen detail view
     * @param {Object} system - System/feature object
     * @param {Array} relatedTasks - Tasks related to this system
     */
    async render(system, relatedTasks) {
        if (!this.container) {
            this.container = document.getElementById('feature-detail');
        }

        // Show the detail view
        this.show();

        // Get image validation status
        const imageValidation = await ImageValidator.validateFeatureImages(system.id);
        const verificationStatus = await ImageValidator.getVerificationStatus(system);

        // Build the detail view HTML
        const html = await this.buildDetailHTML(system, relatedTasks, imageValidation, verificationStatus);
        this.container.innerHTML = html;

        // Setup event listeners
        this.setupEventListeners();
    },

    /**
     * Build the full detail view HTML
     */
    async buildDetailHTML(system, relatedTasks, imageValidation, verificationStatus) {
        // Hero image section
        const heroImageHtml = await ImageValidator.renderHeroImage(system.id);

        // Verification badge
        const verificationBadgeHtml = this.buildVerificationBadge(verificationStatus);

        // Safety notes section
        const safetyNotesHtml = this.buildSafetyNotes(system.safety_notes);

        // Related tasks section
        const tasksHtml = this.buildRelatedTasks(relatedTasks, system.id);

        // Additional images gallery
        const galleryHtml = await this.buildImageGallery(system.id, imageValidation);

        return `
            <div class="feature-detail-view">
                <header class="feature-detail-header">
                    <button class="back-button" aria-label="Back to home">
                        <span class="back-icon">←</span>
                        <span class="back-text">Back</span>
                    </button>
                    <div class="feature-category">${this.escapeHtml(system.category || 'General')}</div>
                </header>

                <div class="feature-hero-section">
                    ${heroImageHtml}
                </div>

                <div class="feature-content">
                    <div class="feature-title-section">
                        <h1 class="feature-title">${this.escapeHtml(system.name)}</h1>
                        ${verificationBadgeHtml}
                    </div>

                    <section class="feature-section purpose-section">
                        <h2 class="section-title">Purpose</h2>
                        <p class="feature-description">${this.escapeHtml(system.description)}</p>
                    </section>

                    ${safetyNotesHtml}

                    ${galleryHtml}

                    ${tasksHtml}
                </div>
            </div>
        `;
    },

    /**
     * Build verification badge HTML
     */
    buildVerificationBadge(verificationStatus) {
        if (verificationStatus.blocked) {
            return `
                <div class="verification-badge blocked">
                    <span class="badge-icon">🚫</span>
                    <span class="badge-text">Cannot Verify - ${this.escapeHtml(verificationStatus.reason)}</span>
                </div>
            `;
        }

        if (verificationStatus.status === 'owner-confirmed') {
            return `
                <div class="verification-badge verified-owner">
                    <span class="badge-icon">✓</span>
                    <span class="badge-text">Owner Confirmed</span>
                </div>
            `;
        }

        if (verificationStatus.status === 'manual-verified') {
            return `
                <div class="verification-badge verified-manual">
                    <span class="badge-icon">📖</span>
                    <span class="badge-text">Manual Verified</span>
                </div>
            `;
        }

        return `
            <div class="verification-badge unverified">
                <span class="badge-icon">⏳</span>
                <span class="badge-text">Pending Verification</span>
            </div>
        `;
    },

    /**
     * Build safety notes section HTML
     */
    buildSafetyNotes(safetyNotes) {
        if (!safetyNotes || safetyNotes.length === 0) {
            return '';
        }

        const notesList = safetyNotes.map(note => 
            `<li>${this.escapeHtml(note)}</li>`
        ).join('');

        return `
            <section class="feature-section safety-section">
                <h2 class="section-title">
                    <span class="section-icon">⚠️</span>
                    Safety Notes
                </h2>
                <ul class="safety-notes-list">
                    ${notesList}
                </ul>
            </section>
        `;
    },

    /**
     * Build image gallery section HTML
     */
    async buildImageGallery(featureId, imageValidation) {
        if (!imageValidation.required || imageValidation.required.length <= 1) {
            return '';
        }

        // Skip the first image (hero) and show the rest
        const additionalImages = imageValidation.required.slice(1);
        
        if (additionalImages.length === 0) {
            return '';
        }

        const imagesHtml = additionalImages.map(img => {
            return ImageValidator.createImageOrPlaceholder(img, img.exists, false);
        }).join('');

        return `
            <section class="feature-section gallery-section">
                <h2 class="section-title">
                    <span class="section-icon">📸</span>
                    Reference Images
                </h2>
                <div class="gallery-grid">
                    ${imagesHtml}
                </div>
            </section>
        `;
    },

    /**
     * Build related tasks section HTML
     */
    buildRelatedTasks(tasks, systemId) {
        if (!tasks || tasks.length === 0) {
            return `
                <section class="feature-section tasks-section">
                    <h2 class="section-title">
                        <span class="section-icon">📋</span>
                        Related Tasks
                    </h2>
                    <p class="no-tasks">No tasks available for this feature.</p>
                </section>
            `;
        }

        const tasksList = tasks.map(task => `
            <a href="${Router.taskRoute(systemId, task.id)}" class="task-link-card">
                <h3 class="task-link-title">${this.escapeHtml(task.title)}</h3>
                <span class="task-link-arrow">→</span>
            </a>
        `).join('');

        return `
            <section class="feature-section tasks-section">
                <h2 class="section-title">
                    <span class="section-icon">📋</span>
                    Related Tasks
                </h2>
                <div class="tasks-list">
                    ${tasksList}
                </div>
            </section>
        `;
    },

    /**
     * Setup event listeners for the detail view
     */
    setupEventListeners() {
        // Back button
        const backBtn = this.container.querySelector('.back-button');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                Router.navigate('/');
            });
        }

        // Image lightbox
        this.setupLightbox();
    },

    /**
     * Setup lightbox for images
     */
    setupLightbox() {
        const images = this.container.querySelectorAll('.feature-image img');
        images.forEach(img => {
            img.addEventListener('click', () => {
                this.openLightbox(img.src, img.alt);
            });
        });
    },

    /**
     * Open lightbox with image
     */
    openLightbox(src, alt) {
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

            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                    lightbox.classList.remove('active');
                }
            });
        }

        const lightboxImg = lightbox.querySelector('.lightbox-content');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightboxCaption.textContent = alt;
        
        lightbox.classList.add('active');
    },

    /**
     * Show the detail view
     */
    show() {
        if (this.container) {
            this.container.classList.remove('hidden');
        }
        // Hide home view
        const homeView = document.getElementById('home-view');
        if (homeView) {
            homeView.classList.add('hidden');
        }
    },

    /**
     * Hide the detail view
     */
    hide() {
        if (this.container) {
            this.container.classList.add('hidden');
        }
        // Show home view
        const homeView = document.getElementById('home-view');
        if (homeView) {
            homeView.classList.remove('hidden');
        }
    },

    /**
     * Escape HTML
     */
    escapeHtml(text) {
        if (text == null) return '';
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    }
};


/**
 * Task Detail View Module
 * Renders full-screen task detail view
 */
const TaskDetail = {
    container: null,

    /**
     * Initialize the task detail module
     */
    init() {
        this.container = document.getElementById('feature-detail');
    },

    /**
     * Render a task's full-screen detail view
     * @param {Object} task - Task object
     * @param {Object} system - Parent system object
     */
    async render(task, system) {
        if (!this.container) {
            this.container = document.getElementById('feature-detail');
        }

        // Show the detail view
        FeatureDetail.show();

        // Build the detail view HTML
        const html = this.buildTaskHTML(task, system);
        this.container.innerHTML = html;

        // Setup event listeners
        this.setupEventListeners(system);
    },

    /**
     * Build the task detail view HTML
     */
    buildTaskHTML(task, system) {
        const stepsHtml = this.buildSteps(task.steps);
        const safetyHtml = this.buildSafetyWarnings(task.safety_warnings || task.safety_notes);
        const linkedSystemsHtml = this.buildLinkedSystems(task.linked_system_ids);

        return `
            <div class="task-detail-view">
                <header class="feature-detail-header">
                    <button class="back-button" aria-label="Back to feature">
                        <span class="back-icon">←</span>
                        <span class="back-text">Back to ${this.escapeHtml(system.name)}</span>
                    </button>
                    <div class="feature-category">${this.escapeHtml(system.category || 'General')}</div>
                </header>

                <div class="feature-content">
                    <div class="feature-title-section">
                        <h1 class="feature-title">${this.escapeHtml(task.title)}</h1>
                    </div>

                    ${stepsHtml}

                    ${safetyHtml}

                    ${linkedSystemsHtml}
                </div>
            </div>
        `;
    },

    /**
     * Build steps section HTML
     */
    buildSteps(steps) {
        if (!steps || steps.length === 0) {
            return '';
        }

        const stepsList = steps.map((step, index) => `
            <li class="step-item">
                <span class="step-number">${index + 1}</span>
                <span class="step-text">${this.escapeHtml(step)}</span>
            </li>
        `).join('');

        return `
            <section class="feature-section steps-section">
                <h2 class="section-title">
                    <span class="section-icon">📝</span>
                    Steps
                </h2>
                <ol class="steps-list">
                    ${stepsList}
                </ol>
            </section>
        `;
    },

    /**
     * Build safety warnings section HTML
     */
    buildSafetyWarnings(warnings) {
        if (!warnings || warnings.length === 0) {
            return '';
        }

        const warningsList = warnings.map(warning => 
            `<li>${this.escapeHtml(warning)}</li>`
        ).join('');

        return `
            <section class="feature-section safety-section">
                <h2 class="section-title">
                    <span class="section-icon">⚡</span>
                    Safety Warnings
                </h2>
                <ul class="safety-notes-list">
                    ${warningsList}
                </ul>
            </section>
        `;
    },

    /**
     * Build linked systems section HTML
     */
    buildLinkedSystems(linkedIds) {
        if (!linkedIds || linkedIds.length === 0) {
            return '';
        }

        // Get system names from App if available
        let systemLinks = linkedIds;
        if (typeof App !== 'undefined' && App.systems) {
            systemLinks = linkedIds.map(id => {
                const system = App.systems.find(s => s.id === id);
                const name = system ? system.name : id;
                const category = system ? system.category : 'general';
                return { id, name, category };
            });
        }

        const linksList = systemLinks.map(sys => `
            <a href="${Router.featureRoute(sys.category, sys.id)}" class="linked-system-link">
                ${this.escapeHtml(sys.name || sys)}
            </a>
        `).join('');

        return `
            <section class="feature-section linked-section">
                <h2 class="section-title">
                    <span class="section-icon">🔗</span>
                    Related Features
                </h2>
                <div class="linked-systems-list">
                    ${linksList}
                </div>
            </section>
        `;
    },

    /**
     * Setup event listeners for the task view
     */
    setupEventListeners(system) {
        // Back button - go back to the parent feature
        const backBtn = this.container.querySelector('.back-button');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                Router.navigate(Router.featureRoute(system.category, system.id).slice(1));
            });
        }
    },

    /**
     * Escape HTML
     */
    escapeHtml(text) {
        if (text == null) return '';
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    }
};
