/**
 * Bürstner Ixeo I 744 Interactive Manual - Image Validator Module
 * 
 * Enforces image requirements for features:
 * - Defines required local image paths
 * - Renders blocking placeholders for missing images
 * - Prevents features from being marked "Verified" without images
 */

const ImageValidator = {
    /**
     * Required images manifest for each feature
     * Maps feature ID to array of required image objects
     */
    requiredImages: {
        'alde-heating': [
            { path: 'assets/images/heating/alde/hero.jpg', description: 'Alde control panel hero image' },
            { path: 'assets/images/heating/alde/boiler.jpg', description: 'Alde boiler unit location' },
            { path: 'assets/images/heating/alde/radiator.jpg', description: 'Radiator convector detail' }
        ],
        'fridge-3way': [
            { path: 'assets/images/comfort/fridge/hero.jpg', description: 'Fridge interior view' },
            { path: 'assets/images/comfort/fridge/controls.jpg', description: 'Fridge control panel' },
            { path: 'assets/images/comfort/fridge/vent.jpg', description: 'External fridge vent' }
        ],
        'solar-system': [
            { path: 'assets/images/power/solar/hero.jpg', description: 'Roof-mounted solar panel' },
            { path: 'assets/images/power/solar/controller.jpg', description: 'Solar charge controller' },
            { path: 'assets/images/power/solar/battery.jpg', description: 'Leisure battery bank' }
        ],
        'camera-360': [
            { path: 'assets/images/safety/360-camera/hero.jpg', description: '360° view on dashboard display' },
            { path: 'assets/images/safety/360-camera/front.jpg', description: 'Front camera location' },
            { path: 'assets/images/safety/360-camera/side.jpg', description: 'Side camera under mirror' }
        ],
        'camera-reversing': [
            { path: 'assets/images/safety/reversing-camera/hero.jpg', description: 'Reversing camera display view' },
            { path: 'assets/images/safety/reversing-camera/rear.jpg', description: 'Rear camera location' }
        ],
        'tv-front': [
            { path: 'assets/images/media/tv-front/hero.jpg', description: 'Front cab Avtex TV' },
            { path: 'assets/images/media/tv-front/remote.jpg', description: 'TV remote control' }
        ],
        'tv-rear': [
            { path: 'assets/images/media/tv-rear/hero.jpg', description: 'Rear lounge TV' },
            { path: 'assets/images/media/tv-rear/mount.jpg', description: 'TV mounting bracket' }
        ],
        'bed-dropdown-rear': [
            { path: 'assets/images/beds/dropdown-rear/hero.jpg', description: 'Drop-down bed raised position' },
            { path: 'assets/images/beds/dropdown-rear/lowered.jpg', description: 'Bed lowered for sleeping' },
            { path: 'assets/images/beds/dropdown-rear/controls.jpg', description: 'Electric bed controls' }
        ],
        'bed-pulldown-dinette': [
            { path: 'assets/images/beds/pulldown-dinette/hero.jpg', description: 'Pull-down bed stowed' },
            { path: 'assets/images/beds/pulldown-dinette/deployed.jpg', description: 'Bed deployed' },
            { path: 'assets/images/beds/pulldown-dinette/latch.jpg', description: 'Release latch mechanism' }
        ],
        'blinds-flyscreens': [
            { path: 'assets/images/comfort/blinds/hero.jpg', description: 'Cassette blind in window' },
            { path: 'assets/images/comfort/blinds/flyscreen.jpg', description: 'Flyscreen deployed' },
            { path: 'assets/images/comfort/blinds/skylight.jpg', description: 'Skylight with blind' }
        ],
        'heat-shield-front': [
            { path: 'assets/images/exterior/heat-shield/hero.jpg', description: 'Heat shield fitted to cab' },
            { path: 'assets/images/exterior/heat-shield/storage.jpg', description: 'Folded for storage' }
        ],
        'awning': [
            { path: 'assets/images/exterior/awning/hero.jpg', description: 'Awning fully extended' },
            { path: 'assets/images/exterior/awning/handle.jpg', description: 'Winding handle operation' },
            { path: 'assets/images/exterior/awning/pegs.jpg', description: 'Secured with pegs' }
        ],
        'outdoor-shower': [
            { path: 'assets/images/water/outdoor-shower/hero.jpg', description: 'Outdoor shower connection point' },
            { path: 'assets/images/water/outdoor-shower/use.jpg', description: 'Shower in use' }
        ],
        'bbq-point': [
            { path: 'assets/images/exterior/bbq/hero.jpg', description: 'BBQ gas point location' },
            { path: 'assets/images/exterior/bbq/connected.jpg', description: 'BBQ connected to gas point' }
        ],
        'outdoor-tv-point': [
            { path: 'assets/images/media/outdoor-tv/hero.jpg', description: 'External TV socket' },
            { path: 'assets/images/media/outdoor-tv/setup.jpg', description: 'TV set up under awning' }
        ],
        'gas-storage': [
            { path: 'assets/images/power/gas/hero.jpg', description: 'Gas locker with cylinders' },
            { path: 'assets/images/power/gas/regulator.jpg', description: 'Regulator and changeover valve' },
            { path: 'assets/images/power/gas/connection.jpg', description: 'Pigtail hose connection' }
        ],
        'cassette-toilet': [
            { path: 'assets/images/water/toilet/hero.jpg', description: 'Cassette toilet interior' },
            { path: 'assets/images/water/toilet/external-door.jpg', description: 'External cassette access' },
            { path: 'assets/images/water/toilet/removal.jpg', description: 'Cassette removal' }
        ],
        'fresh-water-external': [
            { path: 'assets/images/water/fresh/hero.jpg', description: 'External filler cap' },
            { path: 'assets/images/water/fresh/tank-level.jpg', description: 'Tank level display' }
        ],
        'alarm-system': [
            { path: 'assets/images/safety/alarm/hero.jpg', description: 'Alarm control panel' },
            { path: 'assets/images/safety/alarm/fob.jpg', description: 'Key fob' },
            { path: 'assets/images/safety/alarm/sensor.jpg', description: 'Door sensor' }
        ],
        'vehicle-tracker': [
            { path: 'assets/images/safety/tracker/hero.jpg', description: 'Tracker app on phone' },
            { path: 'assets/images/safety/tracker/unit.jpg', description: 'Hidden tracker unit' }
        ],
        'internet-5g': [
            { path: 'assets/images/media/5g/hero.jpg', description: '5G router with WiFi' }
        ],
        'control-panel': [
            { path: 'assets/images/power/control-panel/hero.jpg', description: 'Main control panel' },
            { path: 'assets/images/power/control-panel/battery.jpg', description: 'Battery status display' },
            { path: 'assets/images/power/control-panel/tanks.jpg', description: 'Tank level indicators' }
        ],
        'mains-charger': [
            { path: 'assets/images/power/mains/hero.jpg', description: 'Battery charger unit' },
            { path: 'assets/images/power/mains/inlet.jpg', description: 'External mains inlet' }
        ],
        'driving-safety': [
            { path: 'assets/images/driving/hero.jpg', description: 'Front exterior view' },
            { path: 'assets/images/driving/dashboard.jpg', description: 'Fiat Ducato cab dashboard' },
            { path: 'assets/images/driving/rear.jpg', description: 'Rear view with camera' }
        ],
        'problems': [
            { path: 'assets/images/troubleshooting/hero.jpg', description: 'Fuse box location' },
            { path: 'assets/images/troubleshooting/control-panel.jpg', description: 'Main control panel' },
            { path: 'assets/images/troubleshooting/water-pump.jpg', description: 'Water pump location' }
        ]
    },

    /**
     * Cache for image existence checks
     */
    imageCache: {},

    /**
     * Check if an image exists (async)
     * @param {string} path - Image path to check
     * @returns {Promise<boolean>} Whether image exists
     */
    async checkImageExists(path) {
        // Return from cache if available
        if (path in this.imageCache) {
            return this.imageCache[path];
        }

        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                this.imageCache[path] = true;
                resolve(true);
            };
            img.onerror = () => {
                this.imageCache[path] = false;
                resolve(false);
            };
            img.src = path;
        });
    },

    /**
     * Get required images for a feature
     * @param {string} featureId - Feature ID
     * @returns {Array} Array of required image objects
     */
    getRequiredImages(featureId) {
        return this.requiredImages[featureId] || [];
    },

    /**
     * Validate all images for a feature
     * @param {string} featureId - Feature ID
     * @returns {Promise<Object>} Validation result with status and missing images
     */
    async validateFeatureImages(featureId) {
        const required = this.getRequiredImages(featureId);
        if (required.length === 0) {
            return { valid: false, missing: [], required: [], message: 'No images defined for this feature' };
        }

        const results = await Promise.all(
            required.map(async (img) => ({
                ...img,
                exists: await this.checkImageExists(img.path)
            }))
        );

        const missing = results.filter(r => !r.exists);
        const existing = results.filter(r => r.exists);

        return {
            valid: missing.length === 0,
            missing,
            existing,
            required: results,
            message: missing.length === 0 
                ? 'All required images present' 
                : `Missing ${missing.length} of ${required.length} required images`
        };
    },

    /**
     * Check if a feature can be marked as verified
     * A feature can only be verified if all required images exist
     * @param {string} featureId - Feature ID
     * @returns {Promise<boolean>} Whether feature can be verified
     */
    async canBeVerified(featureId) {
        const validation = await this.validateFeatureImages(featureId);
        return validation.valid;
    },

    /**
     * Create a blocking placeholder HTML for missing image
     * @param {Object} imageInfo - Required image info object
     * @returns {string} HTML string for blocking placeholder
     */
    createBlockingPlaceholder(imageInfo) {
        return `
            <div class="image-blocking-placeholder" data-image-path="${this.escapeAttr(imageInfo.path)}">
                <div class="blocking-icon">🚫</div>
                <div class="blocking-title">Image Required</div>
                <div class="blocking-message">Feature cannot be verified without this image</div>
                <div class="blocking-path">${this.escapeHtml(imageInfo.path)}</div>
                <div class="blocking-description">${this.escapeHtml(imageInfo.description)}</div>
            </div>
        `;
    },

    /**
     * Create image or blocking placeholder based on existence
     * @param {Object} imageInfo - Image info object
     * @param {boolean} exists - Whether image exists
     * @param {boolean} isHero - Whether this is the hero image
     * @returns {string} HTML string
     */
    createImageOrPlaceholder(imageInfo, exists, isHero = false) {
        if (exists) {
            const heroClass = isHero ? 'hero-image' : '';
            return `
                <div class="feature-image ${heroClass}">
                    <img src="${this.escapeAttr(imageInfo.path)}" 
                         alt="${this.escapeAttr(imageInfo.description)}"
                         loading="${isHero ? 'eager' : 'lazy'}">
                    <div class="image-caption">${this.escapeHtml(imageInfo.description)}</div>
                </div>
            `;
        }
        return this.createBlockingPlaceholder(imageInfo);
    },

    /**
     * Render hero image section for feature detail view
     * @param {string} featureId - Feature ID
     * @returns {Promise<string>} HTML for hero image section
     */
    async renderHeroImage(featureId) {
        const required = this.getRequiredImages(featureId);
        if (required.length === 0) {
            return this.createBlockingPlaceholder({ 
                path: `assets/images/${featureId}/hero.jpg`, 
                description: 'Hero image for this feature' 
            });
        }

        const heroImage = required[0];
        const exists = await this.checkImageExists(heroImage.path);
        return this.createImageOrPlaceholder(heroImage, exists, true);
    },

    /**
     * Render all images for feature detail view
     * @param {string} featureId - Feature ID
     * @returns {Promise<string>} HTML for all images
     */
    async renderFeatureImages(featureId) {
        const validation = await this.validateFeatureImages(featureId);
        
        if (validation.required.length === 0) {
            return `
                <div class="image-gallery-empty">
                    <p>No images defined for this feature</p>
                </div>
            `;
        }

        const imagesHtml = validation.required.map((img, index) => {
            return this.createImageOrPlaceholder(img, img.exists, index === 0);
        }).join('');

        const statusClass = validation.valid ? 'images-complete' : 'images-incomplete';
        const statusIcon = validation.valid ? '✅' : '⚠️';

        return `
            <div class="feature-images-gallery ${statusClass}">
                <div class="images-status">
                    <span class="status-icon">${statusIcon}</span>
                    <span class="status-text">${validation.message}</span>
                </div>
                <div class="images-grid">
                    ${imagesHtml}
                </div>
            </div>
        `;
    },

    /**
     * Get verification status considering image requirements
     * @param {Object} system - System object with verification_status
     * @returns {Promise<Object>} Updated verification status
     */
    async getVerificationStatus(system) {
        const canVerify = await this.canBeVerified(system.id);
        const originalStatus = system.verification_status;

        if (!canVerify) {
            return {
                status: 'unverified',
                blocked: true,
                reason: 'Missing required images',
                originalStatus
            };
        }

        return {
            status: originalStatus || 'unverified',
            blocked: false,
            reason: null,
            originalStatus
        };
    },

    /**
     * Escape HTML
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
     * @returns {string} Escaped text
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
