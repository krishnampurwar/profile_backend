const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

const port = 5000;

app.use(cors());
app.use(express.json());
app.use('/', express.static('images'));
const uri = 'mongodb://localhost:27017/assignment';
mongoose.connect('mongodb://localhost:27017/assignment');

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('mongo DB success');
});
app.get('/',(req,res) => {
    console.log('itruns')
})
const userRouter = require('./routes/user');
app.use('/users', userRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})