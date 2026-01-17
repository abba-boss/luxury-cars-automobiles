import { useEffect } from 'react';

// Component to ensure accessibility compliance
const AccessibilityManager = () => {
  useEffect(() => {
    // Set proper document language
    document.documentElement.lang = 'en';
    
    // Add meta tags for accessibility
    const metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Luxury Cars Automobiles - Premium automotive marketplace with accessible interface';
      document.head.appendChild(meta);
    }
    
    // Ensure proper heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length > 0) {
      // Add ARIA labels where needed
      headings.forEach((heading, index) => {
        if (!heading.getAttribute('aria-level')) {
          heading.setAttribute('aria-level', heading.tagName.charAt(1));
        }
      });
    }
    
    // Add skip navigation link for keyboard users
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Clean up on unmount
    return () => {
      if (skipLink.parentNode) {
        skipLink.parentNode.removeChild(skipLink);
      }
    };
  }, []);

  return null;
};

export default AccessibilityManager;