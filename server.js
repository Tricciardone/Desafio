const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const ProductModel = require('./models/Product');
const UserModel = require('./models/user');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

mongoose.connect('mongodb://localhost:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
    console.log('Conexión exitosa a MongoDB');
});

// Ruta para el registro de usuarios
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({ email, password: hashedPassword });
        await user.save();
        res.status(201).send('Usuario registrado exitosamente');
    } catch (error) {
        console.error('Error al registrar usuario:', error.message);
        res.status(500).send('Error al registrar usuario');
    }
});

// Ruta para el login de usuarios
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).send('Credenciales incorrectas');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Credenciales incorrectas');
        }

        req.session.user = {
            email: user.email,
            role: user.role
        };

        if (user.email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            req.session.user.role = 'admin';
        }

        res.redirect('/productos');
    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
        res.status(500).send('Error al iniciar sesión');
    }
});

// Ruta para la vista de productos
app.get('/productos', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const welcomeMessage = `Bienvenido, ${req.session.user.email}!`;
    const products = await ProductModel.find({}); // Obtén todos los productos

    let productList = '';
    products.forEach(product => {
        productList += `<li>${product.name} - $${product.price}</li>`;
    });

    res.send(`
        <h1>Productos</h1>
        <p>${welcomeMessage}</p>
        <ul>${productList}</ul>
        <a href="/logout">Logout</a>
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

