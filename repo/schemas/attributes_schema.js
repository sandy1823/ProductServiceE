const mongoose = require('mongoose');

const attributeSchema = mongoose.Schema(
	{
		clientId: {
			type: String,
			required: true,
			trim: true,
		},
		attrId: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		attrName: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
		attrDesc: {
			type: String,
			required: true,
			trim: true,
		},
		attrValue: {
			type: [String],
			required: false,
		},
		attrType: {
			type: String,
			required: true,
			trim: true,
		},
		attrPattern: {
			type: String,
			required: false,
			trim: true,
		},
		createdBy: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);
attributeSchema.index({ attrId: 1, clientId: 1 }, { unique: true });

module.exports = mongoose.model('Attributes', attributeSchema, 'attributes');
