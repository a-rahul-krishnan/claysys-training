// ===== Export Transactions as CSV =====
document.getElementById("export-btn").addEventListener("click", () => {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  if (transactions.length === 0) {
    alert("No transactions to export!");
    return;
  }

  const header = ["id", "type", "amount", "category", "date"];
  const rows = transactions.map(t => [t.id, t.type, t.amount, t.category, t.date]);

  const csvContent = [header, ...rows]
    .map(e => e.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
});

// ===== Import Transactions from CSV (Clears old data) =====
document.getElementById("import-btn").addEventListener("click", () => {
  const fileInput = document.getElementById("import-file");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a CSV file first");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    const rows = text.split("\n").slice(1); // skip header row

    // Clear old data before import
    let transactions = [];

    rows.forEach(row => {
      if (row.trim() === "") return;
      const [id, type, amount, category, date] = row.split(",");
      transactions.push({
        id: Date.now() + Math.random(), 
        type,
        amount: parseFloat(amount),
        category,
        date
      });
    });

    localStorage.setItem("transactions", JSON.stringify(transactions));
    alert("Transactions imported successfully!");
  };
  reader.readAsText(file);
});
