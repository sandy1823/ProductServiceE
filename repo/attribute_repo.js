const { customLogger } = require('../utils/logger');
var Attribute = require('./schemas/attributes_schema');

function getAllAttributesRepo(clientId) {
	customLogger.info({
		fileName: '/repo/attribute_repo',
		functionName: 'getAllAttributesRepo',
		context: 'Before Execution',
		message: 'Getting all attributes',
	});
	customLogger.info({
		fileName: '/repo/attribute_repo',
		functionName: 'getAllAttributeRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Attribute.find(
		{
			clientId: clientId,
		},
		{
			_id: 0,
			__v: 0,
		}
	)
		.lean()
		.exec();
}

function getAttributeByIdRepo(attrId, clientId) {
	customLogger.info({
		fileName: '/repo/attribute_repo',
		functionName: 'getAttributeByIdRepo',
		context: 'Before Execution',
		message: ' attributesId',
	});
	customLogger.info({
		fileName: '/repo/attribute_repo',
		functionName: 'getAttributeByIdRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Attribute.findOne(
		{
			clientId: clientId,
			attrId: attrId,
		},
		{
			_id: 0,
			__v: 0,
		}
	)
		.lean()
		.exec();
}

function createAttributeRepo(record) {
	customLogger.info({
		fileName: '/repo/attribute_repo',
		functionName: 'createAttributeRepo',
		context: 'Before Execution',
		message: 'Create attributes',
	});
	customLogger.info({
		fileName: '/repo/attribute_repo',
		functionName: 'createAttributeRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Attribute.create(record);
}

module.exports = {
	getAllAttributesRepo,
	createAttributeRepo,
	getAttributeByIdRepo,
};
