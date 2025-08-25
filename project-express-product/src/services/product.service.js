const Product = require("../models/Product.model");

class ProductService {
  async getAll() {
    return Product.findAll();
  }

  async getById(id) {
    return Product.findByPk(id);
  }

  async create(data) {
    return Product.create(data);
  }

  async update(id, data) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    return product.update(data);
  }

  async delete(id) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    await product.destroy();
    return product;
  }
}

module.exports = new ProductService();
