// ====== Chart Initialization ======
const categoryCtx = document.getElementById("categoryChart");
let expenseChart = new Chart(categoryCtx, {
  type: "doughnut",
  data: {
    labels: [],
    datasets: [
      {
        backgroundColor: [
          "crimson",
          "cornflowerblue",
          "gold",
          "limegreen",
          "orange",
          "violet",
          "teal",
          "salmon",
          "slateblue",
        ],
        data: [],
      },
    ],
  },
  options: {
    plugins: {
      legend: { display: true, position: "bottom" }
    },
    animation: { duration: 600, easing: "easeInOutQuart" },
  },
});

// ====== DOM Elements ======
const addBtn = document.querySelector(".add-transaction-btn");
const list = document.querySelector(".list-items");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// ====== Render Transactions ======
function renderTransactions() {
  list.innerHTML = "";

  transactions.forEach((t) => {
    const row = document.createElement("div");
    row.classList.add(t.type === "income" ? "income-row" : "expense-row");

    row.innerHTML = `
      <div class="row-info-1">
        <i class="bxr ${
          t.type === "income" ? "bx-plus-circle" : "bx-minus-circle"
        }"></i>
        ${t.date}
      </div>
      <p>${t.category}</p>
      <div>
        Rs.${t.amount}
        <button class="edit-btn" data-id="${t.id}"><i class="bxr bx-edit"></i></button>
        <button class="delete-btn" data-id="${t.id}"><i class="bxr bx-trash-x"></i></button>
      </div>
    `;

    list.appendChild(row);
  });
}

// ====== Add Transaction ======
addBtn.addEventListener("click", () => {
  const type = document.querySelector("input[name='transaction-type']:checked");
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  if (!type || !amount || !date) {
    alert("Please fill all fields");
    return;
  }

  const transaction = {
    id: Date.now(),
    type: type.value,
    amount: parseFloat(amount),
    category,
    date,
  };

  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderTransactions();
  updateOverview();
  updateExpenseChart();

  // Clear inputs
  document.getElementById("amount").value = "";
  document.getElementById("date").value = "";
  document.querySelector("input[name='transaction-type']:checked").checked = false;
});

// ====== Delete Transaction ======
list.addEventListener("click", (e) => {
  if (e.target.closest(".delete-btn")) {
    const id = e.target.closest(".delete-btn").dataset.id;
    transactions = transactions.filter((t) => t.id != id);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions();
    updateOverview();
    updateExpenseChart();
  }
});

// ====== Edit Transaction ======
list.addEventListener("click", (e) => {
  if (e.target.closest(".edit-btn")) {
    const id = e.target.closest(".edit-btn").dataset.id;
    const tx = transactions.find((t) => t.id == id);

    if (tx) {
      document.getElementById("amount").value = tx.amount;
      document.getElementById("date").value = tx.date;
      document.getElementById("category").value = tx.category;
      document.querySelector(`input[value="${tx.type}"]`).checked = true;

      transactions = transactions.filter((t) => t.id != id);
      localStorage.setItem("transactions", JSON.stringify(transactions));
      renderTransactions();
      updateOverview();
      updateExpenseChart();
    }
  }
});

// ====== Update Overview ======
function updateOverview() {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const remaining = income - expense;

  document.querySelector("#income-overview-card b").textContent = `Rs.${income}`;
  document.querySelector("#expense-overview-card b").textContent = `Rs.${expense}`;
  document.querySelector("#remaining-overview-card b").textContent = `Rs.${remaining}`;
}

// ====== Update Expense Chart ======
function updateExpenseChart() {
  const expenses = transactions.filter((t) => t.type === "expense");
  const categoryTotals = {};
  expenses.forEach((t) => {
    categoryTotals[t.category] =
      (categoryTotals[t.category] || 0) + t.amount;
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  expenseChart.data.labels = labels;
  expenseChart.data.datasets[0].data = data;
  expenseChart.update();
}

function updateSavingsProgress() {
  const data = JSON.parse(localStorage.getItem("savingsProgress")) || {progress: 0};

  const progressBar = document.querySelector("#progress-overview-card .progress-bar");
  progressBar.style.width = `${data.progress}%`;
  progressBar.innerHTML = `<b>${data.progress}%</b>`;
}


// ====== Initial Render ======
localStorage.clear();
transactions=[];
renderTransactions();
updateOverview();
updateExpenseChart();
updateSavingsProgress(); 
