const BASE_URL = 'http://localhost:8080/api'

const getToken = () => localStorage.getItem('token')

const headers = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
})

// Auth
const registerUser = (data) =>
    fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json())

const loginUser = (data) =>
    fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json())

// Groups
const createGroup = (data) =>
    fetch(`${BASE_URL}/groups`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(data)
    }).then(res => res.json())

const getMyGroups = () =>
    fetch(`${BASE_URL}/groups/my`, {
        headers: headers()
    }).then(res => res.json())

const getGroupById = (groupId) =>
    fetch(`${BASE_URL}/groups/${groupId}`, {
        headers: headers()
    }).then(res => res.json())

const addMemberApi = (groupId, data) =>
    fetch(`${BASE_URL}/groups/${groupId}/members`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(data)
    }).then(res => res.json())

// Expenses
const addExpenseApi = (groupId, data) =>
    fetch(`${BASE_URL}/groups/${groupId}/expenses`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(data)
    }).then(res => res.json())

const getGroupExpenses = (groupId) =>
    fetch(`${BASE_URL}/groups/${groupId}/expenses`, {
        headers: headers()
    }).then(res => res.json())

// Settlements
const getSettlements = (groupId) =>
    fetch(`${BASE_URL}/settlements/group/${groupId}`, {
        headers: headers()
    }).then(res => res.json())

const settleUpApi = (splitId) =>
    fetch(`${BASE_URL}/settlements/settle/${splitId}`, {
        method: 'PUT',
        headers: headers()
    }).then(res => res.json())