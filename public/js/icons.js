/**
 * iMail Icon System
 * Utility functions for loading and using SVG sprite icons
 */

(function() {
  'use strict';

  const SPRITE_URL = '/icons/sprite.svg';
  let spriteLoaded = false;
  let spritePromise = null;

  /**
   * Load the SVG sprite and inject it into the document
   */
  async function loadSprite() {
    if (spriteLoaded) return;
    if (spritePromise) return spritePromise;

    spritePromise = fetch(SPRITE_URL)
      .then(response => response.text())
      .then(svgContent => {
        const container = document.createElement('div');
        container.style.display = 'none';
        container.innerHTML = svgContent;
        document.body.insertBefore(container, document.body.firstChild);
        spriteLoaded = true;
      })
      .catch(err => {
        console.warn('Failed to load icon sprite:', err);
      });

    return spritePromise;
  }

  /**
   * Create an SVG icon element
   * @param {string} name - Icon name (without 'icon-' prefix)
   * @param {Object} options - Optional configuration
   * @param {string} options.size - Icon size (default: '20')
   * @param {string} options.class - Additional CSS classes
   * @param {string} options.color - Icon color
   * @returns {SVGElement}
   */
  function createIcon(name, options = {}) {
    const size = options.size || '20';
    const className = options.class || '';
    const color = options.color || 'currentColor';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', color);
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('icon', `icon-${name}`);

    if (className) {
      className.split(' ').forEach(cls => {
        if (cls) svg.classList.add(cls);
      });
    }

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'svg:use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#icon-${name}`);
    use.setAttribute('href', `#icon-${name}`);
    svg.appendChild(use);

    return svg;
  }

  /**
   * Get HTML string for an icon
   * @param {string} name - Icon name
   * @param {Object} options - Optional configuration
   * @returns {string}
   */
  function getIconHTML(name, options = {}) {
    const size = options.size || '20';
    const className = options.class || '';
    const color = options.color || 'currentColor';
    const extraClasses = className ? ` ${className}` : '';

    return `<svg class="icon icon-${name}${extraClasses}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
  }

  /**
   * Replace all elements with data-icon attribute with actual icons
   */
  function replaceIconPlaceholders() {
    const placeholders = document.querySelectorAll('[data-icon]');
    placeholders.forEach(el => {
      const name = el.getAttribute('data-icon');
      const size = el.getAttribute('data-icon-size') || '20';
      const color = el.getAttribute('data-icon-color');

      const icon = createIcon(name, { size, color });

      // Copy classes from placeholder
      el.classList.forEach(cls => {
        if (cls !== 'icon-placeholder') {
          icon.classList.add(cls);
        }
      });

      el.parentNode.replaceChild(icon, el);
    });
  }

  /**
   * Initialize icon system
   */
  async function init() {
    await loadSprite();
    replaceIconPlaceholders();

    // Set up mutation observer to handle dynamically added icons
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (node.hasAttribute && node.hasAttribute('data-icon')) {
              const name = node.getAttribute('data-icon');
              const size = node.getAttribute('data-icon-size') || '20';
              const icon = createIcon(name, { size });
              node.parentNode.replaceChild(icon, node);
            }
            // Check children
            const placeholders = node.querySelectorAll ? node.querySelectorAll('[data-icon]') : [];
            placeholders.forEach(el => {
              const name = el.getAttribute('data-icon');
              const size = el.getAttribute('data-icon-size') || '20';
              const icon = createIcon(name, { size });
              el.parentNode.replaceChild(icon, el);
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Export to global scope
  window.iMailIcons = {
    load: loadSprite,
    create: createIcon,
    getHTML: getIconHTML,
    replace: replaceIconPlaceholders,
    init: init
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
