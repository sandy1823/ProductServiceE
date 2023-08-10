const { customLogger } = require('../utils/logger');
var Wishlist = require('./schemas/wishlist_schema');

function getWishlistRepo(buyerId, userId, wishlistId) {
	customLogger.info({
		fileName: '/repo/wishlist_repo.js',
		functionName: 'getWishlistRepo',
		context: 'Before Execution',
		message: 'Getting wishlist',
	});
	customLogger.info({
		fileName: '/repo/wishlist_repo.js',
		functionName: 'getWishlistRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Wishlist.aggregate([
		{
			$match: {
				buyerId,
				userId,
				wishlistId,
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
			$project: {
				_id: 0,
				__v: 0,
				'productList._id': 0,
				'productList.__V': 0,
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
	]).exec();
}

function getAllWishlistsByUserIdRepo(buyerId, userId) {
	customLogger.info({
		fileName: '/repo/wishlist_repo.js',
		functionName: 'getAllWishlistsByUserIdRepo',
		context: 'Before Execution',
		message: 'Getting all wishlist',
	});
	customLogger.info({
		fileName: '/repo/wishlist_repo.js',
		functionName: 'getAllWishlistsByUserIdRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Wishlist.aggregate([
		{
			$match: {
				buyerId,
				userId,
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
			$project: {
				_id: 0,
				__v: 0,
				'productList._id': 0,
				'productList.__V': 0,
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
	]).exec();
}

function getAllWishlistListNamesByUserIdRepo(userId, buyerId, clientId) {
	customLogger.info({
		fileName: '/repo/wishlist_repo.js',
		functionName: 'getAllWishlistListNamesByUserIdRepo',
		context: 'Before Execution',
		message: 'Getting all wishlist names',
	});
	customLogger.info({
		fileName: '/repo/wishlist_repo.js',
		functionName: 'getAllWishlistListNamesByUserIdRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Wishlist.find(
		{
			userId,
			buyerId,
			clientId,
		},
		{ _id: 0, wishlistId: 1, wishlistName: 1 }
	)
		.lean()
		.exec();
}

function removeListOfProductsFromWishlistRepo(buyerId, userId, productIds) {
	customLogger.info({
		fileName: '/repo/wishlist_repo',
		functionName: 'removeListOfProductsFromWishlistRepo',
		context: 'Before Execution',
		message: 'Remove list of products from wishlist',
	});
	customLogger.info({
		fileName: '/repo/wishlist_repo',
		functionName: 'removeListOfProductsFromWishlistRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});

	return Wishlist.updateOne(
		{
			buyerId,
			userId,
		},
		{
			$pull: {
				productList: {
					$in: productIds,
				},
			},
		}
	).exec();
}

async function removeWishlistProductRepo(
	wishlistId,
	buyerId,
	userId,
	productId
) {
	customLogger.info({
		fileName: '/repo/wishlist_repo',
		functionName: 'removeWishlistProductRepo',
		context: 'Before Execution',
		message: 'Remove list product',
	});
	customLogger.info({
		fileName: '/repo/wishlist_repo',
		functionName: 'removeWishlistProductRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Wishlist.updateOne(
		{
			buyerId,
			userId,
			wishlistId,
		},
		{
			$pull: {
				productList: productId,
			},
		},
		{ upsert: false }
	)
		.exec()
		.then((result) => result.modifiedCount);
}

async function removeAllProductWishlistRepo(userId, buyerId, wishlistId) {
	customLogger.info({
		fileName: '/repo/wishlist_repo',
		functionName: 'removeAllProductWishlistRepo',
		context: 'Before Execution',
		message: 'Remove all product wishlist',
	});
	customLogger.info({
		fileName: '/repo/wishlist_repo',
		functionName: 'removeAllProductWishlistRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Wishlist.updateOne(
		{
			buyerId,
			userId,
			wishlistId,
		},
		{
			$set: {
				productList: [],
			},
		},
		{ upsert: false }
	)
		.exec()
		.then((result) => result.modifiedCount);
}

async function addToWishlistRepo(
	wishlistId,
	userId,
	buyerId,
	clientId,
	productId
) {
	customLogger.info({
		fileName: '/repo/wishlist_repo',
		functionName: 'addToWishlistRepo',
		context: 'Before Execution',
		message: 'add product to wishlist',
	});
	customLogger.info({
		fileName: '/repo/wishlist_repo',
		functionName: 'addToWishlistRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Wishlist.findOneAndUpdate(
		{
			clientId,
			buyerId,
			userId,
			wishlistId,
		},
		{
			$addToSet: {
				productList: productId,
			},
		},
		{
			upsert: false,
		}
	);
}

async function removeAllWishlistByUserIdRepo(userId, buyerId) {
	customLogger.info({
		fileName: '/repo/wishlist_repo',
		functionName: 'removeAllWishlistByUserIdRepo',
		context: 'Before Execution',
		message: 'Remove all wishlist by user Id',
	});
	customLogger.info({
		fileName: '/repo/wishlist_repo',
		functionName: 'removeAllWishlistByUserIdRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Wishlist.deleteMany({
		buyerId,
		userId,
	})
		.exec()
		.then((result) => result.modifiedCount);
}

function createWishlistRepo(record) {
	customLogger.info({
		fileName: '/repo/wishlist_repo',
		functionName: 'createWishlistRepo',
		context: 'Before Execution',
		message: 'Create wishlist',
	});
	customLogger.info({
		fileName: '/repo/wishlist_repo',
		functionName: 'createWishlistRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Wishlist.create(record);
}

function updateWishlistRepo(wishlistId, record) {
	customLogger.info({
		fileName: '/repo/wishlist_repo',
		functionName: 'updateWishlistRepo',
		context: 'Before Execution',
		message: 'update wishlist',
	});
	customLogger.info({
		fileName: '/repo/wishlist_repo',
		functionName: 'updateWishlistRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Wishlist.updateOne(
		{ wishlistId },
		{ $set: record },
		{ upsert: false }
	);
}

function deleteWishlistRepo(wishlistId) {
	customLogger.info({
		fileName: '/repo/wishlist_repo',
		functionName: 'deleteWishlistRepo',
		context: 'Before Execution',
		message: 'Deleting wishlist',
	});
	customLogger.info({
		fileName: '/repo/wishlist_repo',
		functionName: 'deleteWishlistRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Wishlist.deleteOne({ wishlistId });
}

async function getWishlistProductsRepo(wishlistId, userId, buyerId, clientId) {
	customLogger.info({
		fileName: '/repo/wishlist_repo',
		functionName: 'getWishlistProductsRepo',
		context: 'Before Execution',
		message: 'Getting wishlist products',
	});
	customLogger.info({
		fileName: '/repo/wishlist_repo',
		functionName: 'getWishlistProductsRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Wishlist.aggregate([
		{
			$match: {
				buyerId,
				userId,
				wishlistId,
				clientId,
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
			$project: {
				_id: 0,
				__v: 0,
				'productList._id': 0,
				'productList.__V': 0,
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
	])
		.exec()
		.then((wishlistResult) =>
			wishlistResult[0]?.productList ? wishlistResult[0].productList : []
		);
}

module.exports = {
	getWishlistRepo,
	getAllWishlistsByUserIdRepo,
	getAllWishlistListNamesByUserIdRepo,
	addToWishlistRepo,
	removeWishlistProductRepo,
	removeAllProductWishlistRepo,
	removeListOfProductsFromWishlistRepo,
	removeAllWishlistByUserIdRepo,
	createWishlistRepo,
	updateWishlistRepo,
	deleteWishlistRepo,
	getWishlistProductsRepo,
};
