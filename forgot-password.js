document.addEventListener('DOMContentLoaded', () => {
    const forgotForm = document.getElementById('forgot-form');
    const emailInput = document.getElementById('email');
    const message = document.getElementById('message');
    const forgotBtn = document.getElementById('forgot-btn');

    forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        message.textContent = '';
        forgotBtn.textContent = 'Sending...';
        forgotBtn.disabled = true;

        const email = emailInput.value;

        try {
            // This one line replaces ALL of our failed email code
            await auth.sendPasswordResetEmail(email);
            
            // --- SUCCESS ---
            message.textContent = 'Success! Check your email inbox (and spam folder) for a password reset link.';
            message.style.color = 'var(--text-primary)';
            forgotForm.style.display = 'none'; // Hide the form

        } catch (error) {
            // Handle Firebase errors (like "user-not-found")
            errorMessage.textContent = error.message;
            forgotBtn.textContent = 'Send Reset Email';
            forgotBtn.disabled = false;
        }
    });
});
