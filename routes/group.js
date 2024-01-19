const express = require('express');

const expenseController = require('../controllers/group');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/add-group', isAuth, expenseController.addGroup);
router.get('/user-groups', isAuth, expenseController.getUserGroup);
router.get('/group-details/:groupId', isAuth, expenseController.groupDetails);

module.exports = router;