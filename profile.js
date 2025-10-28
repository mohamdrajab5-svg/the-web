document.addEventListener('DOMContentLoaded', () => {

    // --- GRAB DOM ELEMENTS ---
    // Profile View
    const profilePicView = document.getElementById('profile-pic-view');
    const profileNameView = document.getElementById('profile-name-view');
    const profileEmailView = document.getElementById('profile-email-view');
    const profileBioView = document.getElementById('profile-bio-view');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    
    // Profile Edit Form
    const profileView = document.getElementById('profile-view');
    const profileEditForm = document.getElementById('profile-edit-form');
    const editName = document.getElementById('edit-name');
    const editBio = document.getElementById('edit-bio');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    
    // Posts Feed
    const userPostsFeed = document.getElementById('user-posts-feed');
    const loadingPostsMsg = document.getElementById('loading-posts');
    
    const API_BASE_URL = 'https://student-hub-backend-dij3.onrender.com/api';

    // --- HELPER: Get Token ---
    function getAuthToken() {
        return localStorage.getItem('authToken');
    }

    // --- API CALL 1: Fetch User Profile Info ---
    async function fetchProfile() {
        const token = getAuthToken();
        if (!token) {
            document.querySelector('.main-content').innerHTML = '<h1>Please log in to view your profile.</h1>';
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Could not fetch profile');

            const user = await response.json();
            
            // Populate the view
            profileNameView.textContent = user.name;
            profileEmailView.textContent = user.email;
            profileBioView.textContent = user.bio || 'No bio set.';
            // profilePicView.src = user.profilePictureUrl || 'img-placeholder.png'; // Add this when you have PFP URLs

            // Populate the edit form fields (for when they click edit)
            editName.value = user.name;
            editBio.value = user.bio || '';
            
        } catch (error) {
            console.error('Error fetching profile:', error);
            profileView.innerHTML = '<p>Error loading profile.</p>';
        }
    }

    // --- API CALL 2: Fetch User's Own Posts ---
    async function fetchUserPosts() {
        const token = getAuthToken();
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/users/myposts`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Could not fetch user posts');
            
            const posts = await response.json();
            renderUserPosts(posts);

        } catch (error) {
            console.error('Error fetching user posts:', error);
            userPostsFeed.innerHTML = '<p>Error loading your posts.</p>';
        }
    }

    // --- HELPER: Render User's Posts ---
    function renderUserPosts(posts) {
        loadingPostsMsg.style.display = 'none';
        
        if (posts.length === 0) {
            userPostsFeed.innerHTML = '<p>You have not created any posts yet.</p>';
            return;
        }
        
        posts.forEach(post => {
            // Re-use the post card structure from index.html
            const postCard = document.createElement('div');
            postCard.className = 'card post-card';
            
            // Note: Your /myposts endpoint might not include 'author.name'
            // We'll assume 'post.title' and 'post.body' exist.
            postCard.innerHTML = `
                <div class="post-content">
                    <h3>${post.title}</h3>
                    <p>${post.body}</p>
                </div>
                <div class="post-actions">
                    <button class="action-btn upvote">Upvote (${post.likes.length || 0})</button>
                    </div>
            `;
            userPostsFeed.appendChild(postCard);
        });
    }

    // --- API CALL 3: Update User Profile ---
    async function handleUpdateProfile(e) {
        e.preventDefault(); // Stop form from reloading page
        const token = getAuthToken();
        
        const updatedData = {
            name: editName.value,
            bio: editBio.value
            // pfp: editPfp.value // Add this if you implement PFP updates
        };

        try {
            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) throw new Error('Failed to update profile');

            const updatedUser = await response.json();

            // Update the view with new data
            profileNameView.textContent = updatedUser.name;
            profileBioView.textContent = updatedUser.bio || 'No bio set.';
            
            // Hide form, show view
            toggleEditView(false);

        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Could not update profile. Please try again.');
        }
    }

    // --- HELPER: Toggle between View and Edit Mode ---
    function toggleEditView(isEditing) {
        if (isEditing) {
            profileView.style.display = 'none';
            profileEditForm.style.display = 'block';
        } else {
            profileView.style.display = 'block';
            profileEditForm.style.display = 'none';
        }
    }

    // --- Event Listeners ---
    editProfileBtn.addEventListener('click', () => toggleEditView(true));
    cancelEditBtn.addEventListener('click', () => toggleEditView(false));
    profileEditForm.addEventListener('submit', handleUpdateProfile);

    // --- Initial Load ---
    fetchProfile();
    fetchUserPosts();

});
