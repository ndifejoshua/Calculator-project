"use strict";
// Initialize variables from DOM elements
const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
const themeToggle = document.getElementById("themeToggle");
const calculator = document.querySelector(".calculator");
const body = document.body;
const toggleHistory = document.getElementById("toggleHistory");
const historyContainer = document.getElementById("history");
const historyList = document.getElementById("history-list");

let currentExpression = "0";
display.textContent = "0";

// Toggle History
toggleHistory.addEventListener("click", () => {
  historyContainer.classList.toggle("hidden");
});

// Clear History
document.getElementById("clearHistory").addEventListener("click", () => {
  historyList.innerHTML = "";
});

// Button Input Handling
buttons.forEach((button) => {
  const value = button.dataset.value;
  if (!value || value === "clear" || value === "backspace" || value === "=")
    return;

  button.addEventListener("click", () => {
    currentExpression =
      currentExpression === "0" ? (value === "**" ? "^" : value) : currentExpression + (value === "**" ? "^" : value);
    display.textContent = currentExpression;
  });
});

// Equal (=)
document.querySelector(".btn--equality").addEventListener("click", () => {
  try {
    const evalExpression = currentExpression.replace(/\^/g, "**");
    const result = eval(evalExpression);
    display.textContent = result;
    const historyEntry = document.createElement("div");
    historyEntry.textContent = `${currentExpression} = ${result}`;
    historyList.appendChild(historyEntry); // Add latest entry to the bottom

    // Limit to last 10 evaluation
    while (historyList.children.length > 10) {
      historyList.removeChild(historyList.firstChild); //Remove oldest entry
    }

    currentExpression = result.toString();
  } catch {
    display.textContent = "Error";
    currentExpression = "0";
  }
});

// Clear (C)
document.querySelector(".btn--clear").addEventListener("click", () => {
  currentExpression = "0";
  display.textContent = "0";
});

// Backspace
document.querySelector(".btn--backspace").addEventListener("click", () => {
  currentExpression = currentExpression.slice(0, -1);
  if (currentExpression === "") currentExpression = "0";
  display.textContent = currentExpression;
});

// Keyboard Support
document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (/[\d+\-*/.^%]/.test(key)) // If the key is a digit, operator, decimal, or percent, append it to the current expression
  {
    currentExpression =
      currentExpression === "0" ? (key === "^" ? "^" : key) : currentExpression + (key === "^" ? "^" : key);
    display.textContent = currentExpression;
  } else if (key === "Enter" || key === "=") {
    try {
      const evalExpression = currentExpression.replace(/\^/g, "**");
      const result = eval(evalExpression);
      display.textContent = result;

      // Add the calculation and result to history
      const historyEntry = document.createElement("div");
      historyEntry.textContent = `${currentExpression} = ${result}`;
      historyList.appendChild(historyEntry);
      while (historyList.children.length > 10) {
        historyList.removeChild(historyList.firstChild);
      }
      // Set current expression to result for continued calculations and show error if evaluation fails and reset current expression
      currentExpression = result.toString();
    } catch {
      display.textContent = "Error";
      currentExpression = "0";
    }
  } else if (key === "Backspace") {
    currentExpression = currentExpression.slice(0, -1);
    if (currentExpression === "") currentExpression = "0";
    display.textContent = currentExpression;
  }
  // If Escape is pressed, clear the expression and display
  else if (key === "Escape") {
    currentExpression = "0";
    display.textContent = "0";
  }
});

// Theme Toggle
themeToggle.addEventListener("click", () => {
  const isDark = body.classList.toggle("dark-mode");
  body.classList.toggle("light-mode", !isDark);
  calculator.classList.toggle("dark", isDark);
  calculator.classList.toggle("light", !isDark);
  themeToggle.textContent = isDark ? "☀️" : "🌙";
});

// Set Default Theme
body.classList.add("dark-mode");
calculator.classList.add("dark");
