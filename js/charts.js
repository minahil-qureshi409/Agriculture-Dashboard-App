
import { loadJSON } from './utils.js';

class ChartManager {
    constructor() {
        this.crops = null;
        this.colors = {
            primary: '#2E7D32',
            secondary: '#1B5E20',
            success: '#4CAF50',
            warning: '#FF9800',
            danger: '#F44336',
            info: '#2196F3',
            purple: '#9C27B0',
            teal: '#009688',
            orange: '#FF5722'
        };
        this.init();
    }
    
    //  Initialize charts
    async init() {
        await this.loadData();
        this.renderAllCharts();
        
        // Re-render charts on window resize
        window.addEventListener('resize', () => this.renderAllCharts());
    }
    
    //   Load crops data
    async loadData() {
        this.crops = await loadJSON('./data/crops.json');
    }
    
    
    // Render all charts
    renderAllCharts() {
        if (!this.crops) return;
        
        this.renderBarChart();
        this.renderPieChart();
        this.renderLineChart();
    }
    
    
    // Render bar chart for crop yield comparison
    renderBarChart() {
        const canvas = document.getElementById('barChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        
        // Set canvas size
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = 300 * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = '300px';
        ctx.scale(dpr, dpr);
        
        // Get top 6 crops by yield
        const topCrops = [...this.crops]
            .sort((a, b) => b.yield - a.yield)
            .slice(0, 6);
        
        const labels = topCrops.map(c => c.name);
        const data = topCrops.map(c => c.yield);
        const maxValue = Math.max(...data);
        
        // Chart dimensions
        const padding = { top: 20, right: 20, bottom: 60, left: 60 };
        const chartWidth = rect.width - padding.left - padding.right;
        const chartHeight = 300 - padding.top - padding.bottom;
        
        // Clear canvas
        ctx.clearRect(0, 0, rect.width, 300);
        
        // Draw bars
        const barWidth = chartWidth / data.length * 0.7;
        const barSpacing = chartWidth / data.length;
        
        data.forEach((value, index) => {
            const barHeight = (value / maxValue) * chartHeight;
            const x = padding.left + index * barSpacing + (barSpacing - barWidth) / 2;
            const y = padding.top + chartHeight - barHeight;
            
            // Draw bar with gradient
            const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
            gradient.addColorStop(0, this.colors.success);
            gradient.addColorStop(1, this.colors.primary);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Draw value on top
            ctx.fillStyle = '#333';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(value, x + barWidth / 2, y - 5);
        });
        
        // Draw axes
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top);
        ctx.lineTo(padding.left, padding.top + chartHeight);
        ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
        ctx.stroke();
        
        // Draw labels
        ctx.fillStyle = '#666';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        labels.forEach((label, index) => {
            const x = padding.left + index * barSpacing + barSpacing / 2;
            const y = padding.top + chartHeight + 15;
            
            // Truncate long labels
            const truncated = label.length > 10 ? label.substring(0, 10) + '...' : label;
            ctx.fillText(truncated, x, y);
        });
        
        // Y-axis label
        ctx.save();
        ctx.translate(15, padding.top + chartHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillText('Yield (tons)', 0, 0);
        ctx.restore();
    }
    
    
    // Render pie chart for crop type distribution
    renderPieChart() {
        const canvas = document.getElementById('pieChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        
        // Set canvas size
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = 300 * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = '300px';
        ctx.scale(dpr, dpr);
        
        // Count crops by type
        const typeCounts = {};
        this.crops.forEach(crop => {
            typeCounts[crop.type] = (typeCounts[crop.type] || 0) + 1;
        });
        
        const types = Object.keys(typeCounts);
        const counts = Object.values(typeCounts);
        const total = counts.reduce((sum, count) => sum + count, 0);
        
        // Chart dimensions
        const centerX = rect.width / 2;
        const centerY = 150;
        const radius = Math.min(rect.width, 300) / 3;
        
        // Clear canvas
        ctx.clearRect(0, 0, rect.width, 300);
        
        // Draw pie slices
        const colorArray = [
            this.colors.success,
            this.colors.info,
            this.colors.warning,
            this.colors.purple,
            this.colors.teal
        ];
        
        let currentAngle = -Math.PI / 2;
        
        types.forEach((type, index) => {
            const sliceAngle = (counts[index] / total) * 2 * Math.PI;
            
            // Draw slice
            ctx.fillStyle = colorArray[index % colorArray.length];
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();
            
            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
            const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
            
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(counts[index], labelX, labelY);
            
            currentAngle += sliceAngle;
        });
        
        // Draw legend
        const legendX = 10;
        let legendY = 220;
        
        types.forEach((type, index) => {
            // Color box
            ctx.fillStyle = colorArray[index % colorArray.length];
            ctx.fillRect(legendX, legendY, 12, 12);
            
            // Label
            ctx.fillStyle = '#333';
            ctx.font = '11px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(`${type} (${counts[index]})`, legendX + 18, legendY + 9);
            
            legendY += 18;
        });
    }
    
    
    // Render line chart for monthly production trends
    renderLineChart() {
        const canvas = document.getElementById('lineChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        
        // Set canvas size
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = 300 * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = '300px';
        ctx.scale(dpr, dpr);
        
        // Generate sample monthly data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const data = [320, 380, 420, 450, 520, 580, 620, 590, 550, 480, 410, 360];
        const maxValue = Math.max(...data);
        
        // Chart dimensions
        const padding = { top: 20, right: 20, bottom: 40, left: 60 };
        const chartWidth = rect.width - padding.left - padding.right;
        const chartHeight = 300 - padding.top - padding.bottom;
        
        // Clear canvas
        ctx.clearRect(0, 0, rect.width, 300);
        
        // Draw grid lines
        ctx.strokeStyle = '#f0f0f0';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding.top + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(padding.left + chartWidth, y);
            ctx.stroke();
        }
        
        // Draw line
        ctx.strokeStyle = this.colors.primary;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        data.forEach((value, index) => {
            const x = padding.left + (chartWidth / (data.length - 1)) * index;
            const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw points
        data.forEach((value, index) => {
            const x = padding.left + (chartWidth / (data.length - 1)) * index;
            const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
            
            ctx.fillStyle = this.colors.success;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        // Draw axes
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top);
        ctx.lineTo(padding.left, padding.top + chartHeight);
        ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
        ctx.stroke();
        
        // Draw x-axis labels
        ctx.fillStyle = '#666';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        months.forEach((month, index) => {
            const x = padding.left + (chartWidth / (months.length - 1)) * index;
            const y = padding.top + chartHeight + 20;
            ctx.fillText(month, x, y);
        });
        
        // Y-axis label
        ctx.save();
        ctx.translate(15, padding.top + chartHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillText('Production (tons)', 0, 0);
        ctx.restore();
    }
    
    
    // Update charts with new data
    async updateCharts(cropsData) {
        if (cropsData) {
            this.crops = cropsData;
        } else {
            await this.loadData();
        }
        this.renderAllCharts();
    }
}

// Initialize charts when DOM is loaded
let chartManagerInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    chartManagerInstance = new ChartManager();
});

// Export for use in other modules
export default ChartManager;
export { chartManagerInstance };