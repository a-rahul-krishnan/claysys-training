const resultTable = document.getElementById("result-table");

function addTask() {
    const input = document.getElementById("input");
    const task = input.value.trim();

    if (task === "") return; 

    const row = document.createElement("tr");

    const checkCell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkCell.appendChild(checkbox);

    const taskCell = document.createElement("td");
    taskCell.textContent = task;

    const deleteCell = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteCell.appendChild(deleteBtn);


    row.appendChild(checkCell);
    row.appendChild(taskCell);
    row.appendChild(deleteCell);

    resultTable.appendChild(row);

    input.value = "";
}

resultTable.addEventListener("click", (e) => {
    if (e.target.type === "checkbox") {
        const row = e.target.closest("tr");
        row.cells[1].style.textDecoration = e.target.checked ? "line-through" : "none";
    }

    if (e.target.classList.contains("delete-btn")) {
        e.target.closest("tr").remove();
    }
});
