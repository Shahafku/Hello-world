// Budget Split App - Main JavaScript

// State
let participants = [];
let expenses = [];

// DOM Elements
const participantNameInput = document.getElementById('participant-name');
const participantsList = document.getElementById('participants-list');
const expensePayerSelect = document.getElementById('expense-payer');
const splitCheckboxes = document.getElementById('split-checkboxes');
const expensesList = document.getElementById('expenses-list');
const totalRow = document.getElementById('total-row');
const totalAmount = document.getElementById('total-amount');
const balancesList = document.getElementById('balances-list');
const settlementList = document.getElementById('settlement-list');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    renderAll();

    // Add enter key support for participant input
    participantNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addParticipant();
        }
    });
});

// Participant Functions
function addParticipant() {
    const name = participantNameInput.value.trim();

    if (!name) {
        alert('Please enter a name');
        return;
    }

    if (participants.includes(name)) {
        alert('This participant already exists');
        return;
    }

    participants.push(name);
    participantNameInput.value = '';
    saveToLocalStorage();
    renderAll();
}

function removeParticipant(name) {
    // Check if participant has expenses
    const hasExpenses = expenses.some(e => e.payer === name || e.splitBetween.includes(name));

    if (hasExpenses) {
        if (!confirm(`${name} has expenses. Removing them will also remove their expenses. Continue?`)) {
            return;
        }
        // Remove expenses involving this participant
        expenses = expenses.filter(e => e.payer !== name && !e.splitBetween.includes(name));
    }

    participants = participants.filter(p => p !== name);
    saveToLocalStorage();
    renderAll();
}

// Expense Functions
function addExpense(event) {
    event.preventDefault();

    const description = document.getElementById('expense-description').value.trim();
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const payer = document.getElementById('expense-payer').value;

    // Get selected participants for split
    const splitBetween = [];
    document.querySelectorAll('#split-checkboxes input:checked').forEach(cb => {
        splitBetween.push(cb.value);
    });

    if (!description || !amount || !payer) {
        alert('Please fill in all fields');
        return;
    }

    if (splitBetween.length === 0) {
        alert('Please select at least one person to split with');
        return;
    }

    const expense = {
        id: Date.now(),
        description,
        amount,
        payer,
        splitBetween
    };

    expenses.push(expense);

    // Reset form
    document.getElementById('expense-form').reset();
    updateSplitCheckboxes();

    saveToLocalStorage();
    renderAll();
}

function removeExpense(id) {
    expenses = expenses.filter(e => e.id !== id);
    saveToLocalStorage();
    renderAll();
}

// Calculation Functions
function calculateBalances() {
    const balances = {};

    // Initialize balances for all participants
    participants.forEach(p => {
        balances[p] = 0;
    });

    // Calculate balances from expenses
    expenses.forEach(expense => {
        const sharePerPerson = expense.amount / expense.splitBetween.length;

        // Payer gets credit for the full amount
        if (balances.hasOwnProperty(expense.payer)) {
            balances[expense.payer] += expense.amount;
        }

        // Each person in the split owes their share
        expense.splitBetween.forEach(person => {
            if (balances.hasOwnProperty(person)) {
                balances[person] -= sharePerPerson;
            }
        });
    });

    return balances;
}

function calculateSettlements() {
    const balances = calculateBalances();
    const settlements = [];

    // Separate into debtors and creditors
    const debtors = [];
    const creditors = [];

    Object.entries(balances).forEach(([person, balance]) => {
        if (balance < -0.01) {
            debtors.push({ person, amount: -balance });
        } else if (balance > 0.01) {
            creditors.push({ person, amount: balance });
        }
    });

    // Sort by amount
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    // Match debtors with creditors
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        const amount = Math.min(debtor.amount, creditor.amount);

        if (amount > 0.01) {
            settlements.push({
                from: debtor.person,
                to: creditor.person,
                amount: amount
            });
        }

        debtor.amount -= amount;
        creditor.amount -= amount;

        if (debtor.amount < 0.01) i++;
        if (creditor.amount < 0.01) j++;
    }

    return settlements;
}

// Render Functions
function renderAll() {
    renderParticipants();
    updatePayerSelect();
    updateSplitCheckboxes();
    renderExpenses();
    renderBalances();
    renderSettlements();
}

function renderParticipants() {
    if (participants.length === 0) {
        participantsList.innerHTML = '<p class="empty-state">No participants added yet</p>';
        return;
    }

    participantsList.innerHTML = participants.map(name => `
        <div class="tag">
            <span>${escapeHtml(name)}</span>
            <button class="remove-btn" onclick="removeParticipant('${escapeHtml(name)}')" title="Remove">&times;</button>
        </div>
    `).join('');
}

function updatePayerSelect() {
    const currentValue = expensePayerSelect.value;
    expensePayerSelect.innerHTML = '<option value="">Select who paid</option>';

    participants.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        if (name === currentValue) option.selected = true;
        expensePayerSelect.appendChild(option);
    });
}

function updateSplitCheckboxes() {
    if (participants.length === 0) {
        splitCheckboxes.innerHTML = '<p class="empty-state">Add participants first</p>';
        return;
    }

    splitCheckboxes.innerHTML = participants.map(name => `
        <div class="checkbox-item">
            <input type="checkbox" id="split-${escapeHtml(name)}" value="${escapeHtml(name)}" checked>
            <label for="split-${escapeHtml(name)}">${escapeHtml(name)}</label>
        </div>
    `).join('');
}

function renderExpenses() {
    if (expenses.length === 0) {
        expensesList.innerHTML = '<p class="empty-state">No expenses added yet</p>';
        totalRow.style.display = 'none';
        return;
    }

    expensesList.innerHTML = expenses.map(expense => `
        <div class="expense-item">
            <div class="expense-info">
                <div class="expense-description">${escapeHtml(expense.description)}</div>
                <div class="expense-details">
                    Paid by ${escapeHtml(expense.payer)} · Split between ${expense.splitBetween.map(escapeHtml).join(', ')}
                </div>
            </div>
            <div class="expense-amount">$${expense.amount.toFixed(2)}</div>
            <div class="expense-actions">
                <button onclick="removeExpense(${expense.id})" title="Delete">&times;</button>
            </div>
        </div>
    `).join('');

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    totalAmount.textContent = `$${total.toFixed(2)}`;
    totalRow.style.display = 'flex';
}

function renderBalances() {
    if (participants.length === 0 || expenses.length === 0) {
        balancesList.innerHTML = '<p class="empty-state">Add participants and expenses to see balances</p>';
        return;
    }

    const balances = calculateBalances();

    balancesList.innerHTML = Object.entries(balances)
        .sort((a, b) => b[1] - a[1])
        .map(([person, balance]) => {
            const isPositive = balance >= 0;
            const className = isPositive ? 'positive' : 'negative';
            const prefix = isPositive ? '+' : '';
            return `
                <div class="balance-item">
                    <span class="balance-name">${escapeHtml(person)}</span>
                    <span class="balance-amount ${className}">${prefix}$${balance.toFixed(2)}</span>
                </div>
            `;
        }).join('');
}

function renderSettlements() {
    if (participants.length === 0 || expenses.length === 0) {
        settlementList.innerHTML = '<p class="empty-state">Add expenses to see who owes whom</p>';
        return;
    }

    const settlements = calculateSettlements();

    if (settlements.length === 0) {
        settlementList.innerHTML = '<p class="empty-state">All settled up!</p>';
        return;
    }

    settlementList.innerHTML = settlements.map(s => `
        <div class="settlement-item">
            <span class="from">${escapeHtml(s.from)}</span>
            <span class="arrow">→ pays →</span>
            <span class="to">${escapeHtml(s.to)}</span>
            <span class="amount">$${s.amount.toFixed(2)}</span>
        </div>
    `).join('');
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function clearAll() {
    if (!confirm('Are you sure you want to clear all data?')) {
        return;
    }

    participants = [];
    expenses = [];
    saveToLocalStorage();
    renderAll();
}

// Local Storage Functions
function saveToLocalStorage() {
    localStorage.setItem('budgetSplit_participants', JSON.stringify(participants));
    localStorage.setItem('budgetSplit_expenses', JSON.stringify(expenses));
}

function loadFromLocalStorage() {
    const savedParticipants = localStorage.getItem('budgetSplit_participants');
    const savedExpenses = localStorage.getItem('budgetSplit_expenses');

    if (savedParticipants) {
        participants = JSON.parse(savedParticipants);
    }

    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
    }
}
