const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to clear reservations
app.post('/clear-reservations', (req, res) => {
    // Add your logic to clear reservations here
    // For now, let's just send a success response
    res.json({ message: 'Reservations cleared successfully!' });
});

app.listen(port, () => {
    console.log(`Admin backend listening at http://localhost:${port}`);
});
// Assuming you have a function to redirect to the admin page
function redirectToAdminPage() {
    window.location.href = 'admin.html';
}

function authenticate() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'Admin' && password === 'admin') {
        // Simulate successful login
        alert('Login successful!');
        // Redirect to the admin page
        redirectToAdminPage();
    } else {
        // Simulate failed login
        alert('Invalid username or password. Please try again.');
    }
}
