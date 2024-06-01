const btnPay = document.querySelector('.btn-pay') as HTMLButtonElement;
const amountInput = document.querySelector('#amount') as HTMLInputElement;
const categoryInput = document.querySelector('#Categories') as HTMLSelectElement;
const paymentForm = document.querySelector('.payment-form') as HTMLFormElement;
const trasactionHistory = document.querySelector('.transaction > div') as HTMLDivElement;
const btnPayment = document.querySelector('.btn-payment') as HTMLButtonElement;
const paymentContainer = document.querySelector('.payment-container') as HTMLDivElement;
const btnCancel = document.querySelector('.btn-Cancel') as HTMLButtonElement;
const btnIncome = document.querySelector('.btn-income') as HTMLButtonElement;
const addMoneyContainer = document.querySelector('.add-money-container') as HTMLDivElement;
const btnCancelForm = document.querySelector('.btn-Cancel-form') as HTMLButtonElement;
const addAmountInput = document.querySelector('#Add-amount') as HTMLInputElement;
const addMoneyForm = document.querySelector('.add-money-form') as HTMLFormElement;
const btnAddMoney = document.querySelector('.btn-add') as HTMLButtonElement;
const balanceText = document.querySelector('.balance span') as HTMLDivElement;
const btnReminder = document.querySelector('.btn-reminder') as HTMLButtonElement;
const reminderContainer = document.querySelector('.reminder-container') as HTMLDivElement;
const btnCancelReminder = document.querySelector('.btn-Cancel-reminder') as HTMLButtonElement;
const btnAddTask = document.querySelector('.btn-add-task') as HTMLButtonElement;
const taskDescriptionInput = document.querySelector('#task') as HTMLTextAreaElement;
const reminderDateInput = document.querySelector('#date') as HTMLInputElement;
const reminderHistory = document.querySelector('.reminder') as HTMLDivElement;
const billsBalance = document.querySelector('.BU-balance span') as HTMLSpanElement;
const foodAndDrinkBalance = document.querySelector('.FD-balance span') as HTMLSpanElement;
const otherBalance = document.querySelector('.other span') as HTMLSpanElement;
const schoolBalance = document.querySelector('.School-balance span') as HTMLSpanElement;
const checkboxInput = document.querySelector('#checkbox') as HTMLInputElement;
const setReminderForm = document.querySelector('.set-reminder-form') as HTMLFormElement;
const userName = document.querySelector('.user') as HTMLSpanElement;
const body = document.querySelector('main') as HTMLBodyElement;


type Transactions = {
    category: string;
    amount: number;
    date: Date;
}

type Reminder = {
    description: string,
    date: string,
    complete: boolean
}

type CategoryAmount = {
    category: string;
    amount: number;
}




const currentUserEmail = localStorage.getItem("current_user_email");
const reminderArray: Reminder[] = loadReminders();
const transactions: Transactions[] = loadTransactions();
const balance: number[] = loadBalance();
const schoolFees: number[] = loadSchoolFees();
const foodAndDrink: number[] = loadFoodAndDrink();
const billsAndUtilities: number[] = loadBills();
const other: number[] = loadOther();
const names: string[] = (currentUserEmail as string).split('@');



function displayUser(): void{
    userName.textContent = `Welcome ${names[0]}`
}
function loadReminders(): Reminder[] {
    const retrievedReminders = localStorage.getItem(`reminder_${currentUserEmail}`);
    return retrievedReminders ? JSON.parse(retrievedReminders) : [];
}

function loadTransactions(): Transactions[] {
    const loadedValue = localStorage.getItem(`transaction_${currentUserEmail}`);
    return loadedValue ? JSON.parse(loadedValue).map((trans: Transactions) => ({
        ...trans,
        date: new Date(trans.date)
    })) : [];
}

function loadBalance(): number[] {
    const retrievedBalance = localStorage.getItem(`balance_${currentUserEmail}`);
    return retrievedBalance ? JSON.parse(retrievedBalance) : [];
}

function loadBills(): number[] {
    const loadValue = localStorage.getItem(`bills_${currentUserEmail}`);
    return loadValue ? JSON.parse(loadValue) : [];
}

function loadSchoolFees(): number[] {
    const loadValue = localStorage.getItem(`school_${currentUserEmail}`);
    return loadValue ? JSON.parse(loadValue) : [];
}

function loadOther(): number[] {
    const loadValue = localStorage.getItem(`other_${currentUserEmail}`);
    return loadValue ? JSON.parse(loadValue) : [];
}

function loadFoodAndDrink(): number[] {
    const loadValue = localStorage.getItem(`food_${currentUserEmail}`);
    return loadValue ? JSON.parse(loadValue) : [];
}

const totalSchoolFeesBalance = schoolFees.reduce(function(acc: number, curr: number) {
    return acc + curr;
}, 0);

const totalFoodAndDrinkBalance = foodAndDrink.reduce(function(acc: number, curr: number) {
    return acc + curr;
}, 0);

const totalOtherBalance = other.reduce(function(acc: number, curr: number) {
    return acc + curr;
}, 0);

const totalBills = billsAndUtilities.reduce(function(acc: number, curr: number) {
    return acc + curr;
}, 0);

const totalBalance = balance.reduce(function(acc: number, curr: number) {
    return acc + curr;
}, 0);

btnReminder.addEventListener('click', function(e) {
    e.preventDefault();
    reminderContainer.style.display = 'block';
    body.classList.add('blurred');
});

btnCancelReminder.addEventListener('click', function(e) {
    e.preventDefault();
    reminderContainer.style.display = 'none';
    body.classList.remove('blurred');
});

btnPayment.addEventListener('click', function(e) {
    e.preventDefault();
    paymentContainer.style.display = 'block';
    body.classList.add('blurred');
});

btnCancel.addEventListener('click', function(e) {
    e.preventDefault();
    paymentContainer.style.display = 'none';
    body.classList.remove('blurred');
});

btnCancelForm.addEventListener('click', function(e) {
    e.preventDefault();
    console.log(e.target);
    addMoneyContainer.style.display = 'none';
    body.classList.remove('blurred');
});

btnIncome.addEventListener('click', function(e) {
    e.preventDefault();
    addMoneyContainer.style.display = 'block';
    body.classList.add('blurred');
});

btnPay.addEventListener('click', function(e) {
    e.preventDefault();
    const transactionItem: Transactions = {
        category: categoryInput.value,
        amount: +(amountInput.value),
        date: new Date(),
    }

    const categoryAmount: CategoryAmount = {
        category: categoryInput.value,
        amount: +(amountInput.value),
    }

    categoryUpdate(categoryAmount);
    if (transactionItem.amount <= totalBalance) {
        transactions.push(transactionItem);
        updateTransactionStorage();
        renderTransaction(transactionItem);
    }

    // Update the balances dynamically
    updateBalance();
    updateSchoolFeesBalance();
    updateBillsBalance();
    updateOtherBalance();
    updateFoodAndDrinkBalance();
    // renderChart();
    updateLocalStorage();
    
    paymentContainer.style.display = 'none';
    body.classList.remove('blurred');
    paymentForm.reset();
    renderChart();
});

btnAddMoney.addEventListener('click', function(e) {
    e.preventDefault();
    const newAmount = Number(addAmountInput.value);
    balance.push(newAmount);

    updateLocalStorage();
    updateBalance();
    
    addMoneyContainer.style.display = 'none';
    body.classList.remove('blurred');
    addMoneyForm.reset();
    renderChart();
});

btnAddTask.addEventListener('click', function(e) {
    e.preventDefault();

    const reminderDate = new Date(reminderDateInput.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Reset the time part for comparison

    if (reminderDate < today) {
        alert("You cannot set a reminder for a past date.");
        return;
    }
    const reminderItem: Reminder = {
        description: taskDescriptionInput.value,
        date: reminderDateInput.value,
        complete: checkboxInput.checked,
    }

    reminderArray.push(reminderItem);
    displayReminderTask(reminderItem);
    updateReminderStorage();

    reminderContainer.style.display = 'none';
    body.classList.remove('blurred');
    setReminderForm.reset();
});
// New function to check reminders and send notifications
function checkReminders() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Reset the time part for comparison

    reminderArray.forEach(reminder => {
        if (reminder.complete) {
            return;  // Skip reminders that are marked as complete
        }
        const reminderDate = new Date(reminder.date);
        const timeDiff = reminderDate.getTime() - today.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);

        if (daysDiff >= 0 && daysDiff <= 3 && !reminder.complete) {
            sendNotification(reminder);
        }
    });
}

// Function to send a notification (you can customize this as needed)
function sendNotification(reminder: Reminder) {
    alert(`Reminder: ${reminder.description} is due on ${reminder.date}`);
}

// Check reminders daily (86400000 milliseconds = 1 day)
setInterval(checkReminders, 86400000);

// Call checkReminders on page load
checkReminders();
function displayReminderTask(reminder: Reminder): void {
    const html = `
                     <div>
                            <div>
                                <span>${reminder.description}</span>
                                <input type="checkbox" ${reminder.complete ? 'checked' : ''} onchange="toggleReminderComplete('${reminder.description}')">
                            </div>
                            <br>
                            <div>
                                ${reminder.date}
                            </div>
                            <div>
                                
                                <button onclick="deleteReminder('${reminder.description}')">Delete</button>
                            </div>
                    </div>
                    <br>
                    `;

    reminderHistory.insertAdjacentHTML('afterbegin', html);
}

function renderTransaction(trans: Transactions): void {
    const html = `
                     <div class="transaction-item">
                        <span class="cat ${trans.category}">${trans.category}</span>
                        <span class="amt">ZMW ${(trans.amount).toFixed(2)}</span>
                        <span class="date">${(trans.date.getDate()) + 1}:${trans.date.getMonth() + 1}:${trans.date.getFullYear()}</span>
                    </div>
                    <hr> 
                `;
    trasactionHistory.insertAdjacentHTML('afterend', html);
}

function updateBalance(): void {
    const totalBalance = balance.reduce((acc, curr) => acc + curr, 0);
    balanceText.textContent = `${totalBalance}`;
}

function updateSchoolFeesBalance(): void {
    const totalSchoolFeesBalance = schoolFees.reduce((acc, curr) => acc + curr, 0);
    schoolBalance.textContent = `${totalSchoolFeesBalance}`;
}

function updateBillsBalance(): void {
    const totalBills = billsAndUtilities.reduce((acc, curr) => acc + curr, 0);
    billsBalance.textContent = `${totalBills}`;
}

function updateOtherBalance(): void {
    const totalOtherBalance = other.reduce((acc, curr) => acc + curr, 0);
    otherBalance.textContent = `${totalOtherBalance}`;
}

function updateFoodAndDrinkBalance(): void {
    const totalFoodAndDrinkBalance = foodAndDrink.reduce((acc, curr) => acc + curr, 0);
    foodAndDrinkBalance.textContent = `${totalFoodAndDrinkBalance}`;
}

function updateLocalStorage(): void {
    localStorage.setItem(`balance_${currentUserEmail}`, JSON.stringify(balance));
}

function categoryUpdate(catAmount: CategoryAmount) {
    const totalBalance = balance.reduce((acc, curr) => acc + curr, 0);

    if (catAmount.category === 'School') {
        if (catAmount.amount <= totalBalance) {
            schoolFees.push(catAmount.amount);
            balance.push((-1) * (catAmount.amount));
            updateSchoolStorage();
            updateSchoolFeesBalance();
        } else {
            alert("Insufficient funds, please deposit to withdraw...");
        }

    } else if (catAmount.category === 'Food and Drink') {
        if (catAmount.amount <= totalBalance) {
            foodAndDrink.push(catAmount.amount);
            balance.push((-1) * (catAmount.amount));
            updateFoodAndDrinkStorage();
            updateFoodAndDrinkBalance();
        } else {
            alert("Insufficient funds, please deposit to withdraw")
        }
    } else if (catAmount.category === 'Bill and Utilities') {
        if (catAmount.amount <= totalBalance) {
            billsAndUtilities.push(catAmount.amount);
            balance.push((-1) * (catAmount.amount));
            updateBillAndUtilitiesStorage();
            updateBillsBalance();
        } else {
            alert("Insufficient funds, please deposit to withdraw");
        }
    } else if (catAmount.category === 'Other') {
        if (catAmount.amount <= totalBalance) {
            other.push(catAmount.amount);
            balance.push((-1) * (catAmount.amount));
            updateOtherStorage();
            updateOtherBalance();
        } else {
            alert("Insufficient funds, please deposit to withdraw");
        }
    } else {
        return;
    }
    updateLocalStorage();
    updateBalance();
}

function updateReminderStorage() {
    localStorage.setItem(`reminder_${currentUserEmail}`, JSON.stringify(reminderArray));
}

function updateTransactionStorage() {
    localStorage.setItem(`transaction_${currentUserEmail}`, JSON.stringify(transactions));
}

function updateSchoolStorage() {
    localStorage.setItem(`school_${currentUserEmail}`, JSON.stringify(schoolFees));
}

function updateBillAndUtilitiesStorage() {
    localStorage.setItem(`bills_${currentUserEmail}`, JSON.stringify(billsAndUtilities));
}

function updateFoodAndDrinkStorage() {
    localStorage.setItem(`food_${currentUserEmail}`, JSON.stringify(foodAndDrink));
}

function updateOtherStorage() {
    localStorage.setItem(`other_${currentUserEmail}`, JSON.stringify(other));
}

function toggleReminderComplete(description: string): void {
    const reminder = reminderArray.find(rem => rem.description === description);
    if (reminder) {
        reminder.complete = !reminder.complete;
        updateReminderStorage();
        renderReminders();
    }
}

function deleteReminder(description: string): void {
    const index = reminderArray.findIndex(rem => rem.description === description);
    if (index > -1) {
        reminderArray.splice(index, 1);
        updateReminderStorage();
        renderReminders();
    }
}

const totalIncome = balance.reduce(function (acc, curr) { return acc + curr; }, 0) - totalBills - totalSchoolFeesBalance - totalFoodAndDrinkBalance - totalOtherBalance
function renderChart() {
    const ctx = (document.getElementById('myChart') as HTMLCanvasElement).getContext('2d');


    const totalSchoolFeesBalance = schoolFees.reduce((acc, curr) => acc + curr, 0);
    const totalFoodAndDrinkBalance = foodAndDrink.reduce((acc, curr) => acc + curr, 0);
    const totalOtherBalance = other.reduce((acc, curr) => acc + curr, 0);
    const totalBills = billsAndUtilities.reduce((acc, curr) => acc + curr, 0);
//@ts-ignore
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['School', 'Food and Drink', 'Bills and Utilities', 'Other','Income'],
            datasets: [{
                label: 'Transaction Amount',
                data: [totalSchoolFeesBalance, totalFoodAndDrinkBalance, totalBills, totalOtherBalance,totalIncome],
                backgroundColor: [
                    'rgba(30, 144, 255)',
                    'rgba(255, 99, 71)',
                    'rgba(255, 209, 59)',
                    'rgba(255, 105, 180)',
                    'rgb(98, 255, 25)',
                ],
                borderColor: [
                    'rgba(30, 144, 255)',
                    'rgba(255, 99, 71)',
                    'rgba(255, 209, 59)',
                    'rgba(255, 105, 180)',
                    'rgb(98, 255, 25)',
                ],
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}

// function renderChart() {
//     var ctx = (document.getElementById('myChart') as HTMLCanvasElement).getContext('2d');
    
//     // Color mapping for each category
//     var categoryColors = {
//         'School': 'rgba(255, 99, 132, 1)', // Red
//         'Food and Drink': 'rgba(255, 159, 64, 1)', // Orange
//         'Bills and Utilities': 'rgb(182, 255, 11, 1)', // Yellow
//         'Other': 'rgba(153, 102, 255, 1)', // Purple
//         'Income': 'rgba(54, 162, 235, 1)' // Blue

//     };

//     var categoryBorderColors = {
//         'School': 'rgba(255, 99, 132, 1)', // Red
//         'Food and Drink': 'rgba(255, 159, 64, 1)', // Orange
//         'Bills and Utilities': 'rgb(182, 255, 11, 1)', // Yellow
//         'Other': 'rgba(153, 102, 255, 1)', // Purple
//         'Income': 'rgba(54, 162, 235, 1)' // Blue
//     };

//     var categoryTotals = {
//         'School': totalSchoolFeesBalance,
//         'Food and Drink': totalFoodAndDrinkBalance,
//         'Bills and Utilities': totalBills,
//         'Other': totalOtherBalance,
//         'Income': balance.reduce(function (acc, curr) { return acc + curr; }, 0) - totalBills - totalSchoolFeesBalance - totalFoodAndDrinkBalance - totalOtherBalance
//     };

//     var labels = Object.keys(categoryTotals);
//     var amounts = Object.values(categoryTotals);
//     var backgroundColors = labels.map(function (label) { return categoryColors[label] || 'rgba(201, 203, 207, 0.2)'; });
//     var borderColors = labels.map(function (label) { return categoryBorderColors[label] || 'rgba(201, 203, 207, 1)'; });

    

//     // Create new chart instance
//     new Chart(ctx, {
//         type: 'doughnut',
//         data: {
//             labels: labels,
//             datasets: [{
//                 label: 'Transaction Amount',
//                 data: amounts,
//                 backgroundColor: backgroundColors,
//                 borderColor: borderColors,
//                 borderWidth: 3
//             }]
//         },
//         options: {
//             scales: {
//                 y: {
//                     beginAtZero: true
//                 }
//             }
//         }
//     });
// }

window.addEventListener('DOMContentLoaded', function() {
    reminderArray.forEach(displayReminderTask);
    transactions.forEach(renderTransaction);
    updateBalance();
    updateSchoolFeesBalance();
    updateBillsBalance();
    updateOtherBalance();
    updateFoodAndDrinkBalance();
    renderChart();
    displayUser();
});

function renderReminders() {
    reminderHistory.innerHTML = '';
    reminderArray.forEach(displayReminderTask);
}
