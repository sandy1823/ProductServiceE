const mongoose = require('mongoose');

const cartSchema = mongoose.Schema(
	{
		clientId: {
			type: String,
			required: false,
			trim: true,
		},
		cartId: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		userId: {
			type: String,
			required: true,
			unique: true,
			index: true,
			trim: true,
		},
		buyerId: {
			type: String,
			required: true,
			trim: true,
		},
		productList: {
			type: [
				{
					productId: String,
					qty: Number,
				},
			],
			required: false,
		},
	},
	{ timestamps: true }
);

cartSchema.index({ cartId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Cart', cartSchema, 'cart');
