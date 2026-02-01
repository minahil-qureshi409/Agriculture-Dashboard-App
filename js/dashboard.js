import { loadJSON, animateCounter, formatNumber } from './utils.js';

class Dashboard {
    constructor() {
        this.statistics = null;
        this.crops = null;
        this.init();
    }
    
    
    // Initialize dashboard
    async init() {
        await this.loadData();
        this.renderStatistics();
    }
    
    
    // Load data from JSON files
    async loadData() {
        try {
            this.statistics = await loadJSON('./data/statistics.json');
            this.crops = await loadJSON('./data/crops.json');
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }
    
    
    // Render statistics cards with animation
    renderStatistics() {
        if (!this.statistics) {
            console.error('Statistics data not available');
            return;
        }
        
        // Animate stat values
        const statCrops = document.getElementById('statCrops');
        const statFarms = document.getElementById('statFarms');
        const statFarmers = document.getElementById('statFarmers');
        const statYield = document.getElementById('statYield');
        
        if (statCrops) animateCounter(statCrops, this.statistics.totalCrops, 1000);
        if (statFarms) animateCounter(statFarms, this.statistics.totalFarms, 1000);
        if (statFarmers) animateCounter(statFarmers, this.statistics.totalFarmers, 1000);
        if (statYield) animateCounter(statYield, this.statistics.totalYield, 1000);
    }
    
    
    // Update statistics from crops data
    updateStatisticsFromCrops(cropsData) {
        if (!cropsData || !Array.isArray(cropsData)) return;
        
        // Calculate total yield from crops
        const totalYield = cropsData.reduce((sum, crop) => sum + (crop.yield || 0), 0);
        
        // Update statistics
        const statCrops = document.getElementById('statCrops');
        const statYield = document.getElementById('statYield');
        
        if (statCrops) {
            statCrops.textContent = formatNumber(cropsData.length);
        }
        if (statYield) {
            statYield.textContent = formatNumber(Math.round(totalYield));
        }
    }
    
    
    // Refresh dashboard data
    async refresh() {
        await this.loadData();
        this.renderStatistics();
    }
}

// Initialize dashboard when DOM is loaded
let dashboardInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    dashboardInstance = new Dashboard();
});

// Export for use in other modules
export default Dashboard;
export { dashboardInstance };