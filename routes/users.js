const express = require('express');
const router = express.Router();
const { connectToDB } = require('../utils/db');
const ObjectId = require('mongodb').ObjectId;

// Get all users with pagination
router.get('/', async function (req, res) {
    const db = await connectToDB();
    try {
        let query = {};

        let page = parseInt(req.query.page) || 1;
        let perPage = parseInt(req.query.perPage) || 5;
        let skip = (page - 1) * perPage;

        let result = await db.collection("users").find(query).skip(skip).limit(perPage).toArray();
        let total = await db.collection("users").countDocuments(query);

        res.json({ users: result, total: total, page: page, perPage: perPage });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
    finally {
        await db.client.close();
    }
});

// Add a new user
router.post('/', async function (req, res) {
    const db = await connectToDB();
    try {
        req.body.terms = req.body.terms ? true : false;
        req.body.created_at = new Date();
        req.body.modified_at = new Date();

        let result = await db.collection("users").insertOne(req.body);
        res.status(201).json({ id: result.insertedId });
    } catch (err) {
        res.status(400).json({ message: err.message });
    } finally {
        await db.client.close();
    }
});

// Get user by ID
router.get('/:id', async function (req, res) {
    const db = await connectToDB();
    try {
        let result = await db.collection("users").findOne({ _id: new ObjectId(req.params.id) });
        if (result) {
            res.json({ result: result });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    } finally {
        await db.client.close();
    }
});

// Update user by ID
router.put('/:id', async function (req, res) {
    const db = await connectToDB();
    try {
        req.body.terms = req.body.terms ? true : false;
        req.body.modified_at = new Date();

        delete req.body._id;

        let result = await db.collection("users").updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );

        if (result.modifiedCount > 0) {
            res.status(200).json({ message: "User updated" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    } finally {
        await db.client.close();
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
