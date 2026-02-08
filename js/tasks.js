/**
 * Bürstner Ixeo I 744 Interactive Manual - Tasks Module
 * 
 * Dynamically renders task cards - no hardcoded HTML task content.
 * All task data comes from the tasks.json data file.
 */

const Tasks = {
    tasks: [],
    container: null,

    /**
     * Initialize the tasks module
     * @param {Array} tasks - Array of task objects
     */
    init(tasks) {
        this.tasks = tasks;
        this.container = document.getElementById('tasks-container');
    },

    /**
     * Render task cards for the given tasks
     * @param {Array} tasksToRender - Array of task objects to render
     */
    render(tasksToRender) {
        if (!this.container) {
            console.error('Tasks container not found');
            return;
        }

        if (!tasksToRender || tasksToRender.length === 0) {
            this.container.innerHTML = `
                <div class="empty-state">
                    <div class="icon">📋</div>
                    <p>No tasks available for this system</p>
                </div>
            `;
            return;
        }

        const html = tasksToRender.map(task => this.createTaskCard(task)).join('');
        this.container.innerHTML = html;

        // Add event listeners for expand/collapse
        this.setupTaskListeners();
    },

    /**
     * Create HTML for a single task card
     * @param {Object} task - Task object
     * @returns {string} HTML string for the task card
     */
    createTaskCard(task) {
        const stepsHtml = this.createStepsList(task.steps);
        // Support both safety_notes (legacy) and safety_warnings (new)
        const safetyHtml = this.createSafetyNotes(task.safety_warnings || task.safety_notes);
        const imagesHtml = this.createImagesGallery(task.images);
        const linkedSystemsHtml = this.createLinkedSystemsList(task.linked_system_ids);

        return `
            <div class="task-card" data-task-id="${this.escapeAttr(task.id)}">
                <div class="task-header" tabindex="0" role="button" aria-expanded="false" aria-controls="task-content-${this.escapeAttr(task.id)}">
                    <h4>${this.escapeHtml(task.title)}</h4>
                    <span class="expand-icon" aria-hidden="true">▼</span>
                </div>
                <div class="task-content" id="task-content-${this.escapeAttr(task.id)}">
                    ${imagesHtml}
                    ${stepsHtml}
                    ${safetyHtml}
                    ${linkedSystemsHtml}
                </div>
            </div>
        `;
    },

    /**
     * Create HTML for linked systems list
     * @param {Array} linkedIds - Array of linked system IDs
     * @returns {string} HTML string for linked systems
     */
    createLinkedSystemsList(linkedIds) {
        if (!linkedIds || linkedIds.length === 0) {
            return '';
        }

        // Get system names from App if available
        let systemNames = linkedIds;
        if (typeof App !== 'undefined' && App.systems) {
            systemNames = linkedIds.map(id => {
                const system = App.systems.find(s => s.id === id);
                return system ? system.name : id;
            });
        }

        return `
            <div class="linked-systems">
                <h5>🔗 Related Systems</h5>
                <ul>
                    ${systemNames.map(name => `<li>${this.escapeHtml(name)}</li>`).join('')}
                </ul>
            </div>
        `;
    },

    /**
     * Create HTML for task images gallery
     * @param {Array} images - Array of image objects
     * @returns {string} HTML string for images gallery
     */
    createImagesGallery(images) {
        if (!images || images.length === 0) {
            return '';
        }

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
            <div class="image-gallery task-images">
                <h5>📸 Reference Photos</h5>
                <div class="gallery-grid">
                    ${galleryItems}
                </div>
            </div>
        `;
    },

    /**
     * Create HTML for task steps list
     * @param {Array} steps - Array of step strings
     * @returns {string} HTML string for steps
     */
    createStepsList(steps) {
        if (!steps || steps.length === 0) {
            return '';
        }

        const stepsListItems = steps.map(step => `<li>${this.escapeHtml(step)}</li>`).join('');

        return `
            <div class="task-steps">
                <h5>Steps</h5>
                <ol>
                    ${stepsListItems}
                </ol>
            </div>
        `;
    },

    /**
     * Create HTML for safety notes
     * @param {Array} notes - Array of safety note strings
     * @returns {string} HTML string for safety notes
     */
    createSafetyNotes(notes) {
        if (!notes || notes.length === 0) {
            return '';
        }

        const notesListItems = notes.map(note => `<li>${this.escapeHtml(note)}</li>`).join('');

        return `
            <div class="safety-notes">
                <h5>⚡ Safety Notes</h5>
                <ul>
                    ${notesListItems}
                </ul>
            </div>
        `;
    },

    /**
     * Set up event listeners for task expand/collapse
     */
    setupTaskListeners() {
        const taskHeaders = this.container.querySelectorAll('.task-header');

        taskHeaders.forEach(header => {
            header.addEventListener('click', () => {
                this.toggleTask(header);
            });

            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTask(header);
                }
            });
        });

        // Set up lightbox for task images
        if (typeof App !== 'undefined' && App.setupLightbox) {
            App.setupLightbox();
        }
    },

    /**
     * Toggle task expand/collapse state
     * @param {HTMLElement} header - The task header element
     */
    toggleTask(header) {
        const card = header.closest('.task-card');
        const isExpanded = card.classList.contains('expanded');

        // Update aria-expanded
        header.setAttribute('aria-expanded', !isExpanded);

        // Toggle expanded class
        card.classList.toggle('expanded');
    },

    /**
     * Expand a specific task by ID
     * @param {string} taskId - The task ID to expand
     */
    expandTask(taskId) {
        const card = this.container.querySelector(`[data-task-id="${taskId}"]`);
        
        if (card) {
            // First, collapse all tasks
            this.container.querySelectorAll('.task-card').forEach(c => {
                c.classList.remove('expanded');
                const header = c.querySelector('.task-header');
                if (header) {
                    header.setAttribute('aria-expanded', 'false');
                }
            });

            // Expand the target task
            card.classList.add('expanded');
            const header = card.querySelector('.task-header');
            if (header) {
                header.setAttribute('aria-expanded', 'true');
            }

            // Scroll into view
            card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    /**
     * Collapse all tasks
     */
    collapseAll() {
        this.container.querySelectorAll('.task-card').forEach(card => {
            card.classList.remove('expanded');
            const header = card.querySelector('.task-header');
            if (header) {
                header.setAttribute('aria-expanded', 'false');
            }
        });
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
