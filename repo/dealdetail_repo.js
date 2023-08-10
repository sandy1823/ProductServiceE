const DealDetail = require('./schemas/dealdetail_schema');
const ApiException = require('../models/ApiException');
const config = require('../config/app_config.json');
const { STATUSES } = require('../utils/constants');
const { customLogger } = require('../utils/logger');

function getAllDealDetailsRepo(clientId) {
	customLogger.info({
		fileName: '/repo/checkout_repo',
		functionName: 'getAllDealDetailsRepo',
		context: 'Before Execution',
		message: 'getting all deal details',
	});
	customLogger.info({
		fileName: '/repo/checkout_repo',
		functionName: 'getAllDealDetailsRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return DealDetail.find(
		{ clientId, status: STATUSES.ACTIVE },
		{ _id: 0, __v: 0 }
	)
		.lean()
		.exec();
}

async function getDealDetailByDealDetailIdRepo(clientId, dealDetailId) {
	customLogger.info({
		fileName: '/repo/checkout_repo',
		functionName: 'getDealDetailByDealDetailIdRepo',
		context: 'Before Execution',
		message: 'Getting deal detail by deal detail id',
	});

	let dealDetailData = await DealDetail.find(
		{
			clientId,
			dealDetailId,
			status: STATUSES.ACTIVE,
		},
		{
			_id: 0,
			__v: 0,
		}
	)
		.lean()
		.exec();
	if (dealDetailData.length > 0) {
		customLogger.info({
			fileName: '/repo/checkout_repo',
			functionName: 'getDealDetailByDealDetailIdRepo',
			context: 'if block true condition',
			message: 'getting deal by id',
		});
		customLogger.info({
			fileName: '/repo/checkout_repo',
			functionName: 'getDealDetailByDealDetailIdRepo',
			context: 'After Execution',
			message: `Going to reture without errors`,
		});
		return dealDetailData[0];
	} else {
		customLogger.info({
			fileName: '/repo/checkout_repo',
			functionName: 'getDealDetailByDealDetailIdRepo',
			context: 'else block ',
			message: 'got no deals',
		});
		customLogger.info({
			fileName: '/repo/checkout_repo',
			functionName: 'getDealDetailByDealDetailIdRepo',
			context: 'After Execution',
			message: `Going to throw Exception No deal detail found`,
		});
		throw new ApiException({
			message: 'No deal detail found',
			responseCode: config.response_code.empty_results,
		});
	}
}

function createDealDetailRepo(record) {
	customLogger.info({
		fileName: '/repo/checkout_repo',
		functionName: 'createDealDetailRepo',
		context: 'Before Execution',
		message: 'creating deal details',
	});
	customLogger.info({
		fileName: '/repo/checkout_repo',
		functionName: 'createDealDetailRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return DealDetail.create(record);
}

function deleteDealDetailRepo(clientId, dealDetailId) {
	customLogger.info({
		fileName: '/repo/checkout_repo',
		functionName: 'deleteDealDetailRepo',
		context: 'Before Execution',
		message: 'delete deal details',
	});
	customLogger.info({
		fileName: '/repo/checkout_repo',
		functionName: 'deleteDealDetailRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return DealDetail.deleteOne({ clientId, dealDetailId });
}

function updateDealDetailRepo({ record, clientId, dealDetailId, updatedBy }) {
	customLogger.info({
		fileName: '/repo/checkout_repo',
		functionName: 'updateDealDetailRepo',
		context: 'Before Execution',
		message: 'updatedeal details',
	});
	customLogger.info({
		fileName: '/repo/checkout_repo',
		functionName: 'updateDealDetailRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return DealDetail.updateOne(
		{
			clientId,
			dealDetailId,
		},
		{
			$set: { ...record, updatedBy },
		},
		{
			upsert: false,
		}
	);
}

module.exports = {
	getAllDealDetailsRepo,
	getDealDetailByDealDetailIdRepo,
	createDealDetailRepo,
	updateDealDetailRepo,
	deleteDealDetailRepo,
};
