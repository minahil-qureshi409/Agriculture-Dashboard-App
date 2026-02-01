import { loadJSON, showToast } from './utils.js';
import Dashboard, { dashboardInstance } from './dashboard.js';
import ChartManager, { chartManagerInstance } from './charts.js';
import CropsManager from './crops.js';
import SidebarManager from './sidebar.js';

class App {
    constructor() {
        this.notifications = [];
        this.init();
    }
    
    // Initialize application
    async init() {
        // Make instances globally available
        window.dashboardInstance = dashboardInstance;
        window.chartManagerInstance = chartManagerInstance;
        
        // Load and display notifications
        await this.loadNotifications();
        this.renderNotifications();
        
        // Setup logout functionality
        this.setupLogout();
        
        // Show welcome message
        setTimeout(() => {
            showToast('Welcome to Agriculture Management Dashboard!', 'success');
        }, 500);
    }
    
    // Load notifications data
    async loadNotifications() {
        this.notifications = await loadJSON('./data/notifications.json');
        if (this.notifications) {
            this.updateNotificationBadge();
        }
    }
    
    // Render notifications dropdown
    renderNotifications() {
        const notificationList = document.getElementById('notificationList');
        if (!notificationList || !this.notifications) return;
        
        // Clear existing items except header and divider
        const items = notificationList.querySelectorAll('.notification-item');
        items.forEach(item => item.remove());
        
        if (this.notifications.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.className = 'dropdown-item text-center text-muted py-3';
            emptyItem.textContent = 'No notifications';
            notificationList.appendChild(emptyItem);
            return;
        }
        
        // Add notification items
        this.notifications.forEach(notification => {
            const item = document.createElement('li');
            item.className = `notification-item ${!notification.read ? 'unread' : ''}`;
            item.innerHTML = `
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${notification.time}</div>
            `;
            
            item.addEventListener('click', () => this.markAsRead(notification.id));
            notificationList.appendChild(item);
        });
    }
    
    // Update notification badge count 
    updateNotificationBadge() {
        const badge = document.getElementById('notificationBadge');
        if (!badge) return;
        
        const unreadCount = this.notifications.filter(n => !n.read).length;
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
    
    /**
     * Mark notification as read
     * @param {number} id - Notification ID
     */
    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification && !notification.read) {
            notification.read = true;
            this.updateNotificationBadge();
            this.renderNotifications();
        }
    }
    
    
    //   Setup logout functionality
    setupLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }
    
    // Handle logout
    logout() {
        // Show confirmation
        if (confirm('Are you sure you want to logout?')) {
            // Clear any session data if needed
            // localStorage.clear(); // Uncomment if you want to clear all data
            
            showToast('Logged out successfully!', 'info');
            
            // Redirect or reload
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

export default App;