document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('reset-form');
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('password-confirm');
    const message = document.getElementById('message');
    const resetBtn = document.getElementById('reset-btn');
    const loginLink = document.getElementById('login-link');

    // 1. GET THE TOKEN FROM THE URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        // No token found in URL
        message.textContent = 'Invalid or missing reset token. Please try again.';
        resetForm.style.display = 'none';
        return;
    }
    
    const API_URL = `https://student-hub-backend-dij3.onrender.com/api/auth/reset-password/${token}`;

    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        message.textContent = '';
        message.classList.remove('success');
        
        const password = passwordInput.value;
        const passwordConfirm = passwordConfirmInput.value;

        // 2. CHECK IF PASSWORDS MATCH
        if (password !== passwordConfirm) {
            message.textContent = 'Passwords do not match.';
            return;
        }

        resetBtn.textContent = 'Saving...';
        resetBtn.disabled = true;

        try {
            // 3. SEND THE REQUEST TO THE BACKEND
            const response = await fetch(API_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: password })
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle errors from the backend (e.g., "Token expired")
                throw new Error(data.message || 'Failed to reset password');
            }
            
            // --- SUCCESS ---
            message.textContent = 'Your password has been reset successfully!';
            message.style.color = 'var(--text-primary)';
            resetForm.style.display = 'none'; // Hide the form
            loginLink.style.display = 'block'; // Show the "Back to Login" link

        } catch (error) {
            console.error(error);
            message.textContent = error.message;
            resetBtn.textContent = 'Save New Password';
            resetBtn.disabled = false;
        }
    });
});
