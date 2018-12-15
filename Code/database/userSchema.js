import mongoose from 'mongoose';
import * as orderSchema from './orderSchema';


const UserSchema = new mongoose.Schema({
    UserName: String,
    admin: Boolean,
    password: String,
    Address: [],
    Orders: [{ type: mongoose.Schema.ObjectId, ref: 'order' }],
    Mobile: String
},
{
    versionKey: false
});
var userModel = mongoose.model('User', UserSchema );
export {
    userModel
};