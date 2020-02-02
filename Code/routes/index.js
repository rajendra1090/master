var express = require('express');
var app = express();
import * as order from '../routes/orders.api';
import * as delivery from '../routes/deliver.api';
import * as product from '../routes/product.api';
import * as user from '../routes/user.api';

/* GET home page. */
app.use('/order', order.router);
app.use('/delivery', delivery.router);
app.use('/product', product.router);
app.use('/user', user.router);

module.exports = app;

/* Testing JS. */