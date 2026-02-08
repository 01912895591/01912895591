const display = document.getElementById('display');
const buttons = document.querySelector('.buttons');

let current = '0';
let previous = null;
let operator = null;
let waitingForNext = false;

function updateDisplay() {
  display.value = current;
}

function inputNumber(number) {
  if (waitingForNext) {
    current = number;
    waitingForNext = false;
    return;
  }

  current = current === '0' ? number : current + number;
}

function inputDecimal() {
  if (waitingForNext) {
    current = '0.';
    waitingForNext = false;
    return;
  }

  if (!current.includes('.')) {
    current += '.';
  }
}

function clearAll() {
  current = '0';
  previous = null;
  operator = null;
  waitingForNext = false;
}

function deleteLast() {
  if (waitingForNext) return;
  current = current.length > 1 ? current.slice(0, -1) : '0';
}

function toggleSign() {
  current = (parseFloat(current) * -1).toString();
}

function toPercent() {
  current = (parseFloat(current) / 100).toString();
}

function calculate(first, second, op) {
  const a = parseFloat(first);
  const b = parseFloat(second);

  if (Number.isNaN(a) || Number.isNaN(b)) return second;

  switch (op) {
    case '+':
      return (a + b).toString();
    case '-':
      return (a - b).toString();
    case '*':
      return (a * b).toString();
    case '/':
      return b === 0 ? 'Error' : (a / b).toString();
    default:
      return second;
  }
}

function chooseOperator(nextOperator) {
  if (operator && !waitingForNext) {
    current = calculate(previous, current, operator);
  }

  previous = current;
  operator = nextOperator;
  waitingForNext = true;
}

function runEquals() {
  if (!operator || previous === null) return;

  current = calculate(previous, current, operator);
  previous = null;
  operator = null;
  waitingForNext = true;
}

buttons.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;

  const { value, action } = target.dataset;

  if (value) {
    if (['+', '-', '*', '/'].includes(value)) {
      chooseOperator(value);
    } else if (value === '.') {
      inputDecimal();
    } else {
      inputNumber(value);
    }
  }

  if (action) {
    if (action === 'clear') clearAll();
    if (action === 'delete') deleteLast();
    if (action === 'sign') toggleSign();
    if (action === 'percent') toPercent();
    if (action === 'equals') runEquals();
  }

  updateDisplay();
});

window.addEventListener('keydown', (event) => {
  const key = event.key;

  if (/^[0-9]$/.test(key)) inputNumber(key);
  if (key === '.') inputDecimal();
  if (['+', '-', '*', '/'].includes(key)) chooseOperator(key);
  if (key === 'Enter' || key === '=') runEquals();
  if (key === 'Backspace') deleteLast();
  if (key === 'Escape') clearAll();
  if (key === '%') toPercent();

  updateDisplay();
});

updateDisplay();
