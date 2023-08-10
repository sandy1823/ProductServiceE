var Product = require('./schemas/product_schema');
var { getDealForListOfProducts } = require('../services/helper_service');
const { STATUSES } = require('../utils/constants');
const ApiException = require('../models/ApiException');
const config = require('../config/app_config.json');
const { customLogger } = require('../utils/logger');

const getAttributeFormProduct = (productList) =>
	productList != null && productList.length > 0
		? productList.map((product) => ({
				...product,
				attributes: product.attributes.map((attribute) => ({
					...attribute,
					attributes: attribute.attributes.map((attributeData) => ({
						...attributeData,
						...product.attributesData.find(
							(attributeValue) =>
								attributeValue.attrId == attributeData.attrId
						),
					})),
				})),
		  }))
		: productList;

async function getAllProductsRepo(clientId, status) {
	customLogger.info({
		fileName: '/repo/product_repo.js',
		functionName: 'getAllProductsRepo',
		context: 'Before Execution',
		message: `Get all products`,
	});
	switch (status) {
		case STATUSES.ACTIVE:
			customLogger.info({
				fileName: '/repo/product_repo.js',
				functionName: 'getAllProductsRepo',
				context: 'After Execution',
				message: `Going to return without errors`,
			});
			return Product.aggregate([
				{
					$match: {
						clientId: clientId,
						status: STATUSES.ACTIVE,
					},
				},
				{
					$lookup: {
						localField: 'categoryId',
						from: 'categories',
						foreignField: 'categoryId',
						as: 'category',
					},
				},
				{
					$sort: {
						createdAt: -1,
					},
				},
				{
					$addFields: {
						category: {
							$filter: {
								input: '$category',
								cond: { $eq: ['$$this.clientId', '$clientId'] },
							},
						},
					},
				},
				{
					$addFields: {
						category: {
							$arrayElemAt: ['$category', 0],
						},
					},
				},
				{
					$lookup: {
						localField: 'attributes.attributes.attrId',
						from: 'attributes',
						foreignField: 'attrId',
						as: 'attributesData',
					},
				},
				{
					$addFields: {
						attributesData: {
							$filter: {
								input: '$attributesData',
								cond: { $eq: ['$$this.clientId', '$clientId'] },
							},
						},
					},
				},
				{
					$project: {
						_id: 0,
						__v: 0,
						'category._id': 0,
						'category.__V': 0,
						'attributesData._id': 0,
						'attributesData.__V': 0,
					},
				},
			])
				.exec()
				.then(getAttributeFormProduct);
		case STATUSES.INACTIVE:
			customLogger.info({
				fileName: '/repo/product_repo.js',
				functionName: 'getAllProductsRepo',
				context: 'After Execution',
				message: `Going to return without errors`,
			});
			return Product.aggregate([
				{
					$match: {
						clientId: clientId,
						status: STATUSES.INACTIVE,
					},
				},
				{
					$lookup: {
						localField: 'categoryId',
						from: 'categories',
						foreignField: 'categoryId',
						as: 'category',
					},
				},
				{
					$addFields: {
						category: {
							$filter: {
								input: '$category',
								cond: { $eq: ['$$this.clientId', '$clientId'] },
							},
						},
					},
				},
				{
					$addFields: {
						category: {
							$arrayElemAt: ['$category', 0],
						},
					},
				},
				{
					$sort: {
						createdAt: -1,
					},
				},
				{
					$lookup: {
						localField: 'attributes.attributes.attrId',
						from: 'attributes',
						foreignField: 'attrId',
						as: 'attributesData',
					},
				},
				{
					$addFields: {
						attributesData: {
							$filter: {
								input: '$attributesData',
								cond: { $eq: ['$$this.clientId', '$clientId'] },
							},
						},
					},
				},
				{
					$project: {
						_id: 0,
						__v: 0,
						'category._id': 0,
						'category.__V': 0,
						'attributesData._id': 0,
						'attributesData.__V': 0,
					},
				},
			])
				.exec()
				.then(getAttributeFormProduct);
		default:
			customLogger.info({
				fileName: '/repo/product_repo.js',
				functionName: 'getAllProductsRepo',
				context: 'After Execution',
				message: `Going to return without errors`,
			});
			return Product.aggregate([
				{
					$match: {
						clientId: clientId,
					},
				},
				{
					$lookup: {
						localField: 'categoryId',
						from: 'categories',
						foreignField: 'categoryId',
						as: 'category',
					},
				},
				{
					$addFields: {
						category: {
							$filter: {
								input: '$category',
								cond: { $eq: ['$$this.clientId', '$clientId'] },
							},
						},
					},
				},
				{
					$addFields: {
						category: {
							$arrayElemAt: ['$category', 0],
						},
					},
				},
				{
					$sort: {
						createdAt: -1,
					},
				},
				{
					$lookup: {
						localField: 'attributes.attributes.attrId',
						from: 'attributes',
						foreignField: 'attrId',
						as: 'attributesData',
					},
				},
				{
					$addFields: {
						attributesData: {
							$filter: {
								input: '$attributesData',
								cond: { $eq: ['$$this.clientId', '$clientId'] },
							},
						},
					},
				},
				{
					$project: {
						_id: 0,
						__v: 0,
						'category._id': 0,
						'category.__V': 0,
						'attributesData._id': 0,
						'attributesData.__V': 0,
					},
				},
			])
				.exec()
				.then(getAttributeFormProduct);
	}
}

async function getRecentAddedProductsRepo(clientId, limit) {
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'getRecentAddedProductsRepo',
		message: 'getting Recent added products',
		context: 'Before Execution',
	});
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'getRecentAddedProductsRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Product.aggregate([
		{
			$match: {
				clientId: clientId,
				status: STATUSES.ACTIVE,
			},
		},
		{
			$lookup: {
				localField: 'categoryId',
				from: 'categories',
				foreignField: 'categoryId',
				as: 'category',
			},
		},
		{
			$addFields: {
				category: {
					$filter: {
						input: '$category',
						cond: { $eq: ['$$this.clientId', '$clientId'] },
					},
				},
			},
		},
		{
			$addFields: {
				category: {
					$arrayElemAt: ['$category', 0],
				},
			},
		},
		{
			$sort: {
				createdAt: 1,
			},
		},
		{
			$limit: limit || 10,
		},
		{
			$lookup: {
				localField: 'attributes.attributes.attrId',
				from: 'attributes',
				foreignField: 'attrId',
				as: 'attributesData',
			},
		},
		{
			$addFields: {
				attributesData: {
					$filter: {
						input: '$attributesData',
						cond: { $eq: ['$$this.clientId', '$clientId'] },
					},
				},
			},
		},
		{
			$project: {
				_id: 0,
				__v: 0,
				'category._id': 0,
				'category.__V': 0,
				'attributesData._id': 0,
				'attributesData.__V': 0,
			},
		},
	])
		.exec()
		.then(getAttributeFormProduct);
}

async function deleteProductRepo(clientId, productId, status, updatedBy) {
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'deleteProductRepo',
		context: 'Before Execution',
		message: 'deleting products',
	});
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'deleteProductRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Product.updateOne(
		{
			clientId: clientId,
			productId: productId,
		},
		{
			$set: {
				status: STATUSES[status.toString().toUpperCase()],
				updatedBy,
			},
		},
		{ upsert: false }
	)
		.exec()
		.then((result) => result.modifiedCount);
}

function getProductsByCategoryIdRepo(categoryId, clientId) {
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'getProductsByCategoryIdRepo',
		context: 'Before Execution',
		message: 'Getting products by category',
	});
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'getProductsByCategoryIdRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Product.find(
		{
			clientId: clientId,
			categoryId: categoryId,
			status: STATUSES.ACTIVE,
		},
		{
			_id: 0,
			__v: 0,
		}
	)
		.lean()
		.exec();
}

function createProductRepo(record) {
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'createProductRepo',
		context: 'Before Execution',
		message: 'Creating products',
	});
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'createProductRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Product.create(record);
}

async function getProductByIdRepo(productId, clientId) {
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'getProductByIdRepo',
		context: 'Before Execution',
		message: 'getting products by Id',
	});
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'getProductByIdRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Product.aggregate([
		{
			$match: {
				clientId: clientId,
				productId: productId,
			},
		},
		{
			$lookup: {
				localField: 'categoryId',
				from: 'categories',
				foreignField: 'categoryId',
				as: 'category',
			},
		},
		{
			$addFields: {
				category: {
					$filter: {
						input: '$category',
						cond: { $eq: ['$$this.clientId', '$clientId'] },
					},
				},
			},
		},
		{
			$addFields: {
				category: {
					$arrayElemAt: ['$category', 0],
				},
			},
		},
		{
			$lookup: {
				localField: 'attributes.attributes.attrId',
				from: 'attributes',
				foreignField: 'attrId',
				as: 'attributesData',
			},
		},
		{
			$addFields: {
				attributesData: {
					$filter: {
						input: '$attributesData',
						cond: { $eq: ['$$this.clientId', '$clientId'] },
					},
				},
			},
		},
		{
			$project: {
				_id: 0,
				__v: 0,
				'category._id': 0,
				'category.__V': 0,
				'attributesData._id': 0,
				'attributesData.__V': 0,
			},
		},
	])
		.exec()
		.then((result) =>
			result.length > 0 ? getAttributeFormProduct(result[0]) : null
		);
}

function updateProductRepo(productId, clientId, record, updatedBy) {
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'updateProductRepo',
		context: 'Before Execution',
		message: 'Update products',
	});
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'updateProductRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Product.updateOne(
		{
			productId: productId,
			clientId: clientId,
		},
		{
			$set: { ...record, updatedBy },
		},
		{
			upsert: false,
		}
	);
}

function createProductsFromCSVRepo(productListToInsert, clientId) {
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'createProductsFromCSVRepo',
		context: 'Before Execution',
		message: 'Creating products',
	});
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'createProductsFromCSVRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Product.bulkWrite(
		productListToInsert.map((product) => ({
			updateOne: {
				filter: {
					productId: product.productId,
					clientId: clientId,
				},
				update: { $set: product },
				upsert: true,
			},
		}))
	);
}
async function getProductsByListOfIdsRepo(productIdList, clientId, status) {
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'getProductsByListOfIdsRepo',
		context: 'Before Execution',
		message: 'Getting products list of ids',
	});
	let productList = [];
	switch (status) {
		case STATUSES.ACTIVE:
			productList = await Product.aggregate([
				{
					$match: {
						clientId: clientId,
						productId: {
							$in: productIdList,
						},
						status: STATUSES.ACTIVE,
					},
				},
				{
					$lookup: {
						localField: 'categoryId',
						from: 'categories',
						foreignField: 'categoryId',
						as: 'category',
					},
				},
				{
					$addFields: {
						category: {
							$filter: {
								input: '$category',
								cond: { $eq: ['$$this.clientId', '$clientId'] },
							},
						},
					},
				},
				{
					$addFields: {
						category: {
							$arrayElemAt: ['$category', 0],
						},
					},
				},
				{
					$lookup: {
						localField: 'attributes.attributes.attrId',
						from: 'attributes',
						foreignField: 'attrId',
						as: 'attributesData',
					},
				},
				{
					$addFields: {
						attributesData: {
							$filter: {
								input: '$attributesData',
								cond: { $eq: ['$$this.clientId', '$clientId'] },
							},
						},
					},
				},
				{
					$project: {
						_id: 0,
						__v: 0,
						'category._id': 0,
						'category.__V': 0,
						'attributesData._id': 0,
						'attributesData.__V': 0,
					},
				},
			])
				.exec()
				.then(getAttributeFormProduct);
			break;
		case STATUSES.INACTIVE:
			productList = await Product.aggregate([
				{
					$match: {
						clientId: clientId,
						productId: {
							$in: productIdList,
						},
						status: STATUSES.INACTIVE,
					},
				},
				{
					$lookup: {
						localField: 'categoryId',
						from: 'categories',
						foreignField: 'categoryId',
						as: 'category',
					},
				},
				{
					$addFields: {
						category: {
							$filter: {
								input: '$category',
								cond: { $eq: ['$$this.clientId', '$clientId'] },
							},
						},
					},
				},
				{
					$addFields: {
						category: {
							$arrayElemAt: ['$category', 0],
						},
					},
				},
				{
					$lookup: {
						localField: 'attributes.attributes.attrId',
						from: 'attributes',
						foreignField: 'attrId',
						as: 'attributesData',
					},
				},
				{
					$addFields: {
						attributesData: {
							$filter: {
								input: '$attributesData',
								cond: { $eq: ['$$this.clientId', '$clientId'] },
							},
						},
					},
				},
				{
					$project: {
						_id: 0,
						__v: 0,
						'category._id': 0,
						'category.__V': 0,
						'attributesData._id': 0,
						'attributesData.__V': 0,
					},
				},
			])
				.exec()
				.then(getAttributeFormProduct);
			break;
		default:
			productList = await Product.aggregate([
				{
					$match: {
						clientId: clientId,
						productId: {
							$in: productIdList,
						},
					},
				},
				{
					$lookup: {
						localField: 'categoryId',
						from: 'categories',
						foreignField: 'categoryId',
						as: 'category',
					},
				},
				{
					$addFields: {
						category: {
							$filter: {
								input: '$category',
								cond: { $eq: ['$$this.clientId', '$clientId'] },
							},
						},
					},
				},
				{
					$addFields: {
						category: {
							$arrayElemAt: ['$category', 0],
						},
					},
				},
				{
					$lookup: {
						localField: 'attributes.attributes.attrId',
						from: 'attributes',
						foreignField: 'attrId',
						as: 'attributesData',
					},
				},
				{
					$addFields: {
						attributesData: {
							$filter: {
								input: '$attributesData',
								cond: { $eq: ['$$this.clientId', '$clientId'] },
							},
						},
					},
				},
				{
					$project: {
						_id: 0,
						__v: 0,
						'category._id': 0,
						'category.__V': 0,
						'attributesData._id': 0,
						'attributesData.__V': 0,
					},
				},
			])
				.exec()
				.then(getAttributeFormProduct);
			break;
	}
	if (productList.length > 0) {
		customLogger.info({
			fileName: '/repo/product_repo',
			functionName: 'getProductsByListOfIdsRepo',
			context: 'If condition true block',
			message: 'Got result',
		});
		customLogger.info({
			fileName: '/repo/product_repo',
			functionName: 'getProductsByListOfIdsRepo',
			context: 'After Execution',
			message: 'Going to return without errors',
		});
		return getDealForListOfProducts(productList, clientId);
	}
	customLogger.warn({
		fileName: '/repo/product_repo',
		functionName: 'getProductsByListOfIdsRepo',
		context: 'After Execution',
		message: `Going to throw exception with Products not found while finding by list of ids`,
	});
	throw new ApiException({
		message: 'Products not found while finding by list of ids',
		responseCode: config.response_code.error,
	});
}

function getProductPropValueRepo(clientId, productId, prop) {
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'getProductPropValueRepo',
		context: 'Before Execution',
		message: 'Getting product prop values',
	});
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'getProductPropValueRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Product.findOne(
		{
			clientId: clientId,
			productId: productId,
		},
		{
			_id: 0,
			[prop]: 1,
		}
	)
		.lean()
		.exec();
}

async function changeProductQtyAvailableRepo(
	clientId,
	productListWithQty,
	action
) {
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'changeProductQtyAvailableRepo',
		context: 'Before Execution',
		message: `Changing product qty available`,
	});
	let result = null;
	switch (action) {
		case 'INCREASE':
			result = await Product.bulkWrite(
				productListWithQty.map((product) => ({
					updateOne: {
						filter: { productId: product.productId, clientId },
						update: {
							$inc: {
								qtyAvailable: product.qty,
							},
						},
						upsert: false,
					},
				}))
			);
			customLogger.info({
				fileName: '/repo/product_repo',
				functionName: 'changeProductQtyAvailableRepo',
				context: 'After Execution',
				message: 'Going to return without errors',
			});
			return result.result.nModified > 0 ? result.result.nModified : null;
		case 'DECREASE':
			result = await Product.bulkWrite(
				productListWithQty.map((product) => ({
					updateOne: {
						filter: { productId: product.productId, clientId },
						update: {
							$inc: {
								qtyAvailable: -product.qty,
							},
						},
						upsert: false,
					},
				}))
			);
			customLogger.info({
				fileName: '/repo/product_repo',
				functionName: 'changeProductQtyAvailableRepo',
				context: 'After Execution',
				message: 'Going to return without errors',
			});
			return result.result.nModified > 0 ? result.result.nModified : null;
		default:
			customLogger.warn({
				fileName: '/repo/product_repo',
				functionName: 'changeProductQtyAvailableRepo',
				context: 'After Execution',
				message: 'Going to throw exception with Action not found',
			});
			throw new ApiException({
				message: 'Action not found',
				responseCode: config.response_code.error,
			});
	}
}

async function getRelatedProductsByCategoryRepo(clientId, productId, limit) {
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'getRelatedProductsByCategoryRepo',
		context: 'Before Execution',
		message: 'Getting  related products by category',
	});
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'getRelatedProductsByCategoryRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Product.findOne(
		{
			clientId: clientId,
			status: STATUSES.ACTIVE,
			productId,
		},
		{ categoryId: 1 }
	).then((result) =>
		result != null && result?.categoryId
			? Product.aggregate([
					{
						$match: {
							clientId: clientId,
							status: STATUSES.ACTIVE,
							productId: {
								$ne: productId,
							},
							categoryId: result.categoryId,
						},
					},
					{
						$lookup: {
							localField: 'categoryId',
							from: 'categories',
							foreignField: 'categoryId',
							as: 'category',
						},
					},
					{
						$addFields: {
							category: {
								$filter: {
									input: '$category',
									cond: {
										$eq: ['$$this.clientId', '$clientId'],
									},
								},
							},
						},
					},
					{
						$addFields: {
							category: {
								$arrayElemAt: ['$category', 0],
							},
						},
					},
					{
						$limit: limit || 10,
					},
					{
						$lookup: {
							localField: 'attributes.attributes.attrId',
							from: 'attributes',
							foreignField: 'attrId',
							as: 'attributesData',
						},
					},
					{
						$addFields: {
							attributesData: {
								$filter: {
									input: '$attributesData',
									cond: {
										$eq: ['$$this.clientId', '$clientId'],
									},
								},
							},
						},
					},
					{
						$project: {
							_id: 0,
							__v: 0,
							'category._id': 0,
							'category.__V': 0,
							'attributesData._id': 0,
							'attributesData.__V': 0,
						},
					},
			  ])
					.exec()
					.then(getAttributeFormProduct)
			: []
	);
}

async function getProductsByProductNameMatchesRepo(clientId, productNameMatch) {
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'getProductsByProductNameMatchesRepo',
		context: 'Before Execution',
		message: 'Getting products by name matches',
	});
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'getProductsByProductNameMatchesRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Product.aggregate([
		{
			$match: {
				clientId: clientId,
				status: STATUSES.ACTIVE,
				productName: {
					$regex: productNameMatch.toString().toLowerCase() || '',
					$options: 'gi',
				},
			},
		},
		{
			$lookup: {
				localField: 'categoryId',
				from: 'categories',
				foreignField: 'categoryId',
				as: 'category',
			},
		},
		{
			$addFields: {
				category: {
					$filter: {
						input: '$category',
						cond: { $eq: ['$$this.clientId', '$clientId'] },
					},
				},
			},
		},
		{
			$addFields: {
				category: {
					$arrayElemAt: ['$category', 0],
				},
			},
		},
		{
			$lookup: {
				localField: 'attributes.attributes.attrId',
				from: 'attributes',
				foreignField: 'attrId',
				as: 'attributesData',
			},
		},
		{
			$addFields: {
				attributesData: {
					$filter: {
						input: '$attributesData',
						cond: { $eq: ['$$this.clientId', '$clientId'] },
					},
				},
			},
		},
		{
			$project: {
				_id: 0,
				__v: 0,
				'category._id': 0,
				'category.__V': 0,
				'attributesData._id': 0,
				'attributesData.__V': 0,
			},
		},
	])
		.exec()
		.then(getAttributeFormProduct);
}

async function getRandomProductsRepo(clientId, categoryId, limit) {
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'getRandomProductsRepo',
		context: 'Before Execution',
		message: 'Getting random products',
	});
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'getRandomProductsRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Product.aggregate([
		{
			$match: {
				clientId: clientId,
				status: STATUSES.ACTIVE,
				categoryId,
			},
		},
		{
			$sample: {
				size: Math.abs(limit) || 10,
			},
		},
		{
			$lookup: {
				localField: 'categoryId',
				from: 'categories',
				foreignField: 'categoryId',
				as: 'category',
			},
		},
		{
			$addFields: {
				category: {
					$filter: {
						input: '$category',
						cond: { $eq: ['$$this.clientId', '$clientId'] },
					},
				},
			},
		},
		{
			$addFields: {
				category: {
					$arrayElemAt: ['$category', 0],
				},
			},
		},
		{
			$lookup: {
				localField: 'attributes.attributes.attrId',
				from: 'attributes',
				foreignField: 'attrId',
				as: 'attributesData',
			},
		},
		{
			$addFields: {
				attributesData: {
					$filter: {
						input: '$attributesData',
						cond: { $eq: ['$$this.clientId', '$clientId'] },
					},
				},
			},
		},
		{
			$project: {
				_id: 0,
				__v: 0,
				'category._id': 0,
				'category.__V': 0,
				'attributesData._id': 0,
				'attributesData.__V': 0,
			},
		},
	])
		.exec()
		.then(getAttributeFormProduct);
}

function getProductsNotInProductIdsRepo(clientId, productIds) {
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'getProductsNotInProductIdsRepo',
		context: 'Before Execution',
		message: 'Getting products not in ids list',
	});
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'getProductsNotInProductIdsRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Product.aggregate([
		{
			$match: {
				clientId,
				productId: {
					$nin: productIds,
				},
				status: STATUSES.ACTIVE,
			},
		},
		{
			$project: {
				_id: 0,
				__v: 0,
			},
		},
	]).exec();
}

function getTotalProductsCountRepo(clientId) {
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'getTotalProductsCountRepo',
		context: 'Before Execution',
		message: 'Getting products count',
	});
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'getTotalProductsCountRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Product.count({ clientId }).exec();
}

async function getActiveProductsWithFiltersRepo(clientId, filter) {
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'getActiveProductsWithFiltersRepo',
		context: 'Before Execution',
		message: 'Getting products with filters',
	});
	customLogger.info({
		fileName: '/repo/product_repo',
		functionName: 'getActiveProductsWithFiltersRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Product.aggregate([
		{
			$match: {
				clientId: clientId,
				status: STATUSES.ACTIVE,
			},
		},
		{
			$lookup: {
				localField: 'categoryId',
				from: 'categories',
				foreignField: 'categoryId',
				as: 'category',
			},
		},
		{
			$addFields: {
				category: {
					$filter: {
						input: '$category',
						cond: { $eq: ['$$this.clientId', '$clientId'] },
					},
				},
			},
		},
		{
			$addFields: {
				category: {
					$arrayElemAt: ['$category', 0],
				},
			},
		},
		{
			$addFields: {
				inStock: {
					$cond: {
						if: {
							$gte: ['$qtyAvailable', '$moq'],
						},
						then: true,
						else: false,
					},
				},
			},
		},
		{
			$match: {
				inStock: filter.inStock ? filter.inStock : undefined,
				createdAt: {
					$gt: filter?.newArrivalsFilter?.to,
					$lt: filter?.newArrivalsFilter?.from,
				},
			},
		},
		{
			$lookup: {
				localField: 'attributes.attributes.attrId',
				from: 'attributes',
				foreignField: 'attrId',
				as: 'attributesData',
			},
		},
		{
			$addFields: {
				attributesData: {
					$filter: {
						input: '$attributesData',
						cond: { $eq: ['$$this.clientId', '$clientId'] },
					},
				},
			},
		},
		{
			$project: {
				_id: 0,
				__v: 0,
				'category._id': 0,
				'category.__V': 0,
				'attributesData._id': 0,
				'attributesData.__V': 0,
			},
		},
	])
		.exec()
		.then(getAttributeFormProduct);
}

module.exports = {
	createProductRepo,
	getProductByIdRepo,
	getAllProductsRepo,
	deleteProductRepo,
	updateProductRepo,
	createProductsFromCSVRepo,
	getProductsByCategoryIdRepo,
	getRandomProductsRepo,
	getProductsByListOfIdsRepo,
	getProductPropValueRepo,
	changeProductQtyAvailableRepo,
	getRecentAddedProductsRepo,
	getProductsByProductNameMatchesRepo,
	getProductsNotInProductIdsRepo,
	getTotalProductsCountRepo,
	getActiveProductsWithFiltersRepo,
	getRelatedProductsByCategoryRepo,
};
