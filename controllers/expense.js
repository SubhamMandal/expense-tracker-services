const Expense = require('../models/expense');
const User = require('../models/user');
const Group = require('../models/group');

exports.addExpense = async (req, res, next) => {
    const expense = new Expense({
        amount: req.body.amount,
        description: req.body.description,
        date: req.body.date,
        catagory: req.body.type,
        associatedGroup: req.body.group || null,
        creator: req.userId
    });
    if (req.body.group) {
        expense.split = req.body.split;
        expense.splitAmount = req.body.splitAmount;
        expense.paidBy = req.body.paidBy;
    }
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
        allExpense = await Expense.find({ $or: [{ "splitAmount.userId": req.userId }, { paidBy: req.userId }, { $and: [{ associatedGroup: null }, { creator: req.userId }] }] });
        // allExpense = await Expense.find({ creator: req.userId });
        // allExpense = await Expense.find({$and: [{ paidBy: req.userId }]});
    } catch (err) {
        err.statusCode = 500;
        return next(err);
    }
    return await res.status(200).json({ allExpense: allExpense });
}

exports.expenseDetails = async (req, res, next) => {
    const expenseId = req.params.expenseId;
    const response = {};
    let expense;
    let users;
    let group;
    try {
        expense = await Expense.findOne({ _id: expenseId });
        response.expenseData = expense;
        if (expense.associatedGroup) {
            const members = expense.splitAmount.map(data => data.userId);
            users = await User.find({ $or: [{ _id: { $in: members } }, { _id: expense.paidBy }] }, { username: 1 });
            group = await Group.findOne({ _id: expense.associatedGroup }, { _id: 0, category: 1 });
            response.catagory = group.category;
            response.users = users;
        }
    } catch (err) {
        err.statusCode = 500;
        return next(err);
    }
    return await res.status(200).json({ ...response, message: 'expense data fetched successfully' });
}