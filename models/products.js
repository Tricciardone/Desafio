const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: String,
    stock: Number,
    status: { type: Boolean, default: true },
    id: { type: String, unique: true }
});

module.exports = mongoose.model('Product', productSchema);
