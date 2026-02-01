/**
 * Farmers management module
 */

import { loadJSON, getLocalStorage, setLocalStorage, showToast, generateId, debounce } from './utils.js';

class FarmersManager {
    constructor() {
        this.farmers = [];
        this.filteredFarmers = [];
        this.editingId = null;
        
        this.init();
    }
    
    // Initialize farmers manager
    async init() {
        await this.loadFarmers();
        this.setupEventListeners();
        
        // Listen for page load events
        document.addEventListener('pageLoad', (e) => {
            if (e.detail.page === 'farmers') {
                this.renderGrid();
            }
        });
    }
    
    // Load farmers data
    async loadFarmers() {
        const storedFarmers = getLocalStorage('farmers');
        
        if (storedFarmers && Array.isArray(storedFarmers) && storedFarmers.length > 0) {
            this.farmers = storedFarmers;
        } else {
            const jsonFarmers = await loadJSON('./data/farmers.json');
            if (jsonFarmers) {
                this.farmers = jsonFarmers;
                this.saveFarmers();
            }
        }
        
        this.filteredFarmers = [...this.farmers];
    }
    
    // Save farmers to localStorage 
    saveFarmers() {
        setLocalStorage('farmers', this.farmers);
    }
    
    // Setup event listeners 
    setupEventListeners() {
        const addBtn = document.getElementById('addFarmerBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openAddModal());
        }
        
        const saveBtn = document.getElementById('saveFarmerBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveFarmer());
        }
        
        const searchInput = document.getElementById('searchFarmer');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => this.handleSearch(e.target.value), 300));
        }
        
        const farmerModal = document.getElementById('farmerModal');
        if (farmerModal) {
            farmerModal.addEventListener('hidden.bs.modal', () => this.resetForm());
        }
    }
    
    // Render farmers grid 
    renderGrid() {
        const grid = document.getElementById('farmersGrid');
        if (!grid) return;
        
        if (this.filteredFarmers.length === 0) {
            grid.innerHTML = `
                <div class="col-12">
                    <div class="card">
                        <div class="card-body text-center py-5">
                            <i class="bi bi-people" style="font-size: 64px; color: #ccc;"></i>
                            <p class="text-muted mt-3">No farmers found. Click "Add New Farmer" to get started.</p>
                        </div>
                    </div>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = this.filteredFarmers.map(farmer => `
            <div class="col-lg-4 col-md-6">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="farmer-avatar">
                                <i class="bi bi-person-circle" style="font-size: 48px; color: var(--primary-color);"></i>
                            </div>
                            <div class="ms-3 flex-grow-1">
                                <h5 class="mb-0">${farmer.name}</h5>
                                <small class="text-muted"><i class="bi bi-geo-alt"></i> ${farmer.location}</small>
                            </div>
                        </div>
                        <hr>
                        <div class="farmer-details">
                            <p class="mb-2">
                                <i class="bi bi-telephone text-success"></i>
                                <span class="ms-2">${farmer.contact}</span>
                            </p>
                            <p class="mb-2">
                                <i class="bi bi-envelope text-primary"></i>
                                <span class="ms-2">${farmer.email}</span>
                            </p>
                            <p class="mb-0">
                                <i class="bi bi-house text-warning"></i>
                                <span class="ms-2">${farmer.farmSize} acres</span>
                            </p>
                        </div>
                        <div class="mt-3 d-flex gap-2">
                            <button class="btn btn-sm btn-primary flex-grow-1" onclick="farmersManager.editFarmer(${farmer.id})">
                                <i class="bi bi-pencil"></i> Edit
                            </button>
                            <button class="btn btn-sm btn-danger flex-grow-1" onclick="farmersManager.deleteFarmer(${farmer.id})">
                                <i class="bi bi-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Open add modal 
    openAddModal() {
        this.editingId = null;
        this.resetForm();
        document.getElementById('farmerModalTitle').textContent = 'Add New Farmer';
        
        const modal = new bootstrap.Modal(document.getElementById('farmerModal'));
        modal.show();
    }
    
    // Edit farmer 
    editFarmer(id) {
        const farmer = this.farmers.find(f => f.id === id);
        if (!farmer) return;
        
        this.editingId = id;
        
        document.getElementById('farmerId').value = farmer.id;
        document.getElementById('farmerName').value = farmer.name;
        document.getElementById('farmerContact').value = farmer.contact;
        document.getElementById('farmerEmail').value = farmer.email;
        document.getElementById('farmerFarmSize').value = farmer.farmSize;
        document.getElementById('farmerLocation').value = farmer.location;
        
        document.getElementById('farmerModalTitle').textContent = 'Edit Farmer';
        
        const modal = new bootstrap.Modal(document.getElementById('farmerModal'));
        modal.show();
    }
    
    // Save farmer 
    saveFarmer() {
        const formData = {
            name: document.getElementById('farmerName').value.trim(),
            contact: document.getElementById('farmerContact').value.trim(),
            email: document.getElementById('farmerEmail').value.trim(),
            farmSize: parseFloat(document.getElementById('farmerFarmSize').value),
            location: document.getElementById('farmerLocation').value.trim()
        };
        
        if (!formData.name || !formData.contact || !formData.email || !formData.farmSize || !formData.location) {
            showToast('Please fill in all required fields', 'danger');
            return;
        }
        
        if (this.editingId) {
            const index = this.farmers.findIndex(f => f.id === this.editingId);
            if (index !== -1) {
                this.farmers[index] = { ...this.farmers[index], ...formData };
                showToast('Farmer updated successfully!', 'success');
            }
        } else {
            formData.id = generateId();
            this.farmers.push(formData);
            showToast('Farmer added successfully!', 'success');
        }
        
        this.saveFarmers();
        this.filteredFarmers = [...this.farmers];
        this.renderGrid();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('farmerModal'));
        if (modal) modal.hide();
    }
    
    // Delete farmer 
    deleteFarmer(id) {
        this.deleteId = id;
        const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
        
        const confirmBtn = document.getElementById('confirmDeleteBtn');
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        
        newConfirmBtn.addEventListener('click', () => {
            const index = this.farmers.findIndex(f => f.id === id);
            if (index !== -1) {
                this.farmers.splice(index, 1);
                this.saveFarmers();
                this.filteredFarmers = [...this.farmers];
                this.renderGrid();
                showToast('Farmer deleted successfully!', 'success');
            }
            
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            if (deleteModal) deleteModal.hide();
        });
    }
    
    // Handle search 
    handleSearch(query) {
        const searchQuery = query.toLowerCase();
        
        this.filteredFarmers = this.farmers.filter(farmer => {
            return farmer.name.toLowerCase().includes(searchQuery) ||
                   farmer.location.toLowerCase().includes(searchQuery) ||
                   farmer.contact.includes(searchQuery) ||
                   farmer.email.toLowerCase().includes(searchQuery);
        });
        
        this.renderGrid();
    }
    
    // Reset form 
    resetForm() {
        const form = document.getElementById('farmerForm');
        if (form) form.reset();
        this.editingId = null;
    }
}

let farmersManager = null;

document.addEventListener('DOMContentLoaded', () => {
    farmersManager = new FarmersManager();
    window.farmersManager = farmersManager;
});

export default FarmersManager;