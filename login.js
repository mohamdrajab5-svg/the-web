document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const loginBtn = document.getElementById('login-btn');

    const API_LOGIN_URL = 'https://student-hub-backend-dij3.onrender.com/api/auth/login';

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Stop the form from submitting normally
        errorMessage.textContent = ''; // Clear old errors
        loginBtn.textContent = 'Logging in...';
        loginBtn.disabled = true;

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch(API_LOGIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                // If backend sends an error message, use it. Otherwise, generic.
                throw new Error(data.message || 'Invalid email or password');
            }

            // --- SUCCESS ---
            // Your API sends back a 'token'
            localStorage.setItem('authToken', data.token);
            
            // Redirect to the main app page
            window.location.href = 'index.html'; 

        } catch (error) {
            errorMessage.textContent = error.message;
            loginBtn.textContent = 'Login';
            loginBtn.disabled = false;
        }
    });
});
