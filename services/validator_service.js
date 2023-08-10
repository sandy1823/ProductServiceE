var { check, query, param, validationResult } = require('express-validator');
var common_service = require('./common_service');
var config = require('../config/app_config.json');
const { customLogger } = require('../utils/logger');

const validateArrayForUnique = (value) => {
	try {
		Array.from(new Set(JSON.parse(value)));
		return true;
	} catch (error) {
		return false;
	}
};

function validateProduct() {
	return [
		query('clientId')
			.notEmpty()
			.isString()
			.trim()
			.withMessage(`clientId is invalid`),
		check('productId')
			.notEmpty()
			.isString()
			.trim()
			.isLength({ min: 3, max: 10 })
			.isAlphanumeric()
			// .matches(/^[ A-Za-z0-9_/#-]*$/)
			.withMessage(`productId is invalid`),
		check('productName')
			.notEmpty()
			.trim()
			.isString()
			.isLength({ min: 3 })
			.withMessage(`productName is invalid`),
		check('productDesc')
			.notEmpty()
			.trim()
			.isString()
			.isLength({ max: 500 })
			.withMessage(`productDesc is invalid`),
		check('categoryId')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`categoryId is invalid`),
		check('price')
			.notEmpty()
			.trim()
			.isNumeric({ min: 1 })
			.custom((value) => !isNaN(parseFloat(value)))
			.withMessage(`price is invalid`),
		check('minimumAdvertisablePrice')
			.optional()
			.notEmpty()
			.trim()
			.isNumeric({ min: 1 })
			.custom((value) => !isNaN(parseFloat(value)))
			.withMessage(`minimumAdvertisablePrice is invalid`),
		check('priceCategory')
			.optional()
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`priceCategory is invalid`),
		check('productType')
			.optional()
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`productType is invalid`),
		// check('discount')
		// 	.trim()
		// 	.optional()
		// 	.isString()
		// 	.withMessage(`discount is invalid`),
		check('taxClass')
			.trim()
			.optional()
			.isString()
			.withMessage(`taxClass is invalid`),
		check('supplier')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`supplier is invalid`),
		check('leadTime')
			.trim()
			.optional()
			.isString()
			.withMessage(`leadTime is invalid`),
		check('qtyAvailable')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`qtyAvailable is invalid`),
		check('attributes')
			.optional()
			.notEmpty()
			.custom((value) => {
				let testValue = JSON.parse(value);
				return (
					testValue instanceof Array &&
					testValue.length > 0 &&
					testValue.every(
						(val) =>
							val instanceof Object && Object.keys(val).length > 0
					) &&
					testValue.length > 0
				);
			})
			.withMessage(`attributes is invalid`),
		check('createdBy')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`createdBy is invalid`),
		check('rating')
			.trim()
			.optional()
			.isNumeric()
			.withMessage(`rating is invalid`),
		check('reviews')
			.trim()
			.optional()
			.isArray()
			.withMessage(`reviews is invalid`),
		check('visibilityStatus')
			.optional()
			.isBoolean()
			.withMessage(`visibilityStatus is invalid`),
		check('newTagFromDate')
			.optional()
			.trim()
			.custom((value, { req, _loc, _path }) =>
				validateFromDate(value, req.body.newTagToDate)
			)
			.withMessage(`newTagFromDate is invalid`),
		check('newTagToDate')
			.optional()
			.trim()
			.custom((value, { req, _loc, _path }) =>
				validateToDate(req.body.newTagFromDate, value)
			)
			.withMessage(`newTagToDate is invalid`),
		check('moq')
			.optional()
			.trim()
			.isNumeric({ min: 1 })
			.withMessage(`moq is invalid`),
		check('status')
			.notEmpty()
			.optional()
			.trim()
			.toUpperCase()
			.isString()
			.withMessage(`status is invalid`),
	];
}

function validateImages(imageKey) {
	return (req, res, next) => {
		customLogger.info({
			fileName: '/services/validator_service.js',
			functionName: 'validateImagesCB',
			context: 'Before Execution',
			message: `Validating uploaded images`,
		});
		if (
			req.files.every(
				(file) =>
					file.mimetype == 'image/png' ||
					file.mimetype == 'image/jpg' ||
					file.mimetype == 'image/jpeg'
			)
		) {
			customLogger.info({
				fileName: '/services/validator_service.js',
				functionName: 'validateImagesCB',
				context: 'If condition true block',
				message: 'Passed',
			});
			customLogger.info({
				fileName: '/services/validator_service.js',
				functionName: 'validateImagesCB',
				context: 'After Execution',
				message: null,
			});
			next();
		} else {
			customLogger.warn({
				fileName: '/services/validator_service.js',
				functionName: 'validateImagesCB',
				context: 'If condition else block',
				message: 'Failed',
			});
			res.locals.responseCode = config.response_code.field_validation;
			res.locals.error = {
				field: imageKey,
				message: `Unsupported Image file type`,
			};
			customLogger.info({
				fileName: '/services/validator_service.js',
				functionName: 'validateImagesCB',
				context: 'After Execution',
				message: null,
			});
			common_service.failedResponse(res);
		}
	};
}

function validateProductImportSheet(fileKey) {
	return (req, res, next) => {
		customLogger.info({
			fileName: '/services/validator_service.js',
			functionName: 'validateProductImportSheetCB',
			context: 'Before Execution',
			message: `validating product sheet file`,
		});
		if (
			req.file.mimetype == 'text/csv' ||
			req.file.mimetype ==
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		) {
			customLogger.info({
				fileName: '/services/validator_service.js',
				functionName: 'validateProductImportSheetCB',
				context: 'If condition true block',
				message: 'Passed',
			});
			customLogger.info({
				fileName: '/services/validator_service.js',
				functionName: 'validateProductImportSheetCB',
				context: 'After Execution',
				message: null,
			});
			next();
		} else {
			customLogger.warn({
				fileName: '/services/validator_service.js',
				functionName: 'validateProductImportSheetCB',
				context: 'If condition else block',
				message: 'Failed',
			});
			res.locals.responseCode = config.response_code.field_validation;
			res.locals.error = {
				field: fileKey,
				message: `Unsupported Image file type`,
			};
			customLogger.info({
				fileName: '/services/validator_service.js',
				functionName: 'validateProductImportSheetCB',
				context: 'After Execution',
				message: null,
			});
			common_service.failedResponse(res);
		}
	};
}

function validateCart() {
	return [
		query('clientId')
			.notEmpty()
			.isString()
			.trim()
			.withMessage(`clientId is invalid`),
		check('cartId')
			.notEmpty()
			.isString()
			.trim()
			.withMessage(`cartId is invalid`),
		check('userId')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`createdBy is invalid`),
		check('buyerId')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`createdBy is invalid`),
		check('productList')
			.optional()
			.isArray()
			.withMessage(`productList is invalid`),
	];
}

function validateWishlist() {
	return [
		check('clientId')
			.notEmpty()
			.isString()
			.trim()
			.withMessage(`clientId is invalid`),
		param('wishlistId')
			.notEmpty()
			.trim()
			.isString()
			.optional()
			.withMessage(`wishlistId is invalid`),
		check('wishlistName')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`wishlistName is invalid`),
		check('userId')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`createdBy is invalid`),
		check('buyerId')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`createdBy is invalid`),
		check('productList')
			.optional()
			.trim()
			.isArray()
			.optional()
			.withMessage(`productList is invalid`),
		check('comments')
			.notEmpty()
			.trim()
			.isString()
			.optional()
			.withMessage(`comments is invalid`),
	];
}

function validateCategory() {
	return [
		query('clientId')
			.notEmpty()
			.isString()
			.trim()
			.withMessage(`clientId is invalid`),
		check('categoryName')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`categoryName is invalid`),
		check('categoryDesc')
			.notEmpty()
			.trim()
			.isString()
			.isLength({ max: 500 })
			.withMessage(`categoryDesc is invalid`),
		check('isAnchor')
			.optional()
			.isBoolean()
			.withMessage(`isAnchor is invalid`),
		check('parentCategoryId')
			.exists()
			.withMessage(`parentCategoryId is invalid`),
		check('attrSets')
			.notEmpty()
			.isArray()
			.withMessage(`attrSets is invalid`),
		check('createdBy')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`createdBy is invalid`),
	];
}

function validateAttribute() {
	return [
		query('clientId')
			.notEmpty()
			.isString()
			.trim()
			.withMessage(`clientId is invalid`),
		check('attrName')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`attrName is invalid`),
		check('attrDesc')
			.notEmpty()
			.trim()
			.isString()
			.isLength({ max: 500 })
			.withMessage(`attrDesc is invalid`),
		check('attrValue')
			.optional()
			.notEmpty()
			.isArray()
			.withMessage(`attrValue is invalid`),
		check('attrType')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`attrType is invalid`),
		check('attrPattern')
			.optional()
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`attrPattern is invalid`),
		check('createdBy')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`createdBy is invalid`),
	];
}

function validateAttributeset() {
	return [
		query('clientId')
			.notEmpty()
			.isString()
			.trim()
			.withMessage(`clientId is invalid`),
		check('attrSetName')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`attrSetName is invalid`),
		check('attributes')
			.notEmpty()
			.isArray()
			.withMessage(`attributes is invalid`),
		check('comments')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`comments is invalid`),
		check('createdBy')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`createdBy is invalid`),
	];
}

function validateUpdateProduct() {
	return [
		...validateProduct(),
		check('comments')
			.notEmpty()
			.optional()
			.trim()
			.isString()
			.withMessage(`comments is invalid`),
	];
}

function validateDeal() {
	return [
		query('clientId')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`clientId is invalid`),
		param('dealId')
			.notEmpty()
			.optional()
			.trim()
			.isString()
			.withMessage(`dealId is invalid`),
		check('productList')
			.notEmpty()
			.custom(validateArrayForUnique)
			.withMessage(`productList is invalid`),
		check('dealType')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`dealType is invalid`),
		check('title')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`title is invalid`),
		check('description')
			.optional()
			.notEmpty()
			.trim()
			.isLength({ max: 500 })
			.isString()
			.withMessage(`description is invalid`),
		check('images')
			.notEmpty()
			.optional()
			.custom(validateArrayForUnique)
			.withMessage(`images is invalid`),
		check('createdBy')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`createdBy is invalid`),
		check('status')
			.notEmpty()
			.optional()
			.trim()
			.isString()
			.withMessage(`status is invalid`),
		check('fromDate')
			.optional()
			.trim()
			.custom((value, { req, _loc, _path }) =>
				validateFromDate(value, req.body.toDate)
			)
			.withMessage(`fromDate is invalid`),
		check('toDate')
			.optional()
			.trim()
			.custom((value, { req, _loc, _path }) =>
				validateToDate(req.body.fromDate, value)
			)
			.withMessage(`todate is invalid`),
	];
}

function validateDealDetail() {
	return [
		query('clientId')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`clientId is invalid`),
		check('dealDetailId')
			.optional()
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`dealDetailId is invalid`),
		check('name')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`name is invalid`),
		check('valueType')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`valueType is invalid`),
		check('value')
			.notEmpty()
			.trim()
			.isNumeric({ min: 1 })
			.withMessage(`value is invalid`),
		check('description')
			.optional()
			.notEmpty()
			.trim()
			.isLength({ max: 500 })
			.isString()
			.withMessage(`description is invalid`),
		check('createdBy')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`createdBy is invalid`),
		check('status')
			.optional()
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`status is invalid`),
	];
}

function validateAddressAndSchduleDateForCheckout() {
	return [
		check('addressId')
			.notEmpty()
			.trim()
			.isString()
			.withMessage(`addressId is invalid`),
		check('scheduledDate')
			.notEmpty()
			.withMessage(`scheduledDate is invalid`),
	];
}

function validateFromDate(fromDate, toDate) {
	try {
		return (
			new Date(toDate).getTime() >= new Date(fromDate).getTime() &&
			new Date().setHours(0, 0, 0, 0) <= new Date(fromDate).getTime()
		);
	} catch (error) {
		return false;
	}
}

function validateToDate(fromDate, toDate) {
	try {
		return (
			new Date(fromDate).getTime() <=
			new Date(toDate).setHours(23, 59, 59, 0)
		);
	} catch (error) {
		return false;
	}
}

class Product {
	constructor(productData) {
		Object.assign(this, productData);
	}
	specials=/^[a-zA-Z0-9]+$/;
	validateProduct() {
		let productCond = {
			productId:
				this.productId != undefined &&
				this.productId != null &&
				this.productId != '' &&
				this.specials.test(this.productId),
			productName:
				this.productName != undefined &&
				this.productName != null &&
				this.productName != '',
			productDesc:
				this.productDesc != undefined &&
				this.productDesc != null &&
				this.productDesc != '' &&
				this.productDesc.toString().length <= 500,
			categoryId:
				this.categoryId != undefined &&
				this.categoryId != null &&
				this.categoryId != '',
			price:
				this.price != undefined &&
				!isNaN(parseFloat(this.price)) &&
				parseFloat(this.price) > 0,
			priceCategory:
				this.priceCategory != undefined &&
				this.priceCategory != null &&
				this.priceCategory != '',
			productType:
				this.productType != undefined &&
				this.productType != null &&
				this.productType != '',
			supplier:
				this.supplier != undefined &&
				this.supplier != null &&
				this.supplier != '',
			qtyAvailable:
				this.qtyAvailable != undefined &&
				this.qtyAvailable != null &&
				!isNaN(parseFloat(this.qtyAvailable)),
			moq:
				this.moq != undefined &&
				this.moq != null &&
				!isNaN(parseFloat(this.moq)) &&
				parseFloat(this.moq) > 0,
			leadTime:
				this.leadTime != undefined &&
				this.leadTime != null &&
				!isNaN(parseFloat(this.leadTime)),
			taxClass: this.taxClass != undefined && this.taxClass != null,
			createdBy: this.createdBy != null && this.createdBy != undefined,
		};
		if (
			this.hasOwnProperty('minimumAdvertisablePrice') &&
			this.minimumAdvertisablePrice
		) {
			productCond['minimumAdvertisablePrice'] =
				this.minimumAdvertisablePrice != undefined &&
				this.minimumAdvertisablePrice != null &&
				this.minimumAdvertisablePrice != '' &&
				parseFloat(this.minimumAdvertisablePrice) &&
				!isNaN(parseFloat(this.minimumAdvertisablePrice));
		}
		if (this.hasOwnProperty('fromDate') && this.hasOwnProperty('toDate')) {
			let dateResult =
				this.fromDate != undefined &&
				this.fromDate != null &&
				this.toDate != undefined &&
				this.toDate != null &&
				validateFromDate(this.fromDate, this.toDate) &&
				validateToDate(this.fromDate, this.toDate);
			productCond['fromDate'] = dateResult;
			productCond['toDate'] = dateResult;
		} else {
			delete productCond.fromDate;
			delete productCond.toDate;
		}
		return productCond;
	}
	sanitizeProduct() {
		let productToSend = {
			productId: this.productId.toString().trim().toUpperCase(),
			productName: this.productName.toString().trim(),
			productDesc: this.productDesc?.toString().trim(),
			categoryId: this.categoryId.toString().trim(),
			price: parseFloat(this.price),
			priceCategory: this.priceCategory?.toString().trim(),
			productType: this.productType.toString().trim(),
			supplier: this.supplier.toString().trim(),
			qtyAvailable: parseInt(this.qtyAvailable),
			moq: parseInt(this.moq),
			leadTime: parseInt(this.leadTime),
			taxClass: this.taxClass.toString(),
			createdBy: this.createdBy.toString(),
		};
		if (
			this.hasOwnProperty('minimumAdvertisablePrice') &&
			this.minimumAdvertisablePrice
		) {
			productToSend['minimumAdvertisablePrice'] = isNaN(
				parseFloat(this.minimumAdvertisablePrice)
			)
				? undefined
				: parseFloat(this.minimumAdvertisablePrice);
		}
		if (this.fromDate && this.toDate) {
			productToSend['newTag'] = {
				fromDate: this.fromDate,
				toDate: this.toDate,
			};
		}
		return productToSend;
	}
}

function validateImportedProducts(productList) {
	customLogger.info({
		fileName: '/services/validator_service.js',
		functionName: 'validateImportedProducts',
		context: 'Before Execution',
		message: `validating imported product list`,
	});
	let failedProductList = [],
		passedProductList = [];
	productList.forEach((product) => {
		let productToPush = new Product(product);
		let productValidationResult = productToPush.validateProduct();
		try {
			if (
				Object.values(productValidationResult).every((result) => result)
			) {
				passedProductList.push(productToPush.sanitizeProduct());
			} else {
				failedProductList.push({
					...product,
					failedFields: Object.keys(productValidationResult).filter(
						(key) => !productValidationResult[key]
					),
				});
			}
		} catch (error) {
			customLogger.error({
				fileName: '/services/validator_service.js',
				functionName: 'validateImportedProducts',
				context: 'Error Handling',
				message: error.message,
				code: error.code || error.status,
			});
			failedProductList.push({
				...product,
				failedFields: Object.keys(productValidationResult).filter(
					(key) => !productValidationResult[key]
				),
			});
		}
	});
	customLogger.info({
		fileName: '/services/validator_service.js',
		functionName: 'validateImportedProducts',
		context: 'After Execution',
		message: `Going to return without errors`,
	});
	return { failedProductList, passedProductList };
}

function handleValidation() {
	return (req, res, next) => {
		customLogger.info({
			fileName: '/services/validator_service.js',
			functionName: 'handleValidationCB',
			context: 'Before Execution',
			message: `validating request fields`,
		});
		const errors = validationResult(req);
		if (errors.isEmpty()) {
			customLogger.info({
				fileName: '/services/validator_service.js',
				functionName: 'handleValidationCB',
				context: "Condtion's true block",
				message: `No request fileds errors were during validation`,
			});
			next();
		} else {
			customLogger.warn({
				fileName: '/services/validator_service.js',
				functionName: 'handleValidationCB',
				context: "Condtion's false block",
				message: 'Request fileds errors were found during validation',
			});
			res.locals.responseCode = config.response_code.field_validation;
			common_service.failedResponse(res, errors);
		}
	};
}

module.exports = {
	validateProduct,
	validateCart,
	validateWishlist,
	validateCategory,
	validateAttribute,
	validateAttributeset,
	validateUpdateProduct,
	validateDeal,
	validateDealDetail,
	handleValidation,
	validateImportedProducts,
	Product,
	validateFromDate,
	validateToDate,
	validateAddressAndSchduleDateForCheckout,
	validateImages,
	validateProductImportSheet,
};
