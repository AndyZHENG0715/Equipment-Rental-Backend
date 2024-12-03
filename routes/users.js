const express = require('express');
const router = express.Router();
const { connectToDB } = require('../utils/db');
const ObjectId = require('mongodb').ObjectId;

// Get all users (admin only)
router.get('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try {
        const db = await connectToDB();
        const users = await db.collection('users').find().toArray();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Add a new user (admin only)
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
    const { email, password, name, contactNum, department, remark, terms, role } = req.body;
    
    // Basic validation
    if (!email || !password || !name || !contactNum || !department || !role) {
        return res.status(400).json({ message: 'All required fields must be filled.' });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
        email,
        password: hashedPassword,
        name,
        contactNum,
        department,
        remark: remark || '',
        terms: terms || false,
        role, // 'admin' or 'user'
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    
    try {
        const db = await connectToDB();
        const result = await db.collection('users').insertOne(newUser);
        res.status(201).json({ message: 'User created successfully', userId: result.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get user by ID (admin only)
router.get('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
    const userId = req.params.id;
    
    try {
        const db = await connectToDB();
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Exclude password from the response
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update user by ID (admin only)
router.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
    const userId = req.params.id;
    const { email, name, contactNum, department, remark, terms, role } = req.body;
    
    // Basic validation
    if (!email || !name || !contactNum || !department || !role) {
        return res.status(400).json({ message: 'All required fields must be filled.' });
    }
    
    const updatedData = {
        email,
        name,
        contactNum,
        department,
        remark: remark || '',
        terms: terms || false,
        role,
        updatedAt: new Date(),
    };
    
    try {
        const db = await connectToDB();
        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            { $set: updatedData }
        );
        
        if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found or no changes made' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete user by ID
router.delete('/:id', async function (req, res) {
    const db = await connectToDB();
    try {
        let result = await db.collection("users").deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount > 0) {
            res.status(200).json({ message: "User deleted" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    } finally {
        await db.client.close();
    }
});

// POST route for deleting a user
router.post('/delete/:id', async (req, res) => {
    const userId = req.params.id;
    let db;

    try {
        db = await connectToDB();
        const result = await db.collection('users').deleteOne({ _id: new ObjectId(userId) });

        if (result.deletedCount === 1) {
            // Successfully deleted
            res.redirect('/users');
        } else {
            // User not found
            res.status(404).render('error', { message: 'User not found', error: {} });
        }
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { message: 'Internal Server Error', error: err });
    } finally {
        if (db) {
            await db.client.close();
        }
    }
});

module.exports = router;
