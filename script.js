const form = document.querySelector(".add");
const incomeList = document.querySelector(".income-list");
const expenseList = document.querySelector(".expense-list");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const transactionHistory = document.querySelector(".history");

let transactions = localStorage.getItem("transactions") !== null ? JSON.parse(localStorage.getItem("transactions")) : [];

// To hide the transaction history when it is empty 
function historyHide(){
    if(transactions.length === 0){
        transactionHistory.classList.add("hide");
    }
    else{
        transactionHistory.classList.remove("hide");
    }
}

// Update the statistics for income, expense, and balance
function updateStats() {
    const updateIncome = transactions.filter(transaction => transaction.amount > 0)
                                        .reduce((total, transaction) => total += transaction.amount, 0);

    const updateExpense = transactions.filter(transaction => transaction.amount < 0)
                                        .reduce((total, transaction) => total += Math.abs(transaction.amount), 0);

    income.textContent = updateIncome;
    expense.textContent = updateExpense;
    const updateBalance = updateIncome - updateExpense;
    balance.textContent = updateBalance;
}

// Update the transaction lists in the DOM
function updateTransactions() {
    transactions.forEach(transaction => {
        if (transaction.amount > 0) {
            incomeList.innerHTML += generateListTemplate(transaction.id, transaction.source, transaction.amount, transaction.time);
        } else {
            expenseList.innerHTML += generateListTemplate(transaction.id, transaction.source, Math.abs(transaction.amount), transaction.time);
        }
    });
}

// Add a new transaction
function addTransaction(source, amount) {
    const time = new Date();
    amount = parseFloat(amount);
    const id = Math.floor(Math.random() * 100000);
    const transaction = {
        id: id,
        source: source,
        amount: amount,
        time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`
    };
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateTransactionDom(transaction.id, source, amount, transaction.time);
}

// Generate the HTML template for a transaction
function generateListTemplate(id, source, amount, time) {
    return `
        <li data-id='${id}'>
            <p>
                <span class="source">${source}</span>
                <span id="time">${time}</span>
            </p>
            ₹<span>${amount}</span>
            <i class="bi bi-trash-fill delete"></i>
        </li>`;
}

// Update the DOM with a new transaction
function updateTransactionDom(id, source, amount, time) {
    if (amount > 0) {
        incomeList.innerHTML += generateListTemplate(id, source, amount, time);
    } else {
        expenseList.innerHTML += generateListTemplate(id, source, amount, time);
    }
}

// Form submit event listener
form.addEventListener("submit", event => {
    event.preventDefault();
    if (form.source.value.trim() === '' || form.amount.value.trim() === '') {
        alert("Please enter a valid source and amount!");
        return;
    } else {
        addTransaction(form.source.value.trim(), form.amount.value);
        updateStats();
        historyHide();
        form.reset();
    }
});

// Delete a transaction and update the stats
function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Income list click event listener
incomeList.addEventListener("click", event => {
    if (event.target.classList.contains("delete")) {
        event.target.parentElement.remove();
        deleteTransaction(Number(event.target.parentElement.dataset.id));
        updateStats();
        historyHide();
    }
});

// Expense list click event listener
expenseList.addEventListener("click", event => {
    if (event.target.classList.contains("delete")) {
        event.target.parentElement.remove();
        deleteTransaction(Number(event.target.parentElement.dataset.id));
        updateStats();
        historyHide();
    }
});

// Initialize the app
function init() {
    updateTransactions();
    updateStats();
    historyHide();
}

init();
