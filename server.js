//server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Parse JSON bodies
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'wx80@zeineb',
    database: 'track'
});


// Connect to the database
connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database.');
});

// Get interviewer data by ID
app.get('/api/interviewer/:id', (req, res) => {
    const staffId = req.params.id;
    connection.query(
        'SELECT * FROM interv WHERE Staff_ID = ?',
        [staffId],
        (err, results) => {
            if (err) {
                console.error('Error fetching interviewer:', err);
                res.status(500).json({ error: 'Database error' });
                return;
            }
            if (results.length === 0) {
                res.status(404).json({ error: 'Interviewer not found' });
                return;
            }
            res.json(results[0]);
        }
    );
});

// Socket connection handling
io.on('connection', (socket) => {
    console.log('New client connected');
    let currentStaffId = null;

    // Handle staff ID registration
    socket.on('register-staff', (staffId) => {
        currentStaffId = staffId;
        connection.query(
            'SELECT * FROM interv WHERE Staff_ID = ?',
            [staffId],
            (err, results) => {
                if (err || results.length === 0) {
                    socket.emit('registration-error', 'Invalid Staff ID');
                    return;
                }
                const interviewer = results[0];
                socket.emit('registration-success', interviewer);
            }
        );
    });

    // Handle location updates
    socket.on('send-location', (data) => {
        if (!currentStaffId) return;

        const { latitude, longitude } = data;
        
        // Only broadcast the location update
        io.emit('receive-location', {
            userId: currentStaffId,
            latitude,
            longitude
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        currentStaffId = null;
    });
});


// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
