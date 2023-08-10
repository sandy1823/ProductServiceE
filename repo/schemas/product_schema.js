const mongoose = require('mongoose');
const { STATUSES } = require('../../utils/constants');

const productSchema = mongoose.Schema(
	{
		clientId: {
			type: String,
			required: true,
			trim: true,
		},
		productId: {
			type: String,
			required: true,
			// unique: true,
			// index: true,
			trim: true,
			uppercase: true,
			min: 4,
			max: 10,
		},
		productName: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			min: 4,
			validate: {
				validator: (value) => value.length > 3,
			},
		},
		productDesc: {
			type: String,
			required: true,
			max: 500,
		},
		categoryId: {
			type: String,
			required: true,
			trim: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		minimumAdvertisablePrice: {
			type: Number,
			required: false,
			min: 0,
		},
		priceCategory: {
			type: String,
			required: false,
			default: 'fixed',
			trim: true,
			lowercase: true,
		},
		productType: {
			type: String,
			required: true,
			default: 'normal',
			trim: true,
			lowercase: true,
		},
		// discount: {
		// 	type: String,
		// 	required: false,
		// 	default: null,
		// },
		taxClass: {
			type: String,
			required: true,
		},
		supplier: {
			type: String,
			required: true,
			trim: true,
		},
		leadTime: {
			type: Number,
			required: false,
			min: 0,
		},
		qtyAvailable: {
			type: Number,
			required: true,
			min: 0,
		},
		attributes: {
			type: [Object],
			required: false,
			default: [],
		},
		images: {
			type: [String],
			required: false,
		},
		// thumbnails: {
		// 	type: [String],
		// 	required: false,
		// },
		createdBy: {
			type: String,
			required: true,
		},
		updatedBy: {
			type: String,
			required: false,
		},
		rating: Number,
		reviews: [Object],
		// mrp: {
		// 	type: Number,
		// 	required: false,
		// },
		visibilityStatus: {
			type: Boolean,
			required: false,
			default: true,
		},
		newTag: {
			type: {
				fromDate: Date,
				toDate: Date,
			},
			required: false,
		},
		moq: {
			type: Number,
			required: false,
			default: 1,
			min: 1,
		},
		status: {
			type: String,
			required: true,
			enum: Object.values(STATUSES),
			default: STATUSES.ACTIVE,
		},
	},
	{ timestamps: true }
);

productSchema.index({ productId: 1, clientId: 1 }, { unique: true });

module.exports = mongoose.model('Product', productSchema, 'products');
