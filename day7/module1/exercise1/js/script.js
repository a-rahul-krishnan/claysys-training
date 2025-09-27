const resultTable = document.getElementById("result-table");

class Product {
  constructor(name, price, quantity) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }
}

inventory = [];

function addProduct() {
  const name = document.getElementById("name");
  const price = document.getElementById("price");
  const quantity = document.getElementById("quantity");

  if (name.value.trim() === "" || isNaN(price.value) || isNaN(quantity.value)) {
    alert("Enter valid Inputs!");
    return;
  }

  inventory.push(
    new Product(name.value, parseFloat(price.value), quantity.value)
  );

  displayProduct();

  name.value = "";
  price.value = "";
  quantity.value = "";
}

function displayProduct() {
  resultTable.innerHTML = `
    <tr>
        <th>Product Name</th>
        <th>Price</th>
        <th>Quantity</th>
    </tr>
    `;

  inventory.forEach((element) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = element.name.trim();

    const priceCell = document.createElement("td");
    priceCell.textContent = "$" + parseFloat(element.price).toFixed(2);

    const quantityCell = document.createElement("td");
    quantityCell.textContent = element.quantity;

    row.appendChild(nameCell);
    row.appendChild(priceCell);
    row.appendChild(quantityCell);

    resultTable.appendChild(row);
  });
}
