const express = require('express');

const expenseController = require('../controllers/expense');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/add-expense', isAuth, expenseController.addExpense);
router.get('/all-expense', isAuth, expenseController.allExpense);
router.get('/:expenseId', expenseController.expenseDetails);

module.exports = router;