/**
 * MOVEO Landing Page - Internationalization (i18n) System
 * Handles language switching and text translation functionality
 */

class MoveoI18n {
    constructor() {
        this.currentLanguage = localStorage.getItem('moveo-language') || 'es';
        this.translations = {};
        this.loadingPromises = new Map();

        // Initialize on DOM content loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        try {
            // Load current language
            await this.loadLanguage(this.currentLanguage);

            // Preload the other language for faster switching
            const otherLang = this.currentLanguage === 'es' ? 'en' : 'es';
            this.loadLanguage(otherLang); // Don't await, load in background

            // Update page with current language
            this.updatePageLanguage(this.currentLanguage);

            console.log(`🌍 MOVEO i18n initialized with language: ${this.currentLanguage}`);
        } catch (error) {
            console.error('❌ Failed to initialize i18n:', error);
            // Fallback to Spanish if something goes wrong
            this.currentLanguage = 'es';
        }
    }

    /**
     * Load language file
     * @param {string} lang - Language code ('es' or 'en')
     * @returns {Promise<Object>} Loaded translations
     */
    async loadLanguage(lang) {
        // Return existing promise if already loading
        if (this.loadingPromises.has(lang)) {
            return this.loadingPromises.get(lang);
        }

        // Return cached translations if already loaded
        if (this.translations[lang]) {
            return this.translations[lang];
        }

        // Create loading promise
        const loadingPromise = this.fetchLanguageFile(lang);
        this.loadingPromises.set(lang, loadingPromise);

        try {
            const translations = await loadingPromise;
            this.translations[lang] = translations;
            this.loadingPromises.delete(lang);
            return translations;
        } catch (error) {
            this.loadingPromises.delete(lang);
            throw error;
        }
    }

    /**
     * Fetch language file from server
     * @param {string} lang - Language code
     * @returns {Promise<Object>} Translations object
     */
    async fetchLanguageFile(lang) {
        try {
            const response = await fetch(`src/js/translations/${lang}.json`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`❌ Failed to load language file: ${lang}`, error);

            // Fallback: return empty object or basic translations
            if (lang === 'es') {
                return this.getFallbackTranslations();
            }

            throw error;
        }
    }

    /**
     * Get fallback translations in case of loading failure
     * @returns {Object} Basic Spanish translations
     */
    getFallbackTranslations() {
        return {
            nav: {
                about: "Acerca de",
                services: "Servicios",
                testimonials: "Testimonios",
                contact: "Contáctanos"
            },
            hero: {
                title: "Encuentra autos para viajar cómodo",
                button: "Explora ahora"
            }
        };
    }

    /**
     * Update page language
     * @param {string} lang - Language code
     */
    async updatePageLanguage(lang) {
        try {
            // Ensure language is loaded
            await this.loadLanguage(lang);

            if (!this.translations[lang]) {
                throw new Error(`Translations not available for language: ${lang}`);
            }

            // Update HTML lang attribute
            document.documentElement.lang = lang;

            // Update all translatable elements
            const elements = document.querySelectorAll('[data-i18n]');
            elements.forEach(element => {
                const key = element.getAttribute('data-i18n');
                const translation = this.getTranslation(lang, key);

                if (translation) {
                    this.updateElement(element, translation);
                } else {
                    console.warn(`⚠️ Translation not found for key: ${key} in language: ${lang}`);
                }
            });

            // Update placeholders
            const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
            placeholderElements.forEach(element => {
                const key = element.getAttribute('data-i18n-placeholder');
                const translation = this.getTranslation(lang, key);

                if (translation && element.tagName === 'INPUT') {
                    element.placeholder = translation;
                }
            });

            // Save language preference
            localStorage.setItem('moveo-language', lang);
            this.currentLanguage = lang;

            // Dispatch custom event for other components
            document.dispatchEvent(new CustomEvent('moveo:languageChanged', {
                detail: { language: lang }
            }));

            console.log(`✅ Page language updated to: ${lang}`);
        } catch (error) {
            console.error('❌ Failed to update page language:', error);
        }
    }

    /**
     * Get translation using dot notation
     * @param {string} lang - Language code
     * @param {string} key - Translation key (e.g., 'nav.about')
     * @returns {string|null} Translation text
     */
    getTranslation(lang, key) {
        if (!this.translations[lang]) {
            return null;
        }

        const keys = key.split('.');
        let current = this.translations[lang];

        for (const k of keys) {
            if (current && typeof current === 'object' && k in current) {
                current = current[k];
            } else {
                return null;
            }
        }

        return typeof current === 'string' ? current : null;
    }

    /**
     * Update DOM element with translation
     * @param {Element} element - DOM element to update
     * @param {string} translation - Translation text
     */
    updateElement(element, translation) {
        // Handle different element types
        if (element.tagName === 'INPUT') {
            if (element.type === 'submit' || element.type === 'button') {
                element.value = translation;
            }
        } else if (element.tagName === 'IMG') {
            element.alt = translation;
        } else if (element.tagName === 'META') {
            element.content = translation;
        } else {
            // For most elements, update textContent
            element.textContent = translation;
        }
    }

    /**
     * Switch to the other language
     */
    async toggleLanguage() {
        const newLang = this.currentLanguage === 'es' ? 'en' : 'es';
        await this.updatePageLanguage(newLang);
    }

    /**
     * Get current language
     * @returns {string} Current language code
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Check if language is available
     * @param {string} lang - Language code to check
     * @returns {boolean} True if language is available
     */
    isLanguageAvailable(lang) {
        return ['es', 'en'].includes(lang);
    }

    /**
     * Get available languages
     * @returns {Array<string>} Array of available language codes
     */
    getAvailableLanguages() {
        return ['es', 'en'];
    }

    /**
     * Format language name for display
     * @param {string} lang - Language code
     * @returns {string} Formatted language name
     */
    getLanguageDisplayName(lang) {
        const names = {
            'es': 'Español',
            'en': 'English'
        };
        return names[lang] || lang.toUpperCase();
    }
}

// Create global instance
window.moveoI18n = new MoveoI18n();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MoveoI18n;
}