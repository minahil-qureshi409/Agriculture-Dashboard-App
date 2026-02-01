import { showToast, formatDate } from './utils.js';

class ReportsManager {
    constructor() {
        this.reports = [
            {
                id: 1,
                name: 'Q4 2023 Yield Summary',
                type: 'Yield Summary',
                dateGenerated: '2024-01-15',
                status: 'Completed'
            },
            {
                id: 2,
                name: 'December Crops Overview',
                type: 'Crops Overview',
                dateGenerated: '2024-01-10',
                status: 'Completed'
            },
            {
                id: 3,
                name: 'Farmers Performance Report',
                type: 'Farmers Performance',
                dateGenerated: '2024-01-08',
                status: 'Completed'
            },
            {
                id: 4,
                name: 'Annual Financial Report 2023',
                type: 'Financial Report',
                dateGenerated: '2024-01-05',
                status: 'Pending'
            },
            {
                id: 5,
                name: 'November Yield Analysis',
                type: 'Yield Summary',
                dateGenerated: '2023-12-01',
                status: 'Completed'
            }
        ];
        
        this.init();
    }
    
    //   Initialize reports manager
    init() {
        this.setupEventListeners();
        
        // Listen for page load events
        document.addEventListener('pageLoad', (e) => {
            if (e.detail.page === 'reports') {
                this.renderReportsTable();
            }
        });
    }
    
    //  Setup event listeners
    setupEventListeners() {
        const generateBtn = document.getElementById('generateReportBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateReport());
        }
    }
    
//   Render reports table 
    renderReportsTable() {
        const tbody = document.getElementById('reportsTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = this.reports.map(report => `
            <tr>
                <td><strong>${report.name}</strong></td>
                <td>${report.type}</td>
                <td>${formatDate(report.dateGenerated)}</td>
                <td>
                    <span class="badge ${report.status === 'Completed' ? 'bg-success' : 'bg-warning'}">
                        ${report.status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="reportsManager.viewReport(${report.id})">
                        <i class="bi bi-eye"></i> View
                    </button>
                    <button class="btn btn-sm btn-success" onclick="reportsManager.downloadReport(${report.id})">
                        <i class="bi bi-download"></i> Download
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    // Generate new report
    generateReport() {
        const reportType = document.getElementById('reportType')?.value || 'yield';
        const startDate = document.getElementById('reportStartDate')?.value;
        const endDate = document.getElementById('reportEndDate')?.value;
        
        if (!startDate || !endDate) {
            showToast('Please select start and end dates', 'warning');
            return;
        }
        
        if (new Date(startDate) > new Date(endDate)) {
            showToast('Start date must be before end date', 'danger');
            return;
        }
        
        // Simulate report generation
        showToast('Generating report... This may take a moment.', 'info');
        
        setTimeout(() => {
            const reportTypes = {
                'yield': 'Yield Summary',
                'crops': 'Crops Overview',
                'farmers': 'Farmers Performance',
                'financial': 'Financial Report'
            };
            
            const newReport = {
                id: this.reports.length + 1,
                name: `${reportTypes[reportType]} - ${formatDate(startDate)} to ${formatDate(endDate)}`,
                type: reportTypes[reportType],
                dateGenerated: new Date().toISOString().split('T')[0],
                status: 'Completed'
            };
            
            this.reports.unshift(newReport);
            this.renderReportsTable();
            showToast('Report generated successfully!', 'success');
        }, 2000);
    }
    
    //  View report
    viewReport(id) {
        const report = this.reports.find(r => r.id === id);
        if (report) {
            showToast(`Opening report: ${report.name}`, 'info');
        }
    }
    
    
    //  Download report
    downloadReport(id) {
        const report = this.reports.find(r => r.id === id);
        if (report) {
            showToast(`Downloading report: ${report.name}`, 'success');
        }
    }
}

let reportsManager = null;

document.addEventListener('DOMContentLoaded', () => {
    reportsManager = new ReportsManager();
    window.reportsManager = reportsManager;
});

export default ReportsManager;