var attributeSetRepo = require('../repo/attributeset_repo');
const { getAttributeSetFromRequest } = require('./data_extract_service');
const { customLogger } = require('../utils/logger');

function getAllAttributeSetService(req, _res) {
	customLogger.info({
		fileName: '/services/attributeset_service.js',
		functionName: 'getAllAttributeSetService',
		context: 'Before Execution',
		message: 'getting All Attribute'
	});
	customLogger.info({
		fileName: '/services/attributeset_service.js',
		functionName: 'getAllAttributeSetService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});

	return attributeSetRepo.getAllAttributeSetsRepo(req.query.clientId);
}

function createAttributeSetService(req, _res) {
	customLogger.info({
		fileName: '/services/attributeset_service.js',
		functionName: 'createAttributeSetService',
		context: 'Before Execution',
		message: 'create Attribute Set Service'
	});
	customLogger.info({
		fileName: '/services/attributeset_service.js',
		functionName: 'createAttributeSetService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return attributeSetRepo.createAttributeSetRepo(
		getAttributeSetFromRequest(req, true)
	);
}

function deleteAttributeSetByIdService(req, _res) {
	customLogger.info({
		fileName: '/services/attributeset_service.js',
		functionName: 'deleteAttributeSetByIdService',
		context: 'Before Execution',
		message: 'delete Attribute Service'
	});
	customLogger.info({
		fileName: '/services/attributeset_service.js',
		functionName: 'deleteAttributeSetByIdService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return attributeSetRepo.deleteAttributeSetByIdRepo(
		req.query.attrSetId,
		req.query.clientId
	);
}

function updateAttributeSetByIdService(req, _res) {
	customLogger.info({
		fileName: '/services/attributeset_service.js',
		functionName: 'updateAttributeSetByIdService',
		context: 'Before Execution',
		message: 'update Attribute Service'
	});
	const { record, attrSetId, clientId, updatedBy } =
		getAttributeSetFromRequest(req);
	customLogger.info({
		fileName: '/services/attributeset_service.js',
		functionName: 'updateAttributeSetByIdService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return attributeSetRepo.updateAttributeSetByIdRepo(
		clientId,
		attrSetId,
		record,
		updatedBy
	);
}

module.exports = {
	getAllAttributeSetService,
	createAttributeSetService,
	deleteAttributeSetByIdService,
	updateAttributeSetByIdService,
};
