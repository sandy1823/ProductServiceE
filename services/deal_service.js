const {
	GetAllProductsWithoutDealResponse,
} = require('../models/product_responses.js');
var dealRepo = require('../repo/deals_repo.js');
const { getProductsNotInProductIdsRepo } = require('../repo/product_repo.js');
const { getDealFromRequest } = require('./data_extract_service.js');
const {
	getProductStockDetail,
	getDiscountDataForPriceService,
	isOngoingDeal,
	getProductNewTagDetail,
} = require('./helper_service.js');
const { saveFilesToBucket } = require('../utils/file_upload');
const {
	getCalculatedDiscountPriceForListOfProducts,
} = require('./inner_communication_service.js');
const { STATUSES } = require('../utils/constants.js');
const { customLogger } = require('../utils/logger');

function getAllDealsService(req, _res) {
	customLogger.info({
		fileName: '/services/deal_service',
		functionName: 'getAllDealsService',
		context: 'Before Execution',
		message: 'dealting all deals',
	});
	customLogger.info({
		fileName: '/services/deal_service',
		functionName: 'getAllDealsService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return dealRepo.getAllDealsRepo(req.query.clientId, true);
}

function getDealByDealIdService(req, _res) {
	customLogger.info({
		fileName: '/services/deal_service',
		functionName: 'getDealByDealIdService',
		context: 'Before Execution',
		message: 'dealting deals by dealId',
	});
	customLogger.info({
		fileName: '/services/deal_service',
		functionName: 'getDealByDealIdService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return dealRepo.getDealByDealIdRepo(req.query.clientId, req.params.dealId);
}

async function createDealService(req, _res) {
	customLogger.info({
		fileName: '/services/deal_service.js',
		functionName: 'createDealService',
		context: 'Before Execution',
		message: 'create deal service',
	});
	const saveFilesResults = await saveFilesToBucket(req.files);
	if (saveFilesResults) {
		customLogger.info({
			fileName: '/services/deal_service.js',
			functionName: 'createDealService',
			context: 'if block true condition',
			message: 'create deal service',
		});
		return dealRepo.createDealRepo({
			...getDealFromRequest(req, true),
			images: saveFilesResults,
		});
	}
	customLogger.warn({
		fileName: 'services/deal_service',
		functionName: 'createDealService',
		context: 'After Execution',
		message: 'Unable to Store deal Images while create',
	});
	throw new ApiException({
		message: 'Unable to Store deal Images while create',
		responseCode: config.response_code.unable_to_store_files,
	});
}

async function updateDealService(req, _res) {
	customLogger.info({
		fileName: '/services/deal_service.js',
		functionName: 'updateDealService',
		context: 'Before Execution',
		message: 'update deal service',
	});
	let { record, clientId, dealId, updatedBy } = getDealFromRequest(req);
	const saveFilesResults = await saveFilesToBucket(req.files);
	if (saveFilesResults) {
		customLogger.info({
			fileName: '/services/deal_service.js',
			functionName: 'updateDealService',
			context: 'if block true condition',
			message: 'update deal service',
		});
		return dealRepo.updateDealRepo(
			clientId,
			dealId,
			{ ...record, images: record.images.concat(saveFilesResults) },
			updatedBy
		);
	}
	throw new ApiException({
		message: 'Unable to Store deal Images while update',
		responseCode: config.response_code.unable_to_store_files,
	});
}

function deleteDealByIdService(req, _res) {
	customLogger.info({
		fileName: '/services/deal_service',
		functionName: 'deleteDealByIdService',
		message: 'delete deals by dealId',
		context: 'Before Execution',
	});
	customLogger.info({
		fileName: '/services/deal_service',
		functionName: 'deleteDealByIdService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return dealRepo.deleteDealByIdRepo(
		req.query.clientId,
		req.params.dealId,
		req.query.userId
	);
}

async function getDealProductsCountService(req, _res) {
	customLogger.info({
		fileName: '/services/deal_service',
		functionName: 'getDealProductsCountService',
		message: 'Getting dealproduct count',
		context: 'Before Execution',
	});
	let dealResult = await getOngoingDealProductsList(req.query.clientId);
	customLogger.info({
		fileName: '/services/deal_service',
		functionName: 'getDealProductsCountService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return dealResult.productList.length > 0 && dealResult.productList != null
		? {
				dealProductsCount: dealResult.productList.length,
		  }
		: null;
}

async function getDealProductsService(req, _res) {
	customLogger.info({
		fileName: '/services/deal_service',
		functionName: 'getDealProductsService',
		context: 'Before Execution',
		message: 'Getting deal products',
	});
	let dealResult = await getOngoingDealProductsList(req.query.clientId);
	if (dealResult.productList != null && dealResult.productList.length > 0) {
		customLogger.info({
			fileName: '/services/deal_service',
			functionName: 'getDealProductsService',
			context: 'if block true execution',
			message: 'Getting deal results from productlist',
		});
		let priceResult = await getCalculatedDiscountPriceForListOfProducts(
			dealResult.productList.map(getDiscountDataForPriceService),
			false
		);
		let productList = dealResult.productList
			.map((product) => {
				let price = priceResult.items.find(
					(productWithPrice) =>
						productWithPrice.id === product.productId
				).price;
				return {
					...product,
					...getProductStockDetail(product),
					...getProductNewTagDetail(product),
					price: {
						...price,
						discountPrice:
							price.discountPrice <= 0
								? undefined
								: price.discountPrice,
					},
					deal: price.discountPrice <= 0 ? null : product.deal,
				};
			})
			.filter((product) => product.price.discountPrice > 0);
		let productIds = productList.map((product) => product.productId);
		productList = productList
			.filter(
				(product, index) =>
					!productIds.includes(product.productId, index + 1)
			)
			.map((product) => ({
				...product,
				deal: {
					dealId: product.deal.dealId,
					title: product.deal.title,
					dealType: product.deal.dealType,
					description: product.deal.description,
					fromDate: product.deal.fromDate,
					toDate: product.deal.toDate,
				},
			}));
		customLogger.info({
			fileName: '/services/deal_service',
			functionName: 'getDealProductsService',
			context: 'Before Execution',
			message: 'Getting deal products',
		});
		customLogger.info({
			fileName: '/services/deal_service',
			functionName: 'getDealProductsService',
			context: 'After Execution',
			message: 'Going to return with out errors',
		});

		return {
			deals: dealResult.dealData.map((deal) => ({
				dealId: deal.dealId,
				title: deal.title,
				images: deal.images,
			})),
			productList: productList.length === 0 ? null : productList,
		};
	} else {
		customLogger.warn({
			fileName: '/services/deal_service',
			functionName: 'getDealProductsService',
			context: 'else block false condition',
			message: 'Going to return with out errors',
		});
		return null;
	}
}

async function getProductsWithoutDealService(req, _res) {
	customLogger.info({
		fileName: 'services/deal_service',
		functionName: 'getProductsWithoutDealService',
		context: 'Before Execution',
		message: 'Going to return get products withOut deals',
	});
	let dealProductsIds = await dealRepo.getDealProductsIdsRepo(
		req.query.clientId
	);
	let productData = await getProductsNotInProductIdsRepo(
		req.query.clientId,
		dealProductsIds
	);
	customLogger.info({
		fileName: 'services/deal_service',
		functionName: 'getProductsWithoutDealService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return productData.length > 0
		? productData.map(
				(product) => new GetAllProductsWithoutDealResponse(product)
		  )
		: null;
}

async function getAllOngoingDealsService(req, _res) {
	customLogger.info({
		fileName: '/services/deal_service',
		functionName: 'getAllOngoingDealsService',
		message: 'Getting ongoing deals',
		context: 'Before Execution',
	});
	customLogger.info({
		fileName: '/services/deal_service',
		functionName: 'getAllOngoingDealsService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return dealRepo
		.getAllDealsRepo(req.query.clientId)
		.then((result) =>
			result != null ? result.filter((deal) => isOngoingDeal(deal)) : null
		);
}

async function getOngoingDealProductsList(clientId) {
	customLogger.info({
		fileName: '/services/deal_service',
		functionName: 'getOngoingDealProductsList',
		context: 'Before Execution',
		message: 'Getting products from deals',
	});
	let dealData = (await dealRepo.getAllDealsRepo(clientId, true)).filter(
		(deal) =>
			isOngoingDeal(deal) &&
			deal.productList.length > 0 &&
			deal.productList.every(
				(product) => product.status === STATUSES.ACTIVE
			)
	);
	customLogger.info({
		fileName: '/services/deal_service',
		functionName: 'getOngoingDealProductsList',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return dealData != null
		? {
				dealData,
				productList: dealData
					.flatMap((deal) => deal.productList)
					.map((product) => {
						let deal = dealData.find(
							(data) =>
								data.productList.find(
									(dealProduct) =>
										product.productId ===
										dealProduct.productId
								) || null
						);
						return {
							...product,
							...getProductStockDetail(product),
							...getProductNewTagDetail(product),
							deal: deal ? deal : null,
						};
					})
					.filter((product) => product.status === STATUSES.ACTIVE),
		  }
		: null;
}

module.exports = {
	getAllDealsService,
	getDealByDealIdService,
	createDealService,
	updateDealService,
	deleteDealByIdService,
	getDealProductsService,
	getProductsWithoutDealService,
	getDealProductsCountService,
	getAllOngoingDealsService,
};
