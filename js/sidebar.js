class SidebarManager {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.mainContent = document.getElementById('mainContent');
        this.toggleBtn = document.getElementById('sidebarToggle');
        this.navItems = document.querySelectorAll('.nav-item');
        this.pages = {
            dashboard: document.getElementById('dashboardPage'),
            crops: document.getElementById('cropsPage'),
            farmers: document.getElementById('farmersPage'),
            reports: document.getElementById('reportsPage'),
            settings: document.getElementById('settingsPage')
        };
        this.currentPage = 'dashboard';
        
        this.init();
    }
    
    // Initialize sidebar functionality
    init() {
        // Toggle sidebar on button click
        this.toggleBtn.addEventListener('click', () => this.toggleSidebar());
        
        // Handle navigation clicks
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleNavClick(e));
        });
        
        // Handle responsive behavior
        this.handleResponsive();
        window.addEventListener('resize', () => this.handleResponsive());
        
        // Create overlay for mobile
        this.createOverlay();
    }
    
    // Toggle sidebar collapsed state
    toggleSidebar() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            this.sidebar.classList.toggle('show');
            const overlay = document.querySelector('.sidebar-overlay');
            if (overlay) {
                overlay.classList.toggle('show');
            }
        } else {
            this.sidebar.classList.toggle('collapsed');
            this.mainContent.classList.toggle('collapsed');
        }
    }
    
    /**
     * Handle navigation item click
     * @param {Event} e - Click event
     */
    handleNavClick(e) {
        e.preventDefault();
        const target = e.currentTarget;
        const page = target.dataset.page;
        
        if (page && this.pages[page]) {
            // Update active state
            this.navItems.forEach(item => item.classList.remove('active'));
            target.classList.add('active');
            
            // Show selected page
            this.showPage(page);
            
            // Update page title
            const pageTitle = target.querySelector('.nav-text').textContent;
            document.getElementById('pageTitle').textContent = pageTitle;
            
            // Close sidebar on mobile after navigation
            if (window.innerWidth <= 768) {
                this.sidebar.classList.remove('show');
                const overlay = document.querySelector('.sidebar-overlay');
                if (overlay) {
                    overlay.classList.remove('show');
                }
            }
        }
    }
    
    /**
     * Show a specific page
     * @param {string} pageName - Name of the page to show
     */
    showPage(pageName) {
        // Hide all pages
        Object.values(this.pages).forEach(page => {
            if (page) page.classList.add('d-none');
        });
        
        // Show selected page
        if (this.pages[pageName]) {
            this.pages[pageName].classList.remove('d-none');
            this.currentPage = pageName;
            
            // Trigger page-specific initialization if needed
            this.triggerPageLoad(pageName);
        }
    }
    
    /**
     * Trigger page-specific load events
     * @param {string} pageName - Name of the page
     */
    triggerPageLoad(pageName) {
        const event = new CustomEvent('pageLoad', { detail: { page: pageName } });
        document.dispatchEvent(event);
    }
    
    // Handle responsive behavior
    handleResponsive() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // On mobile, remove collapsed class and hide sidebar by default
            this.sidebar.classList.remove('collapsed', 'show');
            this.mainContent.classList.remove('collapsed');
        } else {
            // On desktop, remove show class and mobile overlay
            this.sidebar.classList.remove('show');
            const overlay = document.querySelector('.sidebar-overlay');
            if (overlay) {
                overlay.classList.remove('show');
            }
        }
    }
    
    // Create overlay for mobile sidebar
    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.addEventListener('click', () => {
            this.sidebar.classList.remove('show');
            overlay.classList.remove('show');
        });
        document.body.appendChild(overlay);
    }
}

// Initialize sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SidebarManager();
});

export default SidebarManager;