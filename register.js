document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const registerBtn = document.getElementById('register-btn');

    const API_REGISTER_URL = 'https://student-hub-backend-dij3.onrender.com/api/auth/register';

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';
        registerBtn.textContent = 'Creating account...';
        registerBtn.disabled = true;

        const name = nameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch(API_REGISTER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to register. Email may be in use.');
            }

            // --- SUCCESS ---
            // Save the new token
            localStorage.setItem('authToken', data.token);
            
            // Redirect to the main app page
            window.location.href = 'index.html';

        } catch (error) {
            errorMessage.textContent = error.message;
            registerBtn.textContent = 'Create Account';
            registerBtn.disabled = false;
        }
    });
});
