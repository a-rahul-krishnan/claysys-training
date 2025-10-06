// ===== POPUP Controls =====
function newGoalPopupOpen() {
  document.getElementById("new-goal-popup").style.display = "block";
}
function newGoalPopupClose() {
  document.getElementById("new-goal-popup").style.display = "none";
}
function updateGoalPopupOpen() {
  document.getElementById("update-goal-popup").style.display = "block";
}
function updateGoalPopupClose() {
  document.getElementById("update-goal-popup").style.display = "none";
}

// ===== Local Storage Setup =====
let goals = JSON.parse(localStorage.getItem("goals")) || [];
let currentUpdateId = null;

// ===== DOM Elements =====
const goalsGrid = document.getElementById("goals-grid");
const addGoalBtn = document.getElementById("add-goal-btn");

// ===== Add New Goal =====
addGoalBtn.addEventListener("click", () => {
  const name = document.getElementById("goal-name").value.trim();
  const goalAmount = parseFloat(document.getElementById("goal-amount").value);
  const contribution = parseFloat(document.getElementById("contribution-amount").value);

  if (!name || isNaN(goalAmount) || isNaN(contribution)) {
    alert("Please fill all fields");
    return;
  }

  const newGoal = {
    id: Date.now(),
    name,
    goalAmount,
    contributed: contribution,
  };

  goals.push(newGoal);
  localStorage.setItem("goals", JSON.stringify(goals));

  renderGoals();
  updateTotalProgress();
  newGoalPopupClose();

  // Clear inputs
  document.getElementById("goal-name").value = "";
  document.getElementById("goal-amount").value = "";
  document.getElementById("contribution-amount").value = "";
});

// ===== Render Goals =====
function renderGoals() {
  goalsGrid.innerHTML = "";

  goals.forEach((goal) => {
    const progress = Math.min(Math.round((goal.contributed / goal.goalAmount) * 100), 100);

    const card = document.createElement("div");
    card.classList.add("goals-card");
    if (progress >= 100) card.classList.add("completed");

    card.innerHTML = `
      <div class="goals-card-header">
        <h3>${goal.name}</h3>
      </div>

      <div class="goals-card-content">
        <div class="status-bar-border">
          <div class="status-bar" style="width: ${progress}%;">${progress}%</div>
        </div>
        <p>Rs. ${goal.contributed} / Rs. ${goal.goalAmount}</p>
        ${
          progress < 100
            ? `<button onclick="openContributionPopup(${goal.id})">Contribute (+)</button>`
            : `<p style="color:green; font-weight:bold;">Goal Achieved!</p>`
        }
      </div>
    `;

    goalsGrid.appendChild(card);
  });
}

// ===== Open Contribution Popup =====
function openContributionPopup(id) {
  currentUpdateId = id;
  const goal = goals.find(g => g.id === id);

  // Pre-fill dynamic popup
  const popup = document.getElementById("update-goal-popup");
  popup.innerHTML = `
    <label>Goal Name:
      <input type="text" id="update-goal-name" value="${goal.name}" >
    </label>
    <label>Goal Amount (Rs.):
      <input type="number" id="update-goal-amount" value="${goal.goalAmount}" >
    </label>
    <label>Balance Amount (Rs.):
      <input type="number" id="update-balance-amount" value="${goal.goalAmount - goal.contributed}" readonly>
    </label>
    <label>Contribution (Rs.):
      <input type="number" id="update-contribution-amount">
    </label>
    <div>
      <button class="add-goal-btn" id="update-goal-btn">Update</button>
      <button class="cancel-goal-btn" onclick="updateGoalPopupClose();">Cancel</button>
    </div>
  `;
  updateGoalPopupOpen();

  document.getElementById("update-goal-btn").addEventListener("click", () => {
    const amount = parseFloat(document.getElementById("update-contribution-amount").value);
    if (isNaN(amount) || amount <= 0) {
      alert("Enter valid contribution");
      return;
    }

    goals = goals.map(g => {
      if (g.id === currentUpdateId) {
        g.contributed += amount;
        if (g.contributed >= g.goalAmount) {
          g.contributed = g.goalAmount;
          showToast(`🎉 Goal "${g.name}" Completed!`);
        }
      }
      return g;
    });

    localStorage.setItem("goals", JSON.stringify(goals));
    renderGoals();
    updateTotalProgress();
    updateGoalPopupClose();
  });
}

// ===== Toast Notification =====
function showToast(message) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => toast.remove(), 3000);
}

// ===== Total Progress =====
function updateTotalProgress() {
  if (goals.length === 0) {
    document.getElementById("total-progress-bar").style.width = "0%";
    document.querySelector("#total-progress-bar b").textContent = "0%";
    return;
  }

  const totalTarget = goals.reduce((sum, g) => sum + g.goalAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.contributed, 0);
  const progress = Math.round((totalSaved / totalTarget) * 100);

  const bar = document.getElementById("total-progress-bar");
  bar.style.width = `${progress}%`;
  bar.querySelector("b").textContent = `${progress}%`;
    
  localStorage.setItem("savingsProgress", JSON.stringify({progress, totalSaved, totalTarget}));
}

// ===== Initial Load =====
renderGoals();
updateTotalProgress();
