const mongoose = require('mongoose');
const { STATUSES } = require('../../utils/constants');

const dealsSchema = mongoose.Schema(
	{
		dealId: {
			type: String,
			required: true,
			unique: true,
		},
		clientId: {
			type: String,
			required: true,
			trim: true,
		},
		productList: {
			type: [String],
			default: [],
		},
		dealType: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
		description: {
			type: String,
			required: false,
			trim: true,
		},
		fromDate: {
			type: Date,
			required: true,
		},
		toDate: {
			type: Date,
			required: true,
		},
		images: {
			type: [String],
			required: true,
		},
		createdBy: {
			type: String,
			required: true,
		},
		updatedBy: {
			type: String,
			required: false,
		},
		status: {
			type: String,
			required: true,
			default: STATUSES.ACTIVE,
			enum: Object.values(STATUSES),
		},
	},
	{ timestamps: true }
);

dealsSchema.index({ dealId: 1 }, { unique: true });

module.exports = mongoose.model('Deals', dealsSchema, 'deals');
