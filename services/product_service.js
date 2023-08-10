var productRepo = require('../repo/product_repo');
const { getProductFromRequest } = require('./data_extract_service');
const {
	getProductListWithCalculatedDealPriceAndStockDetail,
	getProductWithCalculatedDealPriceAndStockDetail,
	getClient,
} = require('./helper_service');
const { saveFilesToBucket } = require('../utils/file_upload');
const {
	STATUSES,
	ACTION,
	DEFAULT_PRODUCT_PROPS,
} = require('../utils/constants');
var {
	getCategoryByIdRepo,
	getCategoryIdByClientIdRepo,
} = require('../repo/category_repo');
const { getCheckoutProductListByCheckoutId } = require('../repo/checkout_repo');
const ProductSearchFilter = require('../models/ProductSearchFilter');
const { validateImportedProducts } = require('../services/validator_service');
const config = require('../config/app_config.json');
const {
	getAuthTokenFromRequest,
	compareDealDates,
	compareDealFutureDates,
} = require('../utils/helper_tools');
const ApiException = require('../models/ApiException');
const { failedResponse } = require('./common_service');
const {
	getProductExportSheet,
	getExportedProductsList,
} = require('./product_sheet_generation_service');
const {
	getAllTaxCodeNames,
	getListOfTaxcodesByListOfTaxcodeNames,
} = require('./inner_communication_service');
const { customLogger } = require('../utils/logger');

async function getAllProductsService(req, _res) {
	customLogger.info({
		fileName: '/services/product_service.js',
		functionName: 'getAllProductsService',
		context: 'Before Execution',
		message: 'getting All Products Service',
	});

	let productList = await productRepo.getAllProductsRepo(req.query.clientId);
	if (productList.length > 0) {
		customLogger.info({
			fileName: '/services/product_service.js',
			functionName: 'getAllProductsService',
			context: 'if block true condition',
			message: 'Getting all product',
		});
		return getProductListWithCalculatedDealPriceAndStockDetail(
			productList,
			req.query.clientId
		);
	}

	return null;
}

async function getProductByIdService(req, _res) {
	customLogger.info({
		fileName: '/services/product_service.js',
		functionName: 'getProductByIdService',
		context: 'Before Execution',
		message: 'get Product',
	});

	let productData = await productRepo.getProductByIdRepo(
		req.params.productId,
		req.query.clientId
	);
	if (productData != null) {
		const clientDetails = await getClient(
			req.query.clientId,
			getAuthTokenFromRequest(req)
		);
		customLogger.info({
			fileName: '/services/product_service.js',
			functionName: 'getProductByIdService',
			context: 'if condition true block',
			message: 'Going to return without errors',
		});
		return getProductWithCalculatedDealPriceAndStockDetail(
			productData,
			req.query.clientId,
			getAuthTokenFromRequest(req)
		).then((productListResult) => ({
			...productListResult,
			clientDetails,
		}));
	}
	return null;
}

async function getProductsByCategoryIdService(req, _res) {
	customLogger.info({
		fileName: '/services/product_service.js',
		functionName: 'getProductsByCategoryIdService',
		context: 'Before Execution',
		message: 'Going to return without errors',
	});
	let productList = await productRepo.getProductsByCategoryIdRepo(
		req.params.categoryId,
		req.query.clientId
	);
	if (productList.length > 0) {
		productList = await getProductListWithCalculatedDealPriceAndStockDetail(
			productList,
			clientId
		);
		customLogger.info({
			fileName: '/services/product_service.js',
			functionName: 'getProductsByCategoryIdService',
			context: 'if block true condition',
			message: 'Going to return without errors',
		});
		return req.query.isSP == 'true'
			? productList
			: {
					...(await getCategoryByIdRepo(
						req.params.categoryId,
						req.query.clientId
					)),
					productList,
			  };
	}
	return null;
}

function deleteProductService(req, _res) {
	customLogger.info({
		fileName: '/services/product_service.js',
		functionName: 'deleteProductService',
		context: 'Before Execution',
		message: 'delete product service',
	});
	customLogger.info({
		fileName: '/services/product_service.js',
		functionName: 'deleteProductService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return productRepo.deleteProductRepo(
		req.query.clientId,
		req.query.productId,
		req.query.status,
		req.query.userId
	);
}

async function createProductService(req, _res) {
	customLogger.info({
		fileName: '/services/product_service.js',
		functionName: 'createProductService',
		context: 'Before Execution',
		message: 'Going to return without errors',
	});

	const saveFilesResults = await saveFilesToBucket(req.files);
	if (saveFilesResults) {
		customLogger.info({
			fileName: '/services/product_service.js',
			functionName: 'createProductService',
			context: 'if block true condition',
			message: 'created product service',
		});
		return productRepo.createProductRepo({
			...getProductFromRequest(req, true),
			images: saveFilesResults,
		});
	}
	throw new ApiException({
		message: 'Unable to Store product Images while create',
		responseCode: config.response_code.unable_to_store_files,
	});
}

async function updateProductService(req, _res) {
	customLogger.info({
		fileName: '/services/product_service.js',
		functionName: 'updateProductService',
		context: 'before Execution',
		message: 'Going to return without errors',
	});
	const { record, clientId, productId, updatedBy } =
		getProductFromRequest(req);
	const saveFilesResults = await saveFilesToBucket(req.files);
	customLogger.info({
		fileName: '/services/product_service.js',
		functionName: 'updateProductService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return productRepo.updateProductRepo(
		productId,
		clientId,
		{ ...record, images: record.images.concat(saveFilesResults) },
		updatedBy
	);
}

async function getProductFromCSVService(req, res) {
	let productsList = await getExportedProductsList(req.file.buffer);
	if (productsList.length <= 0) {
		throw new ApiException({
			message: `No products found while upload`,
			responseCode: config.response_code.field_validation,
			errorData: {
				message: `No products found while upload`,
			},
		});
	}
	const categoryId = (
		await getCategoryIdByClientIdRepo(req.query.clientId, req.query.userId)
	).categoryId;
	if (!categoryId) {
		throw new ApiException({
			message: `No category found while upload for client`,
			responseCode: config.response_code.field_validation,
			errorData: {
				message: `No category found while upload for client`,
			},
		});
	}
	productsList = productsList.map((product) => ({
		...DEFAULT_PRODUCT_PROPS,
		categoryId,
		createdBy: req.query.userId,
		updatedBy: req.query.userId,
		...product,
	}));
	const { failedProductList, passedProductList } =
		validateImportedProducts(productsList);
	const taxClasses = await getListOfTaxcodesByListOfTaxcodeNames(
		req.query.clientId,
		passedProductList.map((product) => product.taxClass),
		getAuthTokenFromRequest(req)
	);
	if (taxClasses.length == 0) {
		throw new ApiException({
			message: `No taxclasses found while upload for client`,
			responseCode: config.response_code.field_validation,
			errorData: {
				message: `No taxclasses found while upload for client`,
			},
		});
	}
	passedProductList.forEach((product, index) => {
		let taxClass = taxClasses.find(
			(taxcode) => taxcode.taxcodeName == product.taxClass
		)?.taxcodeId;
		if (taxClass == null || taxClass == undefined) {
			passedProductList.splice(index, 1);
			failedProductList.push({
				...product,
				failedFields: ['taxClass'],
			});
		} else {
			product.taxClass = taxClass;
		}
	});
	let result = [];
	if (passedProductList.length > 0) {
		result = await productRepo.createProductsFromCSVRepo(
			passedProductList,
			req.query.clientId
		);
	}
	if (failedProductList.length > 0) {
		res.locals.responseCode = config.response_code.field_validation;
		res.locals.errors = failedProductList;
	}
	return {
		successProducts: passedProductList,
		successProductsCount: result.nModified + result.nUpserted,
	};
}

async function getActiveProductsService(req, _res) {
	let productList = await productRepo.getAllProductsRepo(
		req.query.clientId,
		STATUSES.ACTIVE
	);
	if (productList.length > 0) {
		return getProductListWithCalculatedDealPriceAndStockDetail(
			productList,
			req.query.clientId
		);
	}
	return null;
}

async function getRelatedProductsByCategoryService(req, _res) {
	let productList = await productRepo.getRelatedProductsByCategoryRepo(
		req.query.clientId,
		req.params.productId,
		req.query.limit
	);
	if (productList.length > 0) {
		return getProductListWithCalculatedDealPriceAndStockDetail(
			productList,
			req.query.clientId
		);
	}
	return null;
}

async function getActiveProductsWithFiltersService(req, _res) {
	let filtersToApply = new ProductSearchFilter(req.body);
	let productList = await productRepo.getActiveProductsWithFiltersRepo(
		req.query.clientId,
		filtersToApply
	);
	if (productList.length > 0) {
		let productListWithDealPrice =
			await getProductListWithCalculatedDealPriceAndStockDetail(
				productList,
				req.query.clientId
			);
		if (filtersToApply.withDeal) {
			productListWithDealPrice = productListWithDealPrice.filter(
				(product) => product.deal !== null
			);
		}
		if (filtersToApply.priceRange !== null) {
			productListWithDealPrice = productListWithDealPrice.filter(
				(product) =>
					product.price.finalPrice >=
						filtersToApply.priceRange.from &&
					(filtersToApply.priceRange?.to !== null
						? product.price.finalPrice <=
						  filtersToApply.priceRange.to
						: true)
			);
		}
		return {
			productList: productListWithDealPrice,
			appliedFilters: filtersToApply,
		};
	}
	return null;
}

function getProductListByProductIdsListService(req, _res) {
	return productRepo.getProductsByListOfIdsRepo(
		req.body.productIdList,
		req.query.clientId,
		STATUSES[req.query.status]
	);
}

async function getRecentAddedProductsService(req, _res) {
	let productList = await productRepo.getRecentAddedProductsRepo(
		req.query.clientId,
		parseInt(req.query.limit)
	);
	if (productList.length > 0) {
		return getProductListWithCalculatedDealPriceAndStockDetail(
			productList,
			req.query.clientId
		);
	}
	return null;
}

async function getProductsByProductNameMatchesService(req, _res) {
	let productList = await productRepo.getProductsByProductNameMatchesRepo(
		req.query.clientId,
		req.query.productNameMatch
	);
	if (productList.length > 0) {
		return getProductListWithCalculatedDealPriceAndStockDetail(
			productList,
			req.query.clientId
		);
	}
	return null;
}

async function getNewProductsService(req, _res) {
	let productList = await productRepo.getAllProductsRepo(
		req.query.clientId,
		STATUSES.ACTIVE
	);
	if (productList.length > 0) {
		return getProductListWithCalculatedDealPriceAndStockDetail(
			productList
				.filter(
					(product) =>
						product?.newTag &&
						compareDealDates(
							product.newTag.fromDate,
							product.newTag.toDate
						) &&
						compareDealFutureDates(product.newTag.fromDate)
				)
				.splice(0, parseInt(req.query.limit) || 10),
			req.query.clientId
		);
	}
	return null;
}

async function getRandomProductsService(req, _res) {
	let productList = await productRepo.getRandomProductsRepo(
		req.query.clientId,
		req.query.categoryId,
		req.query.limit
	);
	if (productList.length > 0) {
		return getProductListWithCalculatedDealPriceAndStockDetail(
			productList,
			req.query.clientId
		);
	}
	return null;
}

async function updateProductQtyOnFailedCheckoutService(req, _res) {
	if(req.body?.productList  ){
		return productRepo.changeProductQtyAvailableRepo(
			req.query.clientId,
			req.body.productList.map((product) => ({
				productId: product.productId,
				qty: product.qty,
			})),
			ACTION.INCREASE
		);
	}

	let productList = await getCheckoutProductListByCheckoutId(
		req.query.clientId,
		req.query.checkoutId
	);
	return productRepo.changeProductQtyAvailableRepo(
		req.query.clientId,
		productList.map((product) => ({
			productId: product.productId,
			qty: product.qty,
		})),
		ACTION.INCREASE
	)
}

async function getTotalProductsCountService(req, _res) {
	return productRepo
		.getTotalProductsCountRepo(req.query.clientId)
		.then((result) => ({
			totalProductsCount: result,
		}));
}

async function getProductExportSheetService(req, res) {
	try {
		let taxclasses = await getAllTaxCodeNames(
			req.query.clientId,
			getAuthTokenFromRequest(req)
		);
		if (taxclasses == null || taxclasses.length == 0) {
			res.locals.responseCode =
				config.response_code.no_taxclass_found_while_exporting_product;
			failedResponse(res, {
				message: `No Tax Classes Found`,
			});
		} else {
			const fileBuffer = await getProductExportSheet(
				[],
				taxclasses.map((taxclass) => taxclass.taxcodeName)
			);
			const fileName = `product-Details-template-${new Date().toISOString()}.xlsx`;

			res.set({
				'Access-Control-Allow-Origin': '*',
				'Content-Type':
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'Content-Disposition': `attachment; filename=${fileName}`,
				'File-Name': `${fileName}`,
			});
			res.end(fileBuffer);
		}
	} catch (error) {
		console.log(
			'===> ~ file: product_service.js ~ line 356 ~ getProductExportSheetService ~ error',
			error
		);
		failedResponse(res, {
			message: error.message,
		});
	}
}

async function getProductImportSheetService(req, res) {
	try {
		let taxclasses = await getAllTaxCodeNames(
			req.query.clientId,
			getAuthTokenFromRequest(req)
		);
		let productsList = await productRepo.getAllProductsRepo(
			req.query.clientId,
			STATUSES.ACTIVE
		);
		if (taxclasses == null || taxclasses.length == 0) {
			res.locals.responseCode =
				config.response_code.no_taxclass_found_while_exporting_product;
			failedResponse(res, {
				message: `No Tax Classes Found`,
			});
		} else {
			const fileBuffer = await getProductExportSheet(
				[],
				taxclasses.map((taxclass) => taxclass.taxcodeName),
				productsList == null || productsList == undefined
					? []
					: productsList
							.map((product) => ({
								...product,
								fromDate: product?.newTag?.fromDate
									? new Date(product?.newTag?.fromDate)
									: undefined,
								toDate: product?.newTag?.toDate
									? new Date(product?.newTag?.toDate)
									: undefined,
								taxClass: taxclasses.find(
									(taxClass) =>
										product.taxClass == taxClass.taxcodeId
								)?.taxcodeName,
							}))
							.filter((product) => product.taxClass)
			);
			const fileName = `product-Details-${new Date().toISOString()}.xlsx`;

			res.set({
				'Access-Control-Allow-Origin': '*',
				'Content-Type':
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'Content-Disposition': `attachment; filename=${fileName}`,
				'File-Name': `${fileName}`,
			});
			res.end(fileBuffer);
		}
	} catch (error) {
		console.log(
			'===> ~ file: product_service.js ~ line 356 ~ getProductExportSheetService ~ error',
			error
		);
		failedResponse(res, {
			message: error.message,
		});
	}
}

module.exports = {
	createProductService,
	getAllProductsService,
	getProductByIdService,
	deleteProductService,
	updateProductService,
	getProductFromCSVService,
	getActiveProductsService,
	getProductsByCategoryIdService,
	getProductListByProductIdsListService,
	getRecentAddedProductsService,
	getProductsByProductNameMatchesService,
	getNewProductsService,
	getRandomProductsService,
	updateProductQtyOnFailedCheckoutService,
	getTotalProductsCountService,
	getActiveProductsWithFiltersService,
	getRelatedProductsByCategoryService,
	getProductExportSheetService,
	getProductImportSheetService,
};
