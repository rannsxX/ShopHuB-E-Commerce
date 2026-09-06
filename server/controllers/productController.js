const db = require("../database/database");

function getProducts(req, res) {
    try {
        const products = db
            .prepare("SELECT * FROM products ORDER BY id DESC")
            .all();

        res.json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {

        console.error("Get products error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get products"
        });
    }
}


function getProductById(req, res) {
    try {

        const product = db
            .prepare("SELECT * FROM products WHERE id = ?")
            .get(req.params.id);

        if (!product) {

            return res.status(404).json({
                success: false,
                message: "Product not found"
            });

        }

        res.json({
            success: true,
            product
        });

    } catch (error) {

        console.error("Get product error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get product"
        });
    }
}


module.exports = {
    getProducts,
    getProductById
};