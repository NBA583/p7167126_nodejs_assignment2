const Cart = require('../models/cart');
const Product = require('../models/product');

// Get all Cart details
exports.getCart = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    const cart = await Cart.find({userId: req.session.userId});
    res.render('cart', { cart: cart[0] || {} });
};

// Add product to cart
exports.addProductToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.session.userId;
    const product = await Product.findById(productId);
    if (!product) return res.status(400).json({ message: 'Product not found' });
    const {name, price} = product;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = new Cart({ userId, items: [], totalPrice: 0 });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
        existingItem.quantity += parseInt(quantity);
    } else {
        cart.items.push({ productId, quantity, price, name });
    }

    cart.totalPrice = cart.items.reduce((total, item) => total + (item.quantity * item.price), 0);
    await cart.save();
    // res.json(cart);
    // res.send("Prodct added to cart successfully");
    res.render('cart', { cart: cart });

};

// Update product quantity from cart
exports.updateProductFromCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.session.userId;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(400).json({ message: 'Cart not found' });

    cart.items.forEach(item => {
        if(item.productId.toString() === productId) {
            item.quantity = parseInt(quantity);
        }
    });
    cart.totalPrice = cart.items.reduce((total, item) => total + (item.quantity * item.price), 0);
    await cart.save();

    res.render('cart', { cart: cart });

};

// Remove product from cart
exports.removeProductFromCart = async (req, res) => {
    const { productId } = req.body;
    const userId = req.session.userId;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(400).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    cart.totalPrice = cart.items.reduce((total, item) => total + (item.quantity * item.price), 0);
    await cart.save();

    res.render('cart', { cart: cart });
};

// Checkout
exports.checkout = async (req, res) => {
    const userId = req.session.userId;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(400).json({ message: 'Cart not found' });

    if (cart.totalPrice === 0) return res.status(400).json({ message: 'Cart is empty' });

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    return res.redirect('/home');
};
