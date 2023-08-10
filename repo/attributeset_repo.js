const { customLogger } = require('../utils/logger');
var AttributeSet = require('./schemas/attributesets_schema');

function getAllAttributeSetsRepo(clientId) {
	customLogger.info({
		fileName: '/repo/attributeset_repo',
		functionName: 'getAllAttributeSetsRepo',
		context: 'Before Execution',
		message: 'Going to return without errors',
	});
	customLogger.info({
		fileName: '/repo/attributeset_repo',
		functionName: 'getAllAttributeSetsRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return AttributeSet.aggregate([
		{
			$match: {
				clientId: clientId,
			},
		},
		{
			$lookup: {
				localField: 'attributes',
				from: 'attributes',
				foreignField: 'attrId',
				as: 'attributes',
			},
		},
		{
			$addFields: {
				attributes: {
					$filter: {
						input: '$attributes',
						cond: { $eq: ['$$this.clientId', '$clientId'] },
					},
				},
			},
		},
		{
			$project: {
				_id: 0,
				__v: 0,
				'attributes._id': 0,
				'attributes.__v': 0,
			},
		},
	]).exec();
}

function createAttributeSetRepo(record) {
	customLogger.info({
		fileName: '/repo/attributeset_repo',
		functionName: 'createAttributeSetRepo',
		context: 'Before Execution',
		message: 'Create attributesSet',
	});
	customLogger.info({
		fileName: '/repo/attributeset_repo',
		functionName: 'createAttributeSetRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return AttributeSet.create(record);
}

async function deleteAttributeSetByIdRepo(attrSetId, clientId) {
	customLogger.info({
		fileName: '/repo/attributeset_repo',
		functionName: 'deleteAttributeSetByIdRepo',
		context: 'Before Execution',
		message: 'Delete attributesSet',
	});
	customLogger.info({
		fileName: '/repo/attributeset_repo',
		functionName: 'deleteAttributeSetByIdRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return (
		await AttributeSet.deleteOne({
			clientId: clientId,
			attrSetId: attrSetId,
		}).exec()
	).deletedCount;
}

function updateAttributeSetByIdRepo(clientId, attrSetId, record, updatedBy) {
	customLogger.info({
		fileName: '/repo/attributeset_repo',
		functionName: 'updateAttributeSetByIdRepo',
		context: 'Before Execution',
		message: 'Update attributesSet',
	});
	customLogger.info({
		fileName: '/repo/attributeset_repo',
		functionName: 'updateAttributeSetByIdRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return AttributeSet.findOneAndUpdate(
		{
			clientId: clientId,
			attrSetId: attrSetId,
		},
		{
			$set: { ...record, updatedBy },
		},
		{
			new: true,
			upsert: false,
			projection: {
				_id: 0,
				__v: 0,
			},
		}
	);
}

module.exports = {
	deleteAttributeSetByIdRepo,
	createAttributeSetRepo,
	getAllAttributeSetsRepo,
	updateAttributeSetByIdRepo,
};
