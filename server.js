const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql2');
const path = require('path');
const turf = require('@turf/turf');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '10mb' })); // Increase JSON limit for large polygons

// Database connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'wx80@zeineb',
    database: 'track',
    connectionLimit: 10,
    multipleStatements: true
});

// Test database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
    console.log('Database connected successfully');
    connection.release();
});

const promisePool = pool.promise();


// ================================
// 📌 API: GET single interviewer
// ================================
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


// ====================================
// 📌 API: GET all interviewers
// ====================================
app.get('/api/interviewers', async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM interv');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching interviewers:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// GeoJSON validation middleware
function validateGeoJSON(req, res, next) {
    if (req.body.polygon_coords) {
        try {
            const geoJson = JSON.parse(req.body.polygon_coords);
            if (!geoJson.type || geoJson.type !== 'Polygon' || !geoJson.coordinates) {
                return res.status(400).json({ error: 'Invalid GeoJSON. Must be a Polygon type.' });
            }
            
            // Basic validation of coordinates
            if (!Array.isArray(geoJson.coordinates) || 
                !Array.isArray(geoJson.coordinates[0]) ||
                geoJson.coordinates[0].length < 4) {
                return res.status(400).json({ error: 'Invalid Polygon coordinates. Must have at least 4 points.' });
            }
            
            // Check if the polygon is closed (first and last points should be the same)
            const first = geoJson.coordinates[0][0];
            const last = geoJson.coordinates[0][geoJson.coordinates[0].length - 1];
            if (first[0] !== last[0] || first[1] !== last[1]) {
                return res.status(400).json({ error: 'Polygon must be closed (first and last points must be the same).' });
            }
            
            req.validatedGeoJSON = geoJson;
            return next();
        } catch (err) {
            return res.status(400).json({ error: 'Invalid GeoJSON format.' });
        }
    }
    next();
}

// ====================================
// 📌 API: ADD new interviewer
// ====================================
// In server.js, update the POST and PUT endpoints:


app.put('/api/interviewers/:id', async (req, res) => {
    const { id } = req.params;
    const { name_, lastname, district, governorate, delegation, staff_status, gov_num } = req.body;
    
    // Map status values to database ENUM values
    const statusMap = {
        'Active': 'Active',
        'On Leave': 'On Leave',
        'Terminated': 'Terminated'
    };
    
    const status = statusMap[staff_status] || 'Active';
    
    try {
        const [result] = await promisePool.query(
            `UPDATE interv
             SET name_ = ?, lastname = ?, district = ?, governorate = ?, delegation = ?, staff_status = ?, gov_num = ?
             WHERE Staff_ID = ?`,
            [name_, lastname, district, governorate, delegation, status, gov_num, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Interviewer not found' });
        }
        
        res.json({ message: 'Interviewer updated' });
    } catch (err) {
        console.error('Error updating interviewer:', err);
        res.status(500).json({ error: 'Database error' });
    }
});


// ====================================
// 📌 API: DELETE interviewer
// ====================================

// Add this endpoint for getting max ID
app.get('/api/interviewers/max-id', async (req, res) => {
    try {
        const [results] = await promisePool.query('SELECT MAX(Staff_ID) as maxId FROM interv');
        const maxId = results[0].maxId || 0;
        res.json({ maxId });  // ✅ Send response correctly
    } catch (error) {
        console.error('Error getting max ID:', error);
        res.status(500).json({ error: 'Database error' });
    }
});


app.delete('/api/interviewers/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await promisePool.query(
            'DELETE FROM interv WHERE Staff_ID = ?', [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Interviewer not found' });
        }

        res.json({ message: 'Interviewer deleted' });
    } catch (err) {
        console.error('Error deleting interviewer:', err);
        res.status(500).json({ error: 'Database error' });
    }
});


// ====================================
// 📌 API: ADD interview (client responses)
// ====================================
// Update your POST endpoint
// Add this endpoint to server.js
app.post('/api/interviews', async (req, res) => {
    try {
        const {
            id,
            governorate,
            delegation,
            gender,
            age,
            job_status,
            marital_status,
            children_num
        } = req.body;

        // Validate required fields
        if (!id || !governorate || !delegation || !gender || !age || !job_status || !marital_status) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Insert interview
        const [result] = await promisePool.query(
            `INSERT INTO client (id, governorate, delegation, gender, age, job_status, marital_status, children_num)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, governorate, delegation, gender, age, job_status, marital_status, children_num || 0]
        );

        // Update interviewer's completed interview count
        await promisePool.query(
            'UPDATE interv SET completed_interview_number = completed_interview_number + 1 WHERE Staff_ID = ?',
            [id]
        );

        res.status(201).json({ message: 'Interview recorded successfully' });
    } catch (err) {
        console.error('Error recording interview:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// ====================================
// 📡 SOCKET.IO: Live staff tracking
// ====================================
io.on('connection', (socket) => {
    console.log('New client connected');
    let currentStaffId = null;

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

    socket.on('send-location', async (data) => {
        if (!currentStaffId) return;
        const { latitude, longitude } = data;

        try {
            const [rows] = await promisePool.query(
                'SELECT * FROM interv WHERE Staff_ID = ?', [currentStaffId]
            );

            if (rows.length === 0) return;

            const interviewer = rows[0];
            const polygon = JSON.parse(interviewer.polygon_coords);
            const point = turf.point([longitude, latitude]);
            const polygonArea = turf.polygon(polygon.coordinates);
            const isInside = turf.booleanPointInPolygon(point, polygonArea);

            io.emit('receive-location', {
                userId: currentStaffId,
                latitude,
                longitude,
                name_: interviewer.name_,
                lastname: interviewer.lastname,
                polygon_coords: interviewer.polygon_coords,
                status: isInside ? 'Inside' : 'Outside',
                district: interviewer.district,
                governorate: interviewer.governorate,
                delegation: interviewer.delegation
            });
        } catch (err) {
            console.error('Geofence check error:', err);
        }
    });

    // Add these new event listeners for geofence updates
    socket.on('request-geofence-update', async (data) => {
        try {
            const [rows] = await promisePool.query(
                'SELECT polygon_coords FROM interv WHERE Staff_ID = ?',
                [data.staffId]
            );
            
            if (rows.length > 0 && rows[0].polygon_coords) {
                socket.emit('receive-geofence-update', {
                    staffId: data.staffId,
                    polygon_coords: rows[0].polygon_coords
                });
            }
        } catch (err) {
            console.error('Error fetching geofence:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        currentStaffId = null;
    });
});

// ====================================
// 📌 API: GET Dashboard Statistics
// ====================================
app.get('/api/dashboard-stats', async (req, res) => {
    try {
        // Get active interviewers count
        const [activeCount] = await promisePool.query(
            'SELECT COUNT(*) as count FROM interv WHERE staff_status = "Active"'
        );
        
        // Get interviewers on leave count
        const [onLeaveCount] = await promisePool.query(
            'SELECT COUNT(*) as count FROM interv WHERE staff_status = "On Leave"'
        );
        
        // Get total completed interviews
        const [completedInterviews] = await promisePool.query(
            'SELECT SUM(completed_interview_number) as total FROM interv'
        );
        
        // Get boundary violations (you'll need to implement this based on your logic)
        const boundaryViolations = 0; // Placeholder
        
        res.json({
            activeInterviewers: activeCount[0].count,
            interviewersOnLeave: onLeaveCount[0].count,
            completedInterviews: completedInterviews[0].total || 0,
            boundaryViolations: boundaryViolations
        });
    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// ====================================
// 📌 API: GET Top Interviewers
// ====================================
// In server.js - make sure this is properly defined
// ====================================
// 📌 API: GET Top Interviewers
// ====================================
// Top interviewers based on number of projects
app.get('/api/top-interviewers', async (req, res) => {
    try {
        const [rows] = await promisePool.query(
            'SELECT Staff_ID, name_, lastname, completed_interview_number FROM interv ORDER BY completed_interview_number DESC LIMIT 5'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching top interviewers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ====================================
// 📌 API: UPDATE interviewer geofence
// ====================================
app.put('/api/interviewers/:id/geofence', validateGeoJSON, async (req, res) => {
    const { id } = req.params;
    const { polygon_coords } = req.body;
    
    // Validate the polygon coordinates
    if (!polygon_coords) {
        return res.status(400).json({ error: 'Polygon coordinates are required' });
    }

    try {
        // Try to parse the GeoJSON to validate it
        const parsedCoords = JSON.parse(polygon_coords);
        if (!parsedCoords || !parsedCoords.type || parsedCoords.type !== 'Polygon') {
            return res.status(400).json({ error: 'Invalid GeoJSON format. Expected Polygon type.' });
        }

        const [result] = await promisePool.query(
            'UPDATE interv SET polygon_coords = ? WHERE Staff_ID = ?',
            [polygon_coords, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Interviewer not found' });
        }
        
        // Notify all connected clients about the update
        io.emit('geofence-updated', { 
            staffId: id,
            polygon_coords: polygon_coords
        });
        
        res.json({ 
            message: 'Geofence updated successfully',
            polygon: parsedCoords
        });
    } catch (err) {
        console.error('Error updating geofence:', err);
        if (err instanceof SyntaxError) {
            return res.status(400).json({ error: 'Invalid JSON format for polygon coordinates' });
        }
        res.status(500).json({ error: 'Database error' });
    }
});

// ====================================
// 📌 API: DELETE interviewer geofence
// ====================================
app.delete('/api/interviewers/:id/geofence', async (req, res) => {
    const { id } = req.params;
    
    try {
        const [result] = await promisePool.query(
            'UPDATE interv SET polygon_coords = NULL WHERE Staff_ID = ?',
            [id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Interviewer not found' });
        }
        
        // Notify all connected clients about the deletion
        io.emit('geofence-deleted', { staffId: id });
        
        res.json({ message: 'Geofence deleted successfully' });
    } catch (err) {
        console.error('Error deleting geofence:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// ====================================
// 📌 API: GET interviewer geofence
// ====================================
app.get('/api/interviewers/:id/geofence', async (req, res) => {
    const { id } = req.params;
    
    try {
        const [rows] = await promisePool.query(
            'SELECT polygon_coords FROM interv WHERE Staff_ID = ?',
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Interviewer not found' });
        }
        
        if (!rows[0].polygon_coords) {
            return res.status(404).json({ error: 'No geofence found for this interviewer' });
        }
        
        res.json({ 
            polygon_coords: JSON.parse(rows[0].polygon_coords)
        });
    } catch (err) {
        console.error('Error fetching geofence:', err);
        res.status(500).json({ error: 'Database error' });
    }
});


// ====================================
// 🚀 Start Server
// ====================================
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
