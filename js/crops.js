import { loadJSON, getLocalStorage, setLocalStorage, showToast, formatDate, getStatusClass, generateId, debounce } from './utils.js';
import { validateCropForm, showError, clearValidation } from './validation.js';

class CropsManager {
    constructor() {
        this.crops = [];
        this.filteredCrops = [];
        this.editingId = null;
        this.deleteId = null;
        
        this.init();
    }
    
    
    // Initialize crops manager
    async init() {
        await this.loadCrops();
        this.setupEventListeners();
        this.renderTable();
        
        // Listen for page load events
        document.addEventListener('pageLoad', (e) => {
            if (e.detail.page === 'crops') {
                this.renderTable();
            }
        });
    }
    
    
    // Load crops data
    async loadCrops() {
        // Try to load from localStorage first
        const storedCrops = getLocalStorage('crops');
        
        if (storedCrops && Array.isArray(storedCrops) && storedCrops.length > 0) {
            this.crops = storedCrops;
        } else {
            // Load from JSON file
            const jsonCrops = await loadJSON('./data/crops.json');
            if (jsonCrops) {
                this.crops = jsonCrops;
                this.saveCrops();
            }
        }
        
        this.filteredCrops = [...this.crops];
    }
    
    
    // Save crops to localStorage
    
    saveCrops() {
        setLocalStorage('crops', this.crops);
        
        // Update dashboard statistics
        if (window.dashboardInstance) {
            window.dashboardInstance.updateStatisticsFromCrops(this.crops);
        }
        
        // Update charts
        if (window.chartManagerInstance) {
            window.chartManagerInstance.updateCharts(this.crops);
        }
    }
    
    
    // Setup event listeners
    setupEventListeners() {
        // Add crop button
        const addBtn = document.getElementById('addCropBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openAddModal());
        }
        
        // Save crop button
        const saveBtn = document.getElementById('saveCropBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveCrop());
        }
        
        // Confirm delete button
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', () => this.confirmDelete());
        }
        
        // Search input
        const searchInput = document.getElementById('searchCrop');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => this.handleSearch(e.target.value), 300));
        }
        
        // Filter dropdowns
        const filterStatus = document.getElementById('filterStatus');
        const filterType = document.getElementById('filterType');
        
        if (filterStatus) {
            filterStatus.addEventListener('change', () => this.applyFilters());
        }
        
        if (filterType) {
            filterType.addEventListener('change', () => this.applyFilters());
        }
        
        // Clear form when modal is hidden
        const cropModal = document.getElementById('cropModal');
        if (cropModal) {
            cropModal.addEventListener('hidden.bs.modal', () => this.resetForm());
        }
    }
    
    
    // Render crops table
    renderTable() {
        const tbody = document.getElementById('cropsTableBody');
        if (!tbody) return;
        
        if (this.filteredCrops.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center text-muted py-4">
                        No crops found. Click "Add New Crop" to get started.
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = this.filteredCrops.map(crop => `
            <tr>
                <td>${crop.id}</td>
                <td><strong>${crop.name}</strong></td>
                <td>${crop.type}</td>
                <td>${crop.area}</td>
                <td><span class="badge ${getStatusClass(crop.status)}">${crop.status}</span></td>
                <td>${crop.yield || 0}</td>
                <td>${formatDate(crop.plantDate)}</td>
                <td>${crop.farmer}</td>
                <td>
                    <button class="btn btn-sm btn-primary btn-action" onclick="cropsManager.editCrop(${crop.id})">
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger btn-action" onclick="cropsManager.deleteCrop(${crop.id})">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    
//  Open add modal
    openAddModal() {
        this.editingId = null;
        this.resetForm();
        document.getElementById('cropModalTitle').textContent = 'Add New Crop';
        
        const modal = new bootstrap.Modal(document.getElementById('cropModal'));
        modal.show();
    }
    
    /**
     * Edit crop
     * @param {number} id - Crop ID
     */
    editCrop(id) {
        const crop = this.crops.find(c => c.id === id);
        if (!crop) return;
        
        this.editingId = id;
        
        // Populate form
        document.getElementById('cropId').value = crop.id;
        document.getElementById('cropName').value = crop.name;
        document.getElementById('cropType').value = crop.type;
        document.getElementById('cropArea').value = crop.area;
        document.getElementById('cropStatus').value = crop.status;
        document.getElementById('cropYield').value = crop.yield || 0;
        document.getElementById('cropFarmer').value = crop.farmer;
        document.getElementById('cropPlantDate').value = crop.plantDate;
        document.getElementById('cropHarvestDate').value = crop.harvestDate || '';
        
        document.getElementById('cropModalTitle').textContent = 'Edit Crop';
        
        const modal = new bootstrap.Modal(document.getElementById('cropModal'));
        modal.show();
    }
    
    
    // Save crop (add or update)
    saveCrop() {
        // Get form data
        const formData = {
            name: document.getElementById('cropName').value.trim(),
            type: document.getElementById('cropType').value,
            area: parseFloat(document.getElementById('cropArea').value),
            status: document.getElementById('cropStatus').value,
            yield: parseFloat(document.getElementById('cropYield').value) || 0,
            farmer: document.getElementById('cropFarmer').value.trim(),
            plantDate: document.getElementById('cropPlantDate').value,
            harvestDate: document.getElementById('cropHarvestDate').value
        };
        
        // Validate form
        const validation = validateCropForm(formData);
        
        if (!validation.isValid) {
            // Show validation errors
            Object.keys(validation.errors).forEach(field => {
                const input = document.getElementById('crop' + field.charAt(0).toUpperCase() + field.slice(1));
                if (input) {
                    showError(input, validation.errors[field]);
                }
            });
            return;
        }
        
        // Create crop object
        const cropData = {
            ...formData,
            areaUnit: 'acres',
            yieldUnit: 'tons'
        };
        
        if (this.editingId) {
            // Update existing crop
            const index = this.crops.findIndex(c => c.id === this.editingId);
            if (index !== -1) {
                this.crops[index] = { ...this.crops[index], ...cropData };
                showToast('Crop updated successfully!', 'success');
            }
        } else {
            // Add new crop
            cropData.id = generateId();
            this.crops.push(cropData);
            showToast('Crop added successfully!', 'success');
        }
        
        // Save and refresh
        this.saveCrops();
        this.applyFilters();
        this.renderTable();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('cropModal'));
        if (modal) modal.hide();
    }
    
    /**
     * Delete crop
     * @param {number} id - Crop ID
     */
    deleteCrop(id) {
        this.deleteId = id;
        const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    }
    
    
    // Confirm delete
    confirmDelete() {
        if (this.deleteId) {
            const index = this.crops.findIndex(c => c.id === this.deleteId);
            if (index !== -1) {
                this.crops.splice(index, 1);
                this.saveCrops();
                this.applyFilters();
                this.renderTable();
                showToast('Crop deleted successfully!', 'success');
            }
        }
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        if (modal) modal.hide();
        
        this.deleteId = null;
    }
    
    /**
     * Handle search
     * @param {string} query - Search query
     */
    handleSearch(query) {
        this.applyFilters();
    }
    
    
    // Apply filters
    applyFilters() {
        const searchQuery = document.getElementById('searchCrop')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('filterStatus')?.value || '';
        const typeFilter = document.getElementById('filterType')?.value || '';
        
        this.filteredCrops = this.crops.filter(crop => {
            // Search filter
            const matchesSearch = !searchQuery || 
                crop.name.toLowerCase().includes(searchQuery) ||
                crop.type.toLowerCase().includes(searchQuery) ||
                crop.farmer.toLowerCase().includes(searchQuery);
            
            // Status filter
            const matchesStatus = !statusFilter || crop.status === statusFilter;
            
            // Type filter
            const matchesType = !typeFilter || crop.type === typeFilter;
            
            return matchesSearch && matchesStatus && matchesType;
        });
        
        this.renderTable();
    }
    
    
    // Reset form
    resetForm() {
        const form = document.getElementById('cropForm');
        if (form) {
            form.reset();
            
            // Clear validation states
            const inputs = form.querySelectorAll('input, select');
            inputs.forEach(input => clearValidation(input));
        }
        
        this.editingId = null;
    }
}

// Initialize crops manager when DOM is loaded
let cropsManager = null;

document.addEventListener('DOMContentLoaded', () => {
    cropsManager = new CropsManager();
    window.cropsManager = cropsManager; // Make it globally accessible for inline onclick handlers
});

export default CropsManager;