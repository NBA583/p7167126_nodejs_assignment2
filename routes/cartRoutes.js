const express = require('express');
const { getCart, addProductToCart, removeProductFromCart, checkout, updateProductFromCart } = require('../controllers/cartController');
const router = express.Router();

router.get('/view', getCart);
router.post('/add-to-cart', addProductToCart);
router.post('/update-cart', updateProductFromCart);
router.post('/remove-from-cart', removeProductFromCart);
router.get('/checkout', checkout);

module.exports = router;
