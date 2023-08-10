const mongoose = require('mongoose');
const { STATUSES } = require('../../utils/constants');

const dealDetailSchema = mongoose.Schema(
	{
		dealDetailId: {
			type: String,
			required: true,
			unique: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
		clientId: {
			type: String,
			required: true,
			trim: true,
		},
		value: {
			type: Number,
			required: true,
		},
		valueType: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: false,
			trim: true,
		},
		createdBy: {
			type: String,
			required: true,
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

dealDetailSchema.index({ dealDetailId: 1 }, { unique: true });

module.exports = mongoose.model('DealDetail', dealDetailSchema, 'dealDetails');
