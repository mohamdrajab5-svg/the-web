// This script runs on all protected pages (index, hub, profile)

// 1. SET UP AN AUTH STATE OBSERVER
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // --- User is logged in ---
        console.log('User is logged in:', user.email);
        
        // Get the user's Firebase ID Token
        try {
            const token = await user.getIdToken(true); // Force refresh
            
            // Save the token to localStorage
            // This is the new token our backend will need to check
            localStorage.setItem('authToken', token);
            
        } catch (error) {
            console.error('Error getting auth token:', error);
            // If we can't get a token, log them out
            logout();
        }

    } else {
        // --- User is not logged in ---
        console.log('No user logged in, redirecting...');
        // Clear any old, invalid tokens
        localStorage.removeItem('authToken');
        // Redirect to the login page
        window.location.href = 'login.html';
    }
});

// 2. LOGOUT FUNCTION
function logout() {
    auth.signOut().then(() => {
        // Sign-out successful.
        console.log('User logged out.');
        // The onAuthStateChanged listener above will see this
        // and automatically redirect to login.html
    }).catch((error) => {
        console.error('Logout error:', error);
    });
}

// 3. ATTACH LOGOUT FUNCTION TO THE BUTTON
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.querySelector('.sidebar .logout a');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault(); // Stop it from acting like a link
            logout();
        });
    }
});
