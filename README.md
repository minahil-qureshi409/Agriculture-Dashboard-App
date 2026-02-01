# Agriculture-Dashboard-App

## Design Guidelines

### Design References
- **AdminLTE**: Professional admin dashboard layouts
- **CoreUI**: Clean, modern admin interface patterns
- **Style**: Professional Business Dashboard + Clean UI + Agricultural Theme

### Color Palette
- Primary: #2E7D32 (Forest Green - agriculture theme)
- Secondary: #1B5E20 (Dark Green - accents)
- Success: #4CAF50 (Light Green - positive metrics)
- Warning: #FF9800 (Orange - alerts)
- Danger: #F44336 (Red - critical)
- Background: #F5F5F5 (Light Gray - main background)
- Card Background: #FFFFFF (White - cards/sections)
- Text Primary: #212121 (Dark Gray)
- Text Secondary: #757575 (Medium Gray)
- Border: #E0E0E0 (Light Gray borders)

### Typography
- Font Family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- Heading1: 28px, font-weight 600
- Heading2: 24px, font-weight 600
- Heading3: 20px, font-weight 600
- Body: 14px, font-weight 400
- Small: 12px, font-weight 400
- Navigation: 15px, font-weight 500

### Key Component Styles
- **Sidebar**: Dark green (#1B5E20), white text, 260px width, smooth toggle animation
- **Cards**: White background, subtle shadow (0 2px 4px rgba(0,0,0,0.1)), 8px border-radius
- **Buttons**: Primary green (#2E7D32), white text, 6px border-radius, hover: darken 10%
- **Tables**: Striped rows, hover effect, responsive with horizontal scroll
- **Forms**: Clean inputs with bottom border focus effect, inline validation messages
- **Charts**: Canvas-based with green color scheme matching theme

### Layout & Spacing
- Sidebar: Fixed left, 260px width (collapsed: 60px)
- Main content: Left margin 260px (collapsed: 60px), padding 20px
- Card padding: 20px
- Section spacing: 30px vertical gaps
- Grid gaps: 20px between cards

### Images to Generate
1. **user-avatar-admin.jpg** - Professional male farmer/agricultural manager avatar, friendly expression (Style: photorealistic, professional headshot)
2. **dashboard-hero-farm.jpg** - Aerial view of green agricultural fields with crops (Style: photorealistic, bright daylight)
3. **crops-icon-wheat.png** - Simple wheat/grain icon for crops section (Style: minimalist icon, green color)
4. **farm-landscape-background.jpg** - Wide agricultural landscape with fields and sky (Style: photorealistic, panoramic view)

---

## Project Structure

```
/workspace/app/frontend/
├── index.html                 # Main dashboard page
├── style.css                  # Custom styles (in addition to Bootstrap)
├── script.js                  # Main JavaScript entry point
├── css/
│   ├── sidebar.css           # Sidebar specific styles
│   ├── dashboard.css         # Dashboard cards and layout
│   ├── charts.css            # Chart container styles
│   └── responsive.css        # Media queries and responsive design
├── js/
│   ├── main.js               # Main application logic and initialization
│   ├── dashboard.js          # Dashboard statistics and cards
│   ├── crops.js              # Crops CRUD operations
│   ├── charts.js             # Chart rendering (bar, pie, line)
│   ├── sidebar.js            # Sidebar toggle and navigation
│   ├── validation.js         # Form validation utilities
│   └── utils.js              # Helper functions and utilities
├── data/
│   ├── crops.json            # Crops data
│   ├── farmers.json          # Farmers data
│   ├── statistics.json       # Dashboard statistics
│   └── notifications.json    # Notifications data
└── assets/
    └── images/               # Generated images folder
```

## Development Tasks

# Project Structure Setup ✓
- Create folder structure (css/, js/, data/, assets/images/)
- Set up base files

# Static Data Preparation
- Create crops.json with sample crop data (id, name, type, area, status, yield, plantDate)
- Create farmers.json with farmer information
- Create statistics.json with dashboard metrics
- Create notifications.json with notification items

# HTML Structure
- Build semantic HTML5 structure in index.html
- Include Bootstrap 5 CDN
- Create sidebar with navigation menu
- Create top navbar with user profile and notifications
- Create main content area with dashboard cards
- Create charts section (3 chart containers)
- Create crops management table with modal forms
- Add all necessary Bootstrap components

# CSS Styling
- Create sidebar.css for sidebar styling and animations
- Create dashboard.css for card layouts and statistics
- Create charts.css for chart containers
- Create responsive.css for mobile breakpoints
- Update style.css with global styles and theme variables

# Sidebar and Navigation
- Implement sidebar toggle functionality in sidebar.js
- Add active state management for navigation items
- Create smooth transition animations
- Handle responsive behavior

# Dashboard Statistics
- Create dashboard.js to render statistic cards dynamically
- Load data from statistics.json
- Implement counter animations for numbers
- Add icon integration for each card

 ## Task 7: Charts Implementation
- Create charts.js with Canvas API implementations
- Build bar chart for crop yield comparison
- Build pie chart for crop type distribution
- Build line chart for monthly production trends
- Make charts responsive

# Crops Management
- Create crops.js for CRUD operations
- Implement dynamic table rendering from crops.json
- Create Add Crop modal with form
- Create Edit Crop functionality
- Implement Delete with confirmation
- Add search/filter functionality
- Store data in localStorage for persistence

# Form Validation
- Create validation.js with validation rules
- Implement real-time validation for crop forms
- Add error message display
- Validate required fields, data types, and formats
- Prevent form submission on validation errors

# User Profile and Notifications
- Implement user profile section in main.js
- Create notification dropdown functionality
- Load notifications from notifications.json
- Add logout functionality (clear session)

### Task 11: Responsive Design
- Implement mobile-first responsive layout
- Add media queries for tablets and mobile devices
- Make sidebar collapsible on mobile
- Ensure tables are horizontally scrollable
- Test touch interactions
