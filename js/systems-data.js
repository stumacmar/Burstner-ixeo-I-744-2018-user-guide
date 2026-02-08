/**
 * Bürstner Ixeo I 744 Interactive Manual - Systems Data
 * 
 * Icon-only data model for the interactive user guide.
 * All features from the user's vehicle are represented here with:
 * - id: unique identifier
 * - title: display name
 * - icon: emoji representation
 * - category: grouping for organization
 * - bullets: key facts about the system
 * - steps: how-to instructions
 * - safety: safety warnings and notes
 */

const SYSTEMS = [
    {
        id: "alde",
        title: "Alde Wet Heating",
        icon: "🔥",
        category: "Heating",
        bullets: [
            "Wet (hydronic) heating system using glycol fluid",
            "Distributes heat via radiators and underfloor heating",
            "Can operate on gas, 230V mains, or both combined",
            "Also provides domestic hot water"
        ],
        steps: [
            "Locate the Alde control panel (usually near the main door)",
            "Press the power button to turn on the system",
            "Select heat source: Gas, Electric, or Both",
            "Set desired temperature using the +/- buttons",
            "Wait 10-15 minutes for system to warm up",
            "For hot water, ensure 'Water' mode is enabled"
        ],
        safety: [
            "Never run gas heating while refuelling at petrol stations",
            "Ensure adequate ventilation when heating is in use",
            "Check glycol fluid levels annually - use only Alde-approved fluid",
            "Do not block radiator convectors or underfloor heating vents",
            "If you smell gas, turn off immediately and ventilate",
            "Always refer to official Alde/Bürstner manuals for gas safety"
        ]
    },
    {
        id: "fridge",
        title: "3-Way Fridge",
        icon: "❄️",
        category: "Comfort",
        bullets: [
            "Operates on 12V DC (driving), 230V AC (hook-up), or gas (off-grid)",
            "Auto-select mode available on most models",
            "Must be level for optimal cooling performance",
            "Allow 24 hours to reach optimal temperature"
        ],
        steps: [
            "Open fridge door and locate control panel (usually inside at top)",
            "Select power mode: Auto, 12V, 230V, or Gas",
            "For gas operation, ensure gas is turned on at bottle",
            "Set temperature dial to desired level",
            "Check external vent is not blocked",
            "Level the vehicle within 3 degrees for best performance"
        ],
        safety: [
            "Switch fridge to 12V mode before driving if not automatic",
            "Turn off gas supply to fridge before refuelling",
            "Ensure external vents are not blocked",
            "Do not leave fridge on gas while vehicle is in motion",
            "Never use gas mode in enclosed/unventilated spaces"
        ]
    },
    {
        id: "solar",
        title: "Solar Charging System",
        icon: "☀️",
        category: "Power",
        bullets: [
            "Roof-mounted solar panel charges batteries silently",
            "Charges leisure battery first, then vehicle battery",
            "Extends off-grid capability significantly",
            "Charging is automatic - no user action required"
        ],
        steps: [
            "Solar charging is fully automatic when parked in sunlight",
            "Check solar controller display for charge status",
            "Monitor leisure battery level on main control panel",
            "Keep panels clean for optimal efficiency",
            "In prolonged shade, connect to mains hook-up"
        ],
        safety: [
            "Do not walk on solar panels",
            "Keep panels clean - debris can reduce efficiency",
            "Disconnect solar before any roof work",
            "Check controller for fault indicators periodically"
        ]
    },
    {
        id: "camera-360",
        title: "360° Surround Camera",
        icon: "📹",
        category: "Safety",
        bullets: [
            "Bird's-eye view of vehicle and surroundings",
            "Displayed on dashboard monitor",
            "Useful for manoeuvring in tight spaces",
            "Multiple camera angles available"
        ],
        steps: [
            "Camera activates automatically when ignition is on",
            "Select 360° view on the dashboard display",
            "Use view selector to switch between cameras",
            "Check all quadrants before manoeuvring"
        ],
        safety: [
            "Always perform visual checks in addition to cameras",
            "Keep camera lenses clean for clear images",
            "Camera view may be limited in poor lighting",
            "Do not rely solely on cameras - use mirrors too"
        ]
    },
    {
        id: "camera-reversing",
        title: "Reversing Camera",
        icon: "🎥",
        category: "Safety",
        bullets: [
            "Rear-mounted camera activates in reverse gear",
            "Shows live image with parking guidelines",
            "Helps with parking and manoeuvring",
            "Camera located above number plate"
        ],
        steps: [
            "Engage reverse gear to activate camera",
            "View appears automatically on dashboard display",
            "Use guideline overlay to judge distances",
            "Combine with mirrors for complete awareness"
        ],
        safety: [
            "Check for children, pets, and low obstacles before reversing",
            "Use mirrors and direct checks as well",
            "Keep camera lens clean for clear visibility",
            "Be aware of blind spots not covered by camera"
        ]
    },
    {
        id: "tv-cab",
        title: "TVs (Two in Cab)",
        icon: "📺",
        category: "Media",
        bullets: [
            "Avtex TVs designed for motorhome use",
            "Operate on both 12V and 240V power",
            "Built-in Freeview tuner and DVD player",
            "Swivel mounts for flexible viewing angles"
        ],
        steps: [
            "Ensure TV is secure and in viewing position",
            "Turn on using remote or power button",
            "Extend aerial for best reception",
            "Select input source (TV, DVD, HDMI)",
            "Secure TV in stowed position before driving"
        ],
        safety: [
            "Do not watch TV while driving",
            "Secure TV before travelling",
            "Only use on 12V when parked to avoid battery drain",
            "Keep ventilation around TV clear"
        ]
    },
    {
        id: "tv-rear",
        title: "TV (Rear Lounge)",
        icon: "📺",
        category: "Media",
        bullets: [
            "Second Avtex TV in rear lounge area",
            "Perfect for relaxing or viewing in bed",
            "Same 12V/240V dual power capability",
            "Built-in tuner and media connections"
        ],
        steps: [
            "Turn on using remote or power button",
            "Extend aerial for better reception",
            "Select viewing source as needed",
            "Adjust position if on swivel mount"
        ],
        safety: [
            "Secure TV before driving",
            "Do not block ventilation around TV",
            "Monitor battery level when using on 12V"
        ]
    },
    {
        id: "bed-dropdown",
        title: "Electric Drop-Down Bed (Rear)",
        icon: "🛏️",
        category: "Beds",
        bullets: [
            "Electric bed above rear lounge",
            "Lowers to provide double sleeping space",
            "Controlled by wall-mounted switch",
            "Can stop at any height during operation"
        ],
        steps: [
            "Clear the area below the bed completely",
            "Locate the wall-mounted control switch",
            "Press and hold the 'Down' button",
            "Release when bed reaches desired height",
            "To raise: press and hold 'Up' button",
            "Ensure bed is FULLY raised before driving"
        ],
        safety: [
            "Always clear the area below before lowering",
            "Ensure bed is FULLY raised and secured before driving",
            "Do not exceed bed weight limit",
            "Keep fingers clear of mechanism during operation",
            "Do not operate bed controls while driving"
        ]
    },
    {
        id: "bed-pulldown",
        title: "Pull-Down Bed (Half Dinette)",
        icon: "🛏️",
        category: "Beds",
        bullets: [
            "Manual pull-down bed above dinette",
            "Provides additional sleeping space",
            "Secured with latches when stowed",
            "Folds down from ceiling area"
        ],
        steps: [
            "Clear the dinette area below",
            "Release the latch mechanism",
            "Gently pull bed down until level",
            "Secure support straps/legs if fitted",
            "To stow: lift bed and engage latch securely"
        ],
        safety: [
            "Ensure bed is securely latched before driving",
            "Check support straps are in good condition",
            "Clear area before deploying",
            "Verify latches are fully engaged when stowed"
        ]
    },
    {
        id: "blinds",
        title: "Blinds & Fly Screens",
        icon: "🪟",
        category: "Comfort",
        bullets: [
            "All windows fitted with integrated blinds",
            "Flyscreens allow ventilation without insects",
            "Skylights have both blind and flyscreen",
            "Cassette blinds provide blackout capability"
        ],
        steps: [
            "Pull blind handle down to lower blind",
            "Release at desired position - it will lock",
            "For flyscreen: pull the separate mesh panel",
            "To open: push up gently until it retracts"
        ],
        safety: [
            "Close blinds and secure skylights before driving",
            "Do not force blind mechanisms",
            "Clean flyscreens gently to avoid damage",
            "Report any stuck or damaged blinds for repair"
        ]
    },
    {
        id: "heat-shield",
        title: "Silver External Heat Shield",
        icon: "🌡️",
        category: "Exterior",
        bullets: [
            "Covers front windscreen and cab windows",
            "Reflects sunlight and insulates against temperature",
            "Keeps cab cool in summer, warm in winter",
            "Silver reflective exterior, insulated lining"
        ],
        steps: [
            "Unfold heat shield completely",
            "Position against outside of windscreen",
            "Attach using suction cups and straps",
            "Ensure side panels cover cab windows",
            "Store folded in designated storage area"
        ],
        safety: [
            "Remove heat shield COMPLETELY before driving",
            "Store securely to prevent it blowing away",
            "Check straps and suction cups regularly",
            "Do not drive with any part of shield attached"
        ]
    },
    {
        id: "awning",
        title: "Awning",
        icon: "⛱️",
        category: "Exterior",
        bullets: [
            "Vehicle-mounted roll-out awning",
            "Provides shade and weather protection",
            "Manually operated with winding handle",
            "Secure with ground pegs in windy conditions"
        ],
        steps: [
            "Remove winding handle from storage",
            "Insert handle into awning mechanism",
            "Turn handle to extend awning",
            "Adjust leg heights as needed",
            "Secure legs with pegs or weights",
            "To retract: reverse the winding direction"
        ],
        safety: [
            "NEVER drive with awning extended",
            "Retract awning in strong winds",
            "Secure legs with pegs or weights",
            "Do not allow water to pool on fabric",
            "Dry awning before storage to prevent mould"
        ]
    },
    {
        id: "outdoor-shower",
        title: "Outdoor Shower",
        icon: "🚿",
        category: "Water",
        bullets: [
            "External hot and cold water point",
            "Useful for rinsing after beach visits",
            "Connects to onboard water system",
            "Located behind external panel"
        ],
        steps: [
            "Locate external shower panel and open",
            "Connect shower head if not attached",
            "Turn on hot/cold mixer to desired temperature",
            "Test water temperature before use",
            "Close valves and store securely after use"
        ],
        safety: [
            "Check water temperature before use - can be very hot",
            "Ensure adequate water in tank",
            "Grey water drains to ground - use appropriate locations",
            "Drain and close securely to prevent freezing"
        ]
    },
    {
        id: "bbq",
        title: "Outdoor Gas BBQ Point",
        icon: "🍖",
        category: "Exterior",
        bullets: [
            "External gas connection for portable BBQ",
            "Connected to onboard gas system",
            "Includes shut-off valve for safety",
            "Use with compatible BBQ equipment"
        ],
        steps: [
            "Open external BBQ point cover",
            "Connect BBQ hose to quick-release fitting",
            "Open the BBQ point valve",
            "Light BBQ according to BBQ instructions",
            "Close valve when finished cooking"
        ],
        safety: [
            "Close BBQ point valve when not in use",
            "Check for gas leaks using soapy water",
            "Use only in well-ventilated outdoor areas",
            "NEVER use BBQ indoors or enclosed spaces",
            "Turn off gas at bottle when leaving unattended"
        ]
    },
    {
        id: "outdoor-tv",
        title: "Outdoor TV Point",
        icon: "📺",
        category: "Media",
        bullets: [
            "External 12V power and aerial socket",
            "Set up TV outside under awning",
            "Perfect for outdoor entertainment",
            "Weatherproof connection panel"
        ],
        steps: [
            "Open outdoor TV point cover",
            "Connect TV power cable to 12V socket",
            "Connect aerial cable if needed",
            "Position TV safely under awning",
            "Secure all cables to prevent trips"
        ],
        safety: [
            "Protect TV from rain and moisture",
            "Do not leave TV outside unattended",
            "Monitor battery level when using on 12V",
            "Secure cables to prevent trip hazards"
        ]
    },
    {
        id: "gas-storage",
        title: "Gas Storage (2×13kg)",
        icon: "🔥",
        category: "Power",
        bullets: [
            "Houses two 13kg propane/butane cylinders",
            "Powers heating, cooking, fridge, and BBQ",
            "Changeover valve for switching bottles",
            "External locker with drainage"
        ],
        steps: [
            "Open gas locker door (usually rear of vehicle)",
            "Check cylinder levels by weight or gauge",
            "To change: close all appliances first",
            "Disconnect empty bottle at regulator",
            "Connect new bottle and check for leaks",
            "Use changeover valve to select active bottle"
        ],
        safety: [
            "Turn off all gas appliances before changing bottles",
            "Check connections for leaks using soapy water",
            "Ensure gas locker drain hole is clear",
            "Turn off gas at bottle when unattended",
            "NEVER smoke or use flames near gas locker",
            "Store cylinders upright and secured"
        ]
    },
    {
        id: "toilet",
        title: "Cassette Toilet",
        icon: "🚽",
        category: "Water",
        bullets: [
            "Removable waste cassette system",
            "External access door for removal",
            "Empty at designated disposal points",
            "Flush water from fresh water tank"
        ],
        steps: [
            "Open external cassette access door",
            "Release cassette locking mechanism",
            "Slide cassette out using handle",
            "Transport upright to disposal point",
            "Empty via spout, rinse with water",
            "Add toilet chemical before refitting",
            "Slide back in and ensure latched"
        ],
        safety: [
            "Empty cassette regularly - don't overfill",
            "Use only approved toilet chemicals",
            "Wear gloves when handling cassette",
            "Rinse hands thoroughly after emptying",
            "Never empty in unauthorized locations"
        ]
    },
    {
        id: "water-tank",
        title: "Fresh Water Tank Access",
        icon: "💧",
        category: "Water",
        bullets: [
            "External filler cap for fresh water",
            "Tank level displayed on control panel",
            "Clean water for all onboard taps",
            "Regular sanitization recommended"
        ],
        steps: [
            "Locate external water filler cap",
            "Open cap and insert clean hose",
            "Fill tank while monitoring level gauge",
            "Do not overfill - stop when gauge shows full",
            "Replace cap securely"
        ],
        safety: [
            "Use only potable water from approved sources",
            "Sanitize tank regularly with appropriate products",
            "Check for leaks around filler cap",
            "In winter, drain tank to prevent freezing"
        ]
    },
    {
        id: "alarm",
        title: "Alarm System",
        icon: "🚨",
        category: "Safety",
        bullets: [
            "Protects against unauthorized entry",
            "Motion sensors and door contacts",
            "Armed/disarmed via key fob or panel",
            "Audible siren when triggered"
        ],
        steps: [
            "To arm: press lock button on key fob",
            "Wait for confirmation beep/flash",
            "To disarm: press unlock before entering",
            "If triggered: disarm within grace period",
            "Check panel for zone that was triggered"
        ],
        safety: [
            "Test alarm system regularly",
            "Replace key fob battery as needed",
            "Note alarm code in secure location",
            "Inform neighbours if alarm sounds"
        ]
    },
    {
        id: "tracker",
        title: "Vehicle Tracker",
        icon: "📍",
        category: "Safety",
        bullets: [
            "GPS tracking for security and recovery",
            "View vehicle location via smartphone app",
            "Geofence alerts available",
            "Hidden installation for security"
        ],
        steps: [
            "Download tracker app to smartphone",
            "Log in with account credentials",
            "View current vehicle location",
            "Set up geofence alerts if desired",
            "Check app regularly to ensure active"
        ],
        safety: [
            "Keep tracker subscription active",
            "Do not reveal tracker location to others",
            "Report theft to police AND tracker company",
            "Update app regularly for best performance"
        ]
    },
    {
        id: "internet",
        title: "5G Internet Setup",
        icon: "📶",
        category: "Media",
        bullets: [
            "5G/4G mobile internet router installed",
            "Provides WiFi throughout vehicle",
            "Requires active SIM card with data plan",
            "Connect all devices via WiFi"
        ],
        steps: [
            "Check vehicle documentation for router location",
            "Turn on router if not auto-powered",
            "Connect device to router WiFi network",
            "Enter WiFi password (check router label)",
            "Verify internet connection"
        ],
        safety: [
            "Monitor data usage against plan allowance",
            "Secure WiFi with strong password",
            "Turn off when not needed to save power",
            "Signal strength varies by location"
        ]
    },
    {
        id: "control-panel",
        title: "Main Control Panel",
        icon: "🎛️",
        category: "Power",
        bullets: [
            "Central display for vehicle systems",
            "Shows battery levels and tank status",
            "Controls for lighting and pumps",
            "Monitor all key systems from one location"
        ],
        steps: [
            "Locate main control panel (usually near entrance)",
            "Check battery voltage levels",
            "Monitor fresh/waste water tank levels",
            "Toggle water pump on/off as needed",
            "Control interior lighting circuits"
        ],
        safety: [
            "Check battery levels before extended off-grid stay",
            "Low battery warning requires mains connection",
            "Turn off water pump when vehicle unoccupied",
            "Report any warning lights or errors"
        ]
    }
];

// Category configuration for display order and icons
const CATEGORIES = {
    'Heating': { icon: '🔥', order: 1 },
    'Power': { icon: '⚡', order: 2 },
    'Water': { icon: '💧', order: 3 },
    'Safety': { icon: '🛡️', order: 4 },
    'Beds': { icon: '🛏️', order: 5 },
    'Media': { icon: '📺', order: 6 },
    'Comfort': { icon: '🏠', order: 7 },
    'Exterior': { icon: '🏕️', order: 8 }
};
