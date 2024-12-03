const express = require('express');
const { connectToDB } = require('../utils/db');
const router = express.Router();

router.get('/', async function(req, res, next) {
  const db = await connectToDB();
  try{
    let query = {};
    let page = parseInt(req.query.page) || 1;
    let perPage = parseInt(req.query.perPage) || 6;
    let skip = (page - 1) * perPage;
  

    if(req.query.highlight === 'true') {
        query.highlight = true;
    } else {
        query.highlight = false;
    }
    let result = await db.collection("equipments").find(query).skip(skip).limit(perPage).toArray();
    let total = await db.collection("equipments").countDocuments(query);

    res.json({ equipments : result, total: total, page: page, perPage: perPage });
    } catch (err) {
        res.status(400).json({ message: err.message });
    } finally {
        await db.client.close();
    }
});

router.post('/', async function (req, res) {
    const db = await connectToDB();
    try {
        req.body.highlight = req.body.highlight? true : false;
        req.body.created_at = new Date();
        req.body.modified_at = new Date();

        let result = await db.collection("equipments").insertOne(req.body);
        res.status(201).json({ id: result.insertedId });
    } catch (err) {
        res.status(400).json({ message: err.message });
    } finally {
        await db.client.close();
    }
});

module.exports = router;
