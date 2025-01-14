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
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'wx80@zeineb',
    database: 'track'
});


// Promisify pool for easier error handling
const promisePool = pool.promise();

// Get interviewer data by ID
app.get('/api/interviewer/:id', async (req, res) => {
    try {
        const [rows] = await promisePool.query(
            'SELECT * FROM interv WHERE Staff_ID = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Interviewer not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error('Error fetching interviewer:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Socket connection handling
io.on('connection', (socket) => {
    console.log('New client connected');
    let currentStaffId = null;

    // Handle staff ID registration
    socket.on('register-staff', async (staffId) => {
        try {
            const [rows] = await promisePool.query(
                'SELECT * FROM interv WHERE Staff_ID = ?',
                [staffId]
            );

            if (rows.length === 0) {
                socket.emit('registration-error', 'Invalid Staff ID');
                return;
            }

            currentStaffId = staffId;
            socket.emit('registration-success', rows[0]);
        } catch (err) {
            console.error('Registration error:', err);
            socket.emit('registration-error', 'Database error');
        }
    });

    socket.on('send-location', (data) => {
        if (!currentStaffId) return;
        const { latitude, longitude } = data;

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

// Route: Add new interview
app.post('/add_interview', async (req, res) => {
    const { governorate, delegation, gender, age, job_status, marital_status, children_num } = req.body;

    try {
        const [result] = await promisePool.query(
            `INSERT INTO client (governorate, delegation, gender, age, job_status, marital_status, children_num)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [governorate, delegation, gender, age, job_status, marital_status, children_num]
        );

        res.status(200).json({ message: 'Interview added successfully' });
    } catch (err) {
        console.error('Error inserting interview:', err);
        res.status(500).json({ error: 'Error adding an interview' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
