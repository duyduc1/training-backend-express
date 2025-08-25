const { error } = require("../../../project-express-authen/src/utils/response");
const productService = require("../services/product.service");

class productController {
    // Lấy danh sách tất cả sản phẩm
    async getProducts(req, res, next){
        try {
            const products = await productService.getAll();
            res.json(products);
        } catch (error) {
            next(error);
        }
    }

    // Lấy thông tin sản phẩm theo id
    async getProductsById(req, res, next) {
        try {
            const productId = await productService.getById(req.params.id);
            if(!productId) return res.status(404).json({ message: "Not found" });
            res.json(productId);
        } catch (error) {
            next(error);
        }
    }

    // Tạo mới sản phẩm
    async createProduct(req, res, next) {
        try {
          const product = await productService.create(req.body);    
          res.status(201).json(product);
        } catch (error) {
          next(error);
        }
    }

    // Cập nhật thông tin sản phẩm theo id
    async updateProduct(req, res, next) {
        try {
          const product = await productService.update(req.params.id, req.body);
          if (!product) return res.status(404).json({ message: "Not found" });
          res.status(200).json(product);
        } catch (error) {
          next(error);
        }
    }

    // Xóa sản phẩm theo id
    async deleteProduct(req, res, next) {
        try {
            const product = await productService.delete(req.params.id);
            if(!product) return res.status(404).json({ message: "Not found"});
            res.status(200).json({ message: "Product was deleted"});
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new productController();