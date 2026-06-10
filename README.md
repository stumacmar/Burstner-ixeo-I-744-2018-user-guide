# Bürstner Ixeo I 744 – Interactive Owner's Manual

An interactive digital owner's manual for the 2018 Bürstner Ixeo I 744 A-class motorhome.

## Design Philosophy

**Icon-only, zero-build** — the manual uses emoji icons for every vehicle system, so it is lightweight, fast-loading and works offline once loaded. It is plain HTML, CSS and JavaScript with no dependencies and no build step.

## Features

- 📱 **Mobile-first design** — optimised for phone use on site, scales up to desktop
- 🔍 **Instant search** — searches systems, checklists and emergency guides with highlighted matches, snippets and full keyboard support (press `/` to focus, arrow keys to navigate)
- ⚠️ **Emergency procedures** — gas leak, fire, electrical fault, water leak and breakdown guides, one tap from the header on every page
- ✅ **Interactive checklists** — Before You Drive, Arriving on Site, Leaving Site and Winter Lay-Up; tick progress is saved on the device with a one-tap reset
- 📋 **Step-by-step guides** — key facts, numbered how-to steps and safety notes for all 22 systems
- 🧭 **Easy navigation** — category jump chips, breadcrumbs, previous/next paging between systems, and shareable URLs for every page (`#alde`, `#checklist/before-driving`, `#emergency`)
- 🌗 **Light/dark mode** — follows system preference, with a manual toggle that remembers your choice
- ♿ **Accessible** — semantic landmarks, skip link, focus management between views, ARIA combobox search, live announcements, visible focus rings, reduced-motion support
- 🖨️ **Print-friendly** — clean print stylesheet for paper copies of any guide
- ⚡ **No build required** — open `index.html` and it works

## Quick Start

1. Open `index.html` in any web browser (or visit the GitHub Pages URL if deployed)
2. Tap a system icon for instructions, or open a Quick Guide checklist
3. Press `/` (or tap the search box) to search the whole manual

## Systems Covered

### Heating & Power
- 🔥 Alde Wet Heating System
- ☀️ Solar Charging System
- 🔥 Gas Storage (2×13kg)
- 🎛️ Main Control Panel

### Water
- 💧 Fresh Water Tank Access
- 🚽 Cassette Toilet
- 🚿 Outdoor Shower

### Safety & Security
- 📹 360° Surround Camera
- 🎥 Reversing Camera
- 🚨 Alarm System
- 📍 Vehicle Tracker

### Beds
- 🛏️ Electric Drop-Down Bed (Rear)
- 🛏️ Pull-Down Bed (Half Dinette)

### Media & Comfort
- 📺 TVs (Two in Cab + Rear Lounge)
- 📺 Outdoor TV Point
- 📶 5G Internet Setup
- ❄️ 3-Way Fridge
- 🪟 Blinds & Fly Screens

### Exterior
- ⛱️ Awning
- 🌡️ Silver External Heat Shield
- 🍖 Outdoor Gas BBQ Point

## Quick Guides

- 🚦 **Before You Drive** — walk-around checks before every journey
- 🏕️ **Arriving on Site** — set up camp in the right order
- 🧳 **Leaving Site** — pack down and leave nothing behind
- ❄️ **Winter Lay-Up** — protect water systems and batteries in storage
- ⚠️ **Emergency** — gas leak, fire, electrical fault, water leak, breakdown

## File Structure

```
/
├── index.html              # Main application shell
├── css/
│   └── style.css           # Mobile-first styles, light/dark themes, print styles
├── js/
│   ├── systems-data.js     # Systems, checklists and emergency data
│   └── app.js              # Routing, rendering, search, theme, checklists
├── data/                   # Legacy JSON data files (not loaded by the app)
│   ├── systems.json
│   └── tasks.json
├── images/                 # Optional — for future photo additions
└── README.md
```

## Technical Notes

- Works offline once loaded; checklist progress and theme are stored in `localStorage`
- No external dependencies, fonts or trackers
- GitHub Pages compatible (hash-based routing, no server needed)
- Every system, checklist and the emergency page has a stable, bookmarkable URL

## Future Enhancements

Photos may be added in future versions. The current icon-only design ensures fast loading on mobile networks and a consistent appearance across all devices.

## Disclaimer

This is a supplementary quick-reference guide. Always refer to the official Bürstner, Alde and appliance documentation for complete specifications, safety information and warranty requirements. In an emergency call 999 (UK) or 112 (Europe).

## License

For personal use with your Bürstner Ixeo I 744 motorhome.
