const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const productRoutes = require('./API/Routes/products');
const orderRoutes = require('./API/Routes/orders');
const userRoutes = require('./API/Routes/user');

mongoose.connect(
    "mongodb+srv://admin:" + 
    process.env.MONGO_ATLAS_PW + 
    "@atlascluster.bzpzarz.mongodb.net/?retryWrites=true&w=majority",

);

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); 

app.use((req, res, next) => {
    res.header('Access-Control-Access-Origin', '*');
    res.header('Access-Control-Access-Origin', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Access-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/orders', orderRoutes);
app.use('/products', productRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;