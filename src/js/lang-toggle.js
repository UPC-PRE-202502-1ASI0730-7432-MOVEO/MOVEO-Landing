/**
 * MOVEO Landing Page - Language Toggle Component
 * Handles the language switcher button functionality
 */

class MoveoLanguageToggle {
    constructor() {
        this.isAnimating = false;

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }


    init() {
        this.createToggleButton();
        this.setupEventListeners();
        this.updateToggleState();

        console.log('🔄 MOVEO Language Toggle initialized');
    }


    createToggleButton() {
        const existingToggle = document.querySelector('.language-switcher');

        if (existingToggle) {
            this.enhanceExistingToggle(existingToggle);
        } else {
            this.createNewToggle();
        }
    }

    /**
     * Enhance existing language switcher
     * @param {Element} toggle - Existing toggle element
     */
    enhanceExistingToggle(toggle) {
        // Add necessary attributes and classes
        toggle.setAttribute('id', 'language-toggle');
        toggle.setAttribute('aria-label', 'Cambiar idioma / Switch language');
        toggle.classList.add('moveo-lang-toggle');

        // Update content to show both languages
        toggle.innerHTML = `
            <span class="lang-option" data-lang="es">ES</span>
            <span class="lang-divider">|</span>
            <span class="lang-option" data-lang="en">EN</span>
        `;

        this.toggleElement = toggle;
    }


    createNewToggle() {
        const toggle = document.createElement('div');
        toggle.id = 'language-toggle';
        toggle.className = 'language-switcher moveo-lang-toggle';
        toggle.setAttribute('aria-label', 'Cambiar idioma / Switch language');

        toggle.innerHTML = `
            <span class="lang-option" data-lang="es">ES</span>
            <span class="lang-divider">|</span>
            <span class="lang-option" data-lang="en">EN</span>
        `;

        // Add to navbar
        const navbar = document.querySelector('.navbar__container');
        if (navbar) {
            navbar.appendChild(toggle);
        }

        this.toggleElement = toggle;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        if (!this.toggleElement) return;

        // Main toggle click
        this.toggleElement.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleToggleClick(e);
        });

        // Individual language option clicks
        const langOptions = this.toggleElement.querySelectorAll('.lang-option');
        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleLanguageOptionClick(e);
            });
        });

        // Listen for language changes from other sources
        document.addEventListener('moveo:languageChanged', (e) => {
            this.updateToggleState(e.detail.language);
        });

        // Keyboard accessibility
        this.toggleElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleToggleClick(e);
            }
        });

        // Make it focusable
        this.toggleElement.setAttribute('tabindex', '0');
    }

    /**
     * Handle main toggle click
     * @param {Event} e - Click event
     */
    async handleToggleClick(e) {
        if (this.isAnimating) return;

        // If clicking on a specific language option, let that handler deal with it
        if (e.target.classList.contains('lang-option')) {
            return;
        }

        await this.switchLanguage();
    }

    /**
     * Handle language option click
     * @param {Event} e - Click event
     */
    async handleLanguageOptionClick(e) {
        if (this.isAnimating) return;

        const targetLang = e.target.getAttribute('data-lang');
        const currentLang = window.moveoI18n?.getCurrentLanguage() || 'es';

        if (targetLang && targetLang !== currentLang) {
            await this.switchLanguage(targetLang);
        }
    }

    /**
     * Switch language
     * @param {string} targetLang - Target language (optional, will toggle if not provided)
     */
    async switchLanguage(targetLang = null) {
        if (this.isAnimating) return;

        this.isAnimating = true;

        try {
            // Add loading state
            this.toggleElement.classList.add('switching');

            if (targetLang) {
                await window.moveoI18n.updatePageLanguage(targetLang);
            } else {
                await window.moveoI18n.toggleLanguage();
            }

            // Update visual state
            this.updateToggleState();

            // Add success animation
            this.toggleElement.classList.add('switched');
            setTimeout(() => {
                this.toggleElement.classList.remove('switched');
            }, 300);

        } catch (error) {
            console.error('❌ Failed to switch language:', error);

            // Add error state
            this.toggleElement.classList.add('error');
            setTimeout(() => {
                this.toggleElement.classList.remove('error');
            }, 1000);
        } finally {
            this.toggleElement.classList.remove('switching');
            this.isAnimating = false;
        }
    }

    /**
     * Update toggle visual state
     * @param {string} lang - Current language (optional)
     */
    updateToggleState(lang = null) {
        if (!this.toggleElement) return;

        const currentLang = lang || window.moveoI18n?.getCurrentLanguage() || 'es';
        const langOptions = this.toggleElement.querySelectorAll('.lang-option');

        // Update active states
        langOptions.forEach(option => {
            const optionLang = option.getAttribute('data-lang');
            if (optionLang === currentLang) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });

        // Update toggle position for visual feedback
        if (currentLang === 'en') {
            this.toggleElement.classList.add('en-active');
            this.toggleElement.classList.remove('es-active');
        } else {
            this.toggleElement.classList.add('es-active');
            this.toggleElement.classList.remove('en-active');
        }

        // Update ARIA label
        const label = currentLang === 'es'
            ? 'Cambiar a inglés / Switch to English'
            : 'Cambiar a español / Switch to Spanish';
        this.toggleElement.setAttribute('aria-label', label);
    }

    /**
     * Add enhanced styling for the toggle
     */
    addEnhancedStyling() {
        const style = document.createElement('style');
        style.textContent = `
            .moveo-lang-toggle {
                position: relative;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                border: 2px solid var(--color-muted, #CCD0DA);
                border-radius: 25px;
                background: var(--color-white, #fff);
                cursor: pointer;
                transition: all 0.3s ease;
                user-select: none;
                font-weight: 600;
                font-size: 0.9rem;
            }

            .moveo-lang-toggle:hover {
                border-color: var(--color-moveo-green, #3A5E5E);
                box-shadow: 0 2px 8px rgba(58, 94, 94, 0.2);
            }

            .moveo-lang-toggle:focus {
                outline: none;
                border-color: var(--color-moveo-green, #3A5E5E);
                box-shadow: 0 0 0 3px rgba(58, 94, 94, 0.2);
            }

            .lang-option {
                padding: 0.25rem 0.5rem;
                border-radius: 15px;
                transition: all 0.2s ease;
                cursor: pointer;
            }

            .lang-option.active {
                background: var(--color-moveo-green, #3A5E5E);
                color: white;
            }

            .lang-option:not(.active):hover {
                background: rgba(58, 94, 94, 0.1);
            }

            .lang-divider {
                color: var(--color-muted, #CCD0DA);
                font-weight: 300;
            }

            .moveo-lang-toggle.switching {
                pointer-events: none;
                opacity: 0.7;
            }

            .moveo-lang-toggle.switched {
                transform: scale(1.05);
            }

            .moveo-lang-toggle.error {
                border-color: #e74c3c;
                animation: shake 0.5s ease-in-out;
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-3px); }
                75% { transform: translateX(3px); }
            }

            @media (max-width: 480px) {
                .moveo-lang-toggle {
                    padding: 0.4rem 0.8rem;
                    font-size: 0.8rem;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * Get current toggle element
     * @returns {Element|null} Toggle element
     */
    getToggleElement() {
        return this.toggleElement;
    }
}

// Initialize when script loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for i18n to initialize
    setTimeout(() => {
        window.moveoLanguageToggle = new MoveoLanguageToggle();

        // Add enhanced styling
        window.moveoLanguageToggle.addEnhancedStyling();
    }, 100);
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MoveoLanguageToggle;
}