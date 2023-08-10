const Category = require('./schemas/category_schema');
var Product = require('./schemas/product_schema');
var { getCategoryHierarchy } = require('../services/helper_service');
var { conn } = require('./db_connection');
const { DEFAULT_CATEGORY_PROPS } = require('../utils/constants');
const { getRandomId } = require('../utils/helper_tools');
const { customLogger } = require('../utils/logger');

function getCategoryByIdRepo(categoryId, clientId) {
	customLogger.info({
		fileName: '/repo/category_repo',
		functionName: 'getCategoryByIdRepo',
		context: 'Before Execution',
		message: 'getting category id ',
	});
	customLogger.info({
		fileName: '/repo/category_repo',
		functionName: 'getCategoryByIdRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Category.findOne(
		{
			categoryId: categoryId,
			clientId: clientId,
		},
		{
			_id: 0,
			__v: 0,
		}
	)
		.lean()
		.exec();
}

async function getAllCategoriesRepo(clientId, isTree, userId) {
	customLogger.info({
		fileName: '/repo/category_repo',
		functionName: 'getAllCategoriesRepo',
		context: 'Before Execution',
		message: 'getting all categories',
	});
	let result = await Category.find({ clientId: clientId }, { _id: 0, __v: 0 })
		.lean()
		.exec();
	if (result.length > 0) {
		customLogger.info({
			fileName: '/repo/category_repo',
			functionName: 'getAllCategoriesRepo',
			context: 'if block true condition',
			message: 'Got result',
		});
		customLogger.info({
			fileName: '/repo/category_repo',
			functionName: 'getAllCategoriesRepo',
			context: 'After Execution',
			message: 'Going to return without errors',
		});
		return isTree ? getCategoryHierarchy(result) : result;
	} else if (result.length == 0 && userId != undefined) {
		customLogger.info({
			fileName: '/repo/category_repo',
			functionName: 'getAllCategoriesRepo',
			context: 'else if block true condition',
			message: 'creating category',
		});
		customLogger.info({
			fileName: '/repo/category_repo',
			functionName: 'getAllCategoriesRepo',
			context: 'After Execution',
			message: 'Going to return without errors',
		});
		return Category.create({
			...DEFAULT_CATEGORY_PROPS,
			categoryId: getRandomId(`CATEGORY`),
			createdBy: userId,
			clientId: clientId,
		});
	}
	customLogger.info({
		fileName: '/repo/category_repo',
		functionName: 'getAllCategoriesRepo',
		context: 'After Execution',
		message: 'Going to return null',
	});
	return null;
}

function createCategoryRepo(record) {
	customLogger.info({
		fileName: '/repo/category_repo',
		functionName: 'createCategoryRepo',
		context: 'Before Execution',
		message: 'create category  ',
	});
	customLogger.info({
		fileName: '/repo/category_repo',
		functionName: 'createCategoryRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Category.create(record);
}

async function deleteCategoryRepo(clientId, categoryId) {
	customLogger.info({
		fileName: '/repo/category_repo',
		functionName: 'deleteCategoryRepo',
		context: 'Before Execution',
		message: 'deleting category ',
	});
	const session = await conn.startSession();
	try {
		session.startTransaction();
		let categoryResult = await Category.deleteOne({
			clientId: clientId,
			categoryId: categoryId,
		}).exec();
		if (categoryResult.deletedCount > 0) {
			customLogger.info({
				fileName: '/repo/category_repo',
				functionName: 'deleteCategoryRepo',
				context: 'if block true condition',
				message: 'delete product category',
			});
			let productResult = await Product.deleteMany({
				clientId: clientId,
				categoryId: categoryId,
			}).exec();
			if (productResult.deletedCount <= 0) {
				customLogger.info({
					fileName: '/repo/category_repo',
					functionName: 'deleteCategoryRepo',
					context: 'if block true condition',
					message: 'delete abort transaction',
				});
				await session.abortTransaction();
			} else {
				customLogger.info({
					fileName: '/repo/category_repo',
					functionName: 'getAllCategoriesRepo',
					context: 'else if block true condition',
					message: 'commit tranasaction',
				});
				await session.commitTransaction();
				return categoryResult.deletedCount;
			}
		} else {
			customLogger.info({
				fileName: '/repo/category_repo',
				functionName: 'getAllCategoriesRepo',
				context: 'else if block true condition',
				message: 'abort tranasaction',
			});
			await session.abortTransaction();
			customLogger.info({
				fileName: '/repo/category_repo',
				functionName: 'getAllCategoriesRepo',
				context: 'After Execution',
				message: 'Going to return null',
			});
			return null;
		}
	} catch (error) {
		customLogger.warn({
			fileName: '/repo/category_repo',
			functionName: 'getAllCategoriesRepo',
			context: 'throwing error',
			message: error.message,
		});
		await session.abortTransaction();
		throw error;
	} finally {
		await session.endSession();
	}
}

function updateCategoryRepo(categoryId, clientId, record, updatedBy) {
	customLogger.info({
		fileName: '/repo/category_repo',
		functionName: 'updateCategoryRepo',
		context: 'Before Execution',
		message: 'update category ',
	});
	customLogger.info({
		fileName: '/repo/category_repo',
		functionName: 'updateCategoryRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Category.findOneAndUpdate(
		{
			categoryId: categoryId,
			clientId: clientId,
		},
		{
			$set: { ...record, updatedBy },
		},
		{
			new: true,
			upsert: false,
			projection: {
				_id: 0,
				__v: 0,
			},
		}
	);
}

async function getAllAttributeByCategoryIdRepo(clientId, categoryId) {
	customLogger.info({
		fileName: '/repo/category_repo',
		functionName: 'getAllAttributeByCategoryIdRepo',
		context: 'Before Execution',
		message: 'getting all attributes',
	});
	let categoryData = await Category.aggregate([
		{
			$match: {
				clientId: clientId,
				categoryId: categoryId,
			},
		},

		{
			$graphLookup: {
				from: 'categories',
				startWith: '$parentCategoryId',
				connectFromField: 'parentCategoryId',
				connectToField: 'categoryId',
				as: 'parentCategories',
			},
		},
		{
			$lookup: {
				from: 'attributesets',
				pipeline: [
					{
						$match: {
							clientId: clientId,
						},
					},
					{
						$lookup: {
							localField: 'attributes',
							from: 'attributes',
							foreignField: 'attrId',
							as: 'attributes',
						},
					},
				],
				as: 'allAttrSets',
			},
		},
		{
			$project: {
				_id: 0,
				allAttrSets: 1,
			},
		},
	]);
	customLogger.info({
		fileName: '/repo/category_repo',
		functionName: 'getAllAttributeByCategoryIdRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return categoryData.length > 0
		? Array.from(
				new Set(categoryData[0].allAttrSets.map(JSON.stringify))
		  ).map(JSON.parse)
		: null;
}

async function getCategoryIdByClientIdRepo(clientId, userId) {
	customLogger.info({
		fileName: '/repo/category_repo',
		functionName: 'getCategoryIdByClientIdRepo',
		context: 'Before Execution',
		message: 'getting category by id ',
	});
	customLogger.info({
		fileName: '/repo/category_repo',
		functionName: 'getCategoryIdByClientIdRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return (await Category.exists({
		clientId,
	})) != null
		? Category.findOne(
				{
					clientId,
				},
				{ categoryId: 1, _id: 0 }
		  ).lean()
		: Category.create({
				...DEFAULT_CATEGORY_PROPS,
				categoryId: getRandomId(`CATEGORY`),
				createdBy: userId,
				clientId: clientId,
		  }).then((result) => ({ categoryId: result.categoryId }));
}

module.exports = {
	getAllCategoriesRepo,
	getCategoryByIdRepo,
	createCategoryRepo,
	deleteCategoryRepo,
	updateCategoryRepo,
	getAllAttributeByCategoryIdRepo,
	getCategoryIdByClientIdRepo,
};
