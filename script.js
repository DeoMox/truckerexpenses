let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const form = document.getElementById("expense-form");
const expensesList = document.getElementById("expenses-list");
const totalDisplay = document.getElementById("total");

form.addEventListener("submit", addExpense);

function addExpense(e) {
  e.preventDefault();
  const desc = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const date = document.getElementById("date").value;

  if (!desc || isNaN(amount) || !date) {
    alert("Please fill all fields");
    return;
  }

  const expenseId = form.dataset.editingId;

  if (expenseId) {
    // Update existing
    const index = expenses.findIndex(exp => exp.id == expenseId);
    expenses[index] = { id: Number(expenseId), description: desc, amount, date };
    delete form.dataset.editingId;
  } else {
    // Add new
    const expense = {
      id: Date.now(),
      description: desc,
      amount,
      date
    };
    expenses.push(expense);
  }

  localStorage.setItem("expenses", JSON.stringify(expenses));
  form.reset();
  renderExpenses();
}

function deleteExpense(id) {
  expenses = expenses.filter(exp => exp.id !== id);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
}

function editExpense(id) {
  const expense = expenses.find(exp => exp.id === id);
  document.getElementById("description").value = expense.description;
  document.getElementById("amount").value = expense.amount;
  document.getElementById("date").value = expense.date;
  form.dataset.editingId = id; // Track that we're editing
}

function renderExpenses() {
  expensesList.innerHTML = "";
  let total = 0;

  expenses.forEach(exp => {
    const item = document.createElement("div");
    item.className = `expense ${exp.amount >= 0 ? 'income' : 'expense'}`;
    item.innerHTML = `
      <span>${exp.description} - $${exp.amount} (${exp.date})</span>
      <div>
        <button class="edit-btn" onclick="editExpense(${exp.id})">Edit</button>
        <button class="delete-btn" onclick="deleteExpense(${exp.id})">Delete</button>
      </div>
    `;
    expensesList.appendChild(item);
    total += exp.amount;
  });

  totalDisplay.textContent = `Total Balance: $${total.toFixed(2)}`;
}


// Initial render
renderExpenses();
