"use strict";
const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");
let expression = "";
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const value = button.textContent || "";
        if (value === "C") {
            expression = "";
            display.value = "0";
        }
        else if (value === "=") {
            try {
                const result = eval(expression);
                display.value = result.toString();
                expression = result.toString();
            }
            catch (error) {
                display.value = "Error";
                expression = "";
            }
        }
        else {
            expression += value;
            display.value = expression;
        }
    });
});
