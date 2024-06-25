const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, default: 'usuario' },
    githubId: { type: String, unique: true, sparse: true } // Campo para almacenar el ID de GitHub
});

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
