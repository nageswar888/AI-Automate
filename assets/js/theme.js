/**
 * AIAutomate Theme Switcher
 * Handles background theme selection and persistence
 */

(function() {
    'use strict';

    // Available themes
    const themes = [
        { id: 'dark', name: 'Dark', color: 'dark' },
        { id: 'light', name: 'Light', color: 'light' },
        { id: 'midnight', name: 'Midnight Blue', color: 'midnight' },
        { id: 'purple', name: 'Deep Purple', color: 'purple' },
        { id: 'ocean', name: 'Ocean', color: 'ocean' },
        { id: 'forest', name: 'Forest', color: 'forest' },
        { id: 'gradient-dark', name: 'Gradient Dark', color: 'gradient-dark' }
    ];

    const STORAGE_KEY = 'ai-automate-theme';
    let currentTheme = localStorage.getItem(STORAGE_KEY) || 'dark';

    // Initialize theme on page load
    function initTheme() {
        document.body.setAttribute('data-theme', currentTheme);
        createThemeSelector();
        updateActiveThemeUI();
    }

    // Create theme selector HTML
    function createThemeSelector() {
        // Check if already exists
        if (document.getElementById('theme-selector')) return;

        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'theme-toggle-btn';
        toggleBtn.id = 'theme-toggle-btn';
        toggleBtn.setAttribute('aria-label', 'Toggle Theme Selector');
        toggleBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
        `;
        toggleBtn.addEventListener('click', toggleThemeSelector);
        document.body.appendChild(toggleBtn);

        // Create theme selector panel
        const selector = document.createElement('div');
        selector.className = 'theme-selector hidden';
        selector.id = 'theme-selector';

        const title = document.createElement('div');
        title.className = 'theme-selector-title';
        title.textContent = 'Select Background';
        selector.appendChild(title);

        themes.forEach(theme => {
            const option = document.createElement('div');
            option.className = 'theme-option';
            option.dataset.theme = theme.id;
            option.innerHTML = `
                <div class="theme-color-dot ${theme.color}"></div>
                <span class="theme-name">${theme.name}</span>
            `;
            option.addEventListener('click', () => setTheme(theme.id));
            selector.appendChild(option);
        });

        document.body.appendChild(selector);

        // Close on outside click
        document.addEventListener('click', (e) => {
            const selectorEl = document.getElementById('theme-selector');
            const toggleEl = document.getElementById('theme-toggle-btn');
            if (selectorEl && !selectorEl.contains(e.target) && !toggleEl.contains(e.target)) {
                selectorEl.classList.add('hidden');
            }
        });
    }

    // Toggle theme selector visibility
    function toggleThemeSelector() {
        const selector = document.getElementById('theme-selector');
        if (selector) {
            selector.classList.toggle('hidden');
        }
    }

    // Set active theme
    function setTheme(themeId) {
        currentTheme = themeId;
        document.body.setAttribute('data-theme', themeId);
        localStorage.setItem(STORAGE_KEY, themeId);
        updateActiveThemeUI();

        // Optional: Add a subtle notification
        showThemeNotification(themeId);
    }

    // Update UI to show active theme
    function updateActiveThemeUI() {
        const options = document.querySelectorAll('.theme-option');
        options.forEach(option => {
            if (option.dataset.theme === currentTheme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    // Show theme change notification
    function showThemeNotification(themeId) {
        const theme = themes.find(t => t.id === themeId);
        if (!theme) return;

        // Remove existing notification
        const existing = document.getElementById('theme-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.id = 'theme-notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--bg-card);
            color: var(--text-primary);
            padding: 12px 24px;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 9999;
            font-size: 0.875rem;
            font-weight: 500;
            backdrop-filter: blur(10px);
            animation: slideUp 0.3s ease;
        `;
        notification.textContent = `Theme changed to ${theme.name}`;

        // Add animation styles if not present
        if (!document.getElementById('theme-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'theme-notification-styles';
            style.textContent = `
                @keyframes slideUp {
                    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Remove after 2 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(20px)';
            notification.style.transition = 'all 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // Keyboard shortcut: Press 'T' to toggle theme selector
    document.addEventListener('keydown', (e) => {
        if (e.key === 't' || e.key === 'T') {
            // Don't trigger if typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            toggleThemeSelector();
        }
    });

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }

    // Expose API for external use
    window.ThemeSwitcher = {
        setTheme: setTheme,
        getCurrentTheme: () => currentTheme,
        getAvailableThemes: () => themes,
        toggle: toggleThemeSelector
    };

})();
