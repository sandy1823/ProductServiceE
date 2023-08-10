const mongoose = require('mongoose');

const checkoutSchema = mongoose.Schema(
	{
		clientId: {
			type: String,
			required: true,
			trim: true,
		},
		checkoutId: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		buyerId: {
			type: String,
			required: true,
			trim: true,
		},
		shippingTo: {
			type: Object,
			required: true,
		},
		userId: {
			type: String,
			required: true,
			trim: true,
		},
		productList: {
			type: [
				{
					productId: String,
					productName: String,
					qty: Number,
					price: Object,
				},
			],
			required: true,
		},
		shippingAddress: {
			type: Object,
			required: false,
		},
		scheduledDate: {
			type: Date,
			required: false,
		},
		price: {
			type: Object,
			required: true,
		},
		schedulerJobId: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

checkoutSchema.index({ checkoutId: 1 }, { unique: true });

module.exports = mongoose.model('Checkout', checkoutSchema, 'checkout');
