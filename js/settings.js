import { showToast, getLocalStorage, setLocalStorage } from './utils.js';

class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.init();
    }
    
    // Initialize settings manager
    init() {
        this.setupEventListeners();
        
        // Listen for page load events
        document.addEventListener('pageLoad', (e) => {
            if (e.detail.page === 'settings') {
                this.loadSettingsToForm();
            }
        });
    }
    
    // Load settings from localStorage
    loadSettings() {
        return getLocalStorage('appSettings', {
            profile: {
                name: 'Admin User',
                email: 'admin@agrimanage.com',
                role: 'Farm Manager',
                phone: '+1-555-0100'
            },
            preferences: {
                language: 'en',
                timezone: 'est',
                dateFormat: 'mm/dd/yyyy',
                notifications: true,
                emailAlerts: true
            }
        });
    }
    
    // Save settings to localStorage
    saveSettings() {
        setLocalStorage('appSettings', this.settings);
    }
    
    // Load settings to form
    loadSettingsToForm() {
        // Profile settings
        const nameInput = document.getElementById('settingName');
        const emailInput = document.getElementById('settingEmail');
        const roleInput = document.getElementById('settingRole');
        const phoneInput = document.getElementById('settingPhone');
        
        if (nameInput) nameInput.value = this.settings.profile.name;
        if (emailInput) emailInput.value = this.settings.profile.email;
        if (roleInput) roleInput.value = this.settings.profile.role;
        if (phoneInput) phoneInput.value = this.settings.profile.phone;
        
        // Preferences
        const languageSelect = document.getElementById('settingLanguage');
        const timezoneSelect = document.getElementById('settingTimezone');
        const dateFormatSelect = document.getElementById('settingDateFormat');
        const notificationsCheck = document.getElementById('settingNotifications');
        const emailAlertsCheck = document.getElementById('settingEmailAlerts');
        
        if (languageSelect) languageSelect.value = this.settings.preferences.language;
        if (timezoneSelect) timezoneSelect.value = this.settings.preferences.timezone;
        if (dateFormatSelect) dateFormatSelect.value = this.settings.preferences.dateFormat;
        if (notificationsCheck) notificationsCheck.checked = this.settings.preferences.notifications;
        if (emailAlertsCheck) emailAlertsCheck.checked = this.settings.preferences.emailAlerts;
    }
    
    //  Setup event listeners
    setupEventListeners() {
        // Save profile
        const saveProfileBtn = document.getElementById('saveProfileBtn');
        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', () => this.saveProfile());
        }
        
        // Save preferences
        const savePreferencesBtn = document.getElementById('savePreferencesBtn');
        if (savePreferencesBtn) {
            savePreferencesBtn.addEventListener('click', () => this.savePreferences());
        }
        
        // Change password
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => this.changePassword());
        }
        
        // Export data
        const exportDataBtn = document.getElementById('exportDataBtn');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => this.exportData());
        }
        
        // Clear cache
        const clearCacheBtn = document.getElementById('clearCacheBtn');
        if (clearCacheBtn) {
            clearCacheBtn.addEventListener('click', () => this.clearCache());
        }
        
        // Reset data
        const resetDataBtn = document.getElementById('resetDataBtn');
        if (resetDataBtn) {
            resetDataBtn.addEventListener('click', () => this.resetData());
        }
    }
    
    // Save profile settings
    saveProfile() {
        this.settings.profile.name = document.getElementById('settingName')?.value || '';
        this.settings.profile.email = document.getElementById('settingEmail')?.value || '';
        this.settings.profile.phone = document.getElementById('settingPhone')?.value || '';
        
        this.saveSettings();
        showToast('Profile settings saved successfully!', 'success');
    }
    
    // Save preferences
    savePreferences() {
        this.settings.preferences.language = document.getElementById('settingLanguage')?.value || 'en';
        this.settings.preferences.timezone = document.getElementById('settingTimezone')?.value || 'est';
        this.settings.preferences.dateFormat = document.getElementById('settingDateFormat')?.value || 'mm/dd/yyyy';
        this.settings.preferences.notifications = document.getElementById('settingNotifications')?.checked || false;
        this.settings.preferences.emailAlerts = document.getElementById('settingEmailAlerts')?.checked || false;
        
        this.saveSettings();
        showToast('Preferences saved successfully!', 'success');
    }
    
    // Change password
    changePassword() {
        const currentPassword = document.getElementById('currentPassword')?.value;
        const newPassword = document.getElementById('newPassword')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            showToast('Please fill in all password fields', 'warning');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showToast('New passwords do not match', 'danger');
            return;
        }
        
        if (newPassword.length < 8) {
            showToast('Password must be at least 8 characters long', 'danger');
            return;
        }
        
        // Simulate password change
        showToast('Password changed successfully!', 'success');
        
        // Clear password fields
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    }
    
    // Export all data
    exportData() {
        const data = {
            crops: getLocalStorage('crops', []),
            farmers: getLocalStorage('farmers', []),
            settings: this.settings,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `agrimanage-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        showToast('Data exported successfully!', 'success');
    }
    
    // Clear cache
    clearCache() {
        if (confirm('Are you sure you want to clear the cache? This will not delete your data.')) {
            showToast('Cache cleared successfully!', 'success');
        }
    }
    
    // Reset to default data
    async resetData() {
        if (confirm('Are you sure you want to reset all data to defaults? This action cannot be undone.')) {
            // Clear localStorage
            localStorage.removeItem('crops');
            localStorage.removeItem('farmers');
            localStorage.removeItem('appSettings');
            
            showToast('Data reset successfully! Reloading...', 'info');
            
            // Reload page after 1 second
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }
}

let settingsManager = null;

document.addEventListener('DOMContentLoaded', () => {
    settingsManager = new SettingsManager();
    window.settingsManager = settingsManager;
});

export default SettingsManager;