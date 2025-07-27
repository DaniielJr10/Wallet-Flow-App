// Investment Dashboard JavaScript
let investments = [
    { 
        id: 1, 
        name: 'Renta Fija', 
        amount: 25000, 
        investmentDate: '2023-01-15', 
        description: 'Inversión en bonos del gobierno', 
        type: 'Renta Fija', 
        expectedValue: 26000, 
        maturityDate: '2025-01-15', 
        returnPercent: 2.5,
        returnAmount: 1500 // Calculated for initial display
    }
];

let stocks = [
    { id: 'AAPL', name: 'AAPL', company: 'Apple Inc.', price: 150.25, change: 2.5 },
    { id: 'GOOGL', name: 'GOOGL', company: 'Alphabet Inc.', price: 2750.80, change: 1.8 },
    { id: 'MSFT', name: 'MSFT', company: 'Microsoft Corp.', price: 305.50, change: -0.5 },
    { id: 'TSLA', name: 'TSLA', company: 'Tesla Inc.', price: 850.25, change: 3.2 }
];

let selectedStock = null;
let selectedInvestment = null;
let nextInvestmentId = 2; // Para generar IDs únicos para nuevas inversiones

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Charts
    initializeDistributionChart();
    initializePerformanceChart();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load initial data
    loadFromLocalStorage(); // Cargar datos guardados o iniciales
    loadInvestments();
    loadStocks();
    updateStockSelectOptions(); // Asegurar que los selects de acciones estén actualizados
    
    // Auto-save every 30 seconds
    setInterval(saveToLocalStorage, 30000);
    // Auto-update stock prices every 2 minutes
    setInterval(updateStockPrices, 120000);
});

// ==================== CHART INITIALIZATION ====================
function initializeDistributionChart() {
    const ctx = document.getElementById('distributionChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Renta Fija', 'Acciones', 'Fondos', 'Crypto', 'Otros'],
            datasets: [{
                data: [35, 25, 20, 15, 5], // Datos de ejemplo
                backgroundColor: [
                    '#17a2b8', // Cyan
                    '#28a745', // Green
                    '#ffc107', // Yellow
                    '#fd7e14', // Orange
                    '#6c757d'  // Gray
                ],
                borderWidth: 0,
                cutout: '60%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

function initializePerformanceChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    // Generate sample data for the line chart
    const labels = [];
    const data = [];
    const baseValue = 100;
    
    for (let i = 0; i < 30; i++) {
        labels.push(`Day ${i + 1}`);
        if (i === 0) {
            data.push(baseValue);
        } else {
            const change = (Math.random() - 0.5) * 10;
            data.push(Math.max(80, Math.min(120, data[i - 1] + change)));
        }
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Rendimiento',
                data: data,
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: true,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    },
                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Stock items click for selection
    document.addEventListener('click', function(e) {
        const stockItem = e.target.closest('.stock-item');
        if (stockItem) {
            // Remove previous selection
            document.querySelectorAll('.stock-item').forEach(el => el.classList.remove('selected'));
            // Add selection to clicked item
            stockItem.classList.add('selected');
            selectedStock = stockItem.getAttribute('data-stock-id');
            showAlert(`Acción ${selectedStock} seleccionada`, 'info');
        }
    });

    // Investment items click for selection
    document.addEventListener('click', function(e) {
        const investmentItem = e.target.closest('.investment-item');
        if (investmentItem) {
            // Remove previous selection
            document.querySelectorAll('.investment-item').forEach(el => el.classList.remove('selected'));
            // Add selection to clicked item
            investmentItem.classList.add('selected');
            selectedInvestment = investmentItem.getAttribute('data-investment-id');
            showAlert(`Inversión seleccionada`, 'info');
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + N = Nueva Inversión
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            showNewInvestmentModal();
        }
        
        // Ctrl/Cmd + E = Editar
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            showEditModal();
        }
        
        // Ctrl/Cmd + U = Actualizar Valor
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
            e.preventDefault();
            showUpdateValueModal();
        }
        
        // Delete key = Eliminar
        if (e.key === 'Delete') {
            e.preventDefault();
            showDeleteModal();
        }
    });
}

// ==================== MODAL FUNCTIONS ====================
function showNewInvestmentModal() {
    const modal = new bootstrap.Modal(document.getElementById('newInvestmentModal'));
    document.getElementById('newInvestmentForm').reset();
    modal.show();
}

function showUpdateValueModal() {
    if (!selectedStock) {
        showAlert('Por favor, seleccione una acción primero haciendo clic en ella.', 'warning');
        return;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('updateValueModal'));
    document.getElementById('stockSelect').value = selectedStock;
    
    // Get current price
    const stock = stocks.find(s => s.id === selectedStock);
    if (stock) {
        document.getElementById('newPrice').value = stock.price.toFixed(2);
    }
    
    modal.show();
}

function showEditModal() {
    if (!selectedInvestment) {
        showAlert('Por favor, seleccione una inversión primero haciendo clic en ella.', 'warning');
        return;
    }
    
    const investment = investments.find(inv => inv.id == selectedInvestment);
    if (investment) {
        document.getElementById('editInvestmentId').value = investment.id; // Store ID
        document.getElementById('editInvestmentAmount').value = investment.amount;
        document.getElementById('editInvestmentDate').value = investment.investmentDate;
        document.getElementById('editInvestmentDescription').value = investment.description;
        document.getElementById('editInvestmentType').value = investment.type;
        document.getElementById('editInvestmentExpectedValue').value = investment.expectedValue;
        document.getElementById('editInvestmentMaturityDate').value = investment.maturityDate || ''; // Optional field
        document.getElementById('editInvestmentExpectedReturn').value = investment.returnPercent + '%'; // Add % for display
        
        const modal = new bootstrap.Modal(document.getElementById('editModal'));
        modal.show();
    }
}

function showDeleteModal() {
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    
    // Reset delete options
    document.getElementById('deleteInvestmentOptions').style.display = 'none';
    document.getElementById('deleteStockOptions').style.display = 'none';
    
    // Populate investment options
    const investmentSelect = document.getElementById('investmentToDelete');
    investmentSelect.innerHTML = '<option value="">Seleccione una inversión</option>';
    investments.forEach(inv => {
        const option = document.createElement('option');
        option.value = inv.id;
        option.textContent = inv.description; // Use description for better identification
        investmentSelect.appendChild(option);
    });
    
    modal.show();
}

function showDeleteInvestmentOptions() {
    document.getElementById('deleteInvestmentOptions').style.display = 'block';
    document.getElementById('deleteStockOptions').style.display = 'none';
}

function showDeleteStockOptions() {
    document.getElementById('deleteStockOptions').style.display = 'block';
    document.getElementById('deleteInvestmentOptions').style.display = 'none';
}

// ==================== CRUD FUNCTIONS ====================
function addNewInvestment() {
    const amount = parseFloat(document.getElementById('newInvestmentAmount').value);
    const investmentDate = document.getElementById('newInvestmentDate').value;
    const description = document.getElementById('newInvestmentDescription').value.trim();
    const type = document.getElementById('newInvestmentType').value.trim();
    const expectedValue = parseFloat(document.getElementById('newInvestmentExpectedValue').value);
    const maturityDate = document.getElementById('newInvestmentMaturityDate').value.trim();
    const expectedReturnStr = document.getElementById('newInvestmentExpectedReturn').value.trim();
    const returnPercent = parseFloat(expectedReturnStr.replace('%', ''));

    if (!amount || !investmentDate || !description || !type || !expectedValue || !expectedReturnStr || isNaN(amount) || isNaN(expectedValue) || isNaN(returnPercent)) {
        showMessageModal('TIENES QUE RELLENAR TODOS LOS CAMPOS', 'error');
        return;
    }
    
    if (amount <= 0 || expectedValue <= 0) {
        showAlert('El monto y el valor esperado deben ser mayores a 0.', 'danger');
        return;
    }
    
    const newInvestment = {
        id: nextInvestmentId++,
        name: description, // Using description as name for simplicity in display
        amount: amount,
        investmentDate: investmentDate,
        description: description,
        type: type,
        expectedValue: expectedValue,
        maturityDate: maturityDate || null, // Store null if optional field is empty
        returnPercent: returnPercent,
        returnAmount: (amount * returnPercent / 100) // Calculate initial return amount
    };
    
    investments.push(newInvestment);
    loadInvestments();
    saveToLocalStorage();
    
    // Close modal and reset form
    bootstrap.Modal.getInstance(document.getElementById('newInvestmentModal')).hide();
    document.getElementById('newInvestmentForm').reset();
    
    showMessageModal('INVERSIÓN CREADA CORRECTAMENTE', 'success');
}

function simulateMarketPrice() {
    const stockSelect = document.getElementById('stockSelect');
    const newPriceInput = document.getElementById('newPrice');
    
    if (!stockSelect.value) {
        showAlert('Por favor, seleccione una acción primero.', 'warning');
        return;
    }
    
    const stock = stocks.find(s => s.id === stockSelect.value);
    if (stock) {
        // Simulate market fluctuation (-10% to +10%)
        const fluctuation = (Math.random() - 0.5) * 0.2;
        const newPrice = stock.price * (1 + fluctuation);
        newPriceInput.value = newPrice.toFixed(2);
        
        showAlert(`Precio simulado para ${stock.name}: $${newPrice.toFixed(2)}`, 'info');
    }
}

function updateStockValue() {
    const stockId = document.getElementById('stockSelect').value;
    const newPrice = parseFloat(document.getElementById('newPrice').value);
    
    if (!stockId || isNaN(newPrice) || newPrice <= 0) {
        showAlert('Por favor, complete todos los campos correctamente.', 'danger');
        return;
    }
    
    const stockIndex = stocks.findIndex(s => s.id === stockId);
    if (stockIndex !== -1) {
        const oldPrice = stocks[stockIndex].price;
        const changePercent = ((newPrice - oldPrice) / oldPrice * 100);
        
        // Update stock data
        stocks[stockIndex].price = newPrice;
        stocks[stockIndex].change = changePercent;
        
        // Update UI
        loadStocks();
        saveToLocalStorage();
        
        // Close modal and reset form
        bootstrap.Modal.getInstance(document.getElementById('updateValueModal')).hide();
        document.getElementById('updateValueForm').reset();
        
        showAlert(`Precio de ${stockId} actualizado a $${newPrice.toFixed(2)} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(1)}%)`, 'success');
    }
}

function saveEditedInvestment() {
    const id = parseInt(document.getElementById('editInvestmentId').value);
    const amount = parseFloat(document.getElementById('editInvestmentAmount').value);
    const investmentDate = document.getElementById('editInvestmentDate').value;
    const description = document.getElementById('editInvestmentDescription').value.trim();
    const type = document.getElementById('editInvestmentType').value.trim();
    const expectedValue = parseFloat(document.getElementById('editInvestmentExpectedValue').value);
    const maturityDate = document.getElementById('editInvestmentMaturityDate').value.trim();
    const expectedReturnStr = document.getElementById('editInvestmentExpectedReturn').value.trim();
    const returnPercent = parseFloat(expectedReturnStr.replace('%', ''));
    
    if (!amount || !investmentDate || !description || !type || !expectedValue || !expectedReturnStr || isNaN(amount) || isNaN(expectedValue) || isNaN(returnPercent)) {
        showMessageModal('TIENES QUE RELLENAR TODOS LOS CAMPOS', 'error');
        return;
    }

    if (amount <= 0 || expectedValue <= 0) {
        showAlert('El monto y el valor esperado deben ser mayores a 0.', 'danger');
        return;
    }
    
    const investmentIndex = investments.findIndex(inv => inv.id === id);
    if (investmentIndex !== -1) {
        const oldDescription = investments[investmentIndex].description;
        investments[investmentIndex] = {
            ...investments[investmentIndex],
            amount: amount,
            investmentDate: investmentDate,
            description: description,
            type: type,
            expectedValue: expectedValue,
            maturityDate: maturityDate || null,
            returnPercent: returnPercent,
            returnAmount: (amount * returnPercent / 100) // Recalculate return amount
        };
        
        loadInvestments();
        saveToLocalStorage();
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
        
        showAlert(`Inversión "${oldDescription}" editada exitosamente.`, 'success');
    }
}

function deleteInvestment() {
    const investmentId = document.getElementById('investmentToDelete').value;
    
    if (!investmentId) {
        showAlert('Por favor, seleccione una inversión.', 'danger');
        return;
    }
    
    const investment = investments.find(inv => inv.id == investmentId);
    if (!investment) {
        showAlert('Inversión no encontrada.', 'danger');
        return;
    }
    
    // Show confirmation modal
    showConfirmationModal(
        `¿Está seguro de que desea eliminar la inversión "${investment.description}"?`,
        () => {
            investments = investments.filter(inv => inv.id != investmentId);
            loadInvestments();
            saveToLocalStorage();
            
            // Close delete modal
            bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
            
            showAlert(`Inversión "${investment.description}" eliminada exitosamente.`, 'success');
            
            // Clear selection if deleted investment was selected
            if (selectedInvestment == investmentId) {
                selectedInvestment = null;
                document.querySelectorAll('.investment-item').forEach(el => el.classList.remove('selected'));
            }
        }
    );
}

function deleteStock() {
    const stockId = document.getElementById('stockToDelete').value;
    
    if (!stockId) {
        showAlert('Por favor, seleccione una acción.', 'danger');
        return;
    }
    
    const stock = stocks.find(s => s.id === stockId);
    if (!stock) {
        showAlert('Acción no encontrada.', 'danger');
        return;
    }
    
    // Show confirmation modal
    showConfirmationModal(
        `¿Está seguro de que desea eliminar la acción "${stock.name} - ${stock.company}"?`,
        () => {
            stocks = stocks.filter(s => s.id !== stockId);
            loadStocks();
            saveToLocalStorage();
            
            // Update stock select options in other modals
            updateStockSelectOptions();
            
            // Close delete modal
            bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
            
            showAlert(`Acción ${stockId} eliminada exitosamente.`, 'success');
            
            // Clear selection if deleted stock was selected
            if (selectedStock === stockId) {
                selectedStock = null;
                document.querySelectorAll('.stock-item').forEach(el => el.classList.remove('selected'));
            }
        }
    );
}

// ==================== HELPER FUNCTIONS ====================
function loadInvestments() {
    const investmentsList = document.getElementById('investmentsList');
    investmentsList.innerHTML = '';
    
    if (investments.length === 0) {
        investmentsList.innerHTML = '<p class="text-muted text-center py-4">No hay inversiones registradas.</p>';
        return;
    }
    
    investments.forEach(investment => {
        const returnAmount = (investment.amount * investment.returnPercent / 100);
        
        const investmentHTML = `
            <div class="investment-item d-flex justify-content-between" data-investment-id="${investment.id}">
                <div>
                    <div class="investment-name">${investment.description}</div>
                    <div class="investment-amount">$${investment.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div class="text-muted" style="font-size: 0.8rem;">${investment.type} - ${investment.investmentDate}</div>
                </div>
                <div class="investment-return">
                    <span class="return-percentage">+${investment.returnPercent}%</span>
                    <div class="return-amount">$${returnAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div class="text-muted" style="font-size: 0.8rem;">Val. Esp: $${investment.expectedValue.toLocaleString()}</div>
                </div>
            </div>
        `;
        
        investmentsList.innerHTML += investmentHTML;
    });
}

function loadStocks() {
    const stocksList = document.getElementById('stocksList');
    stocksList.innerHTML = '';
    
    if (stocks.length === 0) {
        stocksList.innerHTML = '<p class="text-muted text-center py-4">No hay acciones registradas.</p>';
        return;
    }
    
    stocks.forEach(stock => {
        const stockHTML = `
            <div class="stock-item d-flex justify-content-between align-items-center" data-stock-id="${stock.id}">
                <div>
                    <div class="stock-name">${stock.name}</div>
                    <div class="stock-company">${stock.company}</div>
                </div>
                <div class="text-end">
                    <div class="stock-price">$${stock.price.toFixed(2)}</div>
                    <div class="stock-change ${stock.change >= 0 ? 'positive' : 'negative'}">
                        ${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(1)}%
                    </div>
                </div>
            </div>
        `;
        
        stocksList.innerHTML += stockHTML;
    });
}

function updateStockSelectOptions() {
    const stockSelects = ['stockSelect', 'stockToDelete'];
    
    stockSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Seleccione una acción</option>';
            
            stocks.forEach(stock => {
                const option = document.createElement('option');
                option.value = stock.id;
                option.textContent = `${stock.name} - ${stock.company}`;
                select.appendChild(option);
            });
            
            // Restore previous selection if still valid
            if (stocks.find(s => s.id === currentValue)) {
                select.value = currentValue;
            }
        }
    });
}

function showConfirmationModal(message, onConfirm) {
    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    document.getElementById('confirmDeleteMessage').textContent = message;
    
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    
    // Remove previous event listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    // Add new event listener
    newConfirmBtn.addEventListener('click', () => {
        onConfirm();
        modal.hide();
    });
    
    modal.show();
}

// Function to show simple message modals (for success/error)
function showMessageModal(message, type) {
    const modal = new bootstrap.Modal(document.getElementById('messageModal'));
    const messageTextElement = document.getElementById('messageModalText');
    
    messageTextElement.textContent = message;
    
    // Apply specific styling based on type (optional, can be done with CSS classes)
    if (type === 'error') {
        messageTextElement.style.color = '#dc3545'; // Red for error
    } else if (type === 'success') {
        messageTextElement.style.color = '#28a745'; // Green for success
    } else {
        messageTextElement.style.color = '#333'; // Default color
    }

    modal.show();

    // Auto-hide after 2 seconds
    setTimeout(() => {
        modal.hide();
    }, 2000);
}


// Function to show Bootstrap alerts (for general warnings/info)
function showAlert(message, type) {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert alert at the top of the container
    const container = document.querySelector('.container-fluid');
    const firstChild = container.firstElementChild;
    container.insertBefore(alertDiv, firstChild);
    
    // Auto-remove alert after 5 seconds
    setTimeout(() => {
        if (alertDiv && alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// ==================== LOCAL STORAGE ====================
function saveToLocalStorage() {
    try {
        const data = {
            investments: investments,
            stocks: stocks,
            nextInvestmentId: nextInvestmentId,
            lastSaved: new Date().toISOString()
        };
        localStorage.setItem('investmentDashboard', JSON.stringify(data));
        console.log('Data saved to localStorage.');
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const data = localStorage.getItem('investmentDashboard');
        if (data) {
            const parsed = JSON.parse(data);
            investments = parsed.investments || investments;
            stocks = parsed.stocks || stocks;
            nextInvestmentId = parsed.nextInvestmentId || nextInvestmentId;
            
            console.log('Data loaded from localStorage.');
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

// ==================== AUTO-UPDATE STOCK PRICES ====================
function updateStockPrices() {
    stocks.forEach(stock => {
        const change = (Math.random() - 0.5) * 5; // Random change between -2.5% and +2.5%
        const newPrice = Math.max(1, stock.price + change); // Ensure price doesn't go below 1
        const changePercent = ((newPrice - stock.price) / stock.price * 100);
        
        stock.price = newPrice;
        stock.change = changePercent;
    });
    
    loadStocks();
    saveToLocalStorage();
    showAlert('Precios de acciones actualizados automáticamente', 'info');
}

// ==================== EXPORT FUNCTIONALITY (Optional) ====================
function exportData() {
    const data = {
        investments: investments,
        stocks: stocks,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `inversiones_dashboard_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showAlert('Datos exportados exitosamente.', 'success');
}

// Make exportData globally accessible if you want to add a button for it
window.exportData = exportData;

console.log('Investment Dashboard loaded successfully!');
console.log('Keyboard shortcuts:');
console.log('- Ctrl/Cmd + N: Nueva Inversión');
console.log('- Ctrl/Cmd + E: Editar');
console.log('- Ctrl/Cmd + U: Actualizar Valor');
console.log('- Delete: Eliminar');