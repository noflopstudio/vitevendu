const express = require("express");
const router = express.Router();
const Ad = require("../models/Ad");

// CREATE AD
router.post("/", async (req, res) => {
    try {
        const ad = await Ad.create(req.body);
        res.json(ad);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL ADS
router.get("/", async (req, res) => {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json(ads);
});

module.exports = router;