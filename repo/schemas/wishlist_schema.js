const mongoose = require('mongoose');

const wishlistSchema = mongoose.Schema(
	{
		wishlistId: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		wishlistName: {
			type: String,
			required: true,
			default: null,
			trim: true,
		},
		userId: {
			type: String,
			required: true,
		},
		buyerId: {
			type: String,
			required: true,
		},
		clientId: {
			type: String,
			required: true,
			trim: true,
		},
		productList: {
			type: [String],
			required: true,
		},
		comments: {
			type: String,
			required: false,
		},
	},
	{ timestamps: true }
);

wishlistSchema.index({ wishlistId: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema, 'wishlist');
