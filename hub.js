// Wait for the page to load
document.addEventListener('DOMContentLoaded', () => {

    // --- GRAB DOM ELEMENTS ---
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const loadingMsg = document.getElementById('loading-tasks');

    const API_BASE_URL = 'https://student-hub-backend-dij3.onrender.com/api';
    
    // --- HELPER: Get Token from localStorage ---
    // We'll need this for all our requests
    function getAuthToken() {
        // !! We will build the login page later, for now, you can
        // !! manually paste your token in localStorage to test
        return localStorage.getItem('authToken');
    }

    // --- HELPER: Render tasks to the page ---
    function renderTasks(tasks) {
        taskList.innerHTML = ''; // Clear the list first
        
        if (tasks.length === 0) {
            taskList.innerHTML = '<p>You have no pending tasks. Great job!</p>';
            return;
        }

        tasks.forEach(task => {
            // Only show tasks that are NOT completed
            if (!task.isCompleted) {
                const li = document.createElement('li');
                li.setAttribute('data-id', task._id); // Store the task ID

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.addEventListener('change', () => completeTask(task._id, li));

                const span = document.createElement('span');
                span.textContent = task.content;

                li.appendChild(checkbox);
                li.appendChild(span);
                taskList.appendChild(li);
            }
        });
    }

    // --- API CALL 1: Fetch All Tasks ---
    async function fetchTasks() {
        loadingMsg.style.display = 'block';
        const token = getAuthToken();

        if (!token) {
            taskList.innerHTML = '<p>Please log in to see your tasks.</p>';
            loadingMsg.style.display = 'none';
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Could not fetch tasks');
            }

            const tasks = await response.json();
            renderTasks(tasks);

        } catch (error) {
            console.error('Error fetching tasks:', error);
            taskList.innerHTML = '<p>Error loading tasks. Please try again.</p>';
        } finally {
            loadingMsg.style.display = 'none';
        }
    }

    // --- API CALL 2: Add a New Task ---
    async function addTask() {
        const content = taskInput.value.trim();
        if (content === '') return; // Don't add empty tasks

        const token = getAuthToken();
        if (!token) {
            alert('You must be logged in to add a task.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: content })
            });

            if (!response.ok) {
                throw new Error('Failed to add task');
            }
            
            // Success!
            taskInput.value = ''; // Clear the input
            fetchTasks(); // Refresh the entire list

        } catch (error) {
            console.error('Error adding task:', error);
            alert('Could not add task. Please try again.');
        }
    }

    // --- API CALL 3 & 4: Complete and Delete a Task ---
    async function completeTask(taskId, listItemElement) {
        const token = getAuthToken();
        
        try {
            // Step 1: Mark as complete (as you requested)
            const updateResponse = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isCompleted: true })
            });

            if (!updateResponse.ok) throw new Error('Failed to mark as complete');

            // Step 2: Delete the task (as you requested)
            const deleteResponse = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!deleteResponse.ok) throw new Error('Failed to delete task');

            // Success! Remove it from the page visually
            listItemElement.remove();

        } catch (error) {
            console.error('Error completing task:', error);
            alert('Could not complete the task. Please try again.');
        }
    }

    // --- Set up event listeners ---
    addTaskBtn.addEventListener('click', addTask);
    // Allow pressing Enter to add task
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // --- Initial Load ---
    fetchTasks();

});
