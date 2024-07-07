const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Carts' },
    role: { type: String, default: 'usuario' },
    githubId: { type: String, unique: true, sparse: true } // Campo para almacenar el ID de GitHub
});

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
