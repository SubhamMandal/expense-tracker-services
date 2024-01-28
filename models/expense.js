const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    catagory: {
        type: String,
        required: true,
    },
    associatedGroup: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    split: {
        type: String,
    },
    splitAmount: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            amount: {
                type: String,
            }
        }
    ],
    paidBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true })

module.exports = mongoose.model('Expense', expenseSchema);