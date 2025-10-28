// This script will run on index.html, hub.html, and profile.html

// 1. AUTHENTICATION CHECK
// Get the token
const token = localStorage.getItem('authToken');

// If no token exists, redirect to the login page
if (!token) {
    window.location.href = 'login.html';
}

// 2. LOGOUT BUTTON
// Wait for the page to load to find the logout button
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.querySelector('.sidebar .logout a');

    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault(); // Stop it from acting like a link

            // Clear the token from storage
            localStorage.removeItem('authToken');

            // Redirect to the login page
            window.location.href = 'login.html';
        });
    }
});
