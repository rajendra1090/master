import * as express from 'express';
import * as db from '../database/database';

var router = express.Router();

router.post('/registerdeliveryboy', (req, res) => {
    console.log('req to register delivery boy');
    const deliveryBoyDetails = {
        name: req.body.name,
        password: req.body.password,
        completedOrders: [],
        pendingOrders: [],
        location: req.body.location
    }
    db.registerDeliveryBoy({deliveryBoyDetails}).then((response) => {
        res.status(200).json({ data: response});
    }).catch((err) => {
        res.status(500).json({err});
    })
})

export { router };