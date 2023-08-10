const { customLogger } = require('../utils/logger');
const { getProductPropValueRepo } = require('./product_repo');
var Cart = require('./schemas/cart_schema');

function checkForCartClientRepo(cartId, userId, buyerId, clientId) {
	customLogger.info({
		fileName: '/repo/cart_repo',
		functionName: 'checkForCartClientRepo',
		context: 'Before Execution',
		message: 'check cart ',
	});
	customLogger.info({
		fileName: '/repo/cart_repo',
		functionName: 'checkForCartClientRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Cart.exists({
		cartId,
		userId,
		buyerId,
		$or: [
			{
				$and: [
					{ clientId: null },
					{
						productList: {
							$exists: true,
							$size: 0,
						},
					},
				],
			},
			{
				$and: [
					{ clientId },
					{
						productList: {
							$exists: true,
							$not: { $size: 0 },
						},
					},
				],
			},
		],
	}).exec();
}

function getCartCurrentClient(cartId, userId, buyerId) {
	customLogger.info({
		fileName: '/repo/cart_repo',
		functionName: 'getCartCurrentClient',
		context: 'Before Execution',
		message: 'getting all cartcurrent ',
	});
	customLogger.info({
		fileName: '/repo/cart_repo',
		functionName: 'getCartCurrentClient',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Cart.findOne(
		{
			cartId,
			userId,
			buyerId,
		},
		{ clientId: 1 }
	);
}

function getcartRepo(userId, buyerId, cartId) {
	customLogger.info({
		fileName: '/repo/cart_repo',
		functionName: 'getcartRepo',
		context: 'Before Execution',
		message: 'getting all cart ',
	});
	customLogger.info({
		fileName: '/repo/cart_repo',
		functionName: 'getcartRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Cart.aggregate([
		{
			$match: {
				userId,
				buyerId,
				cartId,
			},
		},
		{
			$lookup: {
				localField: 'productList.productId',
				from: 'products',
				foreignField: 'productId',
				as: 'productData',
			},
		},
		{
			$addFields: {
				productData: {
					$filter: {
						input: '$productData',
						cond: { $eq: ['$$this.clientId', '$clientId'] },
					},
				},
			},
		},
		{
			$project: {
				_id: 0,
				__v: 0,
				'productData._id': 0,
				'productData.__v': 0,
			},
		},
		// {
		// 	$project: {
		// 		productList: {
		// 			$map: {
		// 				input: '$productList',
		// 				as: 'e',
		// 				$in: {
		// 					$mergeObjects: [
		// 						'$$e',
		// 						{
		// 							$arrayElemAt: [
		// 								{
		// 									$filter: {
		// 										input: '$productData',
		// 										as: 'f',
		// 										cond: {
		// 											$eq: [
		// 												'$$e.productId',
		// 												'$$f.productId',
		// 											],
		// 										},
		// 									},
		// 								},
		// 								0,
		// 							],
		// 						},
		// 					],
		// 				},
		// 			},
		// 		},
		// 	},
		// },
	]).exec();
}

async function removeListOfProductsFromCartRepo(
	userId,
	buyerId,
	cartId,
	productIds
) {
	customLogger.info({
		fileName: '/repo/cart_repo',
		functionName: 'removeListOfProductsFromCartRepo',
		context: 'Before Execution',
		message: 'remove products from cart ',
	});
	customLogger.info({
		fileName: '/repo/cart_repo',
		functionName: 'removeListOfProductsFromCartRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Cart.findOneAndUpdate(
		{ userId, buyerId, cartId },
		{
			$pull: {
				productList: {
					productId: {
						$in: productIds,
					},
				},
			},
		},
		{ upsert: false, new: true }
	)
		.exec()
		.then((removeResult) =>
			removeResult && removeResult?.productList?.length === 0
				? Cart.updateOne(
						{
							userId,
							buyerId,
							cartId,
						},
						{
							$set: {
								clientId: null,
							},
						}
				  )
						.exec()
						.then(
							(clientUpdateResult) =>
								clientUpdateResult.modifiedCount
						)
				: 1
		);
}

async function removeCartProductRepo(userId, buyerId, cartId, productId) {
	customLogger.info({
		fileName: '/repo/cart_repo',
		functionName: 'removeCartProductRepo',
		context: 'Before Execution',
		message: 'remove cart  products',
	});
	customLogger.info({
		fileName: '/repo/cart_repo',
		functionName: 'removeCartProductRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Cart.findOneAndUpdate(
		{
			userId,
			buyerId,
			cartId,
		},
		{
			$pull: {
				productList: {
					productId: productId,
				},
			},
		},
		{
			upsert: false,
			new: true,
			projection: {
				_id: 0,
				__v: 0,
			},
		}
	)
		.exec()
		.then((productRemoveResult) =>
			productRemoveResult &&
			productRemoveResult?.productList?.length === 0
				? Cart.updateOne(
						{
							userId,
							buyerId,
							cartId,
						},
						{
							$set: {
								clientId: null,
							},
						}
				  )
						.exec()
						.then(
							(clientUpdateResult) =>
								clientUpdateResult.modifiedCount
						)
				: 1
		);
}

async function removeAllCartProductsRepo(userId, buyerId, cartId) {
	customLogger.info({
		fileName: '/repo/cart_repo',
		functionName: 'removeAllCartProductsRepo',
		context: 'Before Execution',
		message: 'remove all cart  products',
	});
	customLogger.info({
		fileName: '/repo/cart_repo',
		functionName: 'removeAllCartProductsRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Cart.updateOne(
		{
			userId,
			buyerId,
			cartId,
		},
		{
			$set: {
				productList: [],
				clientId: null,
			},
		},
		{ upsert: false }
	)
		.exec()
		.then((result) => result.modifiedCount);
}

async function addToCartRepo(record, isPDP) {
	customLogger.info({
		fileName: '/repo/cart_repo',
		functionName: 'addToCartRepo',
		context: 'Before Execution',
		message: 'add cart ',
	});
	customLogger.info({
		fileName: '/repo/cart_repo',
		functionName: 'addToCartRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	let dataToAddCond = isPDP
		? {
				$set: {
					'productList.$.qty': record.product.qty,
				},
		  }
		: {
				$inc: {
					'productList.$.qty': 1,
				},
		  };
	return (await Cart.exists({
		clientId: record.clientId,
		cartId: record.cartId,
		userId: record.userId,
		buyerId: record.buyerId,
		productList: {
			$elemMatch: {
				productId: record.product.productId,
			},
		},
	})) != null
		? Cart.findOneAndUpdate(
				{
					clientId: record.clientId,
					cartId: record.cartId,
					userId: record.userId,
					buyerId: record.buyerId,
					productList: {
						$elemMatch: {
							productId: record.product.productId,
						},
					},
				},
				dataToAddCond,
				{
					upsert: false,
					new: true,
					projection: {
						_id: 0,
						__v: 0,
					},
				}
		  )
		: Cart.findOneAndUpdate(
				{
					cartId: record.cartId,
					userId: record.userId,
					buyerId: record.buyerId,
				},
				{
					$addToSet: {
						productList: isPDP
							? record.product
							: {
									productId: record.product.productId,
									qty: (
										await getProductPropValueRepo(
											record.clientId,
											record.product.productId,
											`moq`
										)
									).moq,
							  },
					},
					$set: {
						clientId: record.clientId,
					},
				},
				{
					upsert: false,
					new: true,
					projection: {
						_id: 0,
						__v: 0,
					},
				}
		  );
}

function updateCartProductsRepo(record) {
	customLogger.info({
		fileName: '/repo/cart_repo',
		functionName: 'updateCartProductsRepo',
		message: 'Update cart products ',
		context: 'Before Execution',
	});
	customLogger.info({
		fileName: '/repo/cart_repo',
		functionName: 'updateCartProductsRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Cart.bulkWrite(
		record.products.map((product) => ({
			updateOne: {
				filter: {
					clientId: record.clientId,
					cartId: record.cartId,
					userId: record.userId,
					buyerId: record.buyerId,
					productList: {
						$elemMatch: {
							productId: product.productId,
						},
					},
				},
				update: {
					$set: {
						'productList.$.qty': product.qty,
					},
				},
				upsert: false,
			},
		}))
	);
}

async function getCartProductsRepo(cartId, userId, buyerId, clientId) {
	customLogger.info({
		fileName: '/repo/cart_repo',
		functionName: 'getCartProductsRepo',
		message: 'getting cart products ',
		context: 'Before Execution',
	});
	customLogger.info({
		fileName: '/repo/cart_repo',
		functionName: 'getCartProductsRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	let cartProductsData = await Cart.aggregate([
		{
			$match: {
				clientId,
				userId,
				buyerId,
				cartId,
			},
		},
		{
			$lookup: {
				localField: 'productList.productId',
				from: 'products',
				foreignField: 'productId',
				as: 'productData',
			},
		},
		{
			$addFields: {
				productData: {
					$filter: {
						input: '$productData',
						cond: { $eq: ['$$this.clientId', '$clientId'] },
					},
				},
			},
		},
		{
			$project: {
				_id: 0,
				productList: 1,
				productData: 1,
			},
		},
	]).exec();
	if (cartProductsData[0]?.productList?.length > 0) {
		return cartProductsData[0].productList.map((product) => ({
			...cartProductsData[0].productData.find(
				(productData) => product.productId === productData.productId
			),
			...product,
		}));
	} else {
		return [];
	}
}

async function checkAndCreateCartRepo(buyerId, userId, cartId) {
	customLogger.info({
		fileName: '/repo/cart_repo',
		functionName: 'checkAndCreateCartRepo',
		context: 'Before Execution',
		message: 'check and create cart ',
	});
	customLogger.info({
		fileName: '/repo/cart_repo',
		functionName: 'checkAndCreateCartRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return (await Cart.exists({
		buyerId,
		userId,
	})) != null
		? Cart.findOne(
				{
					buyerId,
					userId,
				},
				{ cartId: 1, _id: 0 }
		  )
				.lean()
				.exec()
		: Cart.create({
				buyerId,
				userId,
				cartId,
				productList: [],
		  }).then((result) => ({ cartId: result.cartId }));
}
module.exports = {
	checkForCartClientRepo,
	getCartCurrentClient,
	checkAndCreateCartRepo,
	addToCartRepo,
	getcartRepo,
	removeCartProductRepo,
	updateCartProductsRepo,
	getCartProductsRepo,
	removeAllCartProductsRepo,
	removeListOfProductsFromCartRepo,
};
