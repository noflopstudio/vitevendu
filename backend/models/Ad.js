const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    city: String,
    phone: String,
    image: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Ad", adSchema);