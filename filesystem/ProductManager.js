const fs = require('fs');
const Product = require('./models/Product');

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.products = this.loadProductsFromFile() || [];
    }

    loadProductsFromFile() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.log("Error leyendo el archivo:", error.message);
            return null;
        }
    }

    saveProductsToFile() {
        try {
            const data = JSON.stringify(this.products, null, 2);
            fs.writeFileSync(this.filePath, data);
            console.log("Productos guardados en el archivo exitosamente.");
        } catch (error) {
            console.log("Error escribiendo en el archivo:", error.message);
        }
    }

    getProducts() {
        return this.products;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        const existingProduct = this.products.find(product => product.code === code);
        if (existingProduct) {
            throw new Error("El código de producto ya está en uso");
        }

        const newProduct = new Product(title, description, price, thumbnail, code, stock);
        this.products.push(newProduct);
        this.saveProductsToFile();
    }

    getProductById(productId) {
        const product = this.products.find(product => product.id === productId);
        if (!product) {
            throw new Error("Producto no encontrado");
        }
        return product;
    }

    updateProduct(productId, updatedFields) {
        const productIndex = this.products.findIndex(product => product.id === productId);
        if (productIndex === -1) {
            throw new Error("Producto no encontrado");
        }

        // No se actualiza el ID
        delete updatedFields.id;

        this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
        this.saveProductsToFile();
    }

    deleteProduct(productId) {
        const productIndex = this.products.findIndex(product => product.id === productId);
        if (productIndex === -1) {
            throw new Error("Producto no encontrado");
        }

        this.products.splice(productIndex, 1);
        this.saveProductsToFile();
    }

    searchProducts(query) {
        return this.products.filter(product =>
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        );
    }

    sortProductsByPrice(order = 'asc') {
        return this.products.slice().sort((a, b) => {
            if (order === 'asc') {
                return a.price - b.price;
            } else {
                return b.price - a.price;
            }
        });
    }
}

module.exports = ProductManager;
