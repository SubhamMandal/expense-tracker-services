const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signUpUser = async (req, res, next) => {
    let userEmailExists;
    let usernameExists;
    try {
        userEmailExists = await User.findOne({ email: req.body.email });
        usernameExists = await User.findOne({ username: req.body.username });
    } catch (err) {
        return next(err);
    }
    if (userEmailExists || usernameExists) {
        const errorMsg = userEmailExists ? 'User already exists!' : 'Username is taken';
        const err = new Error(errorMsg);
        err.statusCode = 500;
        return next(err);
    }
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });
    let response;
    try {
        response = await user.save();
    } catch (err) {
        err.statusCode = 500;
        return next(err);
    }
    return res.json({ status: 200, message: 'success', user: response });
}

exports.login = async (req, res, next) => {
    try {
        loadedUser = await User.findOne({ username: req.body.username });
        if (!loadedUser) {
            const error = new Error('User does not Exists');
            error.statusCode = 401;
            throw error;
        }
        if (loadedUser.password !== req.body.password) {
            const error = new Error('Invalid User ID or Password');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            { username: loadedUser.username, userId: loadedUser._id.toString() },
            'secret',
            { expiresIn: '1h' }
        );
        const userDetails = { ...loadedUser._doc };
        delete userDetails.password;
        return res.status(200).json({
            token: token,
            userDetails: userDetails,
            expirationTimeStamp: new Date().getTime() + 60 * 60 * 1000,
        });
    } catch (err) {
        return next(err);
    }
}

