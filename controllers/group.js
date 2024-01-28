const Group = require('../models/group');
const Expense = require('../models/expense');
const User = require('../models/user');

exports.addGroup = async (req, res, next) => {
    const group = new Group({
        name: req.body.groupName,
        category: req.body.category,
        members: [req.userId],
        creator: req.userId
    });
    let response;
    try {
        response = await group.save();
    } catch (err) {
        err.statusCode = 500;
        return await next(err);
    }
    // console.log(response);
    return await res.status(201).json({ message: 'Group added successfully!', group: response });
}

exports.getUserGroup = async (req, res, next) => {
    let userGroups;
    try {
        userGroups = await Group.find({ members: req.userId });
    } catch (err) {
        err.statusCode = 500;
        return await next(err);
    }
    return await res.status(200).json({ userGroups: userGroups });
}

exports.groupDetails = async (req, res, next) => {
    let groupId = req.params.groupId;
    let group;
    let members;
    try {
        group = await Group.findOne({ _id: groupId });
        members = await User.find({ _id: { $in: group.members } }, { username: 1 });
    } catch (err) {
        err.statusCode = 500;
        return await next(err);
    }
    group.members = members;
    return await res.status(200).json({ groupDetails: group });
}

exports.joinGroup = async (req, res, next) => {
    let groupId = req.params.groupId;
    let group;
    let message;
    try {
        group = await Group.findOne({ _id: groupId });
        if (!group.members.includes(req.userId)) {
            group.members.push(req.userId);
            await group.save();
            message = 'User added successfully';
        } else {
            message = 'User is already a member';
        }
    } catch (err) {
        err.statusCode = 500;
        next(err);
    }
    return await res.status(200).json({ message: message });
}

exports.groupExpense = async (req, res, next) => {
    let groupId = req.params.groupId;
    let expenses;
    try {
        expenses = await Expense.find({ associatedGroup: groupId });
    } catch (err) {
        err.statusCode = 500;
        return await next(err);
    }
    return await res.status(200).json({ expenses: expenses });
}