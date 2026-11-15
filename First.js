
const resultDisplay = document.getElementById("result");
const expressionDisplay = document.getElementById("expression");
const buttons = document.querySelector(".buttons");

let currentInput = "0";
let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;
let expression = "";

// Update the calculator display
function updateDisplay() {
    resultDisplay.textContent = currentInput;
    expressionDisplay.textContent = expression || "Ready to calculate";
}

// Enter a number
function enterNumber(number) {
    if (currentInput === "Error") {
        currentInput = number;
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

// Enter a decimal point
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

// Select an arithmetic operator
function chooseOperator(nextOperator) {
    if (currentInput === "Error") return;

    const inputValue = Number(currentInput);

    if (operator && !waitingForSecondNumber) {
        calculate();
    }

    firstNumber = Number(currentInput);
    operator = nextOperator;
    waitingForSecondNumber = true;

    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    expression = `${currentInput} ${symbols[operator]}`;
    updateDisplay();
}

// Perform the calculation
function calculate() {
    if (
        operator === null ||
        firstNumber === null ||
        waitingForSecondNumber ||
        currentInput === "Error"
    ) {
        return;
    }

    const secondNumber = Number(currentInput);
    let answer;

    switch (operator) {
        case "+":
            answer = firstNumber + secondNumber;
            break;

        case "-":
            answer = firstNumber - secondNumber;
            break;

        case "*":
            answer = firstNumber * secondNumber;
            break;

        case "/":
            if (secondNumber === 0) {
                currentInput = "Error";
                expression = "Cannot divide by zero";
                firstNumber = null;
                operator = null;
                waitingForSecondNumber = true;
                updateDisplay();
                return;
            }

            answer = firstNumber / secondNumber;
            break;
    }

    expression = `${firstNumber} ${operator} ${secondNumber} =`;

    // Avoid displaying floating-point precision errors
    currentInput = String(Number(answer.toPrecision(12)));

    firstNumber = null;
    operator = null;
    waitingForSecondNumber = true;

    updateDisplay();
}

// Clear everything
function clearCalculator() {
    currentInput = "0";
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;
    expression = "";

    updateDisplay();
}

// Handle AC, sign, and percentage
function handleAction(action) {
    switch (action) {
        case "clear":
            clearCalculator();
            break;

        case "sign":
            if (currentInput !== "0" && currentInput !== "Error") {
                currentInput = String(-Number(currentInput));
            }
            updateDisplay();
            break;

        case "percent":
            if (currentInput !== "Error") {
                currentInput = String(Number(currentInput) / 100);
            }
            updateDisplay();
            break;

        case "decimal":
            enterDecimal();
            break;

        case "equals":
            calculate();
            break;
    }
}

// Handle all calculator button clicks
buttons.addEventListener("click", function (event) {
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

// Start the calculator
updateDisplay();
