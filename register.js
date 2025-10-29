document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const registerBtn = document.getElementById('register-btn');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';
        registerBtn.textContent = 'Creating account...';
        registerBtn.disabled = true;

        const name = nameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            // This one line replaces our entire backend registration route
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            
            // (Optional) We can also save the user's name to their profile
            await userCredential.user.updateProfile({
                displayName: name
            });
            
            // We'll handle login state automatically in global.js later
            console.log('User registered!', userCredential.user);
            
            // Redirect to the main app page
            window.location.href = 'index.html';

        } catch (error) {
            // Handle Firebase errors (like "email already in use")
            errorMessage.textContent = error.message;
            registerBtn.textContent = 'Create Account';
            registerBtn.disabled = false;
        }
    });
});
