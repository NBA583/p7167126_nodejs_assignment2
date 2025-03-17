const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Register user
register = async (req, res) => {    
    let { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) 
        return res.status(400).json({ message: 'User already exists' });
    const user = new User({ name, email, password });
    await user.save();
    // res.status(201).json({ message: 'User created successfully' });
    return res.redirect('/login');
};

// Login user
login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id;
        return res.redirect('/home');
    } else {
        return res.status(401).json({message: "Invalid username or password"}); 
    }
};

module.exports = {register, login};