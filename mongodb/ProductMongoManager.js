const ProductModel = require('./models/Product');
const ProductManager = require('./ProductManager');

class ProductMongoManager {
    constructor(filePath) {
        this.fileProductManager = new ProductManager(filePath);
    }

    async getProducts() {
        try {
            return await ProductModel.find();
        } catch (error) {
            console.error('Error al obtener productos de MongoDB:', error.message);
            return this.fileProductManager.getProducts();
        }
    }

    async getProductById(productId) {
        try {
            return await ProductModel.findById(productId);
        } catch (error) {
            console.error('Error al obtener producto por ID de MongoDB:', error.message);
            return this.fileProductManager.getProductById(productId);
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            const newProduct = new ProductModel({ title, description, price, thumbnail, code, stock });
            await newProduct.save();
            console.log('Producto añadido correctamente a MongoDB');
        } catch (error) {
            console.error('Error al agregar producto a MongoDB:', error.message);
            this.fileProductManager.addProduct(title, description, price, thumbnail, code, stock);
        }
    }

    async updateProduct(productId, updatedFields) {
        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate(productId, updatedFields, { new: true });
            if (!updatedProduct) {
                throw new Error('Producto no encontrado en MongoDB');
            }
            console.log('Producto actualizado correctamente en MongoDB');
        } catch (error) {
            console.error('Error al actualizar producto en MongoDB:', error.message);
            this.fileProductManager.updateProduct(productId, updatedFields);
        }
    }

    async deleteProduct(productId) {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(productId);
            if (!deletedProduct) {
                throw new Error('Producto no encontrado en MongoDB');
            }
            console.log('Producto eliminado correctamente de MongoDB');
        } catch (error) {
            console.error('Error al eliminar producto de MongoDB:', error.message);
            this.fileProductManager.deleteProduct(productId);
        }
    }

    async searchProducts(query) {
        try {
            const regex = new RegExp(query, 'i');
            return await ProductModel.find({
                $or: [
                    { title: regex },
                    { description: regex }
                ]
            });
        } catch (error) {
            console.error('Error al buscar productos en MongoDB:', error.message);
            return this.fileProductManager.searchProducts(query);
        }
    }

    async sortProductsByPrice(order = 'asc') {
        try {
            const sortOrder = order === 'asc' ? 1 : -1;
            return await ProductModel.find().sort({ price: sortOrder });
        } catch (error) {
            console.error('Error al ordenar productos por precio en MongoDB:', error.message);
            return this.fileProductManager.sortProductsByPrice(order);
        }
    }
}

module.exports = ProductMongoManager;
