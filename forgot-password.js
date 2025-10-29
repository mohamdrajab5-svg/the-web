document.addEventListener('DOMContentLoaded', () => {
    const forgotForm = document.getElementById('forgot-form');
    const emailInput = document.getElementById('email');
    const message = document.getElementById('message');
    const forgotBtn = document.getElementById('forgot-btn');

    const API_URL = 'https://student-hub-backend-dij3.onrender.com/api/auth/forgot-password';

    forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        message.textContent = '';
        message.classList.remove('success'); // for success styling
        forgotBtn.textContent = 'Sending...';
        forgotBtn.disabled = true;

        const email = emailInput.value;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                // Even on error, we just show a generic message
                throw new Error(data.message || 'Error sending email');
            }
            
            // --- SUCCESS ---
            // We show a success message whether the email exists or not
            // This prevents people from guessing emails
            message.textContent = 'If an account with that email exists, a reset email has been sent.';
            message.style.color = 'var(--text-primary)'; // Make it a neutral/success color
            forgotForm.style.display = 'none'; // Hide the form

        } catch (error) {
            console.error(error);
            // Show the same generic message on failure
            message.textContent = 'If an account with that email exists, a reset email has been sent.';
            message.style.color = 'var(--text-primary)';
            forgotForm.style.display = 'none';
        }
    });
});
