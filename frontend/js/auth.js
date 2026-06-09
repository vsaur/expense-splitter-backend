// Redirect if already logged in
if (localStorage.getItem('token')) {
    window.location.href = 'dashboard.html'
}

// Login Form
const loginForm = document.getElementById('login-form')
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const btn = document.getElementById('login-btn')
        const errorMsg = document.getElementById('error-msg')
        btn.textContent = 'Logging in...'
        btn.disabled = true
        errorMsg.classList.add('hidden')

        const data = await loginUser({
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        })

        if (data.token) {
            localStorage.setItem('token', data.token)
            window.location.href = 'dashboard.html'
        } else {
            errorMsg.textContent = data.message || 'Login failed. Check your credentials.'
            errorMsg.classList.remove('hidden')
            btn.textContent = 'Login'
            btn.disabled = false
        }
    })
}

// Register Form
const registerForm = document.getElementById('register-form')
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const btn = document.getElementById('register-btn')
        const errorMsg = document.getElementById('error-msg')
        btn.textContent = 'Creating account...'
        btn.disabled = true
        errorMsg.classList.add('hidden')

        const data = await registerUser({
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        })

        if (data.token) {
            localStorage.setItem('token', data.token)
            window.location.href = 'dashboard.html'
        } else {
            errorMsg.textContent = data.message || 'Registration failed. Try again.'
            errorMsg.classList.remove('hidden')
            btn.textContent = 'Create Account'
            btn.disabled = false
        }
    })
}

function logout() {
    localStorage.removeItem('token')
    window.location.href = 'index.html'
}