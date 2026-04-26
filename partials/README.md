# AIAutomate Partials Documentation

This directory contains reusable HTML partials for the AIAutomate template to help maintain consistency across pages and make updates easier.

## Structure

```
partials/
├── navbar.html          # Main navigation component
├── footer.html          # Footer component
├── head.html            # Common head content (meta tags, CSS)
├── scripts.html         # Common script includes
└── README.md            # This documentation
```

## Using Partials

### For Static HTML Projects

If your server supports SSI (Server Side Includes):

```html
<!--#include virtual="partials/navbar.html" -->
```

### For PHP Projects

```php
<?php include 'partials/navbar.html'; ?>
```

### For Node.js/Express with EJS

```html
<%- include('partials/navbar') %>
```

### For Build Tools (Webpack, Vite, Parcel)

Use a templating plugin or loader to include partials during the build process.

## Partial Components

### Navbar Component

**File:** `navbar.html`

Contains the main navigation bar with:
- Logo/brand
- Navigation links
- Login and CTA buttons
- Mobile responsive toggle

**Active State:**
Add `active` class to the appropriate `.nav-link` for each page:
- Home: `index.html` → `class="nav-link active"`
- About: `about.html` → `class="nav-link active"`
- Services: `services.html` → `class="nav-link active"`
- etc.

### Footer Component

**File:** `footer.html`

Contains the footer with:
- Brand description
- Link columns (Product, Company, Resources, Legal)
- Social media links
- Copyright notice

### Head Component

**File:** `head.html`

Contains common `<head>` elements:
- Meta charset and viewport
- SEO meta tags
- Open Graph tags
- Preconnect directives
- Common CSS includes

**Note:** Page-specific meta tags (title, description) should be customized per page.

### Scripts Component

**File:** `scripts.html`

Contains common script includes:
- Bootstrap JS
- AOS (Animate On Scroll)
- Custom theme.js
- Custom main.js

## ThemeForest Reviewer Notes

This template follows ThemeForest's best practices:

✅ Proper project structure with `assets/` folder
✅ Separation of CSS, JS, images, and vendor files
✅ Partials for maintainable code
✅ Comprehensive SEO meta tags
✅ Accessibility features (aria-labels, semantic HTML)
✅ No inline styles (all in CSS)
✅ Professional glassmorphism design
✅ Responsive design patterns
✅ Performance optimized (preconnect, CDN usage)

## Updating Multiple Pages

When you need to make changes that affect all pages:

1. Update the relevant partial file
2. If using includes: Changes apply automatically
3. If not using includes: Copy the updated partial to all HTML files

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers (iOS Safari, Chrome Android)

## File Structure Convention

```
ai-automate/
├── assets/
│   ├── css/styles.css      # Main stylesheet
│   ├── js/
│   │   ├── theme.js        # Theme switcher
│   │   └── main.js         # Main interactions
│   ├── images/             # Image assets
│   └── vendor/             # Third-party libraries (if local)
├── partials/               # HTML partials (this directory)
├── index.html              # Homepage
├── about.html              # About page
├── services.html           # Services page
├── pricing.html            # Pricing page
├── blog.html               # Blog page
├── contact.html            # Contact page
└── login.html              # Login page
```

## Quick Commands

### Copy Navbar to All Pages

If you need to manually update all pages with a new navbar:

1. Edit `partials/navbar.html`
2. Copy the content
3. Replace the `<nav>` section in each HTML file

### Update Footer Across All Pages

Same process as navbar - edit once in `partials/footer.html`, then copy to all pages.

## Support

For issues or questions about the template structure, refer to the main README.md file or contact the template author.
