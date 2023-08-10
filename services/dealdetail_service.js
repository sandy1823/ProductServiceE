var dealDetailRepo = require('../repo/dealdetail_repo');
const { getDealDetailFromRequest } = require('./data_extract_service');
const { customLogger } = require('../utils/logger');

function getAllDealTypesService(req, _res) {
	customLogger.info({
		fileName: '/services/dealdetail_service',
		functionName: 'getAllDealTypesService',
		message: 'Getting all dealtype',
		context: 'Before Execution',
	});
	customLogger.info({
		fileName: '/services/dealdetail_service',
		functionName: 'getAllDealTypesService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return dealDetailRepo.getAllDealDetailsRepo(req.query.clientId);
}

function getDealDetailByDealDetailIdService(req, _res) {
	customLogger.info({
		fileName: '/services/dealdetail_service',
		functionName: 'getDealDetailByDealDetailIdService',
		message: 'Getting all dealdetails',
		context: 'Before Execution',
	});
	customLogger.info({
		fileName: '/services/dealdetail_service',
		functionName: 'getDealDetailByDealDetailIdService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return dealDetailRepo.getDealDetailByDealDetailIdRepo(
		req.query.clientId,
		req.params.dealDetailId
	);
}

function createDealDetailService(req, _res) {
	customLogger.info({
		fileName: '/services/dealdetail_service',
		functionName: 'createDealDetailService',
		context: 'Before Execution',
		message: 'creating deal details',
	});
	customLogger.info({
		fileName: '/services/dealdetail_service',
		functionName: 'createDealDetailService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return dealDetailRepo.createDealDetailRepo(
		getDealDetailFromRequest(req, true)
	);
}

function updateDealDetailService(req, _res) {
	customLogger.info({
		fileName: '/services/dealdetail_service',
		functionName: 'updateDealDetailService',
		context: 'Before Execution',
		message: 'updating all dealdetails',
	});
	customLogger.info({
		fileName: '/services/dealdetail_service',
		functionName: 'updateDealDetailService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return dealDetailRepo.updateDealDetailRepo(
		getDealDetailFromRequest(req, false)
	);
}

function deletedealDetailByIdService(req, _res) {
	customLogger.info({
		fileName: '/services/dealdetail_service',
		functionName: 'deletedealDetailByIdService',
		context: 'Before Execution',
		message: 'dealting dealdetails by id',
	});
	customLogger.info({
		fileName: '/services/dealdetail_service',
		functionName: 'deletedealDetailByIdService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return dealDetailRepo.deletedealDetailByIdRepo(
		req.query.clientId,
		req.params.dealDetailId
	);
}

module.exports = {
	getAllDealTypesService,
	getDealDetailByDealDetailIdService,
	createDealDetailService,
	updateDealDetailService,
	deletedealDetailByIdService,
};
