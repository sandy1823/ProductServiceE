var cartRepo = require('../repo/cart_repo');
const {
	getCartProductFromRequest,
	getCartProductsFromRequest,
} = require('./data_extract_service');
var config = require('../config/app_config.json');
const {
	checkMoqAndQtyOnProduct,
	getProductListWithCalculatedDealPriceAndStockDetail,
	filterActiveAndInactiveProducts,
	getProductStockDetail,
	getProductNewTagDetail,
	getClient,
} = require('./helper_service');
const {
	getProductByIdRepo,
	getProductsByListOfIdsRepo,
} = require('../repo/product_repo');
const { STATUSES } = require('../utils/constants');
const ApiException = require('../models/ApiException');
const { failedResponse, emptyArrayResponse } = require('./common_service');
const {
	getAuthTokenFromRequest,
	getRandomId,
} = require('../utils/helper_tools');
const { customLogger } = require('../utils/logger');

async function checkForCartClientService(req, res, next) {
	customLogger.info({
		fileName: '/services/cart_service.js',
		functionName: 'checkForCartClientService',
		context: 'Before Execution',
		message: 'check For Cart Client Service'
	});

	try {
		if (
			(await cartRepo.checkForCartClientRepo(
				req.body.cartId,
				req.body.userId,
				req.body.buyerId,
				req.query.clientId
			)) != null
		) {
			customLogger.info({
				fileName: '/services/cart_service.js',
				functionName: 'checkForCartClientService',
				context: 'if block true condition',
				message: 'check For Cart Client Service'
			});
			next();
		} else {
			customLogger.warn({
				fileName: '/services/cart_service.js',
				functionName: 'checkForCartClientService',
				context: 'else block flase condition',
				message: 'cart contains products from different client'
			});
			res.locals.responseCode =
				config.response_code.cart_contains_products_from_different_client;
			failedResponse(
				res,
				await cartRepo
					.getCartCurrentClient(
						req.body.cartId,
						req.body.userId,
						req.body.buyerId
					)
					.then((result) =>
						getClient(result.clientId, getAuthTokenFromRequest(req))
					)
			);
		}
	} catch (error) {
		customLogger.error({
			fileName: '/services/cart_service.js',
			functionName: 'checkForCartClientService',
			context: 'catch block',
			message: 'check For Cart Client Service  error'
		});
		console.log(
			'===> ~ file: cart_service.js ~ line 25 ~ checkForCartClientService ~ error',
			error
		);
		failedResponse(res, {
			message: error.message,
		});
	}
}

async function getCartIdByUserIdService(req, _res) {
	customLogger.info({
		fileName: '/services/cart_service.js',
		functionName: 'getCartIdByUserIdService',
		context: 'Before Execution',
		message: 'get Cart Id By UserId Service'
	});
	customLogger.info({
		fileName: '/services/cart_service.js',
		functionName: 'getCartIdByUserIdService',
		context: 'After Execution',
		message: 'going to return with out error'
	});
	return cartRepo.checkAndCreateCartRepo(
		req.query.buyerId,
		req.params.userId,
		getRandomId('CART')
	);
}

async function getCartService(req, res) {
	customLogger.info({
		fileName: '/services/cart_service.js',
		functionName: 'getCartService',
		context: 'Before Execution',
		message: 'getting cart'
	});
	let cartData = await cartRepo.getcartRepo(
		req.query.userId,
		req.query.buyerId,
		req.query.cartId
	);
	if (cartData.length > 0) {
		customLogger.info({
			fileName: '/services/cart_service.js',
			functionName: 'getCartService',
			context: 'if block true condition',
			message: 'getting cartData'
		});
		if (cartData[0].productList.length > 0) {
			cartData[0].productList = cartData[0].productList
				.map((product) => ({
					...cartData[0].productData.find(
						(productData) =>
							product.productId === productData.productId
					),
					...product,
				}))
				.map((product) => ({
					...product,
					...getProductStockDetail(product),
					...getProductNewTagDetail(product),
				}));
			let { activeProducts, inactiveProducts } =
				filterActiveAndInactiveProducts(cartData[0].productList);
			if (inactiveProducts.length > 0) {
				customLogger.info({
					fileName: '/services/cart_service.js',
					functionName: 'getCartService',
					context: 'if block true condition',
					message: 'getting inactive Products'
				});
				await cartRepo.removeListOfProductsFromCartRepo(
					req.query.userId,
					req.query.buyerId,
					cartData[0].cartId,
					inactiveProducts.map((product) => product.productId)
				);
			}
			let moqAndQtyCheckResults = activeProducts.map(
				checkMoqAndQtyOnProduct
			);
			if (
				moqAndQtyCheckResults.filter(
					(checkResult) => checkResult.isCheckFail
				).length > 0
			) {
				customLogger.info({
					fileName: '/services/cart_service.js',
					functionName: 'getCartService',
					context: 'if block true condition',
					message: 'get_product_from_cart_and_wishlist_with_removed_product'
				});
				res.locals.responseCode =
					config.response_code.get_product_from_cart_and_wishlist_with_removed_product;
				res.locals.errors = moqAndQtyCheckResults
					.filter((checkResult) => checkResult.isCheckFail)
					.map((result) => result.product);
			}
			if (activeProducts.length > 0) {
				customLogger.info({
					fileName: '/services/cart_service.js',
					functionName: 'getCartService',
					context: 'if block true condition',
					message: 'activeProducts'
				});
				let { productList, totalAmountToPay } =
					await getProductListWithCalculatedDealPriceAndStockDetail(
						activeProducts,
						cartData[0].clientId
					);

					customLogger.info({
						fileName: '/services/cart_service.js',
						functionName: 'getCartService',
						context: 'if block true condition',
						message: 'going to return with out error'
					});
				return {
					...cartData[0],
					productList,
					totalAmountToPay,
					clientDetails: await getClient(
						cartData[0].clientId,
						getAuthTokenFromRequest(req)
					),
				};
			} else {
				customLogger.info({
					fileName: '/services/cart_service.js',
					functionName: 'getCartService',
					context: 'else  block false condition',
					message: 'return cart data'
				});
				return {
					data: cartData[0],
					// clientDetails: await getClient(
					// 	cartData[0].clientId,
					// 	getAuthTokenFromRequest(req)
					// ),
				};
			}
		} else {
			customLogger.info({
				fileName: '/services/cart_service.js',
				functionName: 'getCartService',
				context: 'else  block false condition',
				message: 'return cart data'
			});
			return {
				data: cartData[0],
				// clientDetails: await getClient(
				// 	cartData[0].clientId,
				// 	getAuthTokenFromRequest(req)
				// ),
			};
		}
	} else {
		customLogger.info({
			fileName: '/services/cart_service.js',
			functionName: 'getCartService',
			context: 'else  block false condition',
			message: 'return null'
		});
		return null;
	}
}

function removeCartProductService(req, _res) {
	customLogger.info({
		fileName: '/services/cart_service.js',
		functionName: 'removeCartProductService',
		context: 'Before Execution',
		message: 'remove Cart Product Service'
	});
	customLogger.info({
		fileName: '/services/cart_service.js',
		functionName: 'removeCartProductService',
		context: 'After Execution',
		message: 'going to return with out error'
	});
	return cartRepo.removeCartProductRepo(
		req.query.userId,
		req.query.buyerId,
		req.query.cartId,
		req.query.productId
	);
}

async function addToCartService(req, _res) {
	customLogger.info({
		fileName: '/services/cart_service.js',
		functionName: 'addToCartService',
		context: 'Before Execution',
		message: 'add To Cart Service'
	});

	let product = await getProductByIdRepo(
		req.body.product.productId,
		req.query.clientId
	);
	let cartProductCheckResult = checkMoqAndQtyOnProduct({
		...product,
		...req.body.product,
	});
	if (
		cartProductCheckResult.isCheckFail ||
		!getProductStockDetail(product).inStock
	) {
		customLogger.warn({
			fileName: '/services/cart_service.js',
			functionName: 'addToCartService',
			context: 'if block true condition',
			message: 'Cart product check failed'
		});
		throw new ApiException({
			message: 'Cart product check failed',
			responseCode: config.response_code.cart_validation_fail,
			errorData: cartProductCheckResult?.error || 'OUT OF STOCK',
		});
	}
	customLogger.info({
		fileName: '/services/cart_service.js',
		functionName: 'addToCartService',
		context: 'After Execution',
		message: 'going to return with out error'
	});
	return cartRepo.addToCartRepo(
		getCartProductFromRequest(req),
		req.query.isPDP == 'true'
	);
}

function removeAllCartProductService(req, _res) {
	customLogger.info({
		fileName: '/services/cart_service.js',
		functionName: 'removeAllCartProductService',
		context: 'Before Execution',
		message: 'remove All Cart Product Service'
	});
	customLogger.info({
		fileName: '/services/cart_service.js',
		functionName: 'removeAllCartProductService',
		context: 'Before Execution',
		message: 'going to return with out error'
	});
	return cartRepo.removeAllCartProductsRepo(
		req.query.userId,
		req.query.buyerId,
		req.query.cartId
	);
}

async function updateCartProductsService(_req, res) {
	customLogger.info({
		fileName: '/services/cart_service.js',
		functionName: 'updateCartProductsService',
		context: 'Before Execution',
		message: 'update Cart Products Service'
	});
	
	if (res.locals.failedProducts != null) {
		customLogger.info({
			fileName: '/services/cart_service.js',
			functionName: 'updateCartProductsService',
			context: 'if block true condition',
			message: 'cart_validation_partially_fail'
		});
		res.locals.responseCode =
			config.response_code.cart_validation_partially_fail;
		res.locals.errors = res.locals.failedProducts;
	} else if (res.locals.cartData.products.length > 0) {
		let updateResult = await cartRepo.updateCartProductsRepo(
			res.locals.cartData
		);
		customLogger.info({
			fileName: '/services/cart_service.js',
			functionName: 'updateCartProductsService',
			context: 'else block true condition',
			message: 'going to return with out error'
		});
		return updateResult.nModified > 0 ? updateResult.nModified : null;
	}
	customLogger.info({
		fileName: '/services/cart_service.js',
		functionName: 'updateCartProductsService',
		context: 'After execution',
		message: 'return null'
	});
	return null;
}

function removeCartProductsService(req, _res) {
	customLogger.info({
		fileName: '/services/cart_service.js',
		functionName: 'removeCartProductsService',
		context: 'Before Execution',
		message: 'remove Cart Products Service'
	});
	customLogger.info({
		fileName: '/services/cart_service.js',
		functionName: 'removeCartProductsService',
		context: 'After Execution',
		message: 'going to return with out error'
	});
	return cartRepo.removeListOfProductsFromCartRepo(
		req.query.userId,
		req.query.buyerId,
		req.query.cartId,
		req.body.products
	);
}

async function validateListOfCartProductsService(req, res, next) {
	customLogger.info({
		fileName: '/services/cart_service.js',
		functionName: 'validateListOfCartProductsService',
		context: 'Before Execution',
		message: 'validate List Of Cart Products Service'
	});
	
	try {

		if (req.body.products.length <= 0) {
			console.log("if if if");
			customLogger.warn({
				fileName: '/services/cart_service.js',
				functionName: 'removeCartProductsService',
				context: 'if block true condition',
				message: 'No Products found while updating cart'
			});
			throw new ApiException({
				message: `No Products found while updating cart`,
				responseCode: config.response_code.success,
			});
		} else {
			customLogger.info({
				fileName: '/services/cart_service.js',
				functionName: 'removeCartProductsService',
				context: 'else block true condition',
				message: 'get the poducts'
			});
			let productDataList = await getProductsByListOfIdsRepo(
				req.body.products.map((product) => product.productId),
				req.query.clientId,
				STATUSES.ACTIVE
			);
			if (productDataList == null) {
				customLogger.warn({
					fileName: '/services/cart_service.js',
					functionName: 'removeCartProductsService',
					context: 'if block true condition',
					message: 'No Products found while updating cart'
				});
				throw new ApiException({
					message: `No Products found while updating cart`,
					responseCode: config.response_code.success,
				});
			}
			let successProducts = [];
			let errors = [];
			productDataList = productDataList.map((product) => ({
				...product,
				...getProductStockDetail(product),
			}));
			productDataList.forEach((product, index) => {
				if (!product.inStock) {
					productDataList.splice(index, 1);
					errors.push({ product, message: 'OUT OF STOCK' });
				}
			});
			let cartProductCheckResults = productDataList.map((product) => {
				return checkMoqAndQtyOnProduct({
					...product,
					...req.body.products.find(
						(productData) =>
							productData.productId === product.productId
					),
				});
			});
			for (let result of cartProductCheckResults) {
				if (result.isCheckFail) {
					errors.push({
						...result.error,
						product: productDataList.find(
							(product) =>
								product.productId === result.error.productId
						),
					});
				} else {
					successProducts.push(
						req.body.products.find(
							(product) =>
								product.productId === result.product.productId
						)
					);
				}
			}
			res.locals.failedProducts =
				errors.length > 0
					? errors.reduce((uniqueList, item) => {
						if (
							!uniqueList.some(
								(product) =>
									product.productId === item.productId
							)
						) {
							uniqueList.push(item);
						}
						return uniqueList;
					}, [])
					: null;
			res.locals.cartData = {
				...getCartProductsFromRequest(req),
				products: successProducts,
			};
			next();
		}
	} catch (error) {
		console.log(error,"catch");
		customLogger.error({
			fileName: '/services/cart_service.js',
			functionName: 'removeCartProductsService',
			context: 'catch block',
			message: error.message,
			code: error.code || error.status,
		});
		console.log(
			'===> ~ file: cart_service.js ~ line 221 ~ validateListOfCartProductsService ~ error',
			error
		);
		if (!error.responseCode) {
			failedResponse(res, {
				message: error.message,
			});
		}
		emptyArrayResponse(res,{
			message: error.message,
		})
		// throw error;
	}
}

async function clearAndAddCartProduct(req, _res) {
	customLogger.info({
		fileName: '/services/cart_service.js',
		functionName: 'clearAndAddCartProduct',
		context: 'Before Execution',
		message: 'clear and add cart product'
	});
	customLogger.info({
		fileName: '/services/cart_service.js',
		functionName: 'clearAndAddCartProduct',
		context: 'After Execution',
		message: 'going to return with out error'
	});
	return cartRepo
		.removeAllCartProductsRepo(
			req.body.userId,
			req.body.buyerId,
			req.body.cartId
		)
		.then((cartRemoveResult) =>
			cartRemoveResult > 0
				? cartRepo.addToCartRepo(getCartProductFromRequest(req), false)
				: null
		);
}

module.exports = {
	checkForCartClientService,
	addToCartService,
	getCartService,
	removeCartProductService,
	removeAllCartProductService,
	validateListOfCartProductsService,
	updateCartProductsService,
	removeCartProductsService,
	clearAndAddCartProduct,
	getCartIdByUserIdService,
};
