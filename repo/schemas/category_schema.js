const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
	{
		categoryId: {
			type: String,
			required: true,
			unique: true,
			index: true,
			trim: true,
		},
		clientId: {
			type: String,
			required: true,
			trim: true,
		},
		categoryName: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
		categoryDesc: {
			type: String,
			required: true,
			trim: true,
		},
		isAnchor: {
			type: Boolean,
			required: false,
		},
		parentCategoryId: {
			type: String,
			required: false,
			default: null,
		},
		attrSets: {
			type: [
				String,
				// {
				// 	attrSetId: String,
				// 	mandatoryAttributes: [String],
				// },
			],
			required: false,
		},
		createdBy: {
			type: String,
			required: true,
		},
		updatedBy: {
			type: String,
			required: false,
		},
		images: [String],
	},
	{ timestamps: true }
);

categorySchema.index({ categoryId: 1, clientId: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema, 'categories');
