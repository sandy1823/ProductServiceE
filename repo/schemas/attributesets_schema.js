const mongoose = require('mongoose');

const attributeSetSchema = mongoose.Schema(
	{
		clientId: {
			type: String,
			required: true,
			trim: true,
		},
		attrSetId: {
			type: String,
			required: true,
			index: true,
			unique: true,
			trim: true,
		},
		attrSetName: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
		attributes: {
			type: [String],
			ref: 'Attributes',
			required: true,
		},
		comments: {
			type: String,
			required: true,
			trim: true,
		},
		createdBy: {
			type: String,
			required: true,
		},
		updatedBy: {
			type: String,
			required: false,
		},
	},
	{ timestamps: true }
);

attributeSetSchema.index({ attrSetId: 1 }, { unique: true });

module.exports = mongoose.model(
	'AttributeSet',
	attributeSetSchema,
	'attributesets'
);
