document.addEventListener('DOMContentLoaded', () => {
    // State management
    let investments = JSON.parse(localStorage.getItem('investments')) || [];

    // DOM Elements
    const form = document.getElementById('add-month-form');
    const tbody = document.getElementById('history-tbody');

    // Summary DOM Elements
    const totalInvestedEl = document.getElementById('total-invested');
    const currentValuationEl = document.getElementById('current-valuation');
    const totalProfitLossEl = document.getElementById('total-profit-loss');
    const totalProfitLossPercentEl = document.getElementById('total-profit-loss-percent');

    // Utility to format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
    };

    // Utility to format percent
    const formatPercent = (value) => {
        return new Intl.NumberFormat('fr-FR', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value / 100);
    };

    // Utility to set color class based on value
    const setColorClass = (element, value) => {
        element.classList.remove('positive', 'negative');
        if (value > 0) {
            element.classList.add('positive');
        } else if (value < 0) {
            element.classList.add('negative');
        }
    };

    // Calculate and render data
    const updateDashboard = () => {
        // Sort investments chronologically (oldest first)
        investments.sort((a, b) => new Date(a.monthYear) - new Date(b.monthYear));

        tbody.innerHTML = '';

        let cumulativeInvestment = 0;
        let lastValuation = 0;

        investments.forEach((inv, index) => {
            cumulativeInvestment += inv.monthlyInvestment;

            // Monthly profit/loss:
            // What we gained this month is: Current Valuation - (Previous Valuation + New Investment this month)
            const prevValuation = index > 0 ? investments[index - 1].endValuation : 0;
            const monthlyProfitLoss = inv.endValuation - (prevValuation + inv.monthlyInvestment);

            // Global profit/loss at that month
            const globalProfitLossAtMonth = inv.endValuation - cumulativeInvestment;

            // Create row
            const tr = document.createElement('tr');

            // Format Month/Year (e.g., "Jan 2023")
            const [year, month] = inv.monthYear.split('-');
            const dateObj = new Date(year, month - 1);
            const formattedDate = dateObj.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });

            tr.innerHTML = `
                <td>${formattedDate}</td>
                <td>${formatCurrency(inv.monthlyInvestment)}</td>
                <td>${formatCurrency(cumulativeInvestment)}</td>
                <td>${formatCurrency(inv.endValuation)}</td>
                <td class="${monthlyProfitLoss > 0 ? 'positive' : (monthlyProfitLoss < 0 ? 'negative' : '')}">${monthlyProfitLoss > 0 ? '+' : ''}${formatCurrency(monthlyProfitLoss)}</td>
                <td class="${globalProfitLossAtMonth > 0 ? 'positive' : (globalProfitLossAtMonth < 0 ? 'negative' : '')}">${globalProfitLossAtMonth > 0 ? '+' : ''}${formatCurrency(globalProfitLossAtMonth)}</td>
                <td>
                    <button class="btn-delete" data-id="${inv.id}" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);

            lastValuation = inv.endValuation;
        });

        // Update Summary
        const finalGlobalProfitLoss = investments.length > 0 ? (lastValuation - cumulativeInvestment) : 0;
        const profitLossPercent = cumulativeInvestment > 0 ? (finalGlobalProfitLoss / cumulativeInvestment) * 100 : 0;

        totalInvestedEl.textContent = formatCurrency(cumulativeInvestment);
        currentValuationEl.textContent = formatCurrency(lastValuation);

        totalProfitLossEl.textContent = `${finalGlobalProfitLoss > 0 ? '+' : ''}${formatCurrency(finalGlobalProfitLoss)}`;
        setColorClass(totalProfitLossEl, finalGlobalProfitLoss);

        totalProfitLossPercentEl.textContent = `(${finalGlobalProfitLoss > 0 ? '+' : ''}${formatPercent(profitLossPercent)})`;
        setColorClass(totalProfitLossPercentEl, finalGlobalProfitLoss);

        // Save to localStorage
        localStorage.setItem('investments', JSON.stringify(investments));
    };

    // Handle Form Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const monthYear = document.getElementById('month-year').value;
        const monthlyInvestment = parseFloat(document.getElementById('monthly-investment').value);
        const endValuation = parseFloat(document.getElementById('end-valuation').value);

        // Check if month already exists
        const existingIndex = investments.findIndex(inv => inv.monthYear === monthYear);

        if (existingIndex !== -1) {
            // Update existing
            investments[existingIndex].monthlyInvestment = monthlyInvestment;
            investments[existingIndex].endValuation = endValuation;
        } else {
            // Add new
            investments.push({
                id: Date.now().toString(),
                monthYear,
                monthlyInvestment,
                endValuation
            });
        }

        updateDashboard();
        form.reset();
    });

    // Handle Delete
    tbody.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-delete');
        if (btn) {
            const idToRemove = btn.getAttribute('data-id');
            investments = investments.filter(inv => inv.id !== idToRemove);
            updateDashboard();
        }
    });

    // Initial render
    updateDashboard();
});