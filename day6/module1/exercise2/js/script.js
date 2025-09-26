// Reference table
const resultTable = document.getElementById("result-table");

// Add task
function addTask() {
    const input = document.getElementById("input");
    const task = input.value.trim();

    if (task === "") return; // prevent empty input

    // Create row
    const row = document.createElement("tr");

    // Checkbox cell
    const checkCell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkCell.appendChild(checkbox);

    // Task text cell
    const taskCell = document.createElement("td");
    taskCell.textContent = task;

    // Delete button cell
    const deleteCell = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteCell.appendChild(deleteBtn);

    // Append cells to row
    row.appendChild(checkCell);
    row.appendChild(taskCell);
    row.appendChild(deleteCell);

    // Add row to table
    resultTable.appendChild(row);

    // Reset input
    input.value = "";
}

// Event delegation for table
resultTable.addEventListener("click", (e) => {
    if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
        // Mark completed with strike-through
        const row = e.target.closest("tr");
        row.cells[1].style.textDecoration = e.target.checked ? "line-through" : "none";
    }

    if (e.target.classList.contains("delete-btn")) {
        // Delete row
        e.target.closest("tr").remove();
    }
});
