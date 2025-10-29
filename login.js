document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const loginBtn = document.getElementById('login-btn');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';
        loginBtn.textContent = 'Logging in...';
        loginBtn.disabled = true;

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            // This one line replaces our entire backend login route
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            
            console.log('User logged in!', userCredential.user);

            // Redirect to the main app page
            window.location.href = 'index.html'; 

        } catch (error) {
            // Handle Firebase errors (like "wrong-password")
            errorMessage.textContent = error.message;
            loginBtn.textContent = 'Login';
            loginBtn.disabled = false;
        }
    });
});
