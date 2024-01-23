const Expense = require('../models/expense');

exports.addExpense = async (req, res, next) => {
    const expense = new Expense({
        amount: req.body.amount,
        description: req.body.description,
        date: req.body.date,
        catagory: req.body.type,
        associatedGroup: req.body.group || null,
        creator: req.userId
    });
    let response;
    try {
        response = await expense.save();
    } catch (err) {
        err.statusCode = 500;
        return next(err);
    }
    // console.log(response);
    return await res.status(201).json({ message: 'Expense added successfully!', expense: response });
}

exports.allExpense = async (req, res, next) => {
    let allExpense;
    try {
        allExpense = await Expense.find({creator: req.userId});
    } catch (err) {
        err.statusCode = 500;
        next(err);
    }
    return await res.status(200).json({allExpense: allExpense});
}