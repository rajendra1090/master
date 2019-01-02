import express from 'express';
import * as db from '../database/database';
import * as _ from 'lodash';

const adminKey = 'qwghdfxzfkgc';
const router = express.Router();

router.post('/register', (req, res) => {
    // add a key to register any user as admin
    // adminKey to be decided
    const user = {
    UserName: req.body.username,
    admin: (req.body.adminKey && req.body.adminKey === adminKey) ? true: false,
    password: req.body.password,
    Address: (req.body.address && _.isArray(req.body.address))? req.body.address : [],
    Orders: [],
    Mobile: req.body.mobile
    }
    db.registerUser({ user }).then((response) => {
        db.disconnectDB();
        res.status(200).json({ data: response });
    }).catch((err) => {
        db.disconnectDB();
        console.log(err);
        res.status(500).json({ err });
    })



});

router.get('/userDetails/:username',(req, res) => {
    db.getUserDetails({ userName: req.params.username}).then((resp) => {
        res.status(200).json({data: resp});
    }).catch((err) => {
        res.status(500).json({err});
    })
});


export { router };