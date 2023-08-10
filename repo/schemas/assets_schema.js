const mongoose = require('mongoose');

const assetsSchema = mongoose.Schema(
	{
		clientId: {
			type: String,
			// required: true,
		},
		homeBanners: {
			type: [Object],
			default: [],
			required: false,
		},
		createdBy: {
			type: String,
			required: true,
		},
		description: {
			type: Object,
			required: false,
		},
		isDefault: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Assets', assetsSchema, 'assets');
