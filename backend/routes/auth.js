const passport = require('passport');
const settings = require('../config/passport')(passport);
const jwt = require('jsonwebtoken');
const router = require('express').Router();

let User = require('../models/User');

router.post('/register', (req, res) => {
    const { body } = req;
    const { password } = body;
    let { email } = body;

    if(!email) {
        return res.json({
            success: false,
            message: 'Error: Email cannot be blank.'
        });
    }
    if(!password) {
        return res.json({
            success: false,
            message: 'Error: Password cannot be blank'
        });
    }

    email = email.toLowerCase();
    email = email.trim();

    // Verify email doesn't already exist.
    User.find({
        email: email
    }, (err, previousUsers) => {
        if(err) {
            return res.json({
                success: false,
                message: 'Error: Server error.'
            });
        }
        else if(previousUsers.length > 0) {
            return res.json({
                success: false,
                message: 'Error: Account with that email already exists.'
            });
        }

        // Save new user.
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.generateHash(password);
        newUser.save((err, user) => {
            if(err) {
                return res.json({
                    success: false,
                    message: 'Error: Server error.'
                });
            }
            return res.json({
                success: true,
                token: 'JWT ' + user.token,
                message: 'Account created for user.'
            });
        });
    });
});

router.post('/login', (req, res) => {
    const { body } = req;
    const { password } = body;
    let { email } = body;

    if(!email) {
        return res.json({
            success: false,
            message: 'Error: Email cannot be blank.'
        });
    }
    if(!password) {
        return res.json({
            success: false,
            message: 'Error: Password cannot be blank'
        });
    }

    email = email.toLowerCase().trim();

    User.findOne({ email }, function(err, user) {
        if(err) throw err;

        if(!user) {
            res.status(401).json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        }
        else if(user.validPassword(password)) {
            // check password match
            let token = jwt.sign(user.toJSON(), process.env.API_SECRET);
            res.json({
                success: true,
                token: 'JWT ' + token
            });
        }
        else {
            res.status(401).json({
                success: false,
                message: 'Authentication failed. Wrong password.'
            });
        }
    });
});

module.exports = router;