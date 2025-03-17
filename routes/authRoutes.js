const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

router.get('', (req, res) => {
    res.redirect('/login');
});
router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Error logging out');
        }
        res.redirect('/login');
    });
});
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/login', login);
router.post('/register', register);

module.exports = router;
