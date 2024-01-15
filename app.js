const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 8080;

const usersRoute = require('./routes/user');
const expenseRoute = require('./routes/expense');

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.get('/', (req, res, next) => {
    return res.json('Missing end point in the request URL');
});

app.use('/users', usersRoute);
app.use('/expense', expenseRoute);

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message || 'Something went wrong';
    return res.status(status).json({ message: message });
});

mongoose.connect('mongodb://subham:mongoDB@cluster0-shard-00-00.7wymb.mongodb.net:27017,cluster0-shard-00-01.7wymb.mongodb.net:27017,cluster0-shard-00-02.7wymb.mongodb.net:27017/expense-tracker?ssl=true&replicaSet=atlas-w7l308-shard-0&authSource=admin&retryWrites=true&w=majority')
    .then(() => {
        app.listen(PORT, (err) => {
            const msg = !err ? 'Listing on port ' + PORT : 'Error Ocuured : ' + err;
            console.log(msg);
        })
    }).catch(err => console.log('Database connectivity failed ', err));
