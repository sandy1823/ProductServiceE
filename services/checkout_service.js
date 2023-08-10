const checkoutRepo = require('../repo/checkout_repo');
const {
	getCartCheckoutFromRequest,
	getCheckoutFromOrderRequest,
	getWishlistCheckoutFromRequest,
	getCheckoutProductListFromRequest,
} = require('./data_extract_service');
const {
	getProductListWithCalculatedDealPriceAndTaxPrice,
	checkMoqAndQtyOnProduct,
	getDealForListOfProducts,
} = require('./helper_service');
const {
	getUserAddressByAddressId,
	getUserDetailByUserId,
	createScheduler,
	destroyScheduler,
	getClientByClientId,
} = require('./inner_communication_service');
var { getCartProductsRepo } = require('../repo/cart_repo');
const {
	STATUSES,
	ACTION,
	DEFAULT_DELIVERYCHARGE,
	CHECKOUT_SCHEDULER_MINUTE,
} = require('../utils/constants');
var ApiException = require('../models/ApiException');
var {
	changeProductQtyAvailableRepo,
	getProductsByListOfIdsRepo,
} = require('../repo/product_repo');
const config = require('../config/app_config.json');
const { PRODUCT_SERVICE_GATEWAY } = require('../utils/urls');
const {
	UPDATEPRODUCTQTYONFAILEDCHECKOUT,
	WITHOUTAUTH,
} = require('../utils/endpoints');
const { HTTP_METHOD } = require('../utils/constants');
const SchedulerJob = require('../models/SchedulerJob');
const { getAuthTokenFromRequest } = require('../utils/helper_tools');
const { failedResponse } = require('./common_service');
const { generateInvoiceDoc } = require('./invoice_generation_service');
const { getWishlistProductsRepo } = require('../repo/wishlist_repo');
const { customLogger } = require('../utils/logger');
function getCheckoutByIdService(req, _res) {
	customLogger.info({
		fileName: '/services/checkout_service.js',
		functionName: 'getCheckoutByIdService',
		context: 'Before Execution',
		message: 'getting checkout',
	});
	customLogger.info({
		fileName: '/services/checkout_service.js',
		functionName: 'getCheckoutByIdService',
		context: 'After Execution',
		message: 'going to return with out error',
	});
	return checkoutRepo.getCheckoutByIdRepo(
		req.params.checkoutId,
		req.query.clientId,
		req.query.buyerId,
		req.query.userId
	);
}

async function createCheckoutService(req, _res) {
	customLogger.info({
		fileName: '/services/checkout_service.js',
		functionName: 'createCheckoutService',
		context: 'Before Execution',
		message: 'create checkout',
	});
	let record = getCartCheckoutFromRequest(req);
	record.productList = (
		await getCartProductsRepo(
			record.cartId,
			record.userId,
			record.buyerId,
			record.clientId
		)
	).filter((product) => product?.status === STATUSES.ACTIVE);
	if (record.productList.length === 0) {
		customLogger.warn({
			fileName: '/services/checkout_service.js',
			functionName: 'createCheckoutService',
			context: 'if block true condition',
			message: 'No Active products found while checkout',
		});
		throw new ApiException({
			message: 'No Active products found while checkout',
			responseCode:
				config.response_code
					.no_active_products_while_proceed_to_checkout,
		});
	}
	record.productList = await getDealForListOfProducts(
		record.productList,
		record.clientId
	);
	record = await buildCheckoutContext(record, getAuthTokenFromRequest(req));
	customLogger.info({
		fileName: '/services/checkout_service.js',
		functionName: 'createCheckoutService',
		context: 'After Execution',
		message: 'going to return with out error',
	});
	return checkoutRepo.createCheckoutRepo(record);
}

async function createCheckoutFromWishlistService(req, _res) {
	customLogger.info({
		fileName: '/services/checkout_service.js',
		functionName: 'createCheckoutFromWishlistService',
		context: 'Before Execution',
		message: 'create Checkout From Wishlist Service',
	});
	let record = getWishlistCheckoutFromRequest(req);
	record.productList = (
		await getWishlistProductsRepo(
			record.wishlistId,
			record.userId,
			record.buyerId,
			record.clientId
		)
	)
		.filter((product) => product?.status === STATUSES.ACTIVE)
		.map((product) => ({ ...product, qty: product.moq }));
	if (record.productList.length === 0) {
		customLogger.warn({
			fileName: '/services/checkout_service.js',
			functionName: 'createCheckoutFromWishlistService',
			context: 'if block true condition',
			message: 'No Active products found while checkout',
		});
		throw new ApiException({
			message: 'No Active products found while checkout',
			responseCode:
				config.response_code
					.no_active_products_while_proceed_to_checkout,
		});
	}
	record.productList = await getDealForListOfProducts(
		record.productList,
		record.clientId
	);
	record = await buildCheckoutContext(record, getAuthTokenFromRequest(req));
	customLogger.info({
		fileName: '/services/checkout_service.js',
		functionName: 'createCheckoutFromWishlistService',
		context: 'After Execution',
		message: 'Going to return with out error',
	});
	return checkoutRepo.createCheckoutRepo(record);
}

async function createCheckoutFromProductListService(req, _res) {
	customLogger.info({
		fileName: '/services/checkout_service.js',
		functionName: 'createCheckoutFromProductListService',
		context: 'Before Execution',
		message: 'create Checkout From productlist Service',
	});
	let record = getCheckoutProductListFromRequest(req);
	record.productList = (
		await getProductsByListOfIdsRepo(
			record.productList.map((product) => product.productId),
			record.clientId
		)
	)
		.filter((product) => product?.status === STATUSES.ACTIVE)
		.map((product) => ({
			...product,
			qty: record.productList.find(
				(productFromRequest) =>
					product.productId == productFromRequest.productId
			).qty,
		}));
	if (record.productList.length === 0) {
		customLogger.warn({
			fileName: '/services/checkout_service.js',
			functionName: 'createCheckoutFromProductListService',
			context: 'if block true conditon',
			message: 'No Active products found while checkout',
		});
		throw new ApiException({
			message: 'No Active products found while checkout',
			responseCode:
				config.response_code
					.no_active_products_while_proceed_to_checkout,
		});
	}
	record.productList = await getDealForListOfProducts(
		record.productList,
		record.clientId
	);
	record = await buildCheckoutContext(record, getAuthTokenFromRequest(req));
	customLogger.info({
		fileName: '/services/checkout_service.js',
		functionName: 'createCheckoutFromProductListService',
		context: 'After Execution',
		message: 'Going to return with out error',
	});
	return checkoutRepo.createCheckoutRepo(record);
}

async function createCheckoutFromPreviosOrderService(req, _res) {
	customLogger.info({
		fileName: '/services/checkout_service.js',
		functionName: 'createCheckoutFromPreviosOrderService',
		context: 'Before Execution',
		message: 'create Checkout From Previos Order Service',
	});
	let record = getCheckoutFromOrderRequest(req);
	let productData = await getProductsByListOfIdsRepo(
		record.productList.map((product) => product.productId),
		record.clientId,
		STATUSES.ACTIVE
	);
	record.productList = await getDealForListOfProducts(
		productData.map((product) => ({
			...product,
			qty: record.productList.find(
				(item) => item.productId == product.productId
			).qty,
		}))
	);
	if (record.productList.length === 0) {
		customLogger.warn({
			fileName: '/services/checkout_service.js',
			functionName: 'createCheckoutFromPreviosOrderService',
			context: 'if block true condition',
			message: 'No Active products found while checkout',
		});
		throw new ApiException({
			message: 'No Active products found while checkout',
			responseCode:
				config.response_code
					.no_active_products_while_proceed_to_checkout,
		});
	}
	record = await buildCheckoutContext(record, getAuthTokenFromRequest(req));
	try {
		customLogger.info({
			fileName: '/services/checkout_service.js',
			functionName: 'createCheckoutFromPreviosOrderService',
			context: 'try block',
			message: 'going to return with out error',
		});
		return checkoutRepo
			.createCheckoutRepo(record)
			.then((result) => ({ ...result, isReorder: true }));
	} catch (error) {
		customLogger.warn({
			fileName: '/services/checkout_service.js',
			functionName: 'createCheckoutFromPreviosOrderService',
			context: 'catch block',
			message: error.message,
			code: error.code || error.status,
		});
		await destroyScheduler(record.schedulerJobId);
		throw error;
	}
}

async function deleteCheckoutByIdService(req, _res) {
	customLogger.info({
		fileName: '/services/checkout_service.js',
		functionName: 'deleteCheckoutByIdService',
		context: 'if block true condition',
		message: 'delete Checkout By Id Service',
	});
	let deleteResult = await checkoutRepo.deleteCheckoutByIdAndGetRepo(
		req.params.checkoutId,
		req.query.clientId
	);
	if (deleteResult !== null) {
		await destroyScheduler(deleteResult.schedulerJobId);
		return deleteResult;
	}
	return null;
}

async function addAddressAndScheduledDateService(req, _res) {
	let addressData = await getUserAddressByAddressId(
		req.body.buyerId,
		req.body.addressId,
		getAuthTokenFromRequest(req)
	);
	return checkoutRepo.addAddressAndScheduledDateRepo(
		req.body.checkoutId,
		req.query.clientId,
		req.body.buyerId,
		req.body.userId,
		{
			shippingAddress: addressData,
			scheduledDate: new Date(req.body.scheduledDate),
		}
	);
}

async function getProformaInvoiceService(req, res) {
	try {
		let receipt = await checkoutRepo.getCheckoutByIdRepo(
			req.params.checkoutId,
			req.query.clientId,
			req.query.buyerId,
			req.query.userId
		);
		let clientData = await getClientByClientId(
			req.query.clientId,
			getAuthTokenFromRequest(req)
		);
		const fileName = `INVOICE-${
			req.params.checkoutId
		}-${new Date().toISOString()}.pdf`;
		res.set({
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename=${fileName}`,
			'File-Name': `filename=${fileName}`,
		});
		res.end(
			await generateInvoiceDoc({
				receipt,
				clientData,
				invoiceId: receipt.checkoutId,
			})
		);
	} catch (error) {
		console.log(
			'===> ~ file: checkout_service.js ~ line 152 ~ getProformaInvoiceService ~ error',
			error
		);
		failedResponse(res, {
			message: error.message,
		});
	}
}

async function buildCheckoutContext(record, headers) {
	let qtyUpdateResult = await changeProductQtyAvailableRepo(
		record.clientId,
		record.productList.map((product) => ({
			productId: product.productId,
			qty: product.qty,
		})),
		ACTION.DECREASE
	);
	if (qtyUpdateResult == null) {
		throw new ApiException({
			message: 'Unable to decrease product qty while checkout',
			responseCode:
				config.response_code
					.Unable_to_decrease_product_qty_while_checkout,
		});
	}
	try {
		let moqAndQtyCheckResults = record.productList.map(
			checkMoqAndQtyOnProduct
		);
		if (
			moqAndQtyCheckResults.filter(
				(checkResult) => checkResult.isCheckFail
			).length > 0
		) {
			throw new ApiException({
				message: 'MOQ and Qty check failed while checkout',
				responseCode: config.response_code.cart_validation_fail,
				errorData: moqAndQtyCheckResults.filter(
					(checkResult) => checkResult.isCheckFail
				),
			});
		}
		if (record.productList.length <= 0) {
			throw new ApiException({
				message: 'No active products while proceed to checkout',
				responseCode: config.response_code.empty_results,
			});
		}
		let {
			productList,
			totalStateGST,
			totalCentralGST,
			totalAmountToPayBeforeTax,
			totalAmountToPayAfterTax,
		} = await getProductListWithCalculatedDealPriceAndTaxPrice(
			record.productList,
			record.clientId,
			headers
		);
		record.productList = productList;
		record.price = {
			totalStateGST,
			totalCentralGST,
			totalAmountToPayBeforeTax,
			totalAmountToPayAfterTax: (
				parseFloat(totalAmountToPayAfterTax) +
				parseFloat(record.deliveryCharge || DEFAULT_DELIVERYCHARGE)
			).toFixed(2),
			deliveryCharge: parseFloat(
				record.deliveryCharge || DEFAULT_DELIVERYCHARGE
			).toFixed(2),
		};
		record.shippingTo = await getUserDetailByUserId(
			record.buyerId,
			record.userId,
			headers
		);
		record.schedulerJobId = await createScheduler(
			CHECKOUT_SCHEDULER_MINUTE,
			new SchedulerJob({
				url: `${PRODUCT_SERVICE_GATEWAY}/${WITHOUTAUTH}/${UPDATEPRODUCTQTYONFAILEDCHECKOUT}`,
				method: HTTP_METHOD.PUT,
				headers: {
					'content-type': 'application/json',
				},
				params: {
					clientId: record.clientId,
					checkoutId: record.checkoutId,
				},
			})
		);
		// record.schedulerJobId = 'TEST_CHECKOUT';
		return record;
	} catch (error) {
		qtyUpdateResult = await changeProductQtyAvailableRepo(
			record.clientId,
			record.productList.map((product) => ({
				productId: product.productId,
				qty: product.qty,
			})),
			ACTION.INCREASE
		);
		if (qtyUpdateResult == null) {
			throw new ApiException({
				message: 'Unable to increase product qty while checkout',
				responseCode:
					config.response_code
						.Unable_to_decrease_product_qty_while_checkout,
			});
		}
		throw error;
	}
}

async function revertCheckoutService(req, _res) {
	let deleteResult = await checkoutRepo.deleteCheckoutByIdAndGetRepo(
		req.params.checkoutId,
		req.query.clientId
	);
	if (deleteResult !== null) {
		await destroyScheduler(deleteResult.schedulerJobId);
		changeProductQtyAvailableRepo(
			req.query.clientId,
			deleteResult.productList.map((product) => ({
				productId: product.productId,
				qty: product.qty,
			})),
			ACTION.INCREASE
		);
		return deleteResult;
	}
	return null;
}

module.exports = {
	getCheckoutByIdService,
	createCheckoutService,
	createCheckoutFromPreviosOrderService,
	createCheckoutFromWishlistService,
	deleteCheckoutByIdService,
	addAddressAndScheduledDateService,
	getProformaInvoiceService,
	createCheckoutFromProductListService,
	revertCheckoutService,
};
