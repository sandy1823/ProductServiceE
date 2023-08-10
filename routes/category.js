var express = require('express');
var categoryService = require('../services/category_service');
const { serviceHandler } = require('../services/common_service');
const { checkUserMiddleware } = require('../services/middlewares');
const {
	validateCategory,
	handleValidation,
} = require('../services/validator_service');
const {
	GETALLCATEGORIES,
	DELETECATEGORYBYID,
	UPDATECATEGORYBYID,
	CREATECATEGORY,
	GETATTRIBUTESBYCATEGORYID,
	CREATEDEFAULTCATEGORY,
} = require('../utils/endpoints');

const router = express.Router();

router.get(
	GETALLCATEGORIES,
	serviceHandler(categoryService.getAllCategoriesService)
);

router.get(
	GETATTRIBUTESBYCATEGORYID,
	serviceHandler(categoryService.getAllAttributeByCategoryIdService)
);

router.use(checkUserMiddleware);

router.delete(
	DELETECATEGORYBYID,
	serviceHandler(categoryService.deleteCategoryService)
);

router.put(
	UPDATECATEGORYBYID,
	validateCategory(),
	handleValidation(),
	serviceHandler(categoryService.updateCategoryService)
);

router.post(
	CREATECATEGORY,
	validateCategory(),
	handleValidation(),
	serviceHandler(categoryService.createCategoryService)
);

router.post(
	CREATEDEFAULTCATEGORY,
	serviceHandler(categoryService.createDefaultCategoryForClientService)
);

module.exports = router;
