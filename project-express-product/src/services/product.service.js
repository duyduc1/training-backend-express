const Product = require("../models/Product.model");

class productService {
  // Lấy tất cả sản phẩm
  async getAll() {
    return Product.findAll();
  }

  // Lấy sản phẩm theo id
  async getById(id) {
    return Product.findByPk(id);
  }

  // Tạo mới sản phẩm
  async create(data) {
    return Product.create(data);
  }

  // Cập nhật sản phẩm theo id
  async update(id, data) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    return product.update(data);
  }

  // Xóa sản phẩm theo id
  async delete(id) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    await product.destroy();
    return product;
  }
}

module.exports = new productService();