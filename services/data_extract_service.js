const { DEFAULT_PRODUCT_PROPS } = require('../utils/constants');
const { getRandomId } = require('../utils/helper_tools');

function getAttributeFromRequest(req) {
	return {
		clientId: req.query.clientId,
		attrId: getRandomId('ATTR'),
		attrName: req.body.attrName,
		attrDesc: req.body.attrDesc,
		attrValue: req.body.attrValue,
		attrType: req.body.attrType,
		attrPattern: req.body.attrPattern,
		createdBy: req.body.createdBy,
	};
}

function getAttributeSetFromRequest(req, toInsert) {
	if (toInsert) {
		return {
			clientId: req.query.clientId,
			attrSetId: getRandomId('ATTRSET'),
			attrSetName: req.body.attrSetName,
			attributes: req.body.attributes,
			comments: req.body.comments,
			createdBy: req.body.createdBy,
		};
	} else {
		return {
			record: {
				attrSetId: req.body.attrSetId,
				attrSetName: req.body.attrSetName,
				attributes: req.body.attributes,
				comments: req.body.comments,
				createdBy: req.body.createdBy,
			},
			attrSetId: req.body.attrSetId,
			clientId: req.query.clientId,
			updatedBy: req.query.userId,
		};
	}
}

function getCartProductFromRequest(req) {
	return {
		clientId: req.query.clientId,
		userId: req.body.userId,
		buyerId: req.body.buyerId,
		product: req.body.product,
		cartId: req.body.cartId,
	};
}

function getCartProductsFromRequest(req) {
	return {
		clientId: req.query.clientId,
		userId: req.body.userId,
		buyerId: req.body.buyerId,
		products: new Set(req.body.products),
		cartId: req.body.cartId,
	};
}

function getCategoryFromRequest(req, toInsert) {
	if (toInsert) {
		return {
			clientId: req.query.clientId,
			categoryId: DEFAULT_PRODUCT_PROPS.categoryId || getRandomId('CAT'),
			categoryName: req.body.categoryName,
			categoryDesc: req.body.categoryDesc,
			isAnchor: req.body.isAnchor,
			parentCategoryId: req.body.parentCategoryId,
			attrSets: req.body.attrSets,
			createdBy: req.body.createdBy,
		};
	} else {
		return {
			record: {
				categoryName: req.body.categoryName,
				categoryDesc: req.body.categoryDesc,
				isAnchor: req.body.isAnchor,
				parentCategoryId: req.body.parentCategoryId,
				attrSets: req.body.attrSets,
				createdBy: req.body.createdBy,
			},
			clientId: req.query.clientId,
			categoryId: req.body.categoryId,
			updatedBy: req.query.userId,
		};
	}
}

function getCartCheckoutFromRequest(req) {
	return {
		clientId: req.query.clientId,
		checkoutId: getRandomId('INVOICE-'),
		buyerId: req.body.buyerId,
		userId: req.body.userId,
		cartId: req.body.cartId,
		deliveryCharge: req.body.deliveryCharge,
	};
}

function getWishlistCheckoutFromRequest(req) {
	return {
		checkoutId: getRandomId('INVOICE-'),
		buyerId: req.body.buyerId,
		userId: req.body.userId,
		wishlistId: req.body.wishlistId,
		deliveryCharge: req.body.deliveryCharge,
		clientId: req.query.clientId,
	};
}

function getCheckoutProductListFromRequest(req) {
	return {
		checkoutId: getRandomId('INVOICE-'),
		buyerId: req.body.buyerId,
		userId: req.body.userId,
		productList: req.body.productList,
		deliveryCharge: req.body.deliveryCharge,
		clientId: req.query.clientId,
	};
}

function getCheckoutFromOrderRequest(req) {
	return {
		clientId: req.query.clientId,
		checkoutId: getRandomId('INVOICE-'),
		buyerId: req.body.buyerId,
		userId: req.body.userId,
		productList: req.body.productList,
		deliveryCharge: req.body.deliveryCharge,
	};
}

function getWishlistFromRequest(req) {
	return {
		wishlistId: getRandomId('WISHLIST'),
		wishlistName: req.body.wishlistName,
		userId: req.body.userId,
		buyerId: req.body.buyerId,
		clientId: req.body.clientId,
		comments: req.body.comments,
	};
}

function getProductFromRequest(req, toInsert) {
	if (toInsert) {
		return {
			clientId: req.query.clientId,
			productId: req.body.productId.toString().toUpperCase(),
			productName: req.body.productName,
			productDesc: req.body.productDesc,
			categoryId: req.body.categoryId,
			price: parseFloat(req.body.price),
			priceCategory: req.body.priceCategory,
			productType: req.body.productType,
			taxClass: req.body.taxClass,
			supplier: req.body.supplier,
			leadTime: parseInt(req.body.leadTime),
			qtyAvailable: parseInt(req.body.qtyAvailable),
			attributes: Array.from(new Set(JSON.parse(req.body.attributes))),
			createdBy: req.body.createdBy,
			visibilityStatus: req.body.visibilityStatus,
			rating: req.body.rating,
			reviews: req.body.reviews,
			minimumAdvertisablePrice: req.body.minimumAdvertisablePrice,
			moq: parseInt(req.body.moq),
			newTag: {
				fromDate: req.body.newTagFromDate
					? new Date(req.body.newTagFromDate)
					: undefined,
				toDate: req.body.newTagToDate
					? new Date(req.body.newTagToDate)
					: undefined,
			},
		};
	} else {
		return {
			record: {
				productName: req.body.productName,
				productDesc: req.body.productDesc,
				categoryId: req.body.categoryId,
				price: parseFloat(req.body.price),
				priceCategory: req.body.priceCategory,
				productType: req.body.productType,
				taxClass: req.body.taxClass,
				supplier: req.body.supplier,
				leadTime: parseInt(req.body.leadTime),
				qtyAvailable: parseInt(req.body.qtyAvailable),
				attributes: Array.from(
					new Set(JSON.parse(req.body.attributes))
				),
				createdBy: req.body.createdBy,
				visibilityStatus: req.body.visibilityStatus,
				rating: req.body.rating,
				moq: parseInt(req.body.moq),
				reviews: req.body.reviews,
				images: JSON.parse(req.body.images),
				minimumAdvertisablePrice: req.body.minimumAdvertisablePrice,
				newTag: {
					fromDate: req.body.newTagFromDate
						? new Date(req.body.newTagFromDate)
						: undefined,
					toDate: req.body.newTagToDate
						? new Date(req.body.newTagToDate)
						: undefined,
				},
			},
			clientId: req.query.clientId,
			productId: req.body.productId,
			updatedBy: req.body.userId,
		};
	}
}

function getDealFromRequest(req, toInsert) {
	if (toInsert) {
		return {
			dealId: getRandomId('DEAL'),
			clientId: req.query.clientId,
			productList: Array.from(new Set(JSON.parse(req.body.productList))),
			dealType: req.body.dealType,
			title: req.body.title,
			description: req.body.description,
			fromDate: new Date(req.body.fromDate),
			toDate: new Date(req.body.toDate),
			createdBy: req.body.createdBy,
		};
	} else {
		return {
			record: {
				productList: Array.from(
					new Set(JSON.parse(req.body.productList))
				),
				dealType: req.body.dealType,
				title: req.body.title,
				description: req.body.description,
				fromDate: new Date(req.body.fromDate),
				toDate: new Date(req.body.toDate),
				createdBy: req.body.createdBy,
				images: JSON.parse(req.body.images),
			},
			dealId: req.body.dealId,
			clientId: req.query.clientId,
			updatedBy: req.query.userId,
		};
	}
}

function getDealDetailFromRequest(req, toInsert) {
	return toInsert
		? {
				clientId: req.query.clientId,
				name: req.body.name,
				dealDetailId: getRandomId('DEALTYPE'),
				value: req.body.value,
				valueType: req.body.valueType,
				description: req.body.description,
				createdBy: req.body.createdBy,
		  }
		: {
				record: {
					name: req.body.name,
					value: req.body.value,
					valueType: req.body.valueType,
					description: req.body.description,
					createdBy: req.body.createdBy,
				},
				clientId: req.query.clientId,
				dealDetailId: req.body.dealDetailId,
				updatedBy: req.query.userId,
		  };
}

module.exports = {
	getProductFromRequest,
	getAttributeFromRequest,
	getAttributeSetFromRequest,
	getCategoryFromRequest,
	getCartProductFromRequest,
	getCartProductsFromRequest,
	getWishlistFromRequest,
	getCartCheckoutFromRequest,
	getWishlistCheckoutFromRequest,
	getDealFromRequest,
	getDealDetailFromRequest,
	getCheckoutFromOrderRequest,
	getCheckoutProductListFromRequest,
};
