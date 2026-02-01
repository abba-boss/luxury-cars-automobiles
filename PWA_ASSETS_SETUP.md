# PWA Asset Requirements

To fully enable PWA functionality with custom icons and screenshots, you need to add the following assets to your project:

## Required Icons

1. **icon-192.png** - 192x192 pixel PNG icon
   - Path: `public/icons/icon-192.png`
   
2. **icon-512.png** - 512x512 pixel PNG icon
   - Path: `public/icons/icon-512.png`

## Recommended Screenshots (for app store listings)

1. **screenshot-desktop.jpg** - Desktop view screenshot (1280x720)
   - Path: `public/screenshots/screenshot-desktop.jpg`
   
2. **screenshot-mobile.jpg** - Mobile view screenshot (720x1280)
   - Path: `public/screenshots/screenshot-mobile.jpg`

## How to Generate Icons

You can generate these icons using online tools like:
- [Favicon.io](https://favicon.io/)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [PWA Builder](https://www.pwabuilder.com/)

## Updating the Manifest

Once you have the assets, update your `public/manifest.json`:

```json
{
  "name": "Sarkin Mota Automobiles",
  "short_name": "Sarkin Mota",
  "description": "Your premier destination for premium automobiles",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0b",
  "theme_color": "#ec1c24",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/screenshot-desktop.jpg",
      "sizes": "1280x720",
      "type": "image/jpeg",
      "form_factor": "wide",
      "label": "Sarkin Mota Homepage"
    },
    {
      "src": "/screenshots/screenshot-mobile.jpg",
      "sizes": "720x1280",
      "type": "image/jpeg",
      "form_factor": "narrow",
      "label": "Sarkin Mota Mobile View"
    }
  ]
}
```

## Current Status

Currently, the manifest uses the existing favicon.ico as a fallback. While this allows the PWA to function, having proper-sized icons will provide a better user experience when installing the app.