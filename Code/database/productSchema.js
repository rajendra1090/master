import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    ProductName: String,
    Price: Number,
    Seller: String,
    Quantity: Number,
    Desc: String,
    Rating: Number
},
{
    versionKey: false
});
var productModel = mongoose.model('Product', ProductSchema );
export {
    productModel
};