var attributeRepo = require('../repo/attribute_repo');
const { getAttributeFromRequest } = require('./data_extract_service');
const { customLogger } = require('../utils/logger');

function getAllAttributeService(req, _res) {
	customLogger.info({
		fileName: '/services/attribute_service',
		functionName: 'getAllAttributeService',
		context: 'Before Execution',
		message: 'Getting all attributes',
	});
	customLogger.info({
		fileName: '/services/attribute_service',
		functionName: 'getAllAttributeService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return attributeRepo.getAllAttributesRepo(req.query.clientId);
}

function createAttributeService(req, _res) {
	customLogger.info({
		fileName: '/services/attribute_service',
		functionName: 'createAttributeService',
		context: 'Before Execution',
		message: 'Create attribute',
	});
	customLogger.info({
		fileName: 'services/attribute_service',
		functionName: 'createAttributeService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return attributeRepo.createAttributeRepo(getAttributeFromRequest(req));
}

module.exports = {
	getAllAttributeService,
	createAttributeService,
};
