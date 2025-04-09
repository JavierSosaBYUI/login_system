const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        const alertMessage = document.getElementById('alert-message');

        // Function to display messages
        function showAlert(message, type) {
            alertMessage.textContent = message;
            alertMessage.className = `alert ${type === 'success' ? 'alert-success' : 'alert-error'}`;
        }

        // Handle Login
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();
            if (response.ok) {
                showAlert('Login successful!', 'success');
                console.log('Token:', result.token);
            } else {
                showAlert('Login failed: ' + result.message, 'error');
            }
        });

        // Handle Signup
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = document.getElementById('signup-username').value;
            const password = document.getElementById('signup-password').value;

            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();
            if (response.ok) {
                showAlert('Signup successful!', 'success');
            } else {
                showAlert('Signup failed: ' + result.message, 'error');
            }
        });