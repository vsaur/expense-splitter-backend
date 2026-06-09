// Redirect if not logged in
if (!localStorage.getItem('token')) {
    window.location.href = 'index.html'
}

window.onload = loadGroups

async function loadGroups() {
    const container = document.getElementById('groups-container')
    container.innerHTML = '<p class="empty-state">Loading groups...</p>'

    const data = await getMyGroups()

    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = '<p class="empty-state">No groups yet. Create one!</p>'
        return
    }

    container.innerHTML = ''
    data.forEach(group => {
        const card = document.createElement('div')
        card.className = 'group-card'
        card.innerHTML = `
            <h3>${group.name}</h3>
            ${group.description ? `<p>${group.description}</p>` : ''}
            <p>Created by ${group.createdBy.name}</p>
        `
        card.onclick = () => window.location.href = `group.html?id=${group.id}`
        container.appendChild(card)
    })
}

function toggleForm() {
    const form = document.getElementById('create-form')
    form.classList.toggle('hidden')
}

async function handleCreateGroup() {
    const name = document.getElementById('group-name').value.trim()
    const desc = document.getElementById('group-desc').value.trim()
    const errorMsg = document.getElementById('error-msg')

    if (!name) {
        errorMsg.textContent = 'Group name is required'
        errorMsg.classList.remove('hidden')
        return
    }

    errorMsg.classList.add('hidden')
    const data = await createGroup({ name, description: desc })

    if (data.id) {
        document.getElementById('group-name').value = ''
        document.getElementById('group-desc').value = ''
        toggleForm()
        loadGroups()
    } else {
        errorMsg.textContent = data.message || 'Failed to create group'
        errorMsg.classList.remove('hidden')
    }
}

function logout() {
    localStorage.removeItem('token')
    window.location.href = 'index.html'
}