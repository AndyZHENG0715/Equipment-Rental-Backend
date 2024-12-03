const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { generateToken, extractToken, removeToken } = require('../utils/auth');
const { connectToDB } = require('../utils/db');

// POST /api/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const db = await connectToDB();
        const user = await db.collection('users').findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Generate and return JWT Token
        const token = await generateToken(user);
        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST /api/logout
router.post('/logout', async (req, res) => {
    const token = extractToken(req);

    if (!token) {
        return res.status(400).json({ message: "Bad Request: No token provided" });
    }

    try {
        await removeToken(token);
        res.status(204).send(); // No content for successful logout
    } catch (err) {
        console.error("Error during logout:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;