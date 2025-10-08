// Dark Mode Toggle
const toggle = document.getElementById("darkModeToggle");
const body = document.body;

// Load preference
if (localStorage.getItem("darkMode") === "enabled") {
  body.classList.add("dark-mode");
  if (toggle) toggle.checked = true;
}

// Toggle event
if (toggle) {
  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "enabled");
    } else {
      body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "disabled");
    }
  });
}
