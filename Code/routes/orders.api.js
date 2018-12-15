import * as express from 'express';
import * as db from '../database/database';

var router = express.Router();

router.post('/placeorder', (req, res) => {
    console.log('req to place order');
    const orderDetails = {
        productId: req.body.productId,
        qty: req.body.qty,
        deliveryAddress: req.body.address,
        purchaserName: req.body.purchaser ? req.body.purchaser: "1",
        orderDate: Date.now(),
        status: "Pending",
        deliveryDate: null,
        deliveryBoy: null
    }
    db.placeOrder({orderDetails}).then((response) => {
        res.status(200).json({ data: response});
    }).catch((err) => {
        res.status(500).json({err});
    })
})

router.delete('/deleteorder/:orderId', (req, res) => {
    db.cancelOrder({ orderId: req.params.orderId}).then((response) => {
        res.status(200).json({ data: response});
    }).catch((err) => {
        res.status(500).json({ err });
    })
})

router.get('/orderdetails/:orderId', (req, res) => {
    db.getOrderDetails({ orderId: req.params.orderId}).then((response) => {
        res.status(200).json({ data: response});
    }).catch((err) => {
        res.status(500).json({ err });
    }) 
})

export { router };