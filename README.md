# Bürstner Ixeo I 744 – Interactive Owner's Manual

An interactive digital owner's manual for the 2018 Bürstner Ixeo I 744 A-class motorhome.

## Features

- 📱 **Mobile-first design** - Optimized for iPhone Safari and all mobile browsers
- 🔍 **Offline search** - Find tasks and systems instantly without internet
- 📸 **Photo references** - Add your own photos to illustrate each task
- 🏕️ **Practical tasks** - Real-world owner tasks like heating, water, and troubleshooting
- ⚡ **No build required** - Pure HTML, CSS, and JavaScript

## Quick Start

1. Open `index.html` in any web browser
2. Or visit the GitHub Pages URL if deployed

## Adding Your Photos

The manual supports reference photos for each system and task. To add your own photos:

1. Take photos of your motorhome's components (control panels, valves, beds, etc.)
2. Save them in the appropriate `/images/` subdirectory:
   - `/images/heating/` - Truma panel, gas locker, mains inlet
   - `/images/water/` - Water fillers, drain valves, pump
   - `/images/driving/` - Exterior views, cab, lockers
   - `/images/interior/` - Beds, dinette, cupboards
   - `/images/problems/` - Fuse box, battery, control panel
3. Name them according to the list in `/images/README.md`
4. Refresh the manual to see your photos

See `/images/README.md` for the complete list of recommended photos.

## File Structure

```
/
├── index.html          # Main application
├── css/
│   └── style.css       # Mobile-first styles
├── js/
│   ├── app.js          # Main application logic
│   ├── search.js       # Offline search functionality
│   └── tasks.js        # Dynamic task rendering
├── data/
│   ├── systems.json    # Vehicle systems data
│   └── tasks.json      # Owner tasks data
├── images/
│   ├── heating/        # Heating & power photos
│   ├── water/          # Water system photos
│   ├── driving/        # Driving & safety photos
│   ├── interior/       # Beds & interior photos
│   └── problems/       # Troubleshooting photos
└── README.md
```

## Systems Covered

- **Heating & Power** - Truma Combi heating, 230V hook-up, 12V battery system
- **Water** - Fresh water, waste water, pump, winterisation
- **Driving & Safety** - Pre-departure checks, weight limits, safety features
- **Beds & Interior** - Drop-down bed, fixed bed, dinette conversion
- **Problems** - Troubleshooting electrical, water, and heating faults

## Tasks Included

1. Set heating on arrival
2. Lower the drop-down bed
3. Winterise the water system
4. Connect to mains hook-up
5. Fill the fresh water tank
6. Prepare the vehicle for driving
7. Empty the waste water tank
8. Troubleshoot: No water from taps
9. Troubleshoot: Heating not working
10. Troubleshoot: 12V electrical fault

## Technical Notes

- Works offline once loaded
- No external dependencies
- GitHub Pages compatible
- Dark mode support (follows system preference)
- Accessible keyboard navigation

## Disclaimer

This is a supplementary quick-reference guide. Always refer to the official Bürstner documentation for complete specifications, safety information, and warranty requirements.

// UNVERIFIED – Some technical details may require manual confirmation against your specific vehicle's documentation.

## License

For personal use with your Bürstner Ixeo I 744 motorhome.

