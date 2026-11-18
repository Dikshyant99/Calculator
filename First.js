
const resultDisplay = document.getElementById("result");
const expressionDisplay = document.getElementById("expression");
const buttons = document.querySelector(".buttons");

let currentInput = "0";
let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;
let expression = "";

let memory = 0;
let lastOperator = null;
let lastOperand = null;
let calculationHistory = [];

// Update display
function updateDisplay() {
    resultDisplay.textContent = currentInput;
    expressionDisplay.textContent =
        expression || "Ready to calculate";
}

// Format calculation results
function formatNumber(number) {
    if (!Number.isFinite(number)) return "Error";
    return String(Number(number.toPrecision(12)));
}

// Enter number
function enterNumber(number) {
    if (currentInput === "Error") {
        currentInput = number;
        waitingForSecondNumber = false;
    } else if (waitingForSecondNumber) {
        currentInput = number;
        waitingForSecondNumber = false;
    } else if (currentInput === "0") {
        currentInput = number;
    } else if (currentInput.length < 15) {
        currentInput += number;
    }

    updateDisplay();
}

// Decimal
function enterDecimal() {
    if (currentInput === "Error") {
        currentInput = "0";
    }

    if (waitingForSecondNumber) {
        currentInput = "0";
        waitingForSecondNumber = false;
    }

    if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}

// Choose operator
function chooseOperator(nextOperator) {
    if (currentInput === "Error") return;

    if (operator && !waitingForSecondNumber) {
        calculate();
    }

    firstNumber = Number(currentInput);
    operator = nextOperator;
    waitingForSecondNumber = true;

    lastOperator = null;
    lastOperand = null;

    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    expression = `${currentInput} ${symbols[operator]}`;
    updateDisplay();
}

// Calculate
function calculate() {
    if (
        operator === null ||
        firstNumber === null ||
        waitingForSecondNumber ||
        currentInput === "Error"
    ) {
        // Repeat previous calculation
        if (
            lastOperator !== null &&
            lastOperand !== null &&
            currentInput !== "Error"
        ) {
            const previous = Number(currentInput);
            const answer = performCalculation(
                previous,
                lastOperand,
                lastOperator
            );

            if (answer === null) return;

            currentInput = formatNumber(answer);
            expression = `${previous} ${lastOperator} ${lastOperand} =`;
            updateDisplay();
        }

        return;
    }

    const secondNumber = Number(currentInput);
    const savedOperator = operator;
    const savedFirstNumber = firstNumber;

    const answer = performCalculation(
        firstNumber,
        secondNumber,
        operator
    );

    if (answer === null) return;

    expression =
        `${savedFirstNumber} ${savedOperator} ${secondNumber} =`;

    lastOperator = savedOperator;
    lastOperand = secondNumber;

    currentInput = formatNumber(answer);

    calculationHistory.unshift({
        expression,
        result: currentInput
    });

    firstNumber = null;
    operator = null;
    waitingForSecondNumber = true;

    updateDisplay();
}

// Arithmetic engine
function performCalculation(a, b, op) {
    let answer;

    switch (op) {
        case "+":
            answer = a + b;
            break;

        case "-":
            answer = a - b;
            break;

        case "*":
            answer = a * b;
            break;

        case "/":
            if (b === 0) {
                showError("Cannot divide by zero");
                return null;
            }
            answer = a / b;
            break;

        default:
            return null;
    }

    if (!Number.isFinite(answer)) {
        showError("Invalid calculation");
        return null;
    }

    return answer;
}

// Show error
function showError(message) {
    currentInput = "Error";
    expression = message;

    firstNumber = null;
    operator = null;
    waitingForSecondNumber = true;
    lastOperator = null;
    lastOperand = null;

    updateDisplay();
}

// Clear calculator
function clearCalculator() {
    currentInput = "0";
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;
    expression = "";
    lastOperator = null;
    lastOperand = null;

    updateDisplay();
}

// Backspace
function backspace() {
    if (currentInput === "Error") {
        clearCalculator();
        return;
    }

    if (waitingForSecondNumber) return;

    currentInput =
        currentInput.length > 1
            ? currentInput.slice(0, -1)
            : "0";

    if (currentInput === "-") {
        currentInput = "0";
    }

    updateDisplay();
}

// Toggle sign
function toggleSign() {
    if (currentInput === "0" || currentInput === "Error") {
        return;
    }

    currentInput = String(-Number(currentInput));
    updateDisplay();
}

// Percentage
function percentage() {
    if (currentInput === "Error") return;

    currentInput = formatNumber(
        Number(currentInput) / 100
    );

    updateDisplay();
}

// Square
function square() {
    if (currentInput === "Error") return;

    const value = Number(currentInput);

    expression = `${value}²`;
    currentInput = formatNumber(value * value);

    waitingForSecondNumber = true;
    firstNumber = null;
    operator = null;

    updateDisplay();
}

// Square root
function squareRoot() {
    if (currentInput === "Error") return;

    const value = Number(currentInput);

    if (value < 0) {
        showError("Invalid square root");
        return;
    }

    expression = `√(${value})`;
    currentInput = formatNumber(Math.sqrt(value));

    waitingForSecondNumber = true;
    firstNumber = null;
    operator = null;

    updateDisplay();
}

// Reciprocal
function reciprocal() {
    if (currentInput === "Error") return;

    const value = Number(currentInput);

    if (value === 0) {
        showError("Cannot divide by zero");
        return;
    }

    expression = `1 / ${value}`;
    currentInput = formatNumber(1 / value);

    waitingForSecondNumber = true;
    firstNumber = null;
    operator = null;

    updateDisplay();
}

// Memory functions
function memoryAction(action) {
    const value = Number(currentInput);

    switch (action) {
        case "memory-clear":
            memory = 0;
            break;

        case "memory-recall":
            currentInput = formatNumber(memory);
            waitingForSecondNumber = false;
            break;

        case "memory-add":
            if (currentInput === "Error") return;
            memory += value;
            break;

        case "memory-subtract":
            if (currentInput === "Error") return;
            memory -= value;
            break;
    }

    updateDisplay();
}

// Handle actions
function handleAction(action) {
    switch (action) {
        case "clear":
            clearCalculator();
            break;

        case "backspace":
            backspace();
            break;

        case "sign":
            toggleSign();
            break;

        case "percent":
            percentage();
            break;

        case "decimal":
            enterDecimal();
            break;

        case "equals":
            calculate();
            break;

        case "square":
            square();
            break;

        case "sqrt":
            squareRoot();
            break;

        case "reciprocal":
            reciprocal();
            break;

        case "memory-clear":
        case "memory-recall":
        case "memory-add":
        case "memory-subtract":
            memoryAction(action);
            break;
    }
}

// Button click handling
buttons.addEventListener("click", function(event) {
    const button = event.target.closest("button");

    if (!button) return;

    if (button.dataset.number !== undefined) {
        enterNumber(button.dataset.number);
    } else if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
    } else if (button.dataset.action) {
        handleAction(button.dataset.action);
    }
});

// Keyboard support
document.addEventListener("keydown", function(event) {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        enterNumber(key);
    } else if (key === ".") {
        enterDecimal();
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    } else if (key === "Backspace") {
        backspace();
    } else if (key === "Escape") {
        clearCalculator();
    } else if (key === "%") {
        percentage();
    }
});

// Start calculator
updateDisplay();
