const express = require('express');

const usersController = require('../controllers/user');

const router = express.Router();

router.post('/sign-up', usersController.signUpUser);
router.post('/login', usersController.login);

module.exports = router;