document.addEventListener('DOMContentLoaded', () => {

    // --- GRAB DOM ELEMENTS ---
    const postFeed = document.getElementById('post-feed');
    const loadingMsg = document.getElementById('loading-posts');
    
    // Create Post Form
    const postForm = document.getElementById('create-post-form');
    const postTitle = document.getElementById('post-title');
    const postBody = document.getElementById('post-body');
    const postCategory = document.getElementById('post-category');
    const postError = document.getElementById('post-error');
    const createPostBtn = document.getElementById('create-post-btn');

    const API_BASE_URL = 'https://student-hub-backend-dij3.onrender.com/api';

    // --- HELPER: Get Token ---
    function getAuthToken() {
        return localStorage.getItem('authToken');
    }

    // --- API CALL 1: Fetch All Posts ---
    async function fetchPosts() {
        const token = getAuthToken();
        if (!token) {
            loadingMsg.textContent = 'Please log in to see posts.';
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/posts`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Note: Your GET /api/posts might not need auth,
                    // but it's good practice if it's not a public feed.
                }
            });

            if (!response.ok) throw new Error('Could not fetch posts');

            const posts = await response.json();
            renderPosts(posts);

        } catch (error) {
            console.error('Error fetching posts:', error);
            loadingMsg.textContent = 'Error loading posts.';
        }
    }

    // --- HELPER: Render Posts to Page ---
    // --- HELPER: Render Posts to Page (SAFER VERSION) ---
    function renderPosts(posts) {
        loadingMsg.style.display = 'none';
        postFeed.innerHTML = ''; // Clear loading message

        if (!posts || posts.length === 0) {
            postFeed.innerHTML = '<p>No posts yet. Be the first!</p>';
            return;
        }

        posts.forEach(post => {
            const postCard = document.createElement('div');
            postCard.className = 'card post-card';
            
            // --- FIX 1: Check for a missing author ---
            const authorName = (post.author && post.author.name) ? post.author.name : 'Unknown User';
            
            // --- FIX 2: Check for a missing createdAt date ---
            const postDate = post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Just now';

            // --- FIX 3: Check for missing 'likes' (THE CRASH) ---
            const likeCount = (post.likes || []).length; // Use 0 if 'likes' is null/undefined

            postCard.innerHTML = `
                <div class="post-header">
                    <strong>${authorName}</strong> 
                    <span class="post-time"> - ${postDate}</span>
                </div>
                <div class="post-content">
                    <h3>${post.title || 'No Title'}</h3>
                    <p>${post.body || 'No content'}</p>
                </div>
                <div class="post-actions">
                    <button class="action-btn upvote" data-id="${post._id}">
                        Upvote (${likeCount})
                    </button>
                    <span class="post-category">${post.category || 'General'}</span>
                </div>
            `;
            
            // Style the category tag
            const categorySpan = postCard.querySelector('.post-category');
            if(categorySpan) {
                categorySpan.style.float = 'right';
                categorySpan.style.fontSize = '0.8rem';
                categorySpan.style.padding = '5px 10px';
                categorySpan.style.borderRadius = '15px';
                categorySpan.style.backgroundColor = '#333';
                categorySpan.style.color = 'var(--text-secondary)';
            }
            
            postFeed.appendChild(postCard);
        });
    }
    // --- API CALL 2: Create a New Post ---
    async function handleCreatePost(e) {
        e.preventDefault();
        postError.style.display = 'none';
        createPostBtn.textContent = 'Posting...';
        createPostBtn.disabled = true;

        const token = getAuthToken();
        if (!token) {
            postError.textContent = 'You must be logged in to post.';
            postError.style.display = 'block';
            createPostBtn.textContent = 'Post';
            createPostBtn.disabled = false;
            return;
        }

        const newPost = {
            title: postTitle.value,
            body: postBody.value,
            category: postCategory.value
        };

        try {
            const response = await fetch(`${API_BASE_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPost)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create post');
            }

            // Success!
            postTitle.value = ''; // Clear form
            postBody.value = '';
            fetchPosts(); // Refresh the feed with the new post

        } catch (error) {
            console.error('Error creating post:', error);
            postError.textContent = error.message;
            postError.style.display = 'block';
        } finally {
            createPostBtn.textContent = 'Post';
            createPostBtn.disabled = false;
        }
    }

    // --- API CALL 3: Upvote a Post ---
    async function handleUpvote(e) {
        // Use event delegation to catch clicks on upvote buttons
        if (!e.target.classList.contains('upvote')) return;
        
        const token = getAuthToken();
        const postId = e.target.getAttribute('data-id');
        if (!token || !postId) return;

        try {
            const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to like post');
            
            // Refresh the whole feed to show new like count
            // This is simple but not the most efficient.
            fetchPosts();

        } catch (error) {
            console.error('Error upvoting post:', error);
            alert('Could not upvote post.');
        }
    }

    // --- Set up event listeners ---
    postForm.addEventListener('submit', handleCreatePost);
    postFeed.addEventListener('click', handleUpvote);

    // --- Initial Load ---
    fetchPosts();

});
