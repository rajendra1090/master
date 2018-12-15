import mongoose from 'mongoose';
// import * as order from './orderSchema';

const deliveryBoySchema = new mongoose.Schema({
    name: String,
    password: String,
    completedOrders: [{ type: mongoose.Schema.ObjectId, ref: 'order' }],
    pendingOrders: [{ type: mongoose.Schema.ObjectId, ref: 'order' }],
    location: String
});

const deliveryBoyModel = new mongoose.model('deliveryBoy', deliveryBoySchema);
export { deliveryBoyModel };