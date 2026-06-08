const BASE_URL = 'http://localhost:8080/api'

const getToken = () => localStorage.getItem('token')

const headers = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
})

// Auth
export const registerUser = (data) =>
    fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json())

export const loginUser = (data) =>
    fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json())

// Groups
export const createGroup = (data) =>
    fetch(`${BASE_URL}/groups`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(data)
    }).then(res => res.json())

export const getMyGroups = () =>
    fetch(`${BASE_URL}/groups/my`, {
        headers: headers()
    }).then(res => res.json())

export const getGroupById = (groupId) =>
    fetch(`${BASE_URL}/groups/${groupId}`, {
        headers: headers()
    }).then(res => res.json())

export const addMember = (groupId, data) =>
    fetch(`${BASE_URL}/groups/${groupId}/members`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(data)
    }).then(res => res.json())

// Expenses
export const addExpense = (groupId, data) =>
    fetch(`${BASE_URL}/groups/${groupId}/expenses`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(data)
    }).then(res => res.json())

export const getGroupExpenses = (groupId) =>
    fetch(`${BASE_URL}/groups/${groupId}/expenses`, {
        headers: headers()
    }).then(res => res.json())

// Settlements
export const getSettlements = (groupId) =>
    fetch(`${BASE_URL}/settlements/group/${groupId}`, {
        headers: headers()
    }).then(res => res.json())

export const settleUp = (splitId) =>
    fetch(`${BASE_URL}/settlements/settle/${splitId}`, {
        method: 'PUT',
        headers: headers()
    }).then(res => res.json())