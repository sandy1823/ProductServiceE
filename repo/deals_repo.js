const ApiException = require('../models/ApiException');
var Deals = require('./schemas/deals_schema');
const config = require('../config/app_config.json');
const { STATUSES } = require('../utils/constants');
const { getDealValueAsString } = require('../utils/helper_tools');
const { customLogger } = require('../utils/logger');

const getDealWithDealvalue = (deal) => ({
	...deal,
	dealType: {
		...deal.dealType,
		valueText: getDealValueAsString(deal.dealType).value,
	},
});

async function getAllDealsRepo(clientId, withProductDetails) {
	customLogger.info({
		fileName: '/repo/deals_repo',
		functionName: 'getAllDealsRepo',
		context: 'Before Execution',
		message: 'get all deals',
	});
	let dealData = [];
	if (withProductDetails) {
		customLogger.info({
			fileName: '/repo/deals_repo',
			functionName: 'getAllDealsRepo',
			context: 'if block true condition',
			message: `With product details`,
		});
		dealData = await Deals.aggregate([
			{
				$match: {
					clientId,
					status: STATUSES.ACTIVE,
				},
			},
			{
				$lookup: {
					localField: 'dealType',
					from: 'dealDetails',
					foreignField: 'dealDetailId',
					as: 'dealType',
				},
			},
			{
				$lookup: {
					localField: 'productList',
					from: 'products',
					foreignField: 'productId',
					as: 'productList',
				},
			},
			{
				$addFields: {
					productList: {
						$filter: {
							input: '$productList',
							cond: { $eq: ['$$this.clientId', '$clientId'] },
						},
					},
				},
			},
			{
				$project: {
					_id: 0,
					__v: 0,
					'dealType._id': 0,
					'dealType.__v': 0,
					'productList._id': 0,
					'productId.__v': 0,
				},
			},
			{
				$addFields: {
					dealType: {
						$filter: {
							input: '$dealType',
							cond: { $eq: ['$$this.clientId', '$clientId'] },
						},
					},
				},
			},
			{
				$addFields: {
					dealType: {
						$arrayElemAt: ['$dealType', 0],
					},
				},
			},
		]);
	} else {
		customLogger.info({
			fileName: '/repo/deal_repo',
			functionName: 'getAllDealsRepo',
			context: 'else block ',
			message: 'not getting deals',
		});
		dealData = await Deals.aggregate([
			{
				$match: {
					clientId,
					status: STATUSES.ACTIVE,
				},
			},
			{
				$lookup: {
					localField: 'dealType',
					from: 'dealDetails',
					foreignField: 'dealDetailId',
					as: 'dealType',
				},
			},
			{
				$project: {
					_id: 0,
					__v: 0,
					'dealType._id': 0,
					'dealType.__v': 0,
				},
			},
			{
				$addFields: {
					dealType: {
						$filter: {
							input: '$dealType',
							cond: { $eq: ['$$this.clientId', '$clientId'] },
						},
					},
				},
			},
			{
				$addFields: {
					dealType: {
						$arrayElemAt: ['$dealType', 0],
					},
				},
			},
			// {
			// 	$project: {
			// 		dealId: 1,
			// 		dealType: 1,
			// 	},
			// },
		]);
	}
	customLogger.info({
		fileName: '/repo/deals_repo',
		functionName: 'getAllDealsRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return dealData.length > 0 ? dealData.map(getDealWithDealvalue) : null;
}

async function getDealByDealIdRepo(clientId, dealId) {
	customLogger.info({
		fileName: '/repo/deals_repo',
		functionName: 'getDealByDealIdRepo',
		message: 'get deal by id',
		context: 'Before Execution',
	});
	let dealData = await Deals.aggregate([
		{
			$match: {
				clientId,
				dealId,
				status: STATUSES.ACTIVE,
			},
		},
		{
			$lookup: {
				localField: 'dealType',
				from: 'dealDetails',
				foreignField: 'dealDetailId',
				as: 'dealType',
			},
		},
		{
			$lookup: {
				localField: 'productList',
				from: 'products',
				foreignField: 'productId',
				as: 'productList',
			},
		},
		{
			$addFields: {
				productList: {
					$filter: {
						input: '$productList',
						cond: { $eq: ['$$this.clientId', '$clientId'] },
					},
				},
			},
		},
		{
			$project: {
				_id: 0,
				__v: 0,
				'dealType._id': 0,
				'dealType.__v': 0,
				'productList._id': 0,
				'productId.__v': 0,
			},
		},
		{
			$addFields: {
				dealType: {
					$filter: {
						input: '$dealType',
						cond: { $eq: ['$$this.clientId', '$clientId'] },
					},
				},
			},
		},
		{
			$addFields: {
				dealType: {
					$arrayElemAt: ['$dealType', 0],
				},
			},
		},
	]);
	customLogger.info({
		fileName: '/repo/deals_repo',
		functionName: 'getDealByDealIdRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return dealData.length > 0
		? {
				...dealData[0],
				dealType: {
					...dealData[0].dealType,
					valueText: getDealValueAsString(dealData[0].dealType).value,
				},
		  }
		: null;
}

function createDealRepo(record) {
	customLogger.info({
		fileName: '/repo/deal_repo',
		functionName: 'createDealRepo',
		message: 'creating deal',
		context: 'Before Execution',
	});
	customLogger.info({
		fileName: '/repo/deal_repo',
		functionName: 'createDealRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Deals.create(record);
}

async function deleteDealByIdRepo(clientId, dealId, updatedBy) {
	customLogger.info({
		fileName: '/repo/deal_repo',
		functionName: 'deleteDealByIdRepo',
		message: 'deleting deal',
		context: 'Before Execution',
	});
	customLogger.info({
		fileName: '/repo/deal_repo',
		functionName: 'deleteDealByIdRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Deals.updateOne(
		{
			clientId,
			dealId,
		},
		{
			$set: {
				status: STATUSES.INACTIVE,
				updatedBy,
			},
		},
		{
			upsert: false,
		}
	)
		.exec()
		.then((result) => result.modifiedCount);
}

async function getDealsFromListOfDealsIdRepo(clientId, dealIds) {
	customLogger.info({
		fileName: '/repo/deal_repo',
		functionName: 'getDealsFromListOfDealsIdRepo',
		context: 'Before Execution',
		message: 'Get deals from deal id',
	});
	let dealsData = await Deals.aggregate([
		{
			$match: {
				clientId,
				dealId: {
					$in: dealIds,
				},
				status: STATUSES.ACTIVE,
			},
		},
		{
			$lookup: {
				localField: 'dealType',
				from: 'dealDetails',
				foreignField: 'dealDetailId',
				as: 'dealType',
			},
		},
		{
			$project: {
				_id: 0,
				__v: 0,
				'dealType._id': 0,
				'dealType.__v': 0,
			},
		},
		{
			$addFields: {
				dealType: {
					$filter: {
						input: '$dealType',
						cond: { $eq: ['$$this.clientId', '$clientId'] },
					},
				},
			},
		},
		{
			$addFields: {
				dealType: {
					$arrayElemAt: ['$dealType', 0],
				},
			},
		},
	]);
	if (dealsData.length > 0) {
		customLogger.info({
			fileName: '/repo/deals_repo',
			functionName: 'getDealsFromListOfDealsIdRepo',
			context: 'if block true condition',
			message: 'get all deals from id',
		});
		customLogger.info({
			fileName: '/repo/deal_repo',
			functionName: 'getDealsFromListOfDealsIdRepo',
			context: 'After Execution',
			message: 'Going to return without errors',
		});
		return dealsData.map(getDealWithDealvalue);
	} else {
		customLogger.warn({
			fileName: '/repo/deal_repo',
			functionName: 'getDealsFromListOfDealsIdRepo',
			context: 'else if block true condition',
			message:
				'Going to throw exception No deals found from list of deals ids',
		});
		throw new ApiException({
			message: 'No deals found from list of deals ids',
			responseCode: config.response_code.empty_results,
		});
	}
}

async function getDealByProductIdRepo(clientId, productId) {
	customLogger.info({
		fileName: '/repo/deal_repo',
		functionName: 'getDealByProductIdRepo',
		message: 'getting deal by product id',
		context: 'Before Execution',
	});
	let dealData = await Deals.aggregate([
		{
			$match: {
				clientId,
				productList: {
					$elemMatch: {
						$eq: productId,
					},
				},
				status: STATUSES.ACTIVE,
			},
		},
		{
			$lookup: {
				localField: 'dealType',
				from: 'dealDetails',
				foreignField: 'dealDetailId',
				as: 'dealType',
			},
		},
		{
			$project: {
				_id: 0,
				__v: 0,
				'dealType._id': 0,
				'dealType.__v': 0,
			},
		},
		{
			$addFields: {
				dealType: {
					$filter: {
						input: '$dealType',
						cond: { $eq: ['$$this.clientId', '$clientId'] },
					},
				},
			},
		},
		{
			$addFields: {
				dealType: {
					$arrayElemAt: ['$dealType', 0],
				},
			},
		},
	]);
	customLogger.info({
		fileName: '/repo/deal_repo',
		functionName: 'getDealByProductIdRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return dealData.length > 0
		? {
				...dealData[0],
				dealType: {
					...dealData[0].dealType,
					valueText: getDealValueAsString(dealData[0].dealType).value,
				},
		  }
		: null;
}

async function updateDealRepo(clientId, dealId, record, updatedBy) {
	customLogger.info({
		fileName: '/repo/deal_repo',
		functionName: 'updateDealRepo',
		message: 'updating deal',
		context: 'Before Execution',
	});
	customLogger.info({
		fileName: '/repo/deal_repo',
		functionName: 'updateDealRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Deals.updateOne(
		{ clientId, dealId },
		{
			$set: { ...record, updatedBy },
		},
		{
			upsert: false,
		}
	).then((result) => result.modifiedCount);
}

async function getDealProductsIdsRepo(clientId) {
	customLogger.info({
		fileName: '/repo/deal_repo',
		functionName: 'getDealProductsIdsRepo',
		message: 'getting deals by product id',
		context: 'Before Execution',
	});
	let dealResult = await Deals.aggregate([
		{
			$match: {
				clientId,
				status: STATUSES.ACTIVE,
			},
		},
		{
			$project: {
				_id: 0,
				productList: 1,
			},
		},
	]).exec();
	customLogger.info({
		fileName: '/repo/deal_repo',
		functionName: 'getDealProductsIdsRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return dealResult.length <= 0
		? []
		: dealResult.flatMap((deal) => deal.productList);
}

module.exports = {
	getAllDealsRepo,
	getDealByDealIdRepo,
	createDealRepo,
	deleteDealByIdRepo,
	getDealsFromListOfDealsIdRepo,
	getDealByProductIdRepo,
	updateDealRepo,
	getDealProductsIdsRepo,
};
