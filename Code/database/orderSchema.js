import mongoose from 'mongoose';
// import * as deliveryBoy from './deliverSchema';
// import * as product from './productSchema';

const orderSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.ObjectId, ref: 'Product' },
    qty: Number,
    deliveryAddress: String,
    orderDate: Date,
    deliveryDate: Date,
    status: String,
    purchaser: { type: mongoose.Schema.ObjectId, ref: 'User' },
    deliveryBoy: { type: mongoose.Schema.ObjectId, ref: 'deliveryBoy' }  
});

const orderModel = new mongoose.model('order',orderSchema);
export { orderModel};