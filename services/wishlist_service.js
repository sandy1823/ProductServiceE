const { customLogger } = require('../utils/logger');
var wishlistRepo = require('../repo/wishlist_repo');
const { getWishlistFromRequest } = require('./data_extract_service');
const {
	filterActiveAndInactiveProducts,
	getProductListWithCalculatedDealPriceAndStockDetail,
	getClient,
} = require('../services/helper_service');
const config = require('../config/app_config.json');
const {
	getAuthTokenFromRequest,
	getRandomId,
} = require('../utils/helper_tools');

async function getWishlistService(req, res) {
	customLogger.info({
		fileName: '/services/wishlist_service.js',
		functionName: 'getWishlistService',
		context: 'Before Execution',
		message: 'getting wishlist data',
	});
	let wishlistData = await wishlistRepo.getWishlistRepo(
		req.query.buyerId,
		req.query.userId,
		req.query.wishlistId
	);

	if (wishlistData.length == 0) {
		customLogger.info({
			fileName: 'services/wishlist_service',
			functionName: 'getWishlistService',
			context: 'if block true condition',
			message: 'Getting wishlistData length',
		});
		return null;
	} else if (wishlistData[0].productList.length == 0) {
		customLogger.warn({
			fileName: 'services/wishlist_service',
			functionName: 'getWishlistService',
			context: 'else block false consition',
			message: 'return wishlist data',
		});
		const clientDetails = await getClient(
			subWishlist.clientId,
			getAuthTokenFromRequest(req)
		);
		customLogger.info({
			fileName: 'services/wishlist_service',
			functionName: 'getWishlistService',
			context: 'After Execution',
			message: 'Going to return withOut errors',
		});
		return {
			...wishlistData[0],
			clientId: undefined,
			clientDetails,
		};
	} else {
		customLogger.warn({
			fileName: 'services/wishlist_service',
			functionName: 'getWishlistService',
			context: 'else block false condition',
			message: 'return wishlist data',
		});
		let { activeProducts, inactiveProducts } =
			filterActiveAndInactiveProducts(wishlistData[0].productList);
		if (activeProducts.length > 0) {
			customLogger.info({
				fileName: 'services/wishlist_service',
				functionName: 'getWishlistService',
				context: 'if block true condition',
				message: 'Getting active products',
			});
			activeProducts =
				await getProductListWithCalculatedDealPriceAndStockDetail(
					activeProducts
				);
		}
		if (inactiveProducts.length > 0) {
			res.locals.errors = inactiveProducts;
			res.locals.responseCode =
				config.response_code.get_product_from_cart_and_wishlist_with_removed_product;
			response.locals.responseCb = async () => {
				const wishlistProductsRemoveResult =
					await wishlistRepo.removeListOfProductsFromWishlistRepo(
						req.query.buyerId,
						req.query.userId,
						inactiveProducts.map((product) => product.productId)
					);
				customLogger.info({
					fileName: '/services/wishlist_service',
					functionName: 'responseCb',
					context: 'After Execution',
					message: `Getting wishlist removingproducts result ${wishlistProductsRemoveResult}\n`,
				});
			};
		}
		const clientDetails = await getClient(
			subWishlist.clientId,
			getAuthTokenFromRequest(req)
		);
		customLogger.info({
			fileName: '/services/wishlist_service',
			functionName: 'getWishlistService',
			context: 'After Execution',
			message: 'Going to return without errors',
		});
		return {
			...wishlistData[0],
			productList: activeProducts,
			clientId: undefined,
			clientDetails,
		};
	}
}

async function getAllWishlistsByUserIdService(req, res) {
	customLogger.info({
		fileName: '/services/wishlist_service',
		functionName: 'getAllWishlistsByUserIdService',
		context: 'Before Execution',
		message: 'Getting all wishlist by userid',
	});
	let wishlistData = await wishlistRepo.getAllWishlistsByUserIdRepo(
		req.query.buyerId,
		req.params.userId
	);
	if (wishlistData.length > 0) {
		customLogger.info({
			fileName: '/services/wishlist_service',
			functionName: 'getAllWishlistsByUserIdService',
			context: 'if block true condition',
			message: 'Getting wishlistData length',
		});
		let inactiveProductsToRemove = [];
		wishlistData = await Promise.all(
			wishlistData.map(async (wishlist) => {
				let { activeProducts, inactiveProducts } =
					filterActiveAndInactiveProducts(wishlist.productList);
				if (activeProducts.length > 0) {
					activeProducts =
						await getProductListWithCalculatedDealPriceAndStockDetail(
							activeProducts
						);
				}
				if (inactiveProducts.length > 0) {
					inactiveProductsToRemove.concat(inactiveProducts);
				}
				return {
					...wishlist,
					productList: activeProducts,
				};
			})
		);
		if (inactiveProductsToRemove.length > 0) {
			customLogger.info({
				fileName: '/services/wishlist_service',
				functionName: 'getAllWishlistsByUserIdService',
				context: 'if block true condition',
				message: 'checking in active products',
			});
			res.locals.errors = inactiveProductsToRemove;
			res.locals.responseCode =
				config.response_code.get_product_from_cart_and_wishlist_with_removed_product;
			response.locals.responseCb = async () => {
				const wishlistProductsRemoveResult =
					await wishlistRepo.removeListOfProductsFromWishlistRepo(
						req.query.buyerId,
						req.query.userId,
						req.query.wishlistId,
						inactiveProductsToRemove.map(
							(product) => product.productId
						)
					);
				customLogger.info({
					fileName: '/services/wishlist_service',
					functionName: 'responseCb',
					context: 'After Execution',
					message: `Getting wishlist products result ${wishlistProductsRemoveResult}\n`,
				});
			};
		}
		const clientDetailsList = await Promise.all(
			wishlistData.map((wishlist) =>
				getClient(wishlist.clientId, getAuthTokenFromRequest(req))
			)
		);
		customLogger.info({
			fileName: '/services/wishlist_service',
			functionName: 'getAllWishlistsByUserIdService',
			context: 'After Execution',
			message: 'Going to return without errors',
		});
		return wishlistData.map((wishlist) => ({
			...wishlist,
			clientDetails: clientDetailsList.find(
				(client) => client.clientId == wishlist.clientId
			),
			clientId: undefined,
		}));
	} else {
		customLogger.warn({
			fileName: 'services/wishlist_service',
			functionName: 'getAllWishlistsByUserIdService',
			context: 'else block false condition',
			message: 'return wishlist data',
		});
		return null;
	}
}

function removeWishlistProductService(req, _res) {
	customLogger.info({
		fileName: '/services/wishlist_service',
		functionName: 'removeWishlistProductService',
		context: 'Before Execution',
		message: 'removing wishlist by productid',
	});
	customLogger.info({
		fileName: '/services/wishlist_service',
		functionName: 'removeWishlistProductService',
		message: 'Going to return without errors',
		context: 'After Execution',
	});
	return wishlistRepo.removeWishlistProductRepo(
		req.query.wishlistId,
		req.query.buyerId,
		req.query.userId,
		req.query.productId
	);
}

function removeAllWishlistProductService(req, _res) {
	customLogger.info({
		fileName: '/services/wishlist_service',
		functionName: 'removeAllWishlistProductService',
		context: 'Before Execution',
		message: 'removing all wishlist product',
	});
	customLogger.info({
		fileName: '/services/wishlist_service',
		functionName: 'removeAllWishlistProductService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return wishlistRepo.removeAllProductWishlistRepo(
		req.query.userId,
		req.query.buyerId,
		req.query.wishlistId
	);
}

function removeAllWishlistByUserIdService(req, _res) {
	customLogger.info({
		fileName: '/services/wishlist_service',
		functionName: 'removeAllWishlistByUserIdService',
		context: 'Before Execution',
		message: 'remove all wishlist by userid',
	});
	customLogger.info({
		fileName: '/services/wishlist_service',
		functionName: 'removeAllWishlistByUserIdService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return wishlistRepo.removeAllWishlistByUserIdRepo(
		req.query.userId,
		req.query.buyerId,
		req.query.wishlistId,
		req.query.clientId
	);
}

async function getAllWishlistListNamesByUserIdService(req, _res) {
	customLogger.info({
		fileName: '/services/wishlist_service',
		functionName: 'getAllWishlistListNamesByUserIdService',
		context: 'Before Execution',
		message: 'remove all wishlist name by userid',
	});
	customLogger.info({
		fileName: '/services/wishlist_service',
		functionName: 'getAllWishlistListNamesByUserIdService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return wishlistRepo
		.getAllWishlistListNamesByUserIdRepo(
			req.query.userId,
			req.query.buyerId,
			req.query.clientId
		)
		.then((wishlistResults) =>
			wishlistResults?.length > 0 ? wishlistResults : null
		);
}

function createWishlistService(req, _res) {
	customLogger.info({
		fileName: '/services/wishlist_service',
		functionName: 'createWishlistService',
		context: 'Before Execution',
		message: 'Creating wishlist service',
	});
	customLogger.info({
		fileName: '/services/wishlist_service',
		functionName: 'createWishlistService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return wishlistRepo.createWishlistRepo(getWishlistFromRequest(req));
}

function updateWishlistService(req, _res) {
	customLogger.info({
		fileName: '/services/wishlist_service',
		functionName: 'updateWishlistService',
		context: 'Before Execution',
		message: 'Updating wishlist service',
	});
	customLogger.info({
		fileName: '/services/wishlist_service',
		functionName: 'updateWishlistService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return wishlistRepo.updateWishlistRepo(
		req.params.wishlistId,
		getWishlistFromRequest(req)
	);
}

function deleteWishlistService(req, _res) {
	customLogger.info({
		fileName: '/services/wishlist_service',
		functionName: 'deleteWishlistService',
		context: 'Before Execution',
		message: 'Deleting  wishlist service ',
	});
	customLogger.info({
		fileName: '/services/wishlist_service',
		functionName: 'deleteWishlistService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return wishlistRepo.deleteWishlistRepo(req.params.wishlistId);
}

function addToWishlistService(req, _res) {
	customLogger.info({
		fileName: '/services/wishlist_service',
		functionName: 'addToWishlistService',
		context: 'Before Execution',
		message: 'Adding to wishlist service',
	});
	customLogger.info({
		fileName: '/services/wishlist_service',
		functionName: 'addToWishlistService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return wishlistRepo.addToWishlistRepo(
		req.body.wishlistId,
		req.body.userId,
		req.body.buyerId,
		req.query.clientId,
		req.body.productId
	);
}

function createWishlistAndAddProductService(req, _res) {
	customLogger.info({
		fileName: '/services/wishlist_service',
		functionName: 'createWishlistAndAddProductService',
		context: 'Before Execution',
		message: 'Creating wishlist and add product',
	});
	customLogger.info({
		fileName: '/services/wishlist_service',
		functionName: 'createWishlistAndAddProductService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return wishlistRepo.createWishlistRepo({
		wishlistId: getRandomId('WISHLIST'),
		userId: req.body.userId,
		buyerId: req.body.buyerId,
		clientId: req.query.clientId,
		wishlistName: `${req.body.clientName}'s wishlist`,
		productList: [req.body.productId],
	});
}

module.exports = {
	getWishlistService,
	getAllWishlistsByUserIdService,
	addToWishlistService,
	createWishlistAndAddProductService,
	removeWishlistProductService,
	removeAllWishlistProductService,
	removeAllWishlistByUserIdService,
	getAllWishlistListNamesByUserIdService,
	createWishlistService,
	updateWishlistService,
	deleteWishlistService,
};
