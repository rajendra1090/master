import mongoose from 'mongoose';
import * as productModel from './productSchema';
import * as deliveryBoy from './deliverSchema';
import * as orderModel from './orderSchema';
import * as userModel from './userSchema';
import _ from 'lodash';

let mongoConnection;
function connect() {
	return new Promise((resolve, reject) => {
		if (!mongoConnection) {
			mongoConnection = mongoose.connect('mongodb://127.0.0.1:27017/test', function(err){
		if(err) {
				reject(err);
		} else {
		console.log('Database successfully connected');
			resolve()
		}
		});
		} else {
			resolve();
		}
	});
}

export function disconnectDB() {
	console.log('disconnecting DB');
	// mongoConnection.connections.close();
	mongoose.connection.close();
	mongoConnection = '';
	// mongoConnection.close();
}

export function registerProduct(product){
	return new Promise((resolve, reject) => {
		connect().then(() => {
				console.log('connection successful');
				const productMod = new productModel.productModel(product);
				productMod.save((err, product) => {
					if (err) {
						console.log(err);
						reject(err);
					} else {
						resolve(product);
					}
				})
		}).catch((err) => {
			console.log(err);
			reject(err);
		})
	})
}

export function updateProductDetails({ updates, productId }) {
	return new Promise((resolve, reject) => {
		connect().then(() => {
				console.log('connection successful');
				const productMod = productModel.productModel;
				productMod.findOne({ _id: productId }, (err, product) => {
					if (err) {
						reject(err);
					} else {
						const keys = Object.keys(updates);
						_.forEach(keys, (key) => {
							if (product[key] || key === 'Quantity') {
								product[key] = updates[key];
							}
						});
						product.save((updateErr, updatedProduct) => {
							if (updateErr) {
								reject(updateErr);
							} else {
								resolve(updatedProduct);
							}
						});
					}
				})
		}).catch((err) => {
			console.log(err);
			reject(err);
		})
	})
}

export function deleteProduct({ productId }) {
	return new Promise((resolve, reject) => {
		connect().then(() => {
				console.log('connection successful');
				const productMod = productModel.productModel;
				productMod.findOneAndRemove({ _id: productId }, (err, product) => {
					if (err) {
						reject(err);
					} else if (product){
						resolve(product);
					} else {
						reject('No Product with this Id exists');
					}
				})
		}).catch((err) => {
			console.log(err);
			reject(err);
		})
	})
}

export function registerDeliveryBoy({ deliveryBoyDetails}) {
	return new Promise((resolve, reject) => {
		connect().then(() => {
			const deliveryBoyObject = new deliveryBoy.deliveryBoyModel(deliveryBoyDetails);
			deliveryBoyObject.save((err, deliveryBoy) => {
				if (err) {
					console.log(err);
					reject(err);
				} else {
					resolve(deliveryBoy);
				}
			})
		}).catch((connErr) => {
			console.log(connErr);
			reject(connErr);
		})
	});
}
export function getDeliveryBoy({ location }) {
	return new Promise((resolve, reject) => {
		connect().then(() => {
				console.log('connection successful');
				const deliveryBoyObject = deliveryBoy.deliveryBoyModel;
				deliveryBoyObject.find({ location: location }, (err, deliveryBoyArray) => {
					if (err) {
						reject(err);
					} else if (deliveryBoyArray){
						resolve(deliveryBoyArray);
					} else {
						reject('No related delivery boy found');
					}
				})
		}).catch((err) => {
			console.log(err);
			reject(err);
		})
	})
}

export function placeOrder({ orderDetails }) {
	return new Promise((resolve, reject) => {
		connect().then(async () => {
			try {
			const deliveryBoys = await getDeliveryBoy({ location: "Delhi"});
			console.log( deliveryBoys);
			if (deliveryBoys.length > 0 ) {
				orderDetails.deliveryBoy = deliveryBoys[0].id;
			const productMod = productModel.productModel;
			productMod.findOne({ _id: orderDetails.productId, Quantity: { "$gte": orderDetails.qty}}, (productFetchErr, product) => {
				if(productFetchErr) {
					console.log(productFetchErr)
					reject(productFetchErr);
				} else if(!product) {
					reject('No product with details exists or went out of stock');
				} else {
					const userModelCheckObject = userModel.userModel;
					userModelCheckObject.findOne({ UserName: orderDetails.purchaserName}, (purchaserErr, purchaser) => {
						if (purchaserErr) {
							console.log(purchaserErr);
							reject(purchaserErr);
						} else if (!purchaser) {
							reject('Invalid purchaser details');
						} else {
							orderDetails.purchaser = purchaser.id;
							const orderModelObject = new orderModel.orderModel(orderDetails); 
							orderModelObject.save((err, order) => {
								if (err) {
									reject(err);
								} else {
									// add order ref to list of pending orders for delivery boy
									//  reduce the quantity of products by the ordered quantity
									purchaser.Orders.push(order.id);
									product.Quantity = product.Quantity - orderDetails.qty;
									product.save((productSaveErr) => {
										if(productSaveErr) {
											console.log(productSaveErr);
											reject(productSaveErr)
										} else {
											const deliveryBoyObject = deliveryBoy.deliveryBoyModel;
											deliveryBoyObject.findOne({_id: orderDetails.deliveryBoy},(deliveryErr, deliveryBoyDetails) => {
												if (deliveryErr) {
													console.log(deliveryErr);
													reject(deliveryErr);
												} else {
													deliveryBoyDetails.pendingOrders.push(order.id);
													deliveryBoyDetails.save((deliverySaveErr) => {
														if (deliverySaveErr) {
															console.log(deliverySaveErr);
															reject(deliverySaveErr);
														} else {
															purchaser.save((purchaserDetailsUpdateErr) => {
																if (purchaserDetailsUpdateErr) {
																	console.log(purchaserDetailsUpdateErr);
																	reject(purchaserDetailsUpdateErr);
																} else {
																	resolve(order);
																}
															});
															
														}
													})
												}
											})
										}
									})
								}
							});
						}
					})

				}
			});
			} else {
				console.log('Np matching Delivery boy found');
				reject('Delivery not available in your location');
			}
		} catch(err) {
			console.log(err);
			reject(err);
		};
		}).catch((connErr) => {
			console.log(connErr);
			reject(connErr);
		});
	})
}

export function cancelOrder({ orderId}) {
	return new Promise((resolve, reject) => {
		connect().then(() => {
			const orderModelObject = orderModel.orderModel;
			orderModelObject.findOne({ _id: orderId, status: "Pending" }, (orderFetchErr, orderDetails) => {
				if (orderFetchErr) {
					console.log(orderFetchErr);
					reject(orderFetchErr);
				} else if (!orderDetails) {
					console.log(`Invalid orderId supplied to cancel : ${orderId}`)
					reject('Invalid order to cancel');
				} else {
					const productId = orderDetails.productId;
					const quantityCancelled = orderDetails.qty;
					const deliveryBoyId = orderDetails.deliveryBoy;
					const productModelObject = productModel.productModel;
					productModelObject.findOne({ _id: productId}, (productFindErr, productFound) => {
						if (productFindErr) {
							console.log('Product Not Found');
						} else if (!productFound) {
							console.log('product not found');
						} else {
							productFound.Quantity = productFound.Quantity + quantityCancelled;
							productFound.save((saveErr) => {
								if (saveErr) {
									console.log('Error occured while updating quantity');
								}
							});
						}
					});
					const deliveryBoyObject = deliveryBoy.deliveryBoyModel;
					deliveryBoyObject.findOne({ _id: deliveryBoyId}, (deliveryBoyErr, deliveryBoy) => {
						if (deliveryBoyErr) {
							console.log('err occured while updating delivery boy details');
						} else if (!deliveryBoy) {
							console.log('No Delivery Found for given order');
						} else {
							_.remove(deliveryBoy.pendingOrders, (order) => {
								return order === orderId;
							});
							deliveryBoy.save((saveDeliveryBoyErr) => {
								if (saveDeliveryBoyErr) {
									console.log(saveDeliveryBoyErr);
								}
							});
						}
					})
					orderDetails.remove((removeErr) => {
						if ( removeErr) {
							reject(removeErr);
						} else {
							resolve({data: 'success'});
						}
					});


				}
			})
		}).catch((connErr) => {
			console.log(connErr);
			reject(connErr)
		})
	})
}

export function registerUser({ user }) {
	return new Promise((resolve, reject) => {
		connect().then(() => {
			console.log('connection successful');
			const userModelCheckObject = userModel.userModel;
			userModelCheckObject.findOne({ UserName: user.UserName}, (chkErr, users) => {
				if (chkErr) {
					console.log(chkErr);
					reject(chkErr);
				} else if (users) {
					console.log('user with same username already exists');
					reject('Username already registered');
				} else {
					const userModelObject = new userModel.userModel(user);
					userModelObject.save((saveErr, user) => {
						if (saveErr) {
							console.log(saveErr);
							reject(saveErr);
						} else if (!user) {
							reject('Some Error Occured while registering the user');
						} else {
							resolve(user);
				}
			})
				}
			})
			
		}).catch((connErr) => {
			console.log(connErr);
			reject(connErr);
		})
	})
};

export function getUserDetails({ userName}) {
	return new Promise ((resolve, reject) => {
		connect().then(() => {
			const userModelObject = userModel.userModel;
			userModelObject.findOne({ UserName: userName }).populate('Orders').exec((fetchErr, response) => {
				if ( fetchErr) {
					console.log(fetchErr);
					reject(fetchErr);
				} else {
					resolve(response);
				}
			})
		}).catch((connErr) => {
			console.log(connErr);
			reject(connErr);
		})
	})
}

export function getOrderDetails({ orderId }) {
	return new Promise ((resolve, reject) => {
		connect().then(() => {
			const orderModelObject = orderModel.orderModel;
			orderModelObject.findOne({ _id: orderId })
				.populate('purchaser')
				.populate('productId')
				.populate('deliveryBoy').exec((fetchErr, response) => {
				if ( fetchErr) {
					console.log(fetchErr);
					reject(fetchErr);
				} else {
					resolve(response);
				}
			})
		}).catch((connErr) => {
			console.log(connErr);
			reject(connErr);
		})
	})
}