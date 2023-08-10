var express = require('express');
var productService = require('../services/product_service');
const multer = require('multer');
const {
	validateProduct,
	validateUpdateProduct,
	handleValidation,
	validateImages,
	validateProductImportSheet,
} = require('../services/validator_service');
const {
	GETALLPRODUCTS,
	GETPRODUCTBYID,
	DELETEPRODUCTBYID,
	UPDATEPRODUCTBYID,
	CREATEPRODUCT,
	GETPRODUCTFROMCSV,
	GETACTIVEPRODUCTS,
	GETPRODUCTDEFBYID,
	GETPRODUCTSBYCATEGORYID,
	GETPRODUCTLISTBYIDLIST,
	GETRECENTADDEDPRODUCTS,
	GETPRODUCTSBYNAMEMATCHES,
	GETNEWPRODUCTS,
	GETTOTALPRODUCTSCOUNT,
	GETACTIVEPRODUCTSWITHFILTERS,
	GETRANDOMPRODUCTS,
	GETRELATEDPRODUCTSBYCATEGORY,
	GETPRODUCTSEXPORTSHEET,
	GETPRODUCTSIMPORTSHEET,
} = require('../utils/endpoints');
const { IMAGE_KEY, CSV_FILENAME } = require('../utils/constants');
const { serviceHandler } = require('../services/common_service');
const {
	singleupload,
	multipleFilesUploadWithConfig,
} = require('@platform_jewels/bassure-node/service/fileupload');
const { checkUserMiddleware } = require('../services/middlewares');

const router = express.Router();

router.get(
	GETALLPRODUCTS,
	serviceHandler(productService.getAllProductsService)
);

router.get(
	GETPRODUCTBYID,
	serviceHandler(productService.getProductByIdService)
);

router.get(
	GETACTIVEPRODUCTS,
	serviceHandler(productService.getActiveProductsService)
);

router.get(
	GETPRODUCTDEFBYID,
	serviceHandler(productService.getProductByIdService)
);

router.get(
	GETPRODUCTSBYCATEGORYID,
	serviceHandler(productService.getProductsByCategoryIdService)
);

router.get(
	GETRANDOMPRODUCTS,
	serviceHandler(productService.getRandomProductsService)
);

router.get(
	GETPRODUCTLISTBYIDLIST,
	serviceHandler(productService.getProductListByProductIdsListService)
);

router.get(
	GETRECENTADDEDPRODUCTS,
	serviceHandler(productService.getRecentAddedProductsService)
);

router.get(
	GETPRODUCTSBYNAMEMATCHES,
	serviceHandler(productService.getProductsByProductNameMatchesService)
);

router.get(
	GETNEWPRODUCTS,
	serviceHandler(productService.getNewProductsService)
);

router.get(
	GETTOTALPRODUCTSCOUNT,
	serviceHandler(productService.getTotalProductsCountService)
);

router.post(
	GETACTIVEPRODUCTSWITHFILTERS,
	serviceHandler(productService.getActiveProductsWithFiltersService)
);

router.get(
	GETRELATEDPRODUCTSBYCATEGORY,
	serviceHandler(productService.getRelatedProductsByCategoryService)
);

router.get(GETPRODUCTSEXPORTSHEET, productService.getProductExportSheetService);

router.get(GETPRODUCTSIMPORTSHEET, productService.getProductImportSheetService);

router.use(checkUserMiddleware);

router.delete(
	DELETEPRODUCTBYID,
	serviceHandler(productService.deleteProductService)
);

router.post(
	CREATEPRODUCT,
	multipleFilesUploadWithConfig(IMAGE_KEY, {
		storage: multer.memoryStorage(),
		limits: {
			fileSize: 20 * 1024 * 1024,
		},
	}),
	validateProduct(),
	handleValidation(),
	validateImages(IMAGE_KEY),
	serviceHandler(productService.createProductService)
);

router.put(
	UPDATEPRODUCTBYID,
	multipleFilesUploadWithConfig(IMAGE_KEY, {
		storage: multer.memoryStorage(),
		limits: {
			fileSize: 20 * 1024 * 1024,
		},
	}),
	validateUpdateProduct(),
	handleValidation(),
	validateImages(IMAGE_KEY),
	serviceHandler(productService.updateProductService)
);

router.post(
	GETPRODUCTFROMCSV,
	singleupload({ file: CSV_FILENAME }),
	validateProductImportSheet(CSV_FILENAME),
	serviceHandler(productService.getProductFromCSVService)
);

module.exports = router;
