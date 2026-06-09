// Redirect if not logged in
if (!localStorage.getItem('token')) {
    window.location.href = 'index.html'
}

// Get group id from URL
const urlParams = new URLSearchParams(window.location.search)
const groupId = urlParams.get('id')

if (!groupId) window.location.href = 'dashboard.html'

window.onload = loadAll

async function loadAll() {
    const [group, expenses, settlements] = await Promise.all([
        getGroupById(groupId),
        getGroupExpenses(groupId),
        getSettlements(groupId)
    ])

    // Group name in navbar
    document.getElementById('group-name').textContent = group.name

    // Members
    const membersList = document.getElementById('members-list')
    membersList.innerHTML = `<span class="member-tag">👑 ${group.createdBy.name}</span>`

    // Expenses
    renderExpenses(expenses)

    // Settlements
    renderSettlements(settlements)
}

function renderExpenses(expenses) {
    const container = document.getElementById('expenses-list')
    if (!Array.isArray(expenses) || expenses.length === 0) {
        container.innerHTML = '<p class="empty-state">No expenses yet.</p>'
        return
    }
    container.innerHTML = ''
    expenses.forEach(exp => {
        const card = document.createElement('div')
        card.className = 'expense-card'
        card.innerHTML = `
            <div>
                <strong>${exp.description}</strong>
                <p class="paid-by">Paid by ${exp.paidBy.name}</p>
            </div>
            <span class="amount">₹${exp.amount}</span>
        `
        container.appendChild(card)
    })
}

function renderSettlements(settlements) {
    const container = document.getElementById('settlements-list')
    if (!Array.isArray(settlements) || settlements.length === 0) {
        container.innerHTML = '<p class="empty-state">All settled up! 🎉</p>'
        return
    }
    container.innerHTML = ''
    settlements.forEach(split => {
        const card = document.createElement('div')
        card.className = 'settlement-card'
        card.innerHTML = `
            <div>
                <p><strong>${split.owedBy.name}</strong> owes <strong>${split.owedTo.name}</strong></p>
                <p class="owed-amount">₹${split.amountOwed}</p>
            </div>
            <button class="settle-btn" onclick="settleUp(${split.id})">Settle</button>
        `
        container.appendChild(card)
    })
}

function toggleMemberForm() {
    document.getElementById('add-member-form').classList.toggle('hidden')
}

async function addMember() {
    const email = document.getElementById('member-email').value.trim()
    if (!email) return

    const data = await addMemberApi(groupId, { email })
    if (data.id) {
        alert('Member added successfully!')
        document.getElementById('member-email').value = ''
        toggleMemberForm()
        loadAll()
    } else {
        alert(data.message || 'Failed to add member')
    }
}

function toggleExpenseForm() {
    document.getElementById('add-expense-form').classList.toggle('hidden')
}

async function addExpense() {
    const desc = document.getElementById('exp-desc').value.trim()
    const amount = parseFloat(document.getElementById('exp-amount').value)
    const paidByUserId = parseInt(document.getElementById('exp-paidby').value)
    const splitInput = document.getElementById('exp-split').value
    const splitMemberIds = splitInput.split(',').map(Number).filter(Boolean)

    if (!desc || !amount || !paidByUserId || splitMemberIds.length === 0) {
        alert('Please fill all fields')
        return
    }

    const data = await addExpenseApi(groupId, {
        description: desc,
        amount,
        paidByUserId,
        splitMemberIds
    })

    if (data.id) {
        document.getElementById('exp-desc').value = ''
        document.getElementById('exp-amount').value = ''
        document.getElementById('exp-paidby').value = ''
        document.getElementById('exp-split').value = ''
        toggleExpenseForm()
        loadAll()
    } else {
        alert(data.message || 'Failed to add expense')
    }
}

async function settleUp(splitId) {
    await settleUpApi(splitId)
    loadAll()
}

function switchTab(tab, el) {
    document.getElementById('expenses-tab').classList.add('hidden')
    document.getElementById('settlements-tab').classList.add('hidden')
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'))
    document.getElementById(`${tab}-tab`).classList.remove('hidden')
    el.classList.add('active')
}

function logout() {
    localStorage.removeItem('token')
    window.location.href = 'index.html'
}