const categoryRepo = require('../repo/category_repo');
const { getCategoryFromRequest } = require('./data_extract_service');
const { customLogger } = require('../utils/logger');

function getAllCategoriesService(req, _res) {
	customLogger.info({
		fileName: '/services/category_service.js',
		functionName: 'getAllCategoriesService',
		context: 'Before Execution',
		message: 'get All Categories Service'
	});
	customLogger.info({
		fileName: '/services/category_service.js',
		functionName: 'getAllCategoriesService',
		context: 'After Execution',
		message: 'going to return with out error'
	});
	return categoryRepo.getAllCategoriesRepo(
		req.query.clientId,
		req.query.isTree.toString().toLowerCase() == 'true',
		req.query.userId
	);
}

function createCategoryService(req, _res) {
	customLogger.info({
		fileName: '/services/category_service.js',
		functionName: 'createCategoryService',
		context: 'Before Execution',
		message: 'create Category Service'
	});
	customLogger.info({
		fileName: '/services/category_service.js',
		functionName: 'createCategoryService',
		context: 'After Execution',
		message: 'going to return with out error'
	});
	return categoryRepo.createCategoryRepo(getCategoryFromRequest(req, true));
}

function deleteCategoryService(req, _res) {
	customLogger.info({
		fileName: '/services/category_service.js',
		functionName: 'deleteCategoryService',
		context: 'Before Execution',
		message: 'delete Category Service'
	});
	customLogger.info({
		fileName: '/services/category_service.js',
		functionName: 'deleteCategoryService',
		context: 'After Execution',
		message: 'going to return with out error'
	});
	return categoryRepo.deleteCategoryRepo(
		req.query.clientId,
		req.query.categoryId
	);
}

function updateCategoryService(req, _res) {
	customLogger.info({
		fileName: '/services/category_service.js',
		functionName: 'updateCategoryService',
		context: 'Before Execution',
		message: 'update Category Service'
	});

	const { record, clientId, categoryId, updatedBy } =
		getCategoryFromRequest(req);
	customLogger.info({
		fileName: '/services/category_service.js',
		functionName: 'updateCategoryService',
		context: 'After Execution',
		message: 'going to return with out error'
	});
	return categoryRepo.updateCategoryRepo(
		categoryId,
		clientId,
		record,
		updatedBy
	);
}

function getAllAttributeByCategoryIdService(req, _res) {
	customLogger.info({
		fileName: '/services/category_service.js',
		functionName: 'getAllAttributeByCategoryIdService',
		context: 'Before Execution',
		message: 'get All Attribute By Category Id Service'
	});
	customLogger.info({
		fileName: '/services/category_service.js',
		functionName: 'getAllAttributeByCategoryIdService',
		context: 'After Execution',
		message: 'going to return with out error'
	});
	return categoryRepo.getAllAttributeByCategoryIdRepo(
		req.query.clientId,
		req.params.categoryId
	);
}

function createDefaultCategoryForClientService(req, _res) {
	customLogger.info({
		fileName: '/services/category_service.js',
		functionName: 'createDefaultCategoryForClientService',
		context: 'Before Execution',
		message: 'create default Category Service'
	});
	customLogger.info({
		fileName: '/services/category_service.js',
		functionName: 'createDefaultCategoryForClientService',
		context: 'After Execution',
		message: 'going to return with out error'
	});
	return categoryRepo.getCategoryIdByClientIdRepo(
		req.params.clientId,
		req.body.userId
	);
}

module.exports = {
	getAllCategoriesService,
	getAllAttributeByCategoryIdService,
	createCategoryService,
	deleteCategoryService,
	updateCategoryService,
	createDefaultCategoryForClientService,
};
