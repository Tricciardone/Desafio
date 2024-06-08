const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost/ecommerce', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('Conexión a MongoDB establecida');
    } catch (error) {
        console.error('Error de conexión a MongoDB:', error.message);
        process.exit(1); // Salir del proceso con error
    }
};

module.exports = connectDB;
