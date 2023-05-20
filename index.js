let LIMIT = 10000;
const CURRENCY = 'TL';
const STATUS_IN_LIMIT = 'все хорошо';
const STATUS_OUT_OF_LIMIT = 'все плохо';
const STATUS_OUT_OF_LIMIT_CLASSNAME = 'status_red';

const inputNode = document.querySelector('.js-expenses-amount-input');
const buttonNode = document.querySelector('.js-expenses-amount-btn');
const historyNode = document.querySelector('.js-history');
const sumNode = document.querySelector('.js-sum');
const limitNode = document.querySelector('.js-limit');
const statusNode = document.querySelector('.js-status');
const currentCategoryNode = document.querySelector('.js-category');
const clearButtonNode = document.querySelector('.js-clear-button');
const limitChangeNode = document.querySelector('.js-limit-image');
const popupNode = document.querySelector('.js-popup');
const popupFormNode = document.querySelector('.js-popup-form');
const popupInputNode = document.querySelector('.js-popup-input');
const popupSubmitNode = document.querySelector('.js-popup-submit');
const popupCloseNode = document.querySelector('.js-popup-close');

let expenses = [];

init();

buttonNode.addEventListener('click', function () {
  const expense = getExpenseFromUser();

  if (!expense) {
    if (currentCategoryNode.value === 'Категория') {
      alert('Выберите категорию');
    }
    return;
  }

  trackExpense(expense);
  saveExpensesToLocalStorage(); // Сохраняем историю трат в локальное хранилище

  render();
});

clearButtonNode.addEventListener('click', function () {
  expenses = [];
  saveExpensesToLocalStorage(); // Сохраняем пустую историю трат в локальное хранилище
  render();
});

limitChangeNode.addEventListener('click', openPopup);
popupFormNode.addEventListener('submit', changeLimit);
popupCloseNode.addEventListener('click', closePopup);

function init() {
  loadExpensesFromLocalStorage(); // Загружаем сохраненную историю трат из локального хранилища
  limitNode.innerText = LIMIT;
  statusNode.innerText = STATUS_IN_LIMIT;
  render();
}

function trackExpense(expense) {
  expenses.push({ category: currentCategoryNode.value, amount: expense });
}

function getExpenseFromUser() {
  if (!inputNode.value || currentCategoryNode.value === 'Категория') {
    return null;
  }

  const expense = parseInt(inputNode.value);

  clearInput();

  return expense;
}

function clearInput() {
  inputNode.value = '';
}

function calculateExpenses() {
  let sum = 0;

  expenses.forEach((element) => {
    sum += element.amount;
  });

  return sum;
}

function render() {
  const sum = calculateExpenses();

  renderHistory();
  renderSum(sum);
  renderStatus(sum);
}

function renderHistory() {
  let expensesListHTML = '';

  expenses.forEach((element) => {
    expensesListHTML += `<li>${element.category}: ${element.amount} ${CURRENCY}</li>`;
  });

  historyNode.innerHTML = `<ol>${expensesListHTML}</ol>`;
}

function renderSum(sum) {
  sumNode.innerText = sum;
}

function renderStatus(totalSum) {
  statusNode.classList.remove(STATUS_OUT_OF_LIMIT_CLASSNAME);

  if (totalSum <= LIMIT) {
    statusNode.innerText = STATUS_IN_LIMIT;
  } else {
    statusNode.innerText = `${STATUS_OUT_OF_LIMIT} (${LIMIT - totalSum} ${CURRENCY})`;
    statusNode.classList.add(STATUS_OUT_OF_LIMIT_CLASSNAME);
  }
}

function openPopup() {
  popupNode.style.display = 'block';
  popupInputNode.value = LIMIT;
}

function closePopup() {
  popupNode.style.display = 'none';
}

function changeLimit(event) {
  event.preventDefault();
  const newLimit = parseInt(popupInputNode.value);
  if (!isNaN(newLimit)) {
    LIMIT = newLimit;
    limitNode.innerText = LIMIT;
    render();
    closePopup();
  }
}

function saveExpensesToLocalStorage() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function loadExpensesFromLocalStorage() {
  const storedExpenses = localStorage.getItem('expenses');
  if (storedExpenses) {
    expenses = JSON.parse(storedExpenses);
  }
}
