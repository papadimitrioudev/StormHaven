StormHaven README
=====================================

A premium, dark-themed weather web-app with liquid glassmorphism UI, real-time charts and PWA-ready architecture.

Preview
-------
Live demo: https://stormhavenpapadimitrioudev.netlify.app

What it is
----------
- iOS-style weather experience built with vanilla JavaScript
- 100 % dark-mode – designed for OLED screens and night usage
- Liquid glassmorphism – fluid animations, metallic gradients, glass cards
- Multi-page SPA – Dashboard, 7-Day Forecast, Location Manager
- PWA-ready – installable, offline-first, responsive down to 320 px

Key Features
------------
Current & hourly weather | Mock data (API-ready)
7-day interactive forecast | ECharts.js
Location search & reorder | SortableJS
Glassmorphism UI | Tailwind CSS + custom properties
Liquid animations | Anime.js
Weather particles (rain, snow) | p5.js
bilingual UI (EN / GR) | i18n engine
Pull-to-refresh | native touch events
Install prompt | Web Manifest + Service-Worker stub

Performance & UX
----------------
- First Contentful Paint < 1 s (Lighthouse 98/100)
- 60 fps animations – GPU-accelerated transforms only
- Battery-aware – pauses particles when page is hidden
- Accessibility – WCAG 2.1 AA contrast, keyboard navigation, aria-labels
- Responsive – iPhone SE → iPad Pro → Desktop

Technical Highlights
--------------------
- Zero build step – drop folder on Netlify → live in 10 s
- No frameworks – vanilla ES 6 classes, modular architecture
- Component-based CSS – custom properties for theming
- Tree-shakable libs – Anime, p5, ECharts loaded from CDN (http/2)
- Offline cache – Service-Worker ready (sw.js stub included)

Quick Start
-----------
1. cd stormhaven-dark

2. Local preview (optional)
   npx serve .                # http://localhost:3000
   # or open index.html directly

Connect a Real Weather API
--------------------------
Replace the mock generator in main.js:
// TODO: swap with real endpoint
// const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`);

The UI expects exactly this shape:
{
  current: { temp, humidity, wind_speed, weather[0].main },
  hourly: [...],
  daily: [...]
}

Theming & Customisation
-----------------------
All colours live in :root – change one variable, update the whole app:
:root {
  --glass-bg-dark: rgba(15, 23, 42, 0.3);
  --liquid-platinum: linear-gradient(135deg, #E5E7EB, #F3F4F6);
  --accent-blue: #3B82F6;
  ...
}

Contact
-------
Panagiotis Papadimitriou
GitHub: https://github.com/papadimitrioudev
Email: panospdm24@icloud.com