const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');
const ProductModel = require('./models/Product');
const UserModel = require('./models/user'); // Modelo de usuario que definiremos más adelante

const app = express();
const PORT = 3000; // Puerto en el que tu servidor Express estará escuchando

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// Configuración de conexión a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true });

// Maneja eventos de conexión
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', async () => {
    console.log('Conexión exitosa a MongoDB');
    try {
        // Borra todos los productos existentes en la base de datos
        await ProductModel.deleteMany({});
        console.log('Productos existentes eliminados de la base de datos');

        // Inserta los nuevos productos desde el archivo JSON
        await ProductModel.insertMany(productsData);
        console.log('Productos insertados en la base de datos correctamente');
    } catch (error) {
        console.error('Error al insertar productos en la base de datos:', error.message);
    } finally {
        // No cerramos la conexión a la base de datos aquí, ya que la aplicación debe seguir funcionando
        // mongoose.disconnect();
        console.log('Conexión a MongoDB lista para usar');
    }
});

// Ruta GET con los parámetros especificados
app.get('/products', async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);

        let filter = {};
        if (query) {
            filter = { type: query }; // Suponiendo que el campo en el modelo de producto es "type"
        }

        let sortOrder = {};
        if (sort) {
            sortOrder = { price: sort === 'asc' ? 1 : -1 }; // Suponiendo que el campo en el modelo de producto es "price"
        }

        const products = await ProductModel.find(filter)
                                          .limit(limit)
                                          .skip((page - 1) * limit)
                                          .sort(sortOrder);
        
        res.json(products);
    } catch (error) {
        console.error('Error al procesar la solicitud:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para la vista de productos
app.get('/productos', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const welcomeMessage = `Bienvenido, ${req.session.user.email}!`;
    res.send(`
        <h1>Productos</h1>
        <p>${welcomeMessage}</p>
        <a href="/logout">Logout</a>
        <!-- Aquí iría el código para mostrar los productos -->
    `);
});

// Ruta de logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/login');
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
