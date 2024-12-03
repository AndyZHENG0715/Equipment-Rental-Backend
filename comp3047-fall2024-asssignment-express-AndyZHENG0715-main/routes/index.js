const express = require('express');
const router = express.Router();
const { connectToDB } = require('../utils/db');
const ObjectId = require('mongodb').ObjectId;

// Home Page - Display Highlighted Equipments
router.get('/', async function(req, res, next) {
  try {
    const db = await connectToDB();
    const equipments = await db.collection('equipments').find({ highlight: true }).toArray();
    res.render('index', { equipments });
  } catch (err) {
    console.error(err);
    res.render('index', { equipments: [] });
  }
});

// Equipments Page - Display All Equipments
router.get('/equipments', async (req, res) => {
  try {
    const db = await connectToDB();
    const equipments = await db.collection('equipments').find().toArray();
    res.render('equipments', { equipments });
  } catch (err) {
    console.error(err);
    res.render('equipments', { equipments: [] });
  }
});

// Add Equipment Form
router.get('/equipment/add', (req, res) => {
  res.render('add');
});

router.post('/equipment/add', async (req, res) => {
  const equipmentData = {
    name: req.body.equipmentName,
    location: req.body.equipmentLocation,
    description: req.body.equipmentDescription,
    imageUrl: req.body.equipmentImage,
    editorName: req.body.editorName,
    color: req.body.equipmentColor,
    highlight: req.body.equipmentHighlight? true : false,
    updateTime: new Date(),
  };

  try {
    const db = await connectToDB();
    await db.collection('equipments').insertOne(equipmentData);
    res.redirect('/equipments');
  } catch (err) {
    console.error(err);
    res.redirect('/equipment/add');
  }
});

// Edit Equipment Form
router.get('/equipment/edit/:id', async (req, res) => {
  const equipmentId = req.params.id;
  try {
    const db = await connectToDB();
    const equipment = await db.collection('equipments').findOne({ _id: new ObjectId(equipmentId) });
    res.render('edit', { equipment });
  } catch (err) {
    console.error(err);
    res.redirect('/equipments');
  }
});

router.post('/equipment/edit/:id', async (req, res) => {
  const equipmentId = req.params.id;
  const updatedData = {
    name: req.body.equipmentName,
    location: req.body.equipmentLocation,
    description: req.body.equipmentDescription,
    imageUrl: req.body.equipmentImage,
    editorName: req.body.editorName,
    color: req.body.equipmentColor,
    highlight: req.body.equipmentHighlight ? true : false,
    updateTime: new Date(),
  };
  try {
    const db = await connectToDB();
    await db.collection('equipments').updateOne(
      { _id: new ObjectId(equipmentId) },
      { $set: updatedData }
    );
    res.redirect('/equipments');
  } catch (err) {
    console.error(err);
    res.redirect('/equipment/edit/' + equipmentId);
  }
});

// Route for deleting equipment
router.get('/equipment/delete/:id', async (req, res) => {
  const equipmentId = req.params.id;
  try {
    const db = await connectToDB();
    await db.collection('equipments').deleteOne({ _id: new ObjectId(equipmentId) });
    res.redirect('/equipments');
  } catch (err) {
    console.error(err);
    res.redirect('/equipments');
  }
});

// Equipment Detail Page
router.get('/equipment/detail/:id', async (req, res) => {
  const equipmentId = req.params.id;
  try {
    const db = await connectToDB();
    const equipment = await db.collection('equipments').findOne({ _id: new ObjectId(equipmentId) });
    res.render('detail', { equipment });
  } catch (err) {
    console.error(err);
    res.redirect('/equipments');
  }
});

// Search Equipment Route
router.get('/search/:query', async (req, res) => {
    const searchQuery = req.params.query;
    try {
        const db = await connectToDB();
        const equipments = await db.collection('equipments').find({
            name: { $regex: searchQuery, $options: 'i' }
        }).toArray();
        res.render('search', { equipments, query: searchQuery });
    } catch (err) {
        console.error(err);
        res.render('search', { equipments: [], query: searchQuery, error: 'Error fetching search results.' });
    } finally {
        await db.client.close();
    }
});

// Users Page - Display All Users
router.get('/users', async function (req, res) {
  const db = await connectToDB();
  try {
    let query = {};

    let page = parseInt(req.query.page) || 1;
    let perPage = parseInt(req.query.perPage) || 5;
    let skip = (page - 1) * perPage;

    let result = await db.collection("users").find(query).skip(skip).limit(perPage).toArray();
    let total = await db.collection("users").countDocuments(query);

    res.render('users', { users: result, total: total, page: page, perPage: perPage });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
  finally {
    await db.client.close();
  }
});

// New User Form
router.get('/user/new', (req, res) => {
  res.render('newUser');
});

router.post('/user/new', async (req, res) => {
  const usersData = {
    email: req.body.usersEmail,
    password: req.body.usersPassword,
    name: req.body.usersName,
    contactNum: req.body.contactNum,
    department: req.body.usersDepartment,
    remark: req.body.usersRemark,
    terms: req.body.usersTerms? true : false,
    updateTime: new Date(),
  };

  try {
    const db = await connectToDB();
    await db.collection('users').insertOne(usersData);
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    res.redirect('/users');
  }
});

// Edit User Form
router.get('/user/edit/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const db = await connectToDB();
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    res.render('editUser', { users: user });
  } catch (err) {
    console.error(err);
    res.redirect('/users');
  }
});

// Handle User Deletion via GET (if needed)
router.get('/user/delete/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const db = await connectToDB();
    await db.collection('users').deleteOne({ _id: new ObjectId(userId) });
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    res.redirect('/users');
  }
});

module.exports = router;
