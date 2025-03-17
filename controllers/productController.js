const Product = require('../models/product');

// Get all products
getProducts = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    const products = await Product.find();
    res.render('home', { products });
};

module.exports={getProducts};
